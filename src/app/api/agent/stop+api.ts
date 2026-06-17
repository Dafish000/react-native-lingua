const VISION_AGENT_URL = process.env.VISION_AGENT_URL ?? "http://localhost:8000";

export async function POST(request: Request) {
  let body: { callId?: string; sessionId?: string };
  try {
    body = (await request.json()) as { callId?: string; sessionId?: string };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { callId, sessionId } = body;

  if (!callId || !sessionId) {
    return Response.json({ error: "callId and sessionId are required" }, { status: 400 });
  }

  try {
    const agentRes = await fetch(
      `${VISION_AGENT_URL}/calls/${callId}/sessions/${sessionId}`,
      { method: "DELETE" }
    );

    // 202 Accepted and 404 are both fine — session may already be gone
    if (!agentRes.ok && agentRes.status !== 404 && agentRes.status !== 202) {
      const errorText = await agentRes.text().catch(() => "");
      console.error("[agent/stop] Vision Agent error:", agentRes.status, errorText);
      return Response.json(
        { error: `Agent server error (${agentRes.status}): ${errorText}` },
        { status: agentRes.status }
      );
    }
  } catch (err) {
    // Best-effort cleanup — don't fail the client if the agent server is unreachable
    console.warn("[agent/stop] Could not reach Vision Agent server:", err instanceof Error ? err.message : err);
  }

  return Response.json({ ok: true });
}
