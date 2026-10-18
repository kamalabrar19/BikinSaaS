# BikinSaaS

Marketing site for an Indonesian web agency that builds websites and business
systems for small businesses, local shops and football schools.

Next.js 15 App Router, React 19, TypeScript, Tailwind, Framer Motion.
Indonesian and English, each on its own server-rendered route.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in at least NEXT_PUBLIC_WHATSAPP_NUMBER
npm run dev                  # http://localhost:3000, redirects to /id
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` is worth filling in before anything else. Every
call to action on the page goes through WhatsApp; with no number configured the
buttons fall back to email, and with no email either they fall back to the
contact form.

## How the content is organised

Text and data are kept apart on purpose.

- `content/catalog.ts` holds everything that is not language: ids, prices as
  numbers, icon keys, ordering. A price exists exactly once.
- `content/copy.id.ts` and `content/copy.en.ts` hold the words, keyed by the
  same ids.
- `content/schema.ts` derives the id unions from the catalog and requires both
  copy files to cover every one of them, so a missing translation is a
  compile error from `npx tsc --noEmit` rather than a page that quietly falls
  back to Indonesian.
- `content/index.ts` joins the two and returns view models. It runs on the
  server only; the dictionary never reaches the browser bundle.

To add a package, add it to `catalog.ts`, then run `npx tsc --noEmit` and let
it tell you which copy entries are missing.

## Admin panel

`/admin` — a hidden page (nothing links to it, `noindex`, absent from
`robots.txt`) where the portfolio, price list, statistics, FAQ, policies,
services, process and the WhatsApp/email/address can be edited without touching
code. It has four pages — Portofolio, Harga, Isi halaman, Kontak — and one save
button. Media uploads (photos, GIFs, videos) go to `public/media/uploads`, and the
document to `data/site.json`; neither is committed, and removing them falls back
to the seed in `content/*.ts`.

```bash
npm run admin:password       # prints ADMIN_PASSWORD_HASH + ADMIN_SESSION_SECRET
# paste into .env.local, restart the server, then open http://localhost:3000/admin
```

`content/index.ts` is where the two layers meet: `buildBaseContent` is the seed,
`getContent` lays the admin document over it. See `docs/admin.md`.

## Money and dates

`lib/format.ts` formats both by hand rather than through `Intl`. Node's ICU and
the browser's ICU disagree about the spacing in `Intl.NumberFormat` for IDR
depending on the ICU build, which shows up as a React hydration mismatch on a
figure that appears more than twenty times. Plain string work is identical on
both sides.

## Photographs

Every photograph in `public/media` is openly licensed (CC0 or CC BY) and shows
the world our clients work in. None of them is a client, and nothing on the
page implies otherwise. Creators and licences are recorded in
`public/media/credits.json` and rendered beside each picture and again in the
footer; CC BY requires that. CC BY-SA was deliberately excluded when searching,
because share-alike would oblige us to license edited versions the same way.

## Content that is still placeholder

The portfolio holds two anonymised client projects and five concepts we wrote
ourselves. The page says so in plain language. Replace them with real case
studies before showing this to prospects, and do not present a concept as
delivered work.

## Checks

```bash
npx tsc --noEmit
npx next build
```

The visual design is also held to an automated standard. See
`docs/design-checks.md`.