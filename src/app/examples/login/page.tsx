import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardFooter } from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { BackLink } from "../_components/back-link";

export const metadata: Metadata = {
  title: "Log in — EP Design Kit",
  description: "Example login screen built from EP components.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-16">
      <BackLink />

      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            EP
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              Welcome back
            </h1>
            <p className="text-sm text-text-secondary">
              Log in to continue to your account.
            </p>
          </div>
        </div>

        <Card>
          <LoginForm />

          <CardFooter className="justify-center">
            <p className="text-sm text-text-secondary">
              Don&apos;t have an account?{" "}
              <Link
                href="/examples/signup"
                className="font-medium text-text-primary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-accent"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
