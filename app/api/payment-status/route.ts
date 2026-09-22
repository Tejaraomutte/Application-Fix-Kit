import { NextResponse } from 'next/server';
import { getSubmission } from '../../../lib/submissions';

const statusText: Record<string, string> = {
  PENDING: 'Your payment details have been received and are awaiting verification.',
  APPROVED: 'Your payment has been verified. Your product is being prepared for delivery.',
  DELIVERED: 'Your Application Fix Kit has been delivered to your email.',
  REJECTED: 'We could not verify the payment using the submitted information. Please contact support with your payment reference.',
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reference = typeof body?.reference === 'string' ? body.reference.trim() : '';

    if (!reference) {
      return NextResponse.json({ error: 'Enter a payment reference.' }, { status: 400 });
    }

    const normalized = reference.toUpperCase();
    const localRecord = await getSubmission(normalized);

    if (localRecord) {
      const status = (localRecord.status || 'PENDING').toUpperCase();
      return NextResponse.json({
        paymentReference: normalized,
        status,
        message: statusText[status] || statusText.PENDING,
      });
    }

    const webhookUrl = process.env.N8N_PAYMENT_SUBMISSION_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-AFK-Action': 'status',
          },
          body: JSON.stringify({ reference: normalized }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.status === 'string') {
            return NextResponse.json({
              paymentReference: normalized,
              status: data.status.toUpperCase(),
              message: data.message || statusText[data.status.toUpperCase()] || statusText.PENDING,
            });
          }
        }
      } catch {
        // Fall back to the default local status response below.
      }
    }

    return NextResponse.json({
      paymentReference: normalized,
      status: 'PENDING',
      message: statusText.PENDING,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to check status right now.' }, { status: 502 });
  }
}

