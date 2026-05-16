# Deploying Wallybot

Wallybot is a static HTML/CSS/JS page plus one serverless function. It deploys
in minutes on any host that supports a Node serverless runtime. Two
recommended targets: **Vercel** and **Cloudflare Pages**.

The frontend works in any modern browser that supports the Web Speech API:
recent Chrome, Edge, and Safari on macOS / iOS / Android. On smart‑TV
browsers and older Safari builds, voice input may not be available — the
text input always works as a fallback.

---

## 1. Get an Anthropic API key

1. Go to <https://console.anthropic.com>.
2. Create a workspace if you don't have one.
3. **API Keys → Create Key.** Copy the key (starts with `sk-ant-…`).
4. Add a billing method. Voice‑chat usage is cheap — a calm conversation is
   pennies. Set a monthly spend limit in the console to cap exposure.

**Never put this key in the browser, in this repo, or in any client code.**
It belongs only as an environment variable on the serverless host.

---

## 2. Deploy to Vercel (easiest)

This is the path the project is scaffolded for. `api/chat.js` is a Vercel
serverless function out of the box.

1. Push the `wallybot/` folder to a private GitHub repo (e.g. `wallybot`).
2. In Vercel, **Add New → Project → Import** that repo.
3. Framework preset: **Other**. Root directory: the folder containing
   `package.json` (the `wallybot/` folder).
4. **Environment Variables → Add:**
   - `ANTHROPIC_API_KEY` = your key from step 1
   - (optional) `WALLYBOT_MODEL` = `claude-sonnet-4-6` to use the cheaper /
     faster model
5. Deploy.

Vercel gives you an HTTPS URL like `https://wallybot.vercel.app`. Open it on
any device. Allow microphone access when the browser asks. Hold the button,
say something, release, listen to the reply.

To use a custom domain (e.g. `wallybot.mywallybot.com`), add it under
**Settings → Domains** and follow the DNS instructions.

### Cost note

- `claude-opus-4-7` (default) — highest quality, $5 / $25 per 1M tokens.
- `claude-sonnet-4-6` — about ⅗ the cost, very close in quality for
  conversational use. Set `WALLYBOT_MODEL=claude-sonnet-4-6` to switch.

A typical short conversation (10 turns, 1–3 sentences each) is well under
$0.05 with Opus and well under $0.02 with Sonnet. Prompt caching on the
system message means repeat turns are even cheaper than the headline rate.

---

## 3. Deploy to Cloudflare Pages

Cloudflare Pages serves the static files; **Pages Functions** runs the API.

The `api/chat.js` in this repo is written for Vercel's Node handler. For
Cloudflare you have two options:

**Option A — easiest, no rewrite:** put a one‑line adapter in
`functions/api/chat.js` that imports the same code. Cloudflare Pages
Functions uses the Web `Request`/`Response` API, while `api/chat.js` uses
Node's `req`/`res`. If you want one codebase, keep the Vercel version as is
and adapt for Cloudflare with a short fetch handler — open an issue if you
want me to add the adapter file.

**Option B — Vercel only for now.** Cleaner. Ship to Vercel, point your DNS
there. You can migrate later.

If you go with Cloudflare anyway, register the environment variable under
**Workers & Pages → your project → Settings → Environment variables**.

---

## 4. Cast or open on a TV

- **Phone → TV (easiest):** open the page on your phone in Chrome or Safari,
  then use Chromecast / AirPlay / "Cast tab" to mirror it onto the TV. Mic
  stays on your phone; audio plays through the TV.
- **Smart‑TV browser:** if your TV has a browser (LG webOS, Samsung Tizen,
  Fire TV, etc.), open the URL directly. Voice input depends on the TV
  browser supporting the Web Speech API — most don't yet, so text input is
  the reliable path. Use a Bluetooth keyboard or the TV remote's voice
  search if it has one.
- **Android TV / Google TV:** install Chrome from the Play Store; voice
  works.
- **Apple TV:** there's no native browser. Use AirPlay from an iPhone or Mac
  Safari tab.

---

## 5. Local development (optional)

```bash
cd wallybot
npm install
cp .env.example .env.local      # then edit .env.local with your real key
npx vercel dev                  # serves at http://localhost:3000
```

Or use any static file server for the frontend and run `api/chat.js`
separately via your preferred Node runner — the function is plain ESM.

---

## 6. Privacy & data architecture (for your records)

This is what makes Wallybot COPPA‑safe by architecture:

- **No accounts, no auth.** No email, no phone, no birthdate field — there
  is nowhere to enter them.
- **No analytics.** No Google Analytics, no Plausible, no Mixpanel, no
  fingerprinting library, no third‑party scripts of any kind. The HTML
  loads only `styles.css` and `app.js`, both from the same origin.
- **No persistent storage.** The conversation lives in a JavaScript variable
  in the open tab. Closing the tab erases it. Nothing is written to
  `localStorage`, `sessionStorage`, `IndexedDB`, or cookies.
- **No server‑side logging of content.** The `api/chat.js` function does
  not write conversation text to logs or any storage. Your serverless host
  may keep request *counts* and *durations*; check your host's defaults if
  you want to disable even that.
- **API key never leaves the server.** The browser calls `/api/chat`; the
  server calls Anthropic.
- **Mic access is explicit and per‑session.** The browser asks before
  capturing audio. Speech recognition is done in the browser (or by the
  browser vendor's STT service, depending on the browser — that part is
  outside Wallybot's control).

The above is a statement of how the system is built. If you publish a
privacy policy, this is the substance you can build it from.

---

## 7. Troubleshooting

- **"Couldn't reach the server."** Check that `ANTHROPIC_API_KEY` is set in
  the host's environment variables and that the deploy succeeded. Reload.
- **"Microphone permission is blocked."** Click the lock icon in the
  browser's address bar and allow microphone for the site.
- **No voice input on Safari iOS.** Make sure you're on a recent iOS version
  and that the page is served over HTTPS (mic requires it).
- **Reply is too short / too long.** Edit `MAX_TOKENS` or the
  `SYSTEM_PROMPT` in `api/chat.js`. Redeploy.
- **Want to swap the voice.** Voice selection is browser‑native. To use a
  premium voice (ElevenLabs, etc.), replace the `speak()` function in
  `app.js` with a call to a `/api/tts` endpoint and proxy ElevenLabs from
  the server. Out of scope for v0.1.
