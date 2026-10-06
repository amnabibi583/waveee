# Signalboard Lead Intelligence

## What the app does

Signalboard is a React + Vite AI-style lead scoring interface. It collects a company name, company size, and buying intent, then simulates a structured local tool request. The result is a readable Lead Score Card with a score out of 100, tier, recommended next action, and reasons. There is no API key, database, or external request.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production check:

```bash
npm run build
npm run preview
```

## Tool contract

- Tool name: `scoreLead`
- Input: `{ company: string, size: "Startup" | "Mid-market" | "Enterprise", intent: "Low" | "Medium" | "High" }`
- Return shape: `{ score: number, tier: string, action: string, reasons: string[] }`

The request is simulated locally with an abortable timer. Stop cancels it, and Retry resends the same submitted details.

## Test each state

- Use an ordinary company name for the success result.
- Use `error` for a designed service error.
- Use `rate` for a rate-limit error.
- Use `slow` to see the loading state for longer.
- Use `midstream` for a connection-ended error.
- While `slow` is loading, use Stop. Then use Retry on an error card to resend the same details.

## Deploy on Netlify

1. Push this repository to GitHub and import it into Netlify, or connect the repository from the Netlify dashboard.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
   These settings are also included in `netlify.toml`.
4. Deploy the site and test each input state on the live URL.

This project has not been deployed or audited here.

# waveee
