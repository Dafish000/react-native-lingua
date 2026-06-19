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


# Audio/turn-detection tuning for a noisy, real-world phone call.
#
# By default the plugin uses Semantic VAD with no noise reduction, which (a) adds
# turn-detection latency ("lag") and (b) treats background noise as speech, so the
# agent keeps interrupting itself. We override that here:
#
# - noise_reduction "near_field": phone mic is close to the mouth; filters background
#   noise BEFORE it reaches VAD, so ambient sound stops triggering false interrupts.
# - Server VAD instead of Semantic VAD: lower latency (no turn-detection model), and
#   it exposes a sensitivity threshold we can raise for noisy rooms.
# - threshold 0.7 (default 0.5): louder audio required to count as speech -> fewer
#   false triggers from background noise.
# - silence_duration_ms 700 (default 500): waits a beat longer before deciding the
#   student is done, so it won't jump in on short thinking pauses.
AUDIO_INPUT = {
    "noise_reduction": {"type": "near_field"},
    "transcription": {"model": "gpt-4o-mini-transcribe"},
}

# Normal turn-taking, used once the intro has finished playing.
TURN_DETECTION = {
    "type": "server_vad",
    "threshold": 0.7,
    "prefix_padding_ms": 300,
    "silence_duration_ms": 700,
}

REALTIME_SESSION = {
    "type": "realtime",
    "audio": {
        "input": {
            **AUDIO_INPUT,
            "turn_detection": TURN_DETECTION,
        },
    },
}

# How long to keep interruptions disabled so the agent can deliver its full
# introduction script even in a noisy room. The intro is capped at four short
# sentences, so ~14s is comfortably long enough.
INTRO_PROTECT_SECONDS = 14.0


async def _set_turn_detection(agent: Agent, turn_detection: dict | None) -> None:
    """Change the realtime session's turn detection while the call is live.

    Passing ``turn_detection=None`` disables voice-activity detection, so
    background noise can't be mistaken for speech and interrupt the agent —
    this guarantees the full intro plays. Passing ``TURN_DETECTION`` back
    restores natural turn-taking so the student can speak and be heard.
    """
    rtc = getattr(agent.llm, "rtc", None)
    if rtc is None:
        return
    try:
        # Resend the whole input config: session.update replaces the fields it
        # receives, so we keep noise_reduction/transcription alongside the new
        # turn_detection value.
        await rtc._send_event(
            {
                "type": "session.update",
                "session": {
                    "audio": {"input": {**AUDIO_INPUT, "turn_detection": turn_detection}}
                },
            }
        )
    except Exception as exc:
        print(f"[agent] turn-detection update failed: {exc}")


async def create_agent(**kwargs) -> Agent:
    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name="Lingua", id="lingua-ai-teacher"),
        instructions=f"{BASE_INSTRUCTIONS}\n\n{UNIVERSAL_RULES}",
        llm=openai.Realtime(
            model="gpt-realtime",  # GA realtime model (replaces retired gpt-4o-realtime-preview)
            voice="shimmer",  # shimmer sounds the most natural/warm for a teacher
            realtime_session=REALTIME_SESSION,
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

    # The student's first name, if the app sent it. Used to personalize the greeting.
    student_name = custom.get("studentName", "")
    if isinstance(student_name, str):
        student_name = student_name.strip()
    else:
        student_name = ""

    greeting = (
        f"Start with a warm, drawn-out greeting that uses their name, like "
        f"'Heyyy {student_name}!' or 'Hi {student_name}!' before anything else. "
        if student_name
        else "Start with a warm, drawn-out greeting like 'Heyyy!' or 'Hi there!' before anything else. "
    )

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
            f"{greeting}"
            f"Then in one sentence introduce yourself as Lingua, their {language_name} AI teacher, "
            f"and tell them today you'll learn how to {first_goal}. "
            f"Then immediately — without waiting — teach the very first item: "
            f"say '{first_item}' clearly, tell them it means '{first_item_meaning}', "
            f"and ask them to repeat it back to you. "
            f"Keep the whole opening under four sentences. Warm, casual, excited — no bullet points."
        )
    else:
        opening_prompt = (
            f"You are live on a call. "
            f"{greeting}"
            f"Then in one sentence introduce yourself as Lingua, "
            f"their {language_name} AI teacher, and say today you'll learn how to {first_goal}. "
            f"Then immediately start the first part of the lesson and ask the student to respond. "
            f"Keep it under three sentences, casual and warm."
        )

    async with agent.join(call):
        # Turn OFF voice-activity detection for the intro so background noise
        # can't trip an interrupt mid-sentence. This lets the agent deliver the
        # whole introduction script start to finish.
        await _set_turn_detection(agent, None)

        # Fire the intro immediately — no warm-up sleep. The realtime model's
        # own first-audio latency (~1s) is enough for the client's audio
        # subscription to settle, and the opening starts with a throwaway
        # greeting ("Heyyy!"), so nothing important gets clipped.
        try:
            await agent.simple_response(opening_prompt)
        except Exception as exc:
            print(f"[agent] simple_response failed: {exc}")

        # After the intro has had time to play, restore normal turn-taking in
        # the background so the student can talk and the agent listens again.
        async def _restore_turn_taking() -> None:
            await asyncio.sleep(INTRO_PROTECT_SECONDS)
            await _set_turn_detection(agent, TURN_DETECTION)

        asyncio.create_task(_restore_turn_taking())

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
