import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/_components/Atoms/ThemeToggle";
import { DEFAULT_THEME, THEME_INIT_SCRIPT } from "@/components/utils/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Display face for the hero headline only. Space Grotesk's tighter, more
 * geometric caps hold up at large sizes where Geist's grotesque turns heavy,
 * and only the two weights the headline actually uses are fetched.
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Satyam",
  description:
    "Satyam is a fullstack engineer with a passion for building performant, accessible, and delightful web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        {/* Resolves the stored/system theme before the first paint — see
            components/utils/theme.ts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-surface text-content">
        <ThemeToggle className="fixed top-6 right-6 z-50" />
        {children}
      </body>
    </html>
  );
}
