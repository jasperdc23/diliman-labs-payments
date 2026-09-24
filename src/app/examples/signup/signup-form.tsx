"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        label="Full name"
        type="text"
        name="name"
        placeholder="Maria Santos"
        autoComplete="name"
        required
      />
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="maria.santos@example.com"
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        helperText="Use at least 8 characters."
        autoComplete="new-password"
        required
      />

      <Checkbox
        name="terms"
        required
        label={
          <>
            I agree to the{" "}
            <Link
              href="#"
              className="font-medium text-text-primary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-accent"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="font-medium text-text-primary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-accent"
            >
              Privacy Policy
            </Link>
            .
          </>
        }
      />

      <Button type="submit" fullWidth>
        Create account
      </Button>
    </form>
  );
}
