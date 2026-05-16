// Wallybot — front-end logic
// COPPA-safe by architecture: no analytics, no persistent storage,
// no third-party scripts, no PII collection. State lives in this closure only.

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const transcriptEl = $("transcript");
  const talkBtn = $("talkBtn");
  const textForm = $("textForm");
  const textInput = $("textInput");
  const sendBtn = $("sendBtn");
  const newChatBtn = $("newChatBtn");
  const statusEl = $("status");

  // In-memory conversation. Each entry: {role: "user"|"assistant", content: string}.
  // Wiped on tab close. Never written to disk.
  let history = [];
  let isSending = false;

  // ---------- Status helpers ----------

  function setStatus(msg, isError = false) {
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("status--error", !!isError);
  }

  // ---------- Transcript ----------

  function addBubble(role, text, opts = {}) {
    const el = document.createElement("div");
    el.className = `bubble bubble--${role}`;
    if (opts.pending) el.classList.add("is-pending");
    el.textContent = text;
    transcriptEl.appendChild(el);
    transcriptEl.scrollTop = transcriptEl.scrollHeight;
    return el;
  }

  function clearTranscript() {
    history = [];
    transcriptEl.innerHTML = "";
    addBubble(
      "system",
      "Hi — I'm Wallybot. Hold the button to talk, or type below. I won't store anything when you close this page."
    );
  }

  // ---------- Speech synthesis (TTS) ----------

  const synth = window.speechSynthesis;
  let preferredVoice = null;

  function pickVoice() {
    if (!synth) return null;
    const voices = synth.getVoices();
    if (!voices.length) return null;
    // Prefer a calm English voice. Order: a recognized "Samantha"/"Karen"-style,
    // then any English voice, then the first available.
    const preferred = voices.find((v) =>
      /samantha|karen|moira|fiona|google us english/i.test(v.name)
    );
    return (
      preferred ||
      voices.find((v) => /^en/i.test(v.lang)) ||
      voices[0]
    );
  }

  if (synth) {
    preferredVoice = pickVoice();
    synth.addEventListener?.("voiceschanged", () => {
      preferredVoice = pickVoice();
    });
  }

  function speak(text) {
    if (!synth || !text) return;
    try {
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      if (preferredVoice) utter.voice = preferredVoice;
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.volume = 1.0;
      synth.speak(utter);
    } catch {
      // Speech is best-effort — fall through silently.
    }
  }

  // ---------- Speech recognition (STT) ----------

  const SR =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;
  let recognizer = null;
  let isListening = false;

  function buildRecognizer() {
    if (!SR) return null;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = navigator.language || "en-US";
    r.maxAlternatives = 1;
    return r;
  }

  function startListening() {
    if (!SR) {
      setStatus(
        "Voice input isn't supported in this browser — please type.",
        true
      );
      return;
    }
    if (isListening || isSending) return;

    // Stop any current speech so the mic doesn't pick it up.
    synth?.cancel();

    recognizer = buildRecognizer();
    if (!recognizer) return;

    recognizer.onstart = () => {
      isListening = true;
      talkBtn.setAttribute("aria-pressed", "true");
      setStatus("Listening…");
    };

    recognizer.onerror = (e) => {
      isListening = false;
      talkBtn.setAttribute("aria-pressed", "false");
      const kind = e?.error || "unknown";
      if (kind === "no-speech") {
        setStatus("I didn't catch that — try again.");
      } else if (kind === "not-allowed" || kind === "service-not-allowed") {
        setStatus("Microphone permission is blocked. Allow it in your browser settings.", true);
      } else if (kind === "audio-capture") {
        setStatus("No microphone found.", true);
      } else {
        setStatus("Voice input error — please type instead.", true);
      }
    };

    recognizer.onend = () => {
      isListening = false;
      talkBtn.setAttribute("aria-pressed", "false");
      if (statusEl.textContent === "Listening…") setStatus("");
    };

    recognizer.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0]?.transcript || "")
        .join(" ")
        .trim();
      if (transcript) sendMessage(transcript);
    };

    try {
      recognizer.start();
    } catch {
      setStatus("Couldn't start voice input — try again.", true);
    }
  }

  function stopListening() {
    if (recognizer && isListening) {
      try {
        recognizer.stop();
      } catch {
        // ignore
      }
    }
  }

  // ---------- Sending to the model ----------

  async function sendMessage(text) {
    const trimmed = (text || "").trim();
    if (!trimmed || isSending) return;

    isSending = true;
    sendBtn.disabled = true;
    talkBtn.disabled = true;

    history.push({ role: "user", content: trimmed });
    addBubble("user", trimmed);
    const pendingBubble = addBubble("bot", "", { pending: true });
    setStatus("Thinking…");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Send only the last 20 turns to keep payloads small.
        body: JSON.stringify({ messages: history.slice(-20) }),
      });

      if (!res.ok) {
        const errText = await safeReadText(res);
        throw new Error(
          `Server responded ${res.status}${errText ? `: ${errText}` : ""}`
        );
      }

      const data = await res.json();
      const reply = (data?.reply || "").trim();
      if (!reply) throw new Error("Empty reply from server.");

      history.push({ role: "assistant", content: reply });
      pendingBubble.classList.remove("is-pending");
      pendingBubble.textContent = reply;
      setStatus("");
      speak(reply);
    } catch (err) {
      pendingBubble.remove();
      const msg =
        err && err.message
          ? String(err.message)
          : "Couldn't reach the server.";
      addBubble("system", `Couldn't reply right now. ${msg}`);
      setStatus("Tap the button or type to try again.", true);
    } finally {
      isSending = false;
      sendBtn.disabled = false;
      talkBtn.disabled = false;
    }
  }

  async function safeReadText(res) {
    try {
      const t = await res.text();
      return t.slice(0, 200);
    } catch {
      return "";
    }
  }

  // ---------- Event wiring ----------

  // Hold-to-talk on pointer / touch / keyboard.
  let pointerHeld = false;

  talkBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    pointerHeld = true;
    startListening();
  });

  const releaseEvents = ["pointerup", "pointercancel", "pointerleave"];
  for (const ev of releaseEvents) {
    talkBtn.addEventListener(ev, () => {
      if (pointerHeld) {
        pointerHeld = false;
        stopListening();
      }
    });
  }

  // Keyboard: space/enter while focused acts like press-and-hold.
  talkBtn.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      startListening();
    }
  });
  talkBtn.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      stopListening();
    }
  });

  textForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = textInput.value;
    textInput.value = "";
    sendMessage(v);
  });

  newChatBtn.addEventListener("click", () => {
    synth?.cancel();
    stopListening();
    clearTranscript();
    setStatus("");
  });

  // ---------- Init ----------

  clearTranscript();
  if (!SR) {
    setStatus(
      "Voice input isn't supported in this browser — typing still works."
    );
  }
})();
