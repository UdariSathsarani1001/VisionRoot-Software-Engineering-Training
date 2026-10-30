import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ServiceDesk',
  description: 'Submit and track internal service requests',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="sd-body flex min-h-screen flex-col">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="sd-header sticky top-0 z-30 border-b backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="sd-logo-link flex items-center gap-2.5 rounded-sm">
              <span
                aria-hidden="true"
                className="sd-logo-mark flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold"
              >
                SD
              </span>
              <span className="text-sm font-semibold tracking-tight">
                ServiceDesk
              </span>
            </Link>

            <nav aria-label="Site navigation">
              <Link
                href="/requests/new"
                className="sd-nav-link hidden rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:inline-flex"
              >
                New request
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────────────────── */}
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <footer className="sd-footer border-t">
          <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
            <p className="sd-footer-text text-xs">
              © {new Date().getFullYear()} ServiceDesk · Running on mock
              data — no backend connected
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
