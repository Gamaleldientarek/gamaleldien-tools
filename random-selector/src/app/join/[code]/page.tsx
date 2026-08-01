import Link from "next/link";
import {
  Wordmark,
  Button,
  BrandNode,
  Eyebrow,
  Hairline,
  ThemeToggle,
} from "@/components/brand";
import { redirect } from "next/navigation";
import { readParticipantCookie } from "@/lib/participantCookie";
import { createServiceClient } from "@/lib/supabase/server";
import type { RoomStatus } from "@/lib/types";
import { JoinForm } from "./JoinForm";

export const dynamic = "force-dynamic";

/**
 * /join/[code] — participant enters their REAL name. Phone-first, one-handed.
 * Server component: looks the room up by code (service role, safe fields
 * only) so unknown / locked / closed rooms get a friendly state instead of a
 * dead form. The form itself posts to the `joinRoom` server action.
 */
export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const roomCode = decodeURIComponent(code ?? "").trim().toUpperCase();

  let room: { id: string; name: string | null; status: RoomStatus } | null =
    null;
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("rooms")
      .select("id, name, status")
      .eq("code", roomCode)
      .maybeSingle<{ id: string; name: string | null; status: RoomStatus }>();
    room = data;
  } catch (err) {
    console.error("join page room lookup failed:", err);
  }

  // Already seated on this phone (signed seat cookie)? Straight back to the
  // room — the room page recovers the identity itself. Covers the locked
  // "draw has started" state too, so returning participants never hit the
  // blocked wall.
  //
  // The cookie alone is NOT enough: redirecting on an unverified cookie
  // bounces the user between /join and /room when the row is gone or the DB
  // hiccups. Confirm the participant row first, and on ANY uncertainty fall
  // through to the form. `redirect()` stays outside the try — it throws a
  // control-flow signal a catch would swallow.
  let seatedRoomId: string | null = null;
  if (room && room.status !== "closed") {
    try {
      const seatedId = await readParticipantCookie(room.id);
      if (seatedId) {
        const supabase = createServiceClient();
        const { data: seat, error } = await supabase
          .from("participants")
          .select("id")
          .eq("id", seatedId)
          .eq("room_id", room.id)
          .maybeSingle<{ id: string }>();
        if (!error && seat) seatedRoomId = room.id;
      }
    } catch (err) {
      console.error("join page seat verification failed:", err);
      // Unknown state → show the form rather than risk a redirect loop.
    }
  }
  if (seatedRoomId) redirect(`/room/${seatedRoomId}`);

  const roomName = room?.name?.trim() || "Turn Order Generator";

  let blockedTitle: string | null = null;
  let blockedBody: string | null = null;
  if (!room) {
    blockedTitle = "We can’t find that room";
    blockedBody =
      "Check the code on the screen and try again.";
  } else if (room.status === "closed") {
    blockedTitle = "This room has ended";
    blockedBody = "This session has wrapped. Ask the host for the new room.";
  } else if (room.status === "locked") {
    blockedTitle = "Joining is closed right now";
    blockedBody =
      "The host has paused joining for a moment. Ask them to reopen it.";
  } else if (room.status !== "lobby") {
    blockedTitle = "The draw has started";
    blockedBody =
      "Joining is closed for this round. Watch the screen for the order.";
  }

  return (
    <main className="g-ground flex min-h-svh flex-col px-6 py-9 sm:px-10">
      {/* Header: which room you're joining. Top-weighted. */}
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
          You&rsquo;re joining
        </Eyebrow>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-2xl text-text">{roomName}</span>
        </div>
        <p className="g-caption mt-2 uppercase text-text-secondary">
          Room {roomCode || "—"}
        </p>
      </header>

      <div className="mt-16 flex-1">
        {blockedTitle ? (
          <>
            <h1 className="g-title max-w-sm text-balance text-text">
              {blockedTitle}
            </h1>
            <p className="g-body mt-6 max-w-sm text-text/70">
              {blockedBody}
            </p>
            <div className="mt-12 max-w-sm">
              <Button variant="secondary" fullWidth href="/join">
                Try another code
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* The ask — serif for personality. */}
            <h1 className="g-title max-w-sm text-balance text-text">
              What&rsquo;s your name?
            </h1>
            <JoinForm code={roomCode} roomId={room!.id} />
          </>
        )}
      </div>

      {/* Footer flow-tick + theme. */}
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
