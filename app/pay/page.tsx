'use client';

import Link from 'next/link';
import QRCode from 'qrcode';
import { useEffect, useMemo, useState } from 'react';
import { AMOUNT, PAYMENT_NAME, SUPPORT, UPI_ID } from '../../lib/config';

const upiUri = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYMENT_NAME)}&am=${AMOUNT}&cu=INR`;

export default function PayPage() {
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ paymentReference?: string; message?: string } | null>(null);
  const [form, setForm] = useState({ name: '', email: '', utr: '', screenshot: '' });

  const qrValue = useMemo(() => upiUri, []);

  useEffect(() => {
    let active = true;

    QRCode.toDataURL(qrValue, {
      width: 520,
      margin: 2,
      color: {
        dark: '#0b1220',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) setQr(url);
      })
      .catch(() => {
        if (active) setQr('');
      });

    return () => {
      active = false;
    };
  }, [qrValue]);

  const copyUpiId = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(UPI_ID);
      } else {
        const helper = document.createElement('textarea');
        helper.value = UPI_ID;
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        document.body.removeChild(helper);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
      setError('Copy is not available on this device. Please copy the UPI ID manually.');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setForm((current) => ({ ...current, screenshot: '' }));
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, JPEG, PNG, or WebP screenshot.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Screenshot must be under 5MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, screenshot: String(reader.result ?? '') }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const response = await fetch('/api/payment-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        utr: form.utr,
        screenshot: form.screenshot,
      }),
    });

    const json = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(json.error || 'Please check the form and try again.');
      setSuccess(null);
      return;
    }

    setSuccess({ paymentReference: json.paymentReference || json.reference, message: json.message });
    setForm({ name: '', email: '', utr: '', screenshot: '' });
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 md:py-16">
      <div className="mb-8">
        <Link href="/" className="text-sm font-bold text-muted">← Back to Application Fix Kit</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="card p-6 md:p-8 lg:p-10">
          <p className="text-sm font-black uppercase tracking-[.2em] text-muted">Pay securely using UPI</p>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">Application Fix Kit</h1>
          <div className="mt-5 text-5xl font-black">₹{AMOUNT}</div>
          <p className="mt-2 text-muted">One-time payment</p>

          <div className="mt-8 rounded-3xl border bg-white/10 p-5 md:p-6" style={{ borderColor: 'var(--line)' }}>
            <p className="text-center text-sm font-medium text-muted">Scan to pay ₹{AMOUNT}</p>

            <div className="mt-4 flex justify-center">
              {qr ? (
                <img src={qr} alt="UPI payment QR code" className="w-full max-w-[360px] rounded-2xl border bg-white p-3 shadow-sm" />
              ) : (
                <div className="flex w-full max-w-[360px] items-center justify-center rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-muted">
                  UPI ID:<br />
                  {UPI_ID}
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
              <div className="text-sm font-semibold text-muted">UPI ID</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="break-all font-bold">{UPI_ID}</span>
                <button type="button" className="btn btn-ghost h-10 px-3 text-sm" onClick={copyUpiId}>
                  {copied ? 'Copied!' : 'Copy UPI ID'}
                </button>
              </div>
            </div>

            <button type="button" className="btn btn-primary mt-4 w-full" onClick={() => window.location.href = upiUri}>
              Open UPI App
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-300/80 bg-amber-50/80 p-3 text-sm text-slate-700 dark:bg-amber-500/10 dark:text-slate-200">
            <span className="font-bold">🔒 Manual payment verification</span>
            <div className="mt-1">We verify your payment before delivering the product.</div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-black">How to pay</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted">
              <li>Scan the QR code or copy the UPI ID.</li>
              <li>Pay exactly ₹{AMOUNT}.</li>
              <li>Complete the payment in your UPI app.</li>
              <li>Save your UTR / Transaction ID.</li>
              <li>Return here and submit your payment details.</li>
              <li>Your payment will be manually verified.</li>
              <li>Your Application Fix Kit will be delivered after verification.</li>
            </ol>
            <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">«Your product will be delivered after payment verification.»</p>
          </div>
        </section>

        <section className="card p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl font-black">Already paid?</h2>
          <p className="mt-2 text-muted">Submit your payment details</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                className="input"
                placeholder="Name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                className="input"
                placeholder="Email"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">UTR / Transaction ID</span>
              <input
                required
                value={form.utr}
                onChange={(e) => setForm((current) => ({ ...current, utr: e.target.value }))}
                className="input"
                placeholder="UTR"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Payment screenshot</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="input"
              />
              <span className="mt-2 block text-xs text-muted">Optional. JPG, JPEG, PNG, or WebP up to 5MB.</span>
            </label>

            {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}

            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Payment Details'}
            </button>
          </form>

          {success && (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-50">
              <p className="font-bold">Payment details submitted successfully.</p>
              <p className="mt-3">
                <span className="font-semibold">Payment Reference:</span> {success.paymentReference}
              </p>
              <p className="mt-2">Your payment is currently awaiting verification.</p>
              <p className="mt-1">Once your payment is verified, the Application Fix Kit will be delivered to your email.</p>
              <div className="mt-4">
                <Link href="/payment/status" className="btn btn-primary inline-flex">
                  Check Payment Status
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 text-center text-sm text-muted">
        {SUPPORT ? <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a> : 'Customer support available after payment review.'}
      </div>
    </main>
  );
}
