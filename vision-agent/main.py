import asyncio
import os

from dotenv import load_dotenv

load_dotenv()

from getstream import Stream as GetStream
from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.core.instructions import Instructions
from vision_agents.plugins import getstream, openai

LANGUAGE_NAMES = {"es": "Spanish", "fr": "French", "ja": "Japanese", "pt": "Portuguese"}

# The lesson-agnostic teacher persona. Used as a fallback when a lesson does
# not ship its own aiTeacherPrompt.
BASE_INSTRUCTIONS = """You are Lingua, a warm and energetic AI language teacher who makes beginners feel confident and excited.

Walk the student through the lesson one item at a time: say the word or phrase clearly and slowly, give its English meaning, use it in one tiny example, then ask them to say it back. Celebrate their wins and gently help when they slip. Finish with a warm two-sentence recap and a cheerful sign-off."""


# Hard guardrails applied to EVERY session on top of the lesson's own teacher
# persona. These keep the agent sounding human and locked to the current
# lesson and language no matter which lesson is loaded.
UNIVERSAL_RULES = """How to speak (always, no exceptions):
- You are speaking out loud on a live call. Never use markdown, bullet points, lists, or emoji.
- Keep every reply to ONE or TWO short, natural sentences. Use contractions — "you're", "let's", "that's".
- Sound like a real, encouraging human teacher: warm, energetic, and patient. Never robotic or formal.
- Mostly speak English. Introduce each target-language word slowly and give its English meaning right away.
- After teaching an item, ask the student to say it back, then listen and adapt: celebrate a good try briefly ("Yes! Perfect!"), or gently model it once more and invite them to try again.
- End every single reply with a question or a "now you try" cue — never leave the student without something to do.

Stay on topic (never break):
- Teach ONLY this lesson's goals, vocabulary, and phrases. Don't drift into other topics or grammar the lesson doesn't cover.
- Teach ONLY this lesson's target language. Never switch to or teach a different language.
- If the student wanders off-topic or asks about something outside the lesson, gently steer them back with one friendly sentence."""


def _build_instructions(custom: dict) -> str:
    """Assemble personalized instructions from lesson data."""
    ai_teacher_prompt = custom.get("aiTeacherPrompt", "")
    goals = custom.get("goals", [])
    vocabulary = custom.get("vocabulary", [])
    phrases = custom.get("phrases", [])

    base = ai_teacher_prompt if ai_teacher_prompt else BASE_INSTRUCTIONS
    parts = [base]

    if goals:
        parts.append("Lesson goals:\n" + "\n".join(f"- {g}" for g in goals if isinstance(g, str)))

    if vocabulary:
        lines = [
            f"- {v['word']} ({v.get('translation', '')})"
            for v in vocabulary
            if isinstance(v, dict) and v.get("word")
        ]
        if lines:
            parts.append("Vocabulary to teach (in this order):\n" + "\n".join(lines))

    if phrases:
        lines = [
            f"- {p['phrase']} — {p.get('translation', '')}"
            for p in phrases
            if isinstance(p, dict) and p.get("phrase")
        ]
        if lines:
            parts.append("Phrases to practice (in this order):\n" + "\n".join(lines))

    # Always enforce the spoken-delivery and lesson/language guardrails, no
    # matter which teacher persona is in use.
    parts.append(UNIVERSAL_RULES)

    return "\n\n".join(parts)


def _fetch_call_custom(call_type: str, call_id: str) -> dict:
    """Read the Stream call's custom data via the server-side SDK."""
    api_key = os.getenv("STREAM_API_KEY")
    api_secret = os.getenv("STREAM_API_SECRET")
    if not api_key or not api_secret:
        return {}

    try:
        stream = GetStream(api_key=api_key, api_secret=api_secret)
        response = stream.video.call(call_type, call_id).get()
        call_obj = getattr(response, "data", response)
        call_obj = getattr(call_obj, "call", call_obj)
        custom = getattr(call_obj, "custom", {})
        return custom if isinstance(custom, dict) else {}
    except Exception as exc:
        print(f"[agent] Could not read call custom data: {exc}")
        return {}


async def create_agent(**kwargs) -> Agent:
    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name="Lingua", id="lingua-ai-teacher"),
        instructions=f"{BASE_INSTRUCTIONS}\n\n{UNIVERSAL_RULES}",
        llm=openai.Realtime(
            model="gpt-4o-realtime-preview",
            voice="coral",  # coral sounds the most natural/warm for a teacher
        ),
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    custom = _fetch_call_custom(call_type, call_id)

    if custom:
        agent.instructions = Instructions(input_text=_build_instructions(custom))

    call = await agent.create_call(call_type, call_id)

    # Build lesson context for the intro
    language_code = custom.get("language", "")
    language_name = LANGUAGE_NAMES.get(language_code, language_code or "a new language")

    goals = custom.get("goals", [])
    vocabulary = custom.get("vocabulary", [])
    phrases = custom.get("phrases", [])

    first_goal = goals[0].lower().rstrip(".") if goals else f"some {language_name} basics"

    # Pick the first item to teach right after the intro
    first_item = ""
    first_item_meaning = ""
    if phrases and isinstance(phrases[0], dict):
        first_item = phrases[0].get("phrase", "")
        first_item_meaning = phrases[0].get("translation", "")
    elif vocabulary and isinstance(vocabulary[0], dict):
        first_item = vocabulary[0].get("word", "")
        first_item_meaning = vocabulary[0].get("translation", "")

    if first_item:
        opening_prompt = (
            f"You are live on a call with your student. "
            f"In one sentence introduce yourself as Lingua, their {language_name} AI teacher, "
            f"and tell them today you'll learn how to {first_goal}. "
            f"Then immediately — without waiting — teach the very first item: "
            f"say '{first_item}' clearly, tell them it means '{first_item_meaning}', "
            f"and ask them to repeat it back to you. "
            f"Keep the whole opening under four sentences. Warm, casual, excited — no bullet points."
        )
    else:
        opening_prompt = (
            f"You are live on a call. In one sentence introduce yourself as Lingua, "
            f"their {language_name} AI teacher, and say today you'll learn how to {first_goal}. "
            f"Then immediately start the first part of the lesson and ask the student to respond. "
            f"Keep it under three sentences, casual and warm."
        )

    async with agent.join(call):
        # Wait for the mobile client's audio subscription to stabilize
        # before firing the intro — otherwise the first words get cut off.
        await asyncio.sleep(2)
        try:
            await agent.simple_response(opening_prompt)
        except Exception as exc:
            print(f"[agent] simple_response failed: {exc}")
        await agent.finish()


if __name__ == "__main__":
    Runner(
        AgentLauncher(
            create_agent=create_agent,
            join_call=join_call,
            agent_idle_timeout=120.0,
            max_concurrent_sessions=10,
            max_session_duration_seconds=1800,
        )
    ).cli()
