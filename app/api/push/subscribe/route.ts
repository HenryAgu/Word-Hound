import { saveSubscription } from "@/lib/push/store";
import { parseSubscribeBody } from "@/lib/push/validate";

/** Stores a browser's push subscription and time zone, or refreshes them if already stored. */
export async function POST(request: Request) {
  const sub = parseSubscribeBody(await request.json().catch(() => null));
  if (!sub) return Response.json({ error: "Invalid subscription" }, { status: 400 });

  try {
    await saveSubscription(sub);
  } catch (error) {
    console.error("push: could not save subscription", error);
    return Response.json({ error: "Could not save subscription" }, { status: 503 });
  }
  return new Response(null, { status: 204 });
}
