"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
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
        autoComplete="current-password"
        required
      />

      <div className="flex justify-end">
        <Link
          href="#"
          className="text-sm text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-text-primary"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth>
        Log in
      </Button>
    </form>
  );
}
