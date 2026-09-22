import crypto from 'crypto';

export function makeReference() {
  const d = new Date();
  const date = d.toISOString().slice(0, 10).replaceAll('-', '');
  const code = crypto.randomBytes(4).toString('hex').slice(0, 6).toUpperCase();
  return `AFK-${date}-${code}`;
}
