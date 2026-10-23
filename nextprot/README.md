# Anudeep Reddy Veerati — Portfolio (Next.js)

Next.js 15 (App Router, TypeScript) rebuild of the dark-red glass portfolio template.

```bash
npm install
npm run dev     # http://localhost:3100
npm run build && npm start
```

- `lib/content.ts` holds all copy (projects, experience, patent, skills). Edit there.
- `lib/sims.ts` holds the six project simulations (PondFix, Privacy Agent, Traffic, Civix, Railway, Recoverix).
- `app/globals.css`: the original template styles first, the type + motion layer (Schibsted Grotesk, expo easing, reveals, scroll timelines) after.
- All motion respects `prefers-reduced-motion`; hidden states only exist when JS is on.
