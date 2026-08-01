"use client";

import { useActionState } from "react";
import { Button } from "@/components/brand";
import { loginFacilitator } from "@/app/actions/auth";

/**
 * Password form on the navy login gate. Wired to the `loginFacilitator`
 * server action via useActionState — the action verifies server-side
 * (constant-time), sets the httpOnly session cookie, and redirects to
 * /facilitator. Errors render inline in the dark-surface accent.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginFacilitator,
    undefined
  );

  const errorMessage = state && !state.ok ? state.message : null;

  return (
    <form action={formAction} className="mt-12 block">
      <label htmlFor="password" className="g-caption uppercase text-text-secondary">
        Shared password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? "login-error" : undefined}
        className="mt-3 w-full appearance-none border-0 border-b-2 border-border bg-transparent
                   pb-3 font-body text-2xl text-text outline-none
                   placeholder:text-text-secondary focus:border-accent-hover"
      />
      <p className="g-caption mt-3 text-text-secondary">
        Verified server-side. Never stored in the browser.
      </p>

      {errorMessage && (
        <p id="login-error" role="alert" className="g-caption mt-4 text-accent-hover">
          {errorMessage}
        </p>
      )}

      <div className="mt-12">
        <Button
          variant="primary"
          tick
          fullWidth
          type="submit"
          disabled={pending}
        >
          {pending ? "Checking…" : "Continue"}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
