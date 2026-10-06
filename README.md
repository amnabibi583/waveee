# Signalboard Lead Intelligence

Signalboard is a React + Vite AI-style lead scoring interface that turns three lead inputs into a transparent, structured local simulation. No live production URL is claimed yet: **Live URL:** `[add the Netlify URL after deployment]`.

## Features

- Company name, company size, and intent form.
- Structured Lead Score Card with score, tier, next action, and reasons.
- Loading, success, empty, cancelled, retry, and designed error states.
- Simulated `error`, `rate`, `slow`, and `midstream` scenarios.
- Stop control, Retry control, maximum input length, duplicate-submit protection, and a short client-side cooldown.
- Responsive layout, semantic form controls, visible focus states, polite live regions, and reduced-motion support.

## Screenshots

No screenshots are included yet. After running the app locally or deploying it, capture the normal result, loading/Stop state, and an error state at desktop and mobile widths. Save real images in a `screenshots/` folder and update this section with their paths; do not use placeholder or invented screenshots.

## Tech stack

React, Vite, plain CSS, and browser APIs (`AbortController` and timers). There is no external AI API, database, authentication, or API key.

## Local setup

```bash
npm install
npm run dev
```

For a production build preview:

```bash
npm run build
npm run preview
```

## Environment variables

No environment variables required.

## Architecture

`src/main.jsx` mounts the app. `src/App.jsx` owns form state, the local abortable tool simulation, cooldown, retry, and stop behavior. `src/components/ToolLifecycle.jsx` selects the idle, loading, output, and error presentation. `src/components/LeadScoreCard.jsx` renders the structured result. `src/App.css` contains the responsive visual system.

## Tool contract

Tool name: `scoreLead`

Input: `{ company: string, size: "Startup" | "Mid-market" | "Enterprise", intent: "Low" | "Medium" | "High" }`

Return shape: `{ score: number, tier: string, action: string, reasons: string[] }`

The request is simulated locally with an abortable timer. Stop cancels it, and Retry resends the same submitted details.

## Production-safety measures

- Company input is capped at 120 characters.
- Submissions are ignored while a request is loading.
- A 1.2-second client-side cooldown prevents rapid repeated submissions.
- `AbortController` cancels the simulated request when Stop is pressed.
- The app only simulates AI locally; it cannot drain API credits because it makes no external AI calls.
- No server-side rate limiting or request timeout is applicable because there is no external API or server endpoint.

## Known limitations

Scores are illustrative local outputs, not validated business predictions. There is no persistence, authentication, real AI model, backend rate limiting, or production URL yet. Lighthouse scores and real-device browser checks remain to be run after deployment.

## How AI tools helped build this

AI assistance helped scaffold the React/Vite structure, draft lifecycle components and responsive CSS, and reason through local error simulations and cancellation. I personally checked the source behavior, kept the tool local with no API credentials, reviewed accessibility requirements, ran `npm run build`, and documented limitations instead of claiming deployment or audit results.

## Deploy on Netlify

1. Push the repository to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and select the repository.
3. Use build command `npm run build` and publish directory `dist`.
4. Deploy, then record the real URL above and test the production states.

## Testing the states

- Normal: enter any ordinary company name, choose size and intent, and select **Score this lead**.
- Error: use company name `error`.
- Rate: use company name `rate`.
- Slow: use company name `slow`, then test **Stop** while it loads.
- Midstream: use company name `midstream`, then test **Retry** on the error card.

## Automated tests

```bash
npm install
npm test
npm run test:watch
npm run test:coverage
npx playwright install --with-deps chromium
npm run test:e2e
```

Vitest runs seven React Testing Library tests for validation, loading and duplicate-submit protection, successful mocked AI output, API error, retry, cancellation, and the structured Lead Score Card. Unit tests mock the Netlify function with `fetch`; they never call Claude. Playwright intercepts the function route and tests the real form-to-score-card flow without external API access.

## Claude API setup

The frontend calls `/.netlify/functions/score-lead`. The Netlify function keeps `ANTHROPIC_API_KEY` server-side and validates both input and Claude's JSON response. The browser never receives the key.

1. Copy `.env.example` to `.env` for local reference and set `ANTHROPIC_API_KEY` to your real key. Do not commit `.env`.
2. In Netlify, add `ANTHROPIC_API_KEY` under **Site configuration → Environment variables**.
3. For local function testing, install the Netlify CLI if needed and run `netlify dev`; do not use only `npm run dev` for the function route.
4. Deploy with `npm run build` and publish `dist`. Netlify will discover functions from `netlify/functions`.

The function has input validation, a 20-second request timeout, safe errors for rate limits, malformed Claude output, unavailable configuration, and upstream failures. No real API request can be tested until a valid server-side key is configured.
