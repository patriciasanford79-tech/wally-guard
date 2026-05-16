import { Link } from 'react-router-dom';
import { PrivacyCallout } from '../components/PrivacyCallout.jsx';

const ROUTES = [
  {
    type: 'Plain text & code',
    formats: ['.txt', '.md', '.json', '.csv', '.html', '.py', '.js'],
    model: 'llama3.1:8b',
    why: 'Fast, accurate on prose and structured text. Tiny enough to run on a laptop CPU if you have to.',
    accent: '#7CFFB2',
  },
  {
    type: 'Long-context documents',
    formats: ['.pdf', '.epub', '.docx', '.rtf'],
    model: 'mistral-nemo:12b',
    why: '128k context window. Eats whole books, court filings, manuals without truncating.',
    accent: '#FFD66B',
  },
  {
    type: 'Images & photos',
    formats: ['.jpg', '.jpeg', '.heic', '.png', '.webp'],
    model: 'llava:13b',
    why: 'Multimodal — actually looks at the picture instead of guessing from the filename.',
    accent: '#9AD0FF',
  },
  {
    type: 'Audio & voice memos',
    formats: ['.m4a', '.mp3', '.wav', '.flac'],
    model: 'whisper.cpp (large-v3)',
    why: 'On-device transcription. Output is then re-routed through the text model for summarising.',
    accent: '#FF9AD0',
  },
  {
    type: 'Video',
    formats: ['.mov', '.mp4', '.mkv'],
    model: 'ffmpeg → whisper.cpp + llava',
    why: 'Audio gets transcribed, sampled frames go through the vision model. Two passes, one summary.',
    accent: '#C49AFF',
  },
  {
    type: 'Structured personal data',
    formats: ['.vcf', '.ics', '.xml (Health)', 'sqlite (Messages)'],
    model: 'spectre-parser (deterministic)',
    why: 'Schema is fixed — no need for an LLM. Pure parsing, instant, zero hallucination risk.',
    accent: '#7CFFB2',
  },
];

export default function AiRouting() {
  return (
    <section className="container-tight pt-16 pb-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // ai routing
      </p>
      <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
        Which AI gets which file.
      </h1>
      <p className="mt-4 text-zinc-300 max-w-2xl">
        One model can't do everything well. SPECTRE looks at each file's
        type, picks the right local model for the job, and pipes the result
        through. This is what the routing table looks like.
      </p>

      <div className="mt-8">
        <PrivacyCallout />
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {ROUTES.map((r) => (
          <article
            key={r.type}
            className="rounded-xl border border-ink-700/80 bg-ink-900/40 p-6 hover:border-spectre-accent/60 transition"
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-1 inline-block h-2 w-2 rounded-full"
                style={{ background: r.accent, boxShadow: `0 0 12px ${r.accent}` }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-50">{r.type}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.formats.map((f) => (
                    <span
                      key={f}
                      className="font-mono text-[11px] px-2 py-0.5 rounded-md border border-ink-700 bg-ink-800/60 text-zinc-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <p className="mt-4 font-mono text-xs uppercase tracking-widest text-spectre-mute">
                  Routes to
                </p>
                <p className="font-mono text-spectre-accent">{r.model}</p>
                <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                  {r.why}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
          // pipeline
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">
          How a file moves through SPECTRE.
        </h2>

        <ol className="mt-6 space-y-3">
          <PipelineStep
            n={1}
            title="Ingest"
            body="File lands in SPECTRE — drag-drop, USB pull, or Miss Kimi import."
          />
          <PipelineStep
            n={2}
            title="Sniff"
            body="MIME + magic-byte check. Filename extension is never trusted on its own."
          />
          <PipelineStep
            n={3}
            title="Route"
            body="Routing table above picks the model. Deterministic parser is preferred when the schema is fixed."
          />
          <PipelineStep
            n={4}
            title="Run locally"
            body="Request goes to localhost:11434 (Ollama) or the on-device parser. Never leaves loopback."
          />
          <PipelineStep
            n={5}
            title="Store"
            body="Results saved alongside the original file, in your data directory. You own both."
          />
        </ol>
      </div>

      <div className="mt-16 rounded-xl border border-ink-700/80 bg-ink-900/40 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-spectre-accent">
          Want the models on disk?
        </p>
        <h3 className="mt-2 text-xl font-semibold">
          Pair this with the local AI guide.
        </h3>
        <p className="mt-2 text-zinc-300 text-sm leading-relaxed">
          The routing only works if the models are actually installed. The{' '}
          <Link to="/local-ai" className="text-spectre-accent underline">
            local AI guide
          </Link>{' '}
          walks you through Ollama setup and which models to pull first.
        </p>
      </div>
    </section>
  );
}

function PipelineStep({ n, title, body }) {
  return (
    <li className="flex gap-4 rounded-lg border border-ink-700/80 bg-ink-900/40 p-4">
      <span className="shrink-0 mt-0.5 h-7 w-7 rounded-md bg-spectre-accent/10 border border-spectre-accent/40 text-spectre-accent font-mono text-sm grid place-items-center">
        {String(n).padStart(2, '0')}
      </span>
      <div>
        <h4 className="font-semibold text-zinc-50">{title}</h4>
        <p className="text-zinc-300 text-sm mt-0.5">{body}</p>
      </div>
    </li>
  );
}
