import { z } from 'zod';

const screenshotSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((value) => {
    if (!value || value === '') return true;
    if (!value.startsWith('data:image/')) return false;
    const match = /^data:image\/(png|jpe?g|webp);base64,/i.exec(value);
    if (!match) return false;
    const [, encoded] = value.split(',', 2);
    if (!encoded) return false;
    const size = Buffer.from(encoded, 'base64').length;
    return size > 0 && size <= 5 * 1024 * 1024;
  }, 'Screenshot must be a JPG, JPEG, PNG, or WebP image up to 5MB.');

export const paymentSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.').max(100, 'Name is too long.'),
  email: z.string().trim().email('Please enter a valid email address.').max(160, 'Email is too long.'),
  utr: z
    .string()
    .trim()
    .min(6, 'UTR / Transaction ID is required.')
    .max(80, 'UTR / Transaction ID is too long.')
    .refine((value) => /^[A-Za-z0-9][A-Za-z0-9\- ]{4,79}$/.test(value), 'Please enter a valid UTR / Transaction ID.'),
  screenshot: screenshotSchema,
}).transform((data) => ({
  name: data.name.trim(),
  email: data.email.trim().toLowerCase(),
  utr: data.utr.trim(),
  screenshot: data.screenshot ?? '',
}));
