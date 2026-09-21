This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Daily push notifications

Readers who press "Send me a word daily" get the word of the day as a web push notification at 9am in their own time zone.

How it fits together:

- `components/subscribe-notice.tsx` asks for permission, then `lib/push/client.ts` registers `public/sw.js` and subscribes with the browser's push service.
- `POST /api/push/subscribe` stores the subscription and the reader's time zone in Redis (`lib/push/store.ts`); `/api/push/unsubscribe` removes it.
- `POST /api/push/send` runs every hour. It picks the subscribers for whom it is now 9am to noon locally and who have not had today's word, and sends it with `web-push`. Dead subscriptions (404/410) are deleted.
- The hourly trigger is `.github/workflows/daily-word.yml`, because Vercel's free plan only allows a daily cron.

### Setup

1. Generate VAPID keys: `npx web-push generate-vapid-keys`.
2. Create a Redis database at [Upstash](https://upstash.com) (or add the Upstash integration in Vercel).
3. Set these environment variables (locally in `.env.local`, and in Vercel):

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | the VAPID public key |
   | `VAPID_PRIVATE_KEY` | the VAPID private key (keep secret) |
   | `VAPID_SUBJECT` | a contact, e.g. `mailto:you@example.com` |
   | `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | from the Upstash database (the Vercel integration's `KV_REST_API_URL` / `KV_REST_API_TOKEN` also work) |
   | `CRON_SECRET` | any long random string; guards `/api/push/send` |

4. In the GitHub repository, add the secrets `SITE_URL` (the production URL, no trailing slash) and `CRON_SECRET` (the same value as above). The workflow then runs at five past every hour.

### Trying it

Push needs HTTPS, except on `localhost`. To send a test right now (this only reaches readers for whom it is currently 9am to noon, and who have not already had today's word):

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/push/send
```

iPhones and iPads only receive web push once the site is added to the Home Screen.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# Word-Hound" 
