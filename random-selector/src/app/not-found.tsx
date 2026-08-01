import Link from "next/link";
import { Wordmark, Button, Eyebrow, Hairline } from "@/components/brand";

/**
 * Custom 404 — navy "premium dark" edge state, matching the login/room
 * aesthetic. Serif carries the moment; two ways out (home, join). Fixed-dark
 * like the other navy shells, so no ThemeToggle.
 */
export default function NotFound() {
  return (
    <main className="g-ground g-lattice relative flex min-h-svh flex-col overflow-hidden px-6 py-10 sm:px-12">
      <header className="relative z-10 flex items-center gap-3">
        <Link href="/" className="inline-flex items-center">
          <Wordmark height={22} />
          <span className="sr-only">gamaleldien — home</span>
        </Link>
        <span className="h-4 w-px bg-border-light" aria-hidden />
        <span className="g-caption uppercase text-text-secondary">Workshop tool</span>
      </header>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-16">
        <Eyebrow tick>
          Error 404
        </Eyebrow>
        <h1 className="g-display mt-6 max-w-2xl text-balance text-text">
          This page isn&rsquo;t in the room
        </h1>
        <p className="g-body mt-6 max-w-md text-text-secondary">
          The link may be old, mistyped, or the room it pointed to has closed.
          If someone sent you a join code, enter it fresh.
        </p>
        <div className="mt-12 flex max-w-md flex-col gap-4 sm:flex-row sm:items-center">
          <Button href="/join" variant="primary" tick>
            Join a room
          </Button>
          <Button href="/" variant="secondary">
            Go to the start
          </Button>
        </div>
      </div>

      <footer className="relative z-10">
        <Hairline />
        <p className="g-caption mt-4 uppercase text-text-secondary">
          Turn Order Generator · tools.gamaleldien.com
        </p>
      </footer>
    </main>
  );
}
