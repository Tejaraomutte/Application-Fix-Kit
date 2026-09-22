'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [ref, setRef] = useState('');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState<any[]>([]);

  async function loadItems() {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (secret) {
      headers['x-admin-secret'] = secret;
    }

    const response = await fetch('/api/payment-submission', {
      method: 'GET',
      headers,
    });

    if (response.ok) {
      const json = await response.json();
      setItems(Array.isArray(json) ? json : []);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function action(kind: 'approve' | 'reject') {
    setStatus('Processing…');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (secret) {
      headers['x-admin-secret'] = secret;
    }

    const response = await fetch(`/api/admin/${kind}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reference: ref }),
    });

    const json = await response.json();
    setStatus(json.message || json.error || 'Unknown response.');
    if (response.ok) {
      await loadItems();
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-20">
      <div className="card p-8">
        <p className="text-sm font-black uppercase tracking-[.2em] text-muted">Private admin area</p>
        <h1 className="mt-3 text-4xl font-black">Payment verification</h1>
        <p className="mt-2 text-muted">For MVP operations. Keep this route private and never share the secret.</p>

        <div className="mt-8 space-y-4">
          <input
            className="input"
            placeholder="Admin secret (optional)"
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
          <input className="input" placeholder="Payment reference" value={ref} onChange={(e) => setRef(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <button className="btn btn-primary" onClick={() => action('approve')}>Approve</button>
            <button className="btn btn-ghost" onClick={() => action('reject')}>Reject</button>
          </div>
          {status && <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: 'var(--line)' }}>{status}</div>}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-black">Submitted payments</h2>
          <div className="mt-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-muted">No submissions yet.</p>
            ) : (
              items.map((item) => (
                <div key={item.paymentReference || item.reference} className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex items-center justify-between gap-3">
                    <strong>{item.name}</strong>
                    <span className="text-sm text-muted">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{item.email}</p>
                  <p className="text-sm text-muted">Reference: {item.paymentReference || item.reference}</p>
                  <p className="text-sm text-muted">UTR: {item.utr}</p>
                  <p className="text-sm text-muted">Amount: ₹{item.amount}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

