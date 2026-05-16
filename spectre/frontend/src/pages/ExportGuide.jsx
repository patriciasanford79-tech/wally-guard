import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ExportGuide() {
  const { platformId } = useParams();
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/platforms')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setPlatforms(data.platforms || []);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!platformId) {
      setActive(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/platforms/${platformId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Platform "${platformId}" not found.`);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setActive(data);
        setError(null);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [platformId]);

  return (
    <section className="container-tight pt-16 pb-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // step-by-step
      </p>
      <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
        Export your data.
      </h1>
      <p className="mt-4 text-zinc-300 max-w-2xl">
        Pick a platform. Follow the steps. Walk away with a copy of everything
        they have on you. The export goes to your device — SPECTRE never sees it.
      </p>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/export/${p.id}`)}
            className={`text-left rounded-lg border px-4 py-3 transition ${
              p.id === platformId
                ? 'border-spectre-accent bg-spectre-accent/5'
                : 'border-ink-700/80 bg-ink-900/60 hover:border-spectre-accent'
            }`}
          >
            <div
              className="font-semibold"
              style={{ color: p.id === platformId ? '#7CFFB2' : '#fafafa' }}
            >
              {p.name}
            </div>
            <div className="text-xs text-spectre-mute mt-1">{p.tagline}</div>
          </button>
        ))}
      </div>

      <div className="mt-12">
        {error && (
          <div className="rounded-lg border border-spectre-warn/60 bg-spectre-warn/10 text-spectre-warn px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!platformId && !error && (
          <div className="rounded-lg border border-ink-700/80 bg-ink-900/40 p-8 text-center text-spectre-mute">
            Pick a platform above to see the export instructions.
          </div>
        )}

        {platformId && loading && (
          <div className="rounded-lg border border-ink-700/80 bg-ink-900/40 p-8 text-center text-spectre-mute">
            Loading…
          </div>
        )}

        {platformId && !loading && active && <PlatformDetail platform={active} />}
      </div>

      <div className="mt-16 rounded-xl border border-ink-700/80 bg-ink-900/40 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-spectre-accent">
          What next?
        </p>
        <h3 className="mt-2 text-xl font-semibold">Now you actually own it.</h3>
        <p className="mt-2 text-zinc-300 text-sm leading-relaxed">
          Back it up. Encrypt it. Feed it to a local model like Llama or Mistral.
          Or just sit with the fact that this much of your life was sitting on
          someone else's server. Then{' '}
          <Link to="/manifesto" className="text-spectre-accent underline">
            read the manifesto
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function PlatformDetail({ platform }) {
  return (
    <article className="rounded-xl border border-ink-700/80 bg-ink-900/40 p-6 md:p-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: platform.color }}
          >
            {platform.name}
          </h2>
          <p className="mt-1 text-zinc-300">{platform.tagline}</p>
        </div>
        <a
          href={platform.url}
          target="_blank"
          rel="noreferrer noopener"
          className="btn-ghost text-sm"
        >
          Open {platform.name}
          <ExternalIcon />
        </a>
      </header>

      <dl className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
        <Meta label="Time" value={platform.timeEstimate} />
        <Meta label="Delivered as" value={platform.deliveredAs} />
      </dl>

      <ol className="mt-8 space-y-4">
        {platform.steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="shrink-0 mt-0.5 h-7 w-7 rounded-md bg-spectre-accent/10 border border-spectre-accent/40 text-spectre-accent font-mono text-sm grid place-items-center">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-zinc-100 leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>

      {platform.tips?.length > 0 && (
        <div className="mt-8 rounded-lg border border-ink-700/80 bg-ink-800/40 p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-spectre-accent mb-2">
            Pro tips
          </p>
          <ul className="space-y-2 text-sm text-zinc-300 list-disc list-inside">
            {platform.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function Meta({ label, value }) {
  return (
    <div className="rounded-md border border-ink-700/80 bg-ink-800/40 px-4 py-3">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-spectre-mute">
        {label}
      </dt>
      <dd className="mt-1 text-zinc-100">{value}</dd>
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M10 14L21 3M21 14v7H3V3h7" />
    </svg>
  );
}
