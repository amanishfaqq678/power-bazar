import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ADMIN_AUTH_STORAGE_KEY = "power-bazar-admin-demo-auth";

// Local/dev fallback demo credentials (kept for developer convenience only)
const DEMO_ADMIN_USERNAME = "admin";
const DEMO_ADMIN_PASSWORD = "admin";

export type AdminLoginValidationResult =
| { ok: true; code: "success"; message: string }
| { ok: false; code: "demo_disabled" | "missing_env" | "invalid_input" | "invalid_credentials" | "server_error"; message: string };

const adminDemoLoginInputSchema = z.object({
username: z.string().min(1),
password: z.string().min(1),
});

export const validateAdminDemoLoginServerFn = createServerFn({ method: "POST" })
.validator(adminDemoLoginInputSchema)
.handler(async ({ data }) => {
  const { username, password } = data;
  const normalizedUsername = username.trim().toLowerCase();
  const configuredUsername = (process.env["ADMIN_DEMO_USERNAME"] ?? process.env["ADMIN_USERNAME"] ?? "admin")
    .trim()
    .toLowerCase();
  const configuredPassword = process.env["ADMIN_DEMO_PASSWORD"] ?? process.env["ADMIN_PASSWORD"];

  if (!configuredPassword) {
    return {
      ok: false,
      code: "missing_env",
      message: "Admin demo credentials are not configured on this server.",
    } satisfies AdminLoginValidationResult;
  }

  if (!normalizedUsername || !password) {
    return {
      ok: false,
      code: "invalid_input",
      message: "Username and password are required.",
    } satisfies AdminLoginValidationResult;
  }

  if (normalizedUsername !== configuredUsername || password !== configuredPassword) {
    return {
      ok: false,
      code: "invalid_credentials",
      message: "Invalid username or password.",
    } satisfies AdminLoginValidationResult;
  }

  return {
    ok: true,
    code: "success",
    message: "Login successful.",
  } satisfies AdminLoginValidationResult;
},
);

export function isAdminDemoEnabled() {
return import.meta.env.DEV || import.meta.env["VITE_ENABLE_ADMIN_DEMO"] === "true";
}

export async function validateDemoAdminLogin(username: string, password: string): Promise<AdminLoginValidationResult> {
if (!isAdminDemoEnabled()) {
  return {
    ok: false,
    code: "demo_disabled",
    message: "Access is temporarily unavailable. Please contact your administrator.",
  };
}

if (import.meta.env.DEV) {
  const isValid =
    username.trim().toLowerCase() === DEMO_ADMIN_USERNAME && password === DEMO_ADMIN_PASSWORD;

  if (!isValid) {
    return {
      ok: false,
      code: "invalid_credentials",
      message: "Invalid username or password.",
    };
  }

  return {
    ok: true,
    code: "success",
    message: "Login successful.",
  };
}

try {
  return await validateAdminDemoLoginServerFn({
    data: {
      username: username.trim(),
      password,
    },
  });
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown server error";
  console.error("Admin login validation failed:", message);
  return {
    ok: false,
    code: "server_error",
    message: "Unable to verify credentials right now. Please try again.",
  };
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