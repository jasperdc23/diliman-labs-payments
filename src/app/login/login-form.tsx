"use client";

import { useActionState, useState } from "react";
import { Envelope, Lock, Eye, EyeSlash } from "@phosphor-icons/react/ssr";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { login, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = undefined;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="flex flex-col gap-5" action={formAction}>
      {state?.error && <Alert variant="danger" title={state.error} />}

      <InputGroup
        type="email"
        name="email"
        placeholder="Email address"
        autoComplete="email"
        leading={<Envelope size={18} weight="regular" />}
        invalid={Boolean(state?.error)}
        required
      />
      <InputGroup
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        leading={<Lock size={18} weight="regular" />}
        trailing={
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="flex items-center text-text-tertiary hover:text-text-secondary"
          >
            {showPassword ? <EyeSlash size={18} weight="regular" /> : <Eye size={18} weight="regular" />}
          </button>
        }
        invalid={Boolean(state?.error)}
        required
      />

      <a
        href="mailto:support@dilimanlabs.ph?subject=Forgot%20password"
        className="self-end text-sm font-medium text-accent-text hover:underline"
      >
        Forgot password?
      </a>

      <Button type="submit" fullWidth disabled={pending}>
        {pending ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}
