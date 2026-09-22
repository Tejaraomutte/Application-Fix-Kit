import { NextResponse } from 'next/server';
import { AMOUNT, PRODUCT } from '../../../lib/config';
import { makeReference } from '../../../lib/reference';
import { listSubmissions, saveSubmission } from '../../../lib/submissions';
import { paymentSchema } from '../../../lib/validation';

export async function GET(req: Request) {
  const configuredSecret = process.env.ADMIN_APPROVAL_SECRET || '';
  const providedSecret = req.headers.get('x-admin-secret') || '';

  if (configuredSecret && providedSecret !== configuredSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const submissions = await listSubmissions();
  return NextResponse.json(submissions);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = paymentSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message ?? 'Please enter a valid name, email and UTR.';
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const paymentReference = makeReference();
    const submittedAt = new Date().toISOString();
    const record = {
      paymentReference,
      reference: paymentReference,
      name: parsed.data.name,
      email: parsed.data.email,
      product: PRODUCT,
      amount: AMOUNT,
      utr: parsed.data.utr,
      screenshot: parsed.data.screenshot || '',
      submittedAt,
      status: 'PENDING' as const,
      source: 'web',
      deliveryStatus: 'PENDING',
    };

    await saveSubmission(record);

    const webhookUrl = process.env.N8N_PAYMENT_SUBMISSION_WEBHOOK_URL;
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AFK-Webhook-Secret': process.env.ADMIN_APPROVAL_SECRET || '',
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'We could not submit your payment details. Please try again.' }, { status: 502 });
      }
    }

    return NextResponse.json({
      paymentReference,
      reference: paymentReference,
      status: 'PENDING',
      message: `Payment details submitted successfully.\n\nPayment Reference:\n${paymentReference}\n\nYour payment is currently awaiting verification.\nOnce your payment is verified, the Application Fix Kit will be delivered to your email.`,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

