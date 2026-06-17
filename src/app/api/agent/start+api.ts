import { StreamClient } from "@stream-io/node-sdk";

const API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY;
const APP_SECRET = process.env.STREAM_APP_SECRET;
const VISION_AGENT_URL = process.env.VISION_AGENT_URL ?? "http://localhost:8000";

export async function POST(request: Request) {
  if (!API_KEY || !APP_SECRET) {
    console.error("[agent/start] Missing EXPO_PUBLIC_STREAM_API_KEY or STREAM_APP_SECRET");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  let body: { callId?: string; callType?: string };
  try {
    body = (await request.json()) as { callId?: string; callType?: string };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { callId, callType = "default" } = body;

  if (!callId) {
    return Response.json({ error: "callId is required" }, { status: 400 });
  }

  try {
    const streamClient = new StreamClient(API_KEY, APP_SECRET);
    const call = streamClient.video.call(callType, callId);

    // Grant the agent user admin role so it can publish audio in audio_room
    await call.updateCallMembers({
      update_members: [{ user_id: "lingua-ai-teacher", role: "admin" }],
    });

    // Transition the call to live state so all participants can hear each other
    await call.goLive();
  } catch (err) {
    // Log but don't block — the call may already be live or the member may already exist
    console.warn("[agent/start] Stream setup warning:", err instanceof Error ? err.message : err);
  }

  // Proxy to the Vision Agent HTTP server
  let agentRes: Response;
  try {
    agentRes = await fetch(`${VISION_AGENT_URL}/calls/${callId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ call_type: callType }),
    });
  } catch (err) {
    let msg = err instanceof Error ? err.message : String(err);
    // Node/Bun fetch wraps the real network error in err.cause
    if (err instanceof Error && (err as Error & { cause?: unknown }).cause) {
      const cause = (err as Error & { cause?: unknown }).cause;
      const causeMsg = cause instanceof Error ? cause.message : String(cause);
      if (causeMsg) msg = causeMsg;
    }
    console.error("[agent/start] Vision Agent server unreachable:", msg);
    return Response.json(
      { error: `Vision Agent server unreachable: ${msg}` },
      { status: 502 }
    );
  }

  if (!agentRes.ok) {
    const errorText = await agentRes.text().catch(() => "");
    console.error("[agent/start] Vision Agent error:", agentRes.status, errorText);
    return Response.json(
      { error: `Agent server error (${agentRes.status}): ${errorText}` },
      { status: agentRes.status }
    );
  }

  const agentData = (await agentRes.json()) as Record<string, unknown>;
  const sessionId = (agentData.session_id ?? agentData.id ?? "") as string;

  return Response.json({ sessionId });
}
