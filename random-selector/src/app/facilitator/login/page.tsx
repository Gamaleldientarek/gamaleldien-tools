import Link from "next/link";
import { Wordmark, Eyebrow, Hairline } from "@/components/brand";
import { LoginForm } from "./LoginForm";

/**
 * /facilitator/login — the password gate. The shared password is verified
 * server-side (env var, constant-time) and never shipped to the client.
 * Focused navy "premium dark" surface (intended contrast with the light
 * facilitator work area).
 */
export default function FacilitatorLoginPage() {
  return (
    <main className="g-ground g-lattice relative flex min-h-svh flex-col overflow-hidden px-6 py-10 sm:px-12">

      <header className="relative z-10 flex items-center gap-3">
        <Link href="/" className="inline-flex items-center">
          <Wordmark height={22} />
          <span className="sr-only">gamaleldien — home</span>
        </Link>
        <span className="h-4 w-px bg-border-light" aria-hidden />
        <span className="g-caption uppercase text-text-secondary">Facilitator</span>
      </header>

      <div className="relative z-10 flex flex-1 items-center">
        <div className="w-full max-w-md">
          <Eyebrow tick>
            Restricted
          </Eyebrow>
          <h1 className="g-title mt-4 text-text">Sign in to run a room</h1>

          <LoginForm />
        </div>
      </div>

      <footer className="relative z-10">
        <Hairline />
        <p className="g-caption mt-4 uppercase text-text-secondary">
          Turn Order Generator · one room per session
        </p>
      </footer>
    </main>
  );
}
