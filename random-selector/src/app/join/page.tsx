"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wordmark,
  Button,
  BrandNode,
  Eyebrow,
  Hairline,
  ThemeToggle,
} from "@/components/brand";

/**
 * /join — manual code entry for participants without the QR/link (the landing
 * CTA points here). Pure navigation: pushes to /join/[code], where the room
 * is validated and the name form lives. Mirrors the join page composition.
 */
export default function JoinCodePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) router.push(`/join/${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="g-ground flex min-h-svh flex-col px-6 py-9 sm:px-10">
      <header>
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center">
            <span className="inline-flex dark:hidden">
              <Wordmark height={22} />
            </span>
            <span className="hidden dark:inline-flex">
              <Wordmark height={22} />
            </span>
            <span className="sr-only">gamaleldien — home</span>
          </Link>
          <span className="h-4 w-px bg-border-light" aria-hidden />
          <span className="g-caption uppercase text-text-secondary">Workshop tool</span>
        </div>
        <Eyebrow tick className="mt-10">
          Join a room
        </Eyebrow>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-2xl text-text">
            Turn Order Generator
          </span>
        </div>
      </header>

      <div className="mt-16 flex-1">
        <h1 className="g-title max-w-sm text-balance text-text">
          Enter the room code
        </h1>

        <form onSubmit={submit} className="mt-12 block">
          <label htmlFor="roomCode" className="g-caption uppercase text-text-secondary">
            Room code
          </label>
          <input
            id="roomCode"
            name="roomCode"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            required
            placeholder="ROOM-4821"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-3 w-full appearance-none border-0 border-b-2 border-border-light bg-transparent
                       pb-3 font-display text-3xl uppercase text-text outline-none
                       placeholder:text-text-secondary/40 focus:border-accent"
          />
          <p className="g-caption mt-3 text-text-secondary">
            Nine characters, like ROOM-4821. It&rsquo;s on the big screen, or
            scan the QR there instead.
          </p>

          <div className="mt-12">
            <Button variant="primary" tick fullWidth type="submit">
              Find my room
            </Button>
          </div>
        </form>
      </div>

      <footer className="mt-10">
        <Hairline />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <BrandNode size={4} shape="square" tone="accent" />
            <span className="g-caption uppercase text-text-secondary">
              Joining locks when the selector runs
            </span>
          </div>
          <ThemeToggle />
        </div>
      </footer>
    </main>
  );
}
