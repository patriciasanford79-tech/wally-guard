# Wallybot — Alert Not Surveil

**Patent Pending — U.S. Provisional Patent #63/985,295**
**Filed: February 18, 2026**
**Inventor: Patricia Darlene Sanford — MyWallyBot LLC, Manning, SC**

A calm voice companion. Hold to talk, listen to a reply. Works in any modern
browser on any device — phone, tablet, laptop, smart‑TV browser, or cast from
phone to TV.

---

## What it is

A static web app (one HTML file, one stylesheet, one script) plus one small
serverless function that proxies to the Anthropic API. The browser handles
microphone capture and speech playback natively. The serverless function holds
the API key — it never reaches the browser.

## What it is not

No accounts. No sign‑in. No email or phone. No analytics. No third‑party
trackers. No cookies beyond what the browser sets for the page itself. No
server‑side logging of conversation content. Conversation history lives in
browser memory only and is cleared when the tab closes.

This is **COPPA‑safe by architecture**, not by policy: there is nothing in the
system that could collect data from a minor because the system collects no data
from anyone.

## Legal notice — all rights reserved

This repository contains confidential invention materials protected by U.S.
Provisional Patent #63/985,295. No part of this repository (code, documents,
diagrams, notes, or ideas) may be copied, used, or shared without express
written permission from the inventor.

For licensing, partnership, or prototype collaboration inquiries:
**tricia@mywallybot.com**

See `LICENSE.md` for full terms.

## Run it

See `DEPLOY.md`. Short version: drop the folder on Cloudflare Pages or Vercel,
set the `ANTHROPIC_API_KEY` environment variable, deploy. Open the URL on any
device.
