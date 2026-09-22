import fs from 'fs/promises';
import path from 'path';

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'DELIVERED' | 'REJECTED';

export type SubmissionRecord = {
  paymentReference: string;
  reference: string;
  name: string;
  email: string;
  product: string;
  amount: number;
  utr: string;
  screenshot?: string;
  submittedAt: string;
  status: SubmissionStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  deliveryStatus?: string;
  deliveryTimestamp?: string;
  source?: string;
  notes?: string;
};

const STORAGE_PATH = path.join(process.cwd(), 'data', 'payments.json');

async function ensureStore() {
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
  try {
    await fs.access(STORAGE_PATH);
  } catch {
    await fs.writeFile(STORAGE_PATH, '[]', 'utf8');
  }
}

async function readStore(): Promise<SubmissionRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(STORAGE_PATH, 'utf8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeStore(records: SubmissionRecord[]) {
  await ensureStore();
  await fs.writeFile(STORAGE_PATH, JSON.stringify(records, null, 2), 'utf8');
}

export async function saveSubmission(record: SubmissionRecord) {
  const records = await readStore();
  const next = [record, ...records];
  await writeStore(next);
  return record;
}

export async function listSubmissions() {
  return readStore();
}

export async function getSubmission(reference: string) {
  const records = await readStore();
  const target = reference.trim().toUpperCase();

  return records.find((entry) => {
    const paymentReference = (entry.paymentReference || '').toUpperCase();
    const recordReference = (entry.reference || '').toUpperCase();
    return paymentReference === target || recordReference === target;
  }) ?? null;
}

export async function updateSubmission(reference: string, updates: Partial<SubmissionRecord>) {
  const records = await readStore();
  const target = reference.trim().toUpperCase();
  const index = records.findIndex((entry) => {
    const paymentReference = (entry.paymentReference || '').toUpperCase();
    const recordReference = (entry.reference || '').toUpperCase();
    return paymentReference === target || recordReference === target;
  });
  if (index === -1) return null;

  records[index] = { ...records[index], ...updates };
  await writeStore(records);
  return records[index];
}
