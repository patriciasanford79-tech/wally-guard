// Single source of truth for file → AI routing.
// Frontend uses this via /api/routing/preview to show the destination
// before upload. Backend uses this when POST /api/import lands.

export const ROUTES = [
  {
    id: 'images',
    label: 'Images & photos',
    extensions: ['.jpg', '.jpeg', '.heic', '.heif', '.png', '.webp', '.gif'],
    mimePrefixes: ['image/'],
    cloud: { provider: 'gemini', model: 'gemini-1.5-pro', why: 'Native multimodal vision, strong on photos and screenshots.' },
    local: { provider: 'ollama', model: 'llava:13b', why: 'Runs locally with vision support.' },
  },
  {
    id: 'documents',
    label: 'Long documents',
    extensions: ['.pdf', '.epub', '.docx', '.rtf'],
    mimePrefixes: ['application/pdf', 'application/epub', 'application/vnd.openxmlformats-officedocument', 'application/rtf'],
    cloud: { provider: 'claude', model: 'claude-sonnet-4-6', why: '200k context window — eats whole books and court filings without chunking.' },
    local: { provider: 'ollama', model: 'mistral-nemo:12b', why: '128k context window, runs on a laptop with 16 GB RAM.' },
  },
  {
    id: 'audio',
    label: 'Audio & voice memos',
    extensions: ['.m4a', '.mp3', '.wav', '.flac', '.aac', '.ogg'],
    mimePrefixes: ['audio/'],
    cloud: { provider: 'chatgpt', model: 'whisper-1 + gpt-4o', why: 'Whisper transcribes, GPT-4o summarises. Best-in-class for English.' },
    local: { provider: 'whisper.cpp', model: 'large-v3', why: 'On-device transcription, no audio leaves the machine.' },
  },
  {
    id: 'video',
    label: 'Video',
    extensions: ['.mov', '.mp4', '.mkv', '.m4v', '.webm'],
    mimePrefixes: ['video/'],
    cloud: { provider: 'gemini', model: 'gemini-1.5-pro', why: 'Direct video ingest — audio + visual frames in one pass.' },
    local: { provider: 'ffmpeg + ollama', model: 'whisper.cpp + llava', why: 'Audio transcribed, frames sampled and described locally.' },
  },
  {
    id: 'text',
    label: 'Plain text & notes',
    extensions: ['.txt', '.md', '.markdown'],
    mimePrefixes: ['text/plain', 'text/markdown'],
    cloud: { provider: 'chatgpt', model: 'gpt-4o', why: 'Fast, cheap, accurate on prose. Default text destination.' },
    local: { provider: 'ollama', model: 'llama3.1:8b', why: 'Runs on a laptop, no API key.' },
  },
  {
    id: 'code',
    label: 'Code & structured text',
    extensions: ['.json', '.csv', '.html', '.xml', '.py', '.js', '.ts', '.jsx', '.tsx', '.go', '.rs', '.swift', '.java', '.c', '.cpp', '.h'],
    mimePrefixes: ['application/json', 'text/csv', 'text/html', 'text/xml', 'application/xml'],
    cloud: { provider: 'claude', model: 'claude-sonnet-4-6', why: 'Strongest code reasoning, especially on long files.' },
    local: { provider: 'ollama', model: 'llama3.1:8b', why: 'Decent code performance, no leaks.' },
  },
  {
    id: 'contacts-calendars',
    label: 'Contacts & calendars',
    extensions: ['.vcf', '.ics'],
    mimePrefixes: ['text/vcard', 'text/calendar'],
    cloud: { provider: 'local-parser', model: 'spectre-parser', why: 'Fixed schema — no LLM needed, zero hallucination risk.' },
    local: { provider: 'local-parser', model: 'spectre-parser', why: 'Same parser as cloud route — deterministic by design.' },
  },
];

const PROVIDER_META = {
  gemini:   { name: 'Gemini',        color: '#9AD0FF', tagline: "Google's multimodal model" },
  claude:   { name: 'Claude',        color: '#FFD66B', tagline: 'Anthropic, 200k context' },
  chatgpt:  { name: 'ChatGPT',       color: '#10A37F', tagline: 'OpenAI GPT-4o' },
  ollama:   { name: 'Ollama (local)', color: '#7CFFB2', tagline: 'On-device, open source' },
  'whisper.cpp': { name: 'whisper.cpp', color: '#7CFFB2', tagline: 'On-device transcription' },
  'ffmpeg + ollama': { name: 'ffmpeg + Ollama', color: '#7CFFB2', tagline: 'On-device video pipeline' },
  'local-parser': { name: 'SPECTRE parser', color: '#7CFFB2', tagline: 'Deterministic, no LLM' },
};

const FALLBACK = {
  id: 'unknown',
  label: 'Unknown / other',
  cloud:  { provider: 'chatgpt', model: 'gpt-4o',         why: 'Generalist fallback when type cannot be detected.' },
  local:  { provider: 'ollama',  model: 'llama3.1:8b',    why: 'Generalist fallback for unknown types.' },
};

function getExt(filename = '') {
  const m = String(filename).toLowerCase().match(/\.[a-z0-9]+$/);
  return m ? m[0] : '';
}

export function routeFor({ filename = '', mime = '' } = {}) {
  const ext = getExt(filename);
  const lowMime = (mime || '').toLowerCase();
  const match = ROUTES.find(
    (r) =>
      (ext && r.extensions.includes(ext)) ||
      (lowMime && r.mimePrefixes.some((p) => lowMime.startsWith(p)))
  );
  const route = match || FALLBACK;
  return {
    id: route.id,
    label: route.label,
    extension: ext || null,
    mime: lowMime || null,
    cloud: { ...route.cloud, providerMeta: PROVIDER_META[route.cloud.provider] || null },
    local: { ...route.local, providerMeta: PROVIDER_META[route.local.provider] || null },
  };
}

export function listRoutes() {
  return ROUTES.map((r) => ({
    id: r.id,
    label: r.label,
    extensions: r.extensions,
    cloud: { ...r.cloud, providerMeta: PROVIDER_META[r.cloud.provider] || null },
    local: { ...r.local, providerMeta: PROVIDER_META[r.local.provider] || null },
  }));
}
