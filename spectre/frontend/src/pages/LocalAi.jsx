import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PrivacyCallout } from '../components/PrivacyCallout.jsx';

const MODELS = [
  { name: 'llama3.1:8b', size: '4.7 GB', ram: '8 GB', role: 'General text + code' },
  { name: 'mistral-nemo:12b', size: '7.1 GB', ram: '16 GB', role: 'Long-context documents' },
  { name: 'llava:13b', size: '8.0 GB', ram: '16 GB', role: 'Images & screenshots' },
  { name: 'qwen2.5:3b', size: '1.9 GB', ram: '4 GB', role: 'Low-spec fallback' },
];

const INSTALL_CODE = `# macOS
brew install ollama

# Linux (one-liner)
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# download the installer from ollama.com/download`;

const RUN_CODE = `ollama serve              # starts the local API on :11434
ollama pull llama3.1:8b   # downloads the model
ollama pull mistral-nemo  # long-context
ollama pull llava         # vision`;

const SPECTRE_ENV = `# spectre/backend/.env
AI_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
DEFAULT_MODEL=llama3.1:8b`;

export default function LocalAi() {
  return (
    <section className="container-tight pt-16 pb-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // local ai
      </p>
      <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
        Run AI on your laptop.
      </h1>
      <p className="mt-4 text-zinc-300 max-w-2xl">
        Cloud LLM APIs are convenient. They are also a long, slow leak of
        your most personal text. SPECTRE prefers Ollama — open source, runs
        on your hardware, no API keys, no telemetry, no usage logging.
      </p>

      <div className="mt-8">
        <PrivacyCallout />
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-3">
        <Compare
          label="Cloud APIs"
          tone="warn"
          items={['Sends every prompt off your machine', 'Pay per token', 'Requires API keys & a billing account', 'Provider can log, train, breach', 'Breaks without internet']}
        />
        <Compare
          label="Ollama (local)"
          tone="ok"
          items={['Runs on your hardware', 'Free, unlimited tokens', 'No accounts, no keys', 'Nothing to log — there\'s no server', 'Works offline']}
        />
        <Compare
          label="Trade-offs"
          tone="mute"
          items={['Slower on small machines', 'Needs disk space for models', 'Less knowledgeable than frontier models', 'You\'re the sysadmin now']}
        />
      </div>

      <Section title="01. Install Ollama">
        <p className="text-zinc-300">
          One install. Same binary on every platform. It runs a tiny local
          server on{' '}
          <span className="font-mono text-spectre-accent">localhost:11434</span>{' '}
          and never opens an outbound connection on its own.
        </p>
        <CodeBlock code={INSTALL_CODE} />
      </Section>

      <Section title="02. Pull the models SPECTRE uses">
        <p className="text-zinc-300">
          You don't need all of them. Start with{' '}
          <code className="font-mono text-spectre-accent">llama3.1:8b</code>{' '}
          — it handles most of the routing table.
        </p>
        <CodeBlock code={RUN_CODE} />

        <div className="mt-6 overflow-x-auto rounded-xl border border-ink-700/80 bg-ink-900/40">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/60 text-spectre-mute uppercase text-[10px] tracking-widest">
              <tr>
                <th className="text-left font-mono font-medium px-4 py-3">Model</th>
                <th className="text-left font-mono font-medium px-4 py-3">Disk</th>
                <th className="text-left font-mono font-medium px-4 py-3">RAM (min)</th>
                <th className="text-left font-mono font-medium px-4 py-3">Use</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m) => (
                <tr key={m.name} className="border-t border-ink-700/60">
                  <td className="px-4 py-3 font-mono text-spectre-accent">{m.name}</td>
                  <td className="px-4 py-3 text-zinc-200">{m.size}</td>
                  <td className="px-4 py-3 text-zinc-200">{m.ram}</td>
                  <td className="px-4 py-3 text-zinc-300">{m.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="03. Point SPECTRE at it">
        <p className="text-zinc-300">
          Drop these three lines into{' '}
          <code className="font-mono text-spectre-accent">backend/.env</code>{' '}
          and restart. That's the whole integration.
        </p>
        <CodeBlock code={SPECTRE_ENV} />
      </Section>

      <Section title="04. Verify it's working">
        <p className="text-zinc-300">
          Ping the local Ollama API directly. If you get JSON back, you're
          done.
        </p>
        <CodeBlock code={`curl http://localhost:11434/api/tags`} />
      </Section>

      <div className="mt-16 rounded-xl border border-ink-700/80 bg-ink-900/40 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-spectre-accent">
          Now what?
        </p>
        <h3 className="mt-2 text-xl font-semibold">
          See where each file goes.
        </h3>
        <p className="mt-2 text-zinc-300 text-sm leading-relaxed">
          The{' '}
          <Link to="/ai-routing" className="text-spectre-accent underline">
            AI routing page
          </Link>{' '}
          maps each file type to one of the models above, so you can decide
          which ones to actually pull.
        </p>
      </div>
    </section>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Compare({ label, tone, items }) {
  const toneClass =
    tone === 'ok'
      ? 'border-spectre-accent/60 bg-spectre-accent/5'
      : tone === 'warn'
      ? 'border-spectre-warn/40 bg-spectre-warn/5'
      : 'border-ink-700/80 bg-ink-900/40';
  return (
    <div className={`rounded-xl border p-5 ${toneClass}`}>
      <p className="font-mono text-xs uppercase tracking-widest text-zinc-300">
        {label}
      </p>
      <ul className="mt-3 space-y-2 text-sm text-zinc-200 list-disc list-inside">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <div className="relative rounded-lg border border-ink-700/80 bg-ink-950/80">
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded border border-ink-600 text-zinc-300 hover:border-spectre-accent hover:text-spectre-accent transition"
      >
        {copied ? 'copied' : 'copy'}
      </button>
      <pre className="overflow-x-auto px-4 py-4 text-sm font-mono text-zinc-100 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
