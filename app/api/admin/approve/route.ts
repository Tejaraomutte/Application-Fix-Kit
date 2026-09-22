import { NextResponse } from 'next/server';
import { updateSubmission } from '../../../../lib/submissions';

export async function POST(req: Request) {
  const configuredSecret = process.env.ADMIN_APPROVAL_SECRET || '';
  const providedSecret = req.headers.get('x-admin-secret') || '';

  if (configuredSecret && providedSecret !== configuredSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const reference = typeof body?.reference === 'string' ? body.reference.trim() : '';

    if (!reference) {
      return NextResponse.json({ error: 'Payment reference required.' }, { status: 400 });
    }

    const updated = await updateSubmission(reference, {
      status: 'APPROVED',
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'admin',
      deliveryStatus: 'PENDING',
    });

    const url = process.env.N8N_APPROVAL_WEBHOOK_URL;
    if (url) {
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AFK-Webhook-Secret': process.env.ADMIN_APPROVAL_SECRET || '',
        },
        body: JSON.stringify({ reference, action: 'approve', verifiedAt: new Date().toISOString(), verifiedBy: 'admin' }),
      });

      if (!r.ok) {
        return NextResponse.json({ error: 'Automation failed.' }, { status: 502 });
      }
    }

    return NextResponse.json({
      message: updated ? 'Payment approved successfully.' : 'Payment reference not found. Check the submitted reference and try again.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

