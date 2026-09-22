export const PRODUCT = 'Application Fix Kit';
export const AMOUNT = Number(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT ?? '299');
export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID ?? '8555828999@ybl';
export const PAYMENT_NAME = process.env.NEXT_PUBLIC_PAYMENT_NAME ?? PRODUCT;
export const SUPPORT = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? '';
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
