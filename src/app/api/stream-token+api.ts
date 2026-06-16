import { StreamClient } from "@stream-io/node-sdk";

const API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY;
const APP_SECRET = process.env.STREAM_APP_SECRET;

export async function POST(request: Request) {
  if (!API_KEY || !APP_SECRET) {
    console.error(
      "[stream-token] Missing env vars — EXPO_PUBLIC_STREAM_API_KEY or STREAM_APP_SECRET not set"
    );
    return Response.json(
      { error: "Server misconfiguration: Stream credentials not set" },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as { userId?: string };
    const userId = body.userId?.trim();

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    // generateUserToken is pure local crypto — no HTTP call to Stream's API.
    // The Stream backend auto-creates users the first time they join a call.
    const streamClient = new StreamClient(API_KEY, APP_SECRET);
    const token = streamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60 * 4,
    });

    return Response.json({ token, apiKey: API_KEY, userId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stream-token] Error generating token:", message);
    return Response.json(
      { error: `Failed to generate token: ${message}` },
      { status: 500 }
    );
  }
}
