import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Public host (the Worker proxies into basePath) — makes the og:image URL
  // absolute so shared links preview correctly.
  metadataBase: new URL("https://tools.gamaleldien.com"),
  title: "Turn Order Generator",
  description:
    "Put your whole group in a fair random order. Everyone joins on a phone, gets a name, and sees where they land.",
  applicationName: "Turn Order Generator",
  authors: [{ name: "Gamal Eldien", url: "https://gamaleldien.com" }],
  openGraph: {
    title: "Turn Order Generator",
    description:
      "Put your whole group in a fair random order. Everyone joins on a phone, gets a name, and sees where they land.",
    siteName: "tools.gamaleldien.com",
    type: "website",
  },
};

/**
 * Theme bootstrap — runs before first paint (parser-blocking, first in body)
 * so there is no flash of the wrong theme. Resolves auto/light/dark:
 * `tog-theme` in localStorage ("light" | "dark") overrides the device;
 * absent = auto = follow `prefers-color-scheme`.
 *
 * - data-theme       = resolved theme ("light" | "dark") — all CSS keys off this
 * - data-theme-mode  = the user's preference ("auto" | "light" | "dark")
 *
 * Note the default: unlike the AZMX build, DARK is this system's default mode,
 * so `auto` resolves to dark unless the device explicitly asks for light.
 */
const themeInitScript = `(function(){try{var m="auto",s=localStorage.getItem("tog-theme");if(s==="light"||s==="dark")m=s;var d=m==="auto"?(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):m;var r=document.documentElement;r.setAttribute("data-theme",d);r.setAttribute("data-theme-mode",m);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col g-ground">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
