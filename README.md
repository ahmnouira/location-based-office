# Serviced Offices in London

A polished location-based office listing page built in Next.js (App Router) with TypeScript, Tailwind CSS, and lightweight shadcn-style UI primitives.

## What is included

- Headline and intro section for the London location page
- Search and filters for office type, area, budget range, and desk count
- Twelve London office cards populated from `data/listings.json`
- Mid-page advisor conversion block
- FAQ section tailored to serviced office search intent
- Responsive layout designed for desktop and mobile

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Custom shadcn-style UI components

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project structure

- `app/page.tsx` renders the main location page
- `components/office-listing-page.tsx` contains the interactive UI and filtering logic
- `components/ui/*` contains reusable UI primitives
- `data/listings.json` stores the London office inventory

## Notes

- The original prompt referenced a provided `listings.json`, but no dataset was present in the workspace. A realistic 12-item London dataset has been included so the page is functional and reviewable end-to-end.
- The UI follows the polish and commercial tone expected of a modern office search experience without copying any reference site.
