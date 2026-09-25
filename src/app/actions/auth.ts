"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/auth/session";

/**
 * Single demo user, prototype-grade. No database, no user table — this is
 * enough to demonstrate real route protection without standing up an
 * identity provider. Override via env vars in any shared environment;
 * the fallback demo credentials are documented in README.md, not treated
 * as a secret.
 */
const DEMO_USER_EMAIL = process.env.DEMO_USER_EMAIL ?? "demo@dilimanlabs.ph";
const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD ?? "DilimanLabs!2026";

export type LoginState = {
  error?: string;
} | undefined;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }
  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  // Constant-shape comparison isn't load-bearing for a single hardcoded
  // demo credential, but the check stays simple and explicit on purpose —
  // this is a prototype gate, not a real identity check.
  if (email.toLowerCase() !== DEMO_USER_EMAIL.toLowerCase() || password !== DEMO_USER_PASSWORD) {
    return { error: "Incorrect email or password." };
  }

  await createSession(email.toLowerCase());
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
