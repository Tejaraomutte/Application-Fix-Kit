'use client';

import Link from 'next/link';
import { useState } from 'react';

const statusCopy: Record<string, { title: string; description: string }> = {
  PENDING: {
    title: 'PENDING',
    description: 'Your payment details have been received and are awaiting verification.',
  },
  APPROVED: {
    title: 'APPROVED',
    description: 'Your payment has been verified. Your product is being prepared for delivery.',
  },
  DELIVERED: {
    title: 'DELIVERED',
    description: 'Your Application Fix Kit has been delivered to your email.',
  },
  REJECTED: {
    title: 'REJECTED',
    description: 'We could not verify the payment using the submitted information. Please contact support with your payment reference.',
  },
};

export default function StatusPage() {
  const [ref, setRef] = useState('');
  const [data, setData] = useState<{ status?: string; message?: string; paymentReference?: string } | null>(null);
  const [error, setError] = useState('');

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/payment-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: ref }),
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error || 'Unable to check status right now.');
      setData(null);
      return;
    }

    setData(json);
  }

  const current = data?.status ? statusCopy[data.status.toUpperCase()] || { title: data.status.toUpperCase(), description: data.message || 'Payment status is available.' } : null;

  return (
    <main className="mx-auto max-w-2xl px-5 py-20">
      <Link href="/" className="text-sm font-bold text-muted">← Home</Link>

      <div className="card mt-8 p-8 md:p-10">
        <p className="text-sm font-black uppercase tracking-[.2em] text-muted">Payment status</p>
        <h1 className="mt-3 text-4xl font-black">Check your payment</h1>

        <form onSubmit={check} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            className="input"
            placeholder="Payment Reference"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
          <button className="btn btn-primary">Check Status</button>
        </form>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {current && (
          <div className="mt-8 rounded-3xl border p-6" style={{ borderColor: 'var(--line)' }}>
            <div className="text-2xl font-black">{current.title}</div>
            <p className="mt-2 text-muted">{data?.message || current.description}</p>
            {data?.paymentReference && (
              <p className="mt-4 text-sm text-muted">Reference: {data.paymentReference}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

