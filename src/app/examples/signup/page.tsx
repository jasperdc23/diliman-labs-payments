import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardFooter } from "@/components/ui/card";
import { SignupForm } from "./signup-form";
import { BackLink } from "../_components/back-link";

export const metadata: Metadata = {
  title: "Sign up — EP Design Kit",
  description: "Example sign-up screen built from EP components.",
};

export default function SignupPage() {
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
              Create your account
            </h1>
            <p className="text-sm text-text-secondary">
              Set up an account to get started.
            </p>
          </div>
        </div>

        <Card>
          <SignupForm />

          <CardFooter className="justify-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                href="/examples/login"
                className="font-medium text-text-primary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-accent"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
