'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';

export function Nav() {
  const { dark, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ borderColor: 'var(--line)', background: 'color-mix(in srgb, var(--bg) 88%, transparent)' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3 font-black">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white">
            AF
          </span>
          <span>Application Fix Kit</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="/#inside" className="text-sm font-semibold text-muted">What's inside</a>
          <a href="/#how" className="text-sm font-semibold text-muted">How it works</a>
          <Link href="/payment/status" className="text-sm font-semibold text-muted">Check status</Link>
          <Link href="/pay" className="btn btn-primary text-sm">Get the Kit — ₹299</Link>
        </nav>

        <button onClick={toggle} aria-label="Toggle theme" className="btn btn-ghost ml-3 h-10 w-10 p-0">
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

