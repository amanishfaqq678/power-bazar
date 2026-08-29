const ADMIN_AUTH_STORAGE_KEY = "power-bazar-admin-demo-auth";

// Local/dev fallback demo credentials (kept for developer convenience only)
const DEMO_ADMIN_USERNAME = "admin";
const DEMO_ADMIN_PASSWORD = "admin";

export function isAdminDemoEnabled() {
  // Keep the original behavior in dev, but allow explicit opt-in via VITE_ENABLE_ADMIN_DEMO
  // for testing on preview surfaces. Production validation is performed server-side.
  return import.meta.env.DEV || import.meta.env['VITE_ENABLE_ADMIN_DEMO'] === "true";
}

export async function validateDemoAdminLogin(username: string, password: string) {
  if (!isAdminDemoEnabled()) return false;

  // In dev, validate locally to keep the fast developer workflow.
  if (import.meta.env.DEV) {
    return (
      username.trim().toLowerCase() === DEMO_ADMIN_USERNAME &&
      password === DEMO_ADMIN_PASSWORD
    );
  }
  // In non-dev environments, call a server-side endpoint that compares the
  // supplied credentials against server-only environment variables so the
  // password is never exposed to the client bundle.
  try {
    const res = await fetch("/admin-login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
      credentials: "same-origin",
    });
    return res.ok;
  } catch (e) {
    console.error("Admin login check failed:", e);
    return false;
  }
}

export function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "true";
}

export function signInAdminDemo() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "true");
}

export function signOutAdmin() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
}
