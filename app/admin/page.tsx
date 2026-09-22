'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit() {
    if (!secret.trim()) return;
    window.location.href = `/admin/payments?secret=${encodeURIComponent(secret)}`;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="card w-full max-w-md p-8">
        <p className="text-sm font-black uppercase tracking-[.2em] text-muted">Admin</p>
        <h1 className="mt-3 text-3xl font-black">Open admin dashboard</h1>
        <p className="mt-2 text-muted">Use your admin secret to continue.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="relative">
            <input
              className="input w-full pr-12"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter admin secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button className="btn btn-primary w-full" type="submit" disabled={!secret.trim()}>
            Open admin page
          </button>
        </form>
      </div>
    </main>
  );
}
