import { removeSubscription } from "@/lib/push/store";
import { isPushEndpoint } from "@/lib/push/validate";

/** Forgets a browser's push subscription. */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const endpoint = typeof body === "object" && body !== null ? (body as { endpoint?: unknown }).endpoint : undefined;
  if (!isPushEndpoint(endpoint)) return Response.json({ error: "Invalid endpoint" }, { status: 400 });

  try {
    await removeSubscription(endpoint);
  } catch (error) {
    console.error("push: could not remove subscription", error);
    return Response.json({ error: "Could not remove subscription" }, { status: 503 });
  }
  return new Response(null, { status: 204 });
}
