const ADMIN_AUTH_STORAGE_KEY = "power-bazar-admin-demo-auth";

const DEMO_ADMIN_USERNAME = "admin";
const DEMO_ADMIN_PASSWORD = "admin";

export function isAdminDemoEnabled() {
  return import.meta.env.DEV;
}

export function validateDemoAdminLogin(username: string, password: string) {
  if (!isAdminDemoEnabled()) return false;
  return (
    username.trim().toLowerCase() === DEMO_ADMIN_USERNAME &&
    password === DEMO_ADMIN_PASSWORD
  );
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
