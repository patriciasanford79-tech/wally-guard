import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'Is my data safe?',
    short: 'Yes — because we never see it.',
    a: [
      'SPECTRE runs entirely on your machine. The frontend, the API, and the local AI all listen on localhost. No SPECTRE-controlled server exists.',
      'When you export from ChatGPT, Apple, Google, or Meta, the file lands on your device. SPECTRE only reads from your local data directory.',
      'Local AI routing goes through Ollama on localhost:11434 — by default Ollama refuses non-loopback connections.',
    ],
  },
  {
    q: 'Do I need API keys?',
    short: 'No. SPECTRE\'s default stack uses zero external APIs.',
    a: [
      'The recommended setup is Ollama + local models. No keys. No accounts. No billing.',
      'If you want to use a cloud model (OpenAI, Anthropic, etc.), you can — but it\'s opt-in and explicitly off by default, because that pipes your data back out to a third party.',
    ],
  },
  {
    q: 'Does it work without internet?',
    short: 'Yes — after the first install.',
    a: [
      'You need internet once: to install Ollama and pull your model(s).',
      'After that, you can pull the network cable and SPECTRE keeps working. The UI, the API, and inference are all local.',
      'The only thing internet is required for is exporting from the cloud platforms themselves (you have to actually reach ChatGPT, Apple, Google, Meta to request your data).',
    ],
  },
  {
    q: 'What does SPECTRE itself log?',
    short: 'HTTP method, path, and status code. No payloads.',
    a: [
      'The Express server uses Morgan in default access-log mode. It records request method, URL path, status, response size, and latency.',
      'Request and response bodies (your prompts, your files, your AI replies) are never written to logs.',
      'The log file lives on your machine. You can delete it, redirect it, or disable it entirely.',
    ],
  },
  {
    q: 'How do I update SPECTRE?',
    short: 'docker pull, or git pull. That\'s it.',
    a: [
      'Docker: `docker pull ghcr.io/spectre-app/spectre:latest && docker rm -f spectre` then re-run the original `docker run` command — your data volume persists.',
      'Manual: `git pull && cd backend && npm install && cd ../frontend && npm install && npm run build`, then restart.',
    ],
  },
  {
    q: 'Can I use my exported data with a cloud AI later if I change my mind?',
    short: 'Yes. The files are plain formats — they go anywhere.',
    a: [
      'Exports are JSON, mbox, CSV, XML, MP4, JPG, etc. There\'s no SPECTRE-proprietary format.',
      'If you decide to upload them to a cloud LLM later, that\'s your call. SPECTRE just hands you the files.',
    ],
  },
  {
    q: 'Will SPECTRE add a hosted version?',
    short: 'No. That\'s the opposite of the point.',
    a: [
      'A hosted SPECTRE would mean trusting us with your exports. The whole project exists to remove that kind of trust.',
      'If hosting is what you want, the platforms you\'re exporting from already do that — and the result is why you\'re here.',
    ],
  },
  {
    q: 'Is the code open source?',
    short: 'Yes. MIT licensed. Fork it, mirror it, audit it.',
    a: [
      'Frontend and backend are both in one repo. No closed binaries, no obfuscated payloads.',
      'You can read every line of code that touches your data. That\'s the only way "trust us" actually works.',
    ],
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    if (!hash) return;
    const i = FAQS.findIndex((f) => slug(f.q) === hash);
    if (i >= 0) setOpenIndex(i);
  }, []);

  const visible = FAQS.map((f, i) => ({ ...f, i })).filter(
    (f) =>
      !filter ||
      f.q.toLowerCase().includes(filter.toLowerCase()) ||
      f.a.join(' ').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="container-tight pt-16 pb-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // faq
      </p>
      <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
        Questions we actually get asked.
      </h1>
      <p className="mt-4 text-zinc-300 max-w-2xl">
        Short answers above. Full answers if you open them. If your
        question isn't here,{' '}
        <Link to="/manifesto" className="text-spectre-accent underline">
          the manifesto
        </Link>{' '}
        probably covers the spirit of it.
      </p>

      <div className="mt-8">
        <label className="block">
          <span className="sr-only">Filter</span>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter questions…"
            className="w-full md:w-96 rounded-lg border border-ink-700/80 bg-ink-900/60
                       px-4 py-2.5 text-sm text-zinc-100 placeholder:text-spectre-mute
                       focus:outline-none focus:border-spectre-accent focus:ring-1 focus:ring-spectre-accent"
          />
        </label>
      </div>

      <div className="mt-8 space-y-3">
        {visible.length === 0 && (
          <p className="text-spectre-mute text-sm">No matches.</p>
        )}
        {visible.map(({ q, short, a, i }) => {
          const open = i === openIndex;
          return (
            <article
              key={q}
              id={slug(q)}
              className={`rounded-xl border bg-ink-900/40 transition ${
                open ? 'border-spectre-accent/60' : 'border-ink-700/80'
              }`}
            >
              <button
                onClick={() => setOpenIndex(open ? -1 : i)}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
                aria-expanded={open}
              >
                <div>
                  <h2 className="font-semibold text-zinc-50">{q}</h2>
                  <p className="mt-1 text-sm text-spectre-mute">{short}</p>
                </div>
                <span
                  className={`font-mono text-spectre-accent text-xl leading-none transition shrink-0 ${
                    open ? 'rotate-45' : ''
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              {open && (
                <div className="px-5 pb-5 border-t border-ink-700/60">
                  <div className="mt-4 space-y-3 text-sm text-zinc-300 leading-relaxed">
                    {a.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
