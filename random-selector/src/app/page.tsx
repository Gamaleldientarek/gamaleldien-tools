import { Button, Eyebrow, Hairline, Wordmark } from "@/components/brand";

/**
 * Landing — type, colour and geometry on black.
 *
 * The AZMX original was built on a supplied photograph, with the whole layout
 * reasoned around the still life's composition and the contrast of its lit
 * floor. That art is a client asset and is gone, and no tool in this family
 * uses photography: every one of them is a lockup on #0A0A0A with the dot
 * lattice underneath. Rebuilding it that way is what makes this read as one
 * of Jimmy's tools rather than a reskinned client project.
 *
 * The bloom is anchored below the frame, so its hot centre never reaches the
 * lockup and the AAA contrast of white-on-near-black is preserved without a
 * scrim. Fixed dark (`g-dark-locked`): an art-directed surface composed on
 * black reads as broken when washed out to light. The working surfaces —
 * facilitator panel, phone, join — do theme.
 */
export default function Home() {
  return (
    <main className="g-dark-locked g-lattice g-bloom relative flex min-h-svh flex-col">
      <header className="px-6 pt-8 sm:px-10 lg:px-sp-6 lg:pt-sp-4 xl:px-sp-7">
        <a
          href="https://gamaleldien.com"
          className="inline-flex rounded-g-sm text-white transition-opacity duration-150 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Wordmark height={22} />
        </a>
      </header>

      <div className="flex flex-1 flex-col justify-center px-6 pb-6 pt-14 sm:px-10 lg:px-sp-6 lg:py-sp-4 xl:px-sp-7">
        <div className="max-w-[46rem]">
          <Eyebrow tick>Workshop tool</Eyebrow>

          {/* The lockup. Two lines, uppercase Clash, tight tracking — the
              name reads as one object rather than three loose words. */}
          <h1 className="g-hero mt-5 text-white">
            Turn Order
            <br />
            Generator
          </h1>

          <p className="g-lead mt-6 max-w-[34rem]">
            Everyone gets a turn, in an order no one can argue with. Retros,
            workshops, standups, icebreakers.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center lg:mt-sp-4">
          <Button href="/join" variant="primary" tick className="w-full sm:w-auto">
            Join a room
          </Button>
          <Button
            href="/facilitator/login"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            I&rsquo;m the facilitator
          </Button>
        </div>
      </div>

      <footer className="px-6 pb-8 sm:px-10 lg:px-sp-6 lg:pb-sp-4 xl:px-sp-7">
        <Hairline />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <span className="g-caption uppercase">Free tool · No sign-up</span>
          <a
            href="https://tools.gamaleldien.com"
            className="g-caption uppercase transition-colors duration-150 hover:text-accent-hover"
          >
            tools.gamaleldien.com
          </a>
        </div>
      </footer>
    </main>
  );
}
