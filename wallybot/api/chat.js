// Wallybot — chat API (Vercel Serverless Function, Node runtime)
//
// Receives: { messages: [{role: "user"|"assistant", content: string}, ...] }
// Returns:  { reply: string }
//
// COPPA-safe by architecture: this function does not persist or log
// conversation content. It forwards messages to the Anthropic API and
// returns the reply. The only side effect is the upstream API call.

import Anthropic from "@anthropic-ai/sdk";

// System prompt is the long stable prefix; placed before any varying content
// so prompt caching can reuse it across turns (~90% cheaper on cached reads).
// Keep this immutable — interpolating dates or session IDs here would
// invalidate the cache every request.
const SYSTEM_PROMPT = `You are Wallybot, a calm, warm voice companion. You speak with the person — you do not surveil them.

Your job is to be present, reassuring, and useful when asked. Keep replies short enough to be read aloud comfortably — usually 1–3 short sentences. Use plain, friendly language, like a kind neighbor on the porch. No clinical jargon, no lectures.

You never ask the person for personal details. You never ask their name, address, age, phone number, email, or any other identifying information. If they offer it, do not store it or repeat it back later — just continue the conversation.

When the person wants to talk, listen. When they ask for help thinking something through, help them think it through one step at a time. When they want a moment of company, be a moment of company.

Safety: if the person tells you they may hurt themselves, that they are in immediate danger, or that someone is hurting them, respond gently and steer them toward help. In the United States, you can suggest calling or texting 988 (Suicide and Crisis Lifeline) or calling 911 for an emergency. Do not press, do not interrogate — just point the way and stay with them.

You do not pretend to be a person. If asked, you can say you are Wallybot, a voice companion. You do not pretend to remember past conversations — each session starts fresh.`;

const MODEL = process.env.WALLYBOT_MODEL || "claude-opus-4-7";
const MAX_TOKENS = 1024;
const MAX_TURNS = 20;
const MAX_MESSAGE_CHARS = 4000;

function jsonResponse(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}

function sanitizeMessages(input) {
  if (!Array.isArray(input)) return [];
  const cleaned = [];
  for (const m of input) {
    if (!m || typeof m !== "object") continue;
    const role = m.role === "assistant" ? "assistant" : "user";
    const content = typeof m.content === "string" ? m.content : "";
    const trimmed = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!trimmed) continue;
    cleaned.push({ role, content: trimmed });
  }
  // Ensure conversation starts with a user turn.
  while (cleaned.length && cleaned[0].role !== "user") cleaned.shift();
  return cleaned.slice(-MAX_TURNS);
}

async function readJsonBody(req) {
  // On Vercel's Node runtime, req.body may already be parsed.
  if (req.body && typeof req.body === "object") return req.body;
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 200_000) {
        reject(new Error("payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("invalid json"));
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return jsonResponse(res, 405, { error: "method_not_allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse(res, 500, {
      error: "server_not_configured",
      detail: "ANTHROPIC_API_KEY is not set.",
    });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (e) {
    return jsonResponse(res, 400, { error: "bad_request", detail: e.message });
  }

  const messages = sanitizeMessages(body?.messages);
  if (messages.length === 0) {
    return jsonResponse(res, 400, { error: "no_messages" });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // Cache the system prompt — it's the largest stable prefix.
      // Tools render before system; system before messages. Marker on the
      // last system block caches everything before the user turn.
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    const reply = (response.content || [])
      .filter((b) => b && b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!reply) {
      return jsonResponse(res, 502, { error: "empty_reply" });
    }

    return jsonResponse(res, 200, { reply });
  } catch (err) {
    // Don't echo the upstream body verbatim — it may contain prompt details.
    // Map known error classes to status; everything else is 502.
    const status =
      err instanceof Anthropic.RateLimitError
        ? 429
        : err instanceof Anthropic.AuthenticationError
          ? 500
          : err instanceof Anthropic.BadRequestError
            ? 400
            : err instanceof Anthropic.APIError
              ? 502
              : 502;
    return jsonResponse(res, status, {
      error: "upstream_error",
      detail: err?.message ? String(err.message).slice(0, 200) : "unknown",
    });
  }
}
