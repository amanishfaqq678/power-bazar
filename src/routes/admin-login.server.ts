// Server-side admin demo login endpoint.
// This endpoint validates the supplied credentials against server-only
// environment variables so the admin password is never shipped to the client.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Read server-only environment variables (set these in Vercel project settings).
    const ADMIN_USERNAME = (process.env["ADMIN_DEMO_USERNAME"] ?? process.env["ADMIN_USERNAME"] ?? "admin").toLowerCase();
    const ADMIN_PASSWORD = process.env["ADMIN_DEMO_PASSWORD"] ?? process.env["ADMIN_PASSWORD"];

    if (!ADMIN_PASSWORD) {
      // Admin demo not configured in this environment.
      return new Response(JSON.stringify({ error: "Admin login not configured" }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error("/admin-login failed:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
