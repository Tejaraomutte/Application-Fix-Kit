# Application Fix Kit — Production-ready MVP starter

A lightweight Next.js + n8n + Google Sheets digital-product checkout for the Application Fix Kit.

## What is included
- Polished responsive landing page with custom light/dark theme
- UPI QR + UPI intent payment page
- UTR submission API with server-side fixed ₹499 price
- Unique AFK payment references
- Payment status page
- Protected admin approve/reject endpoints
- n8n webhook integration points
- SEO metadata
- Accessibility-minded labels, focus states and semantic structure
- No database dependency

## Run
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000

## Production setup
1. Set your UPI ID, support email and site URL.
2. Create an n8n webhook for payment submissions. Save the URL in `N8N_PAYMENT_SUBMISSION_WEBHOOK_URL`.
3. Create an n8n approval webhook. Save it in `N8N_APPROVAL_WEBHOOK_URL`.
4. Configure n8n to write PENDING rows to Google Sheets and notify the admin.
5. Configure approval workflow to update the row, send delivery/rejection email and prevent repeat delivery.
6. Set `ADMIN_APPROVAL_SECRET` to a long random value.
7. Configure product delivery URLs or replace them with private/signed storage.
8. Deploy to Vercel and add the same environment variables.

## n8n payment payload
The submission webhook receives:
`reference, name, email, utr, screenshot, product, amount, submittedAt, status`.

## n8n approval payload
The approval webhook receives:
`reference, action, verifiedAt, verifiedBy`.

## Important
UPI intent/QR does not verify payment. Manually verify the UTR before approving. The client cannot set the product or amount: the API uses the server-defined product and amount.

The admin page is an MVP operations surface. Before high-volume use, put it behind stronger authentication/rate limiting and use a proper transactional data store.
