import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PrivacyCallout } from '../components/PrivacyCallout.jsx';

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

      <div className="mt-16">
        <PrivacyCallout />
      </div>

      <MethodComparison />
      <FileTypeReference />
      <Troubleshooting />

      <div className="mt-16 rounded-xl border border-ink-700/80 bg-ink-900/40 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-spectre-accent">
          What next?
        </p>
        <h3 className="mt-2 text-xl font-semibold">Now you actually own it.</h3>
        <p className="mt-2 text-zinc-300 text-sm leading-relaxed">
          Back it up. Encrypt it. Feed it to a{' '}
          <Link to="/local-ai" className="text-spectre-accent underline">
            local AI
          </Link>{' '}
          like Llama or Mistral. Or just sit with the fact that this much
          of your life was sitting on someone else's server. Then{' '}
          <Link to="/manifesto" className="text-spectre-accent underline">
            read the manifesto
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

const METHODS = [
  {
    name: 'iCloud',
    speed: 'Slow',
    privacy: 2,
    privacyLabel: 'Apple-trusted',
    pros: [
      'Works wirelessly from anywhere',
      'No cables, no drivers',
      'Includes encrypted backups when enabled',
    ],
    cons: [
      'Uploads everything through Apple servers first',
      'Counts against iCloud storage',
      'Slow re-download to your computer',
    ],
  },
  {
    name: 'USB',
    speed: 'Fastest',
    privacy: 5,
    privacyLabel: 'Air-gapped',
    pros: [
      'Direct device → computer transfer',
      'No cloud middleman, no telemetry',
      'Fastest path for large photo / video libraries',
    ],
    cons: [
      'Requires a cable and a trusted computer',
      '"Trust This Computer" prompt on first connect',
      'Windows needs iTunes / Apple Devices app',
    ],
  },
  {
    name: 'AirDrop',
    speed: 'Fast',
    privacy: 4,
    privacyLabel: 'Peer-to-peer',
    pros: [
      'Wireless, no cable required',
      'Encrypted peer-to-peer transfer',
      'Great for ad-hoc / partial exports',
    ],
    cons: [
      'Apple-to-Apple only',
      'Hits size and count limits on big batches',
      'Manual: not great for full-archive exports',
    ],
  },
  {
    name: 'Miss Kimi',
    speed: 'Automatic',
    privacy: 5,
    privacyLabel: 'On-device routing',
    pros: [
      'Imports straight into SPECTRE — no manual file shuffling',
      'Sorts files into the right local AI lane automatically',
      'Nothing leaves your machine at any step',
    ],
    cons: [
      'Requires SPECTRE installed (see Setup)',
      'Local-network only — no remote import',
      'Best paired with a USB or AirDrop first-hop',
    ],
  },
];

function MethodComparison() {
  return (
    <section className="mt-20">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // method comparison
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight">
        iCloud vs USB vs AirDrop vs Miss Kimi
      </h2>
      <p className="mt-3 text-zinc-300 max-w-2xl">
        Four ways to get a file off your iPhone. They are not equally
        private. Pick the row that matches your threat model.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-ink-700/80 bg-ink-900/40">
        <table className="w-full text-sm">
          <thead className="bg-ink-800/60 text-spectre-mute uppercase text-[10px] tracking-widest">
            <tr>
              <th className="text-left font-mono font-medium px-4 py-3">Method</th>
              <th className="text-left font-mono font-medium px-4 py-3">Speed</th>
              <th className="text-left font-mono font-medium px-4 py-3">Privacy</th>
              <th className="text-left font-mono font-medium px-4 py-3">Pros</th>
              <th className="text-left font-mono font-medium px-4 py-3">Cons</th>
            </tr>
          </thead>
          <tbody>
            {METHODS.map((m) => (
              <tr key={m.name} className="border-t border-ink-700/60 align-top">
                <td className="px-4 py-4 font-semibold text-zinc-50 whitespace-nowrap">
                  {m.name}
                </td>
                <td className="px-4 py-4 text-zinc-200 whitespace-nowrap">
                  {m.speed}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <PrivacyRating value={m.privacy} label={m.privacyLabel} />
                </td>
                <td className="px-4 py-4 text-zinc-200">
                  <ul className="space-y-1 list-disc list-inside marker:text-spectre-accent/70">
                    {m.pros.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-4 text-zinc-300">
                  <ul className="space-y-1 list-disc list-inside marker:text-spectre-warn/70">
                    {m.cons.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PrivacyRating({ value, label }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-0.5" aria-label={`Privacy ${value} of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-2 w-4 rounded-sm ${
              i <= value ? 'bg-spectre-accent' : 'bg-ink-700'
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] text-spectre-mute">{label}</span>
    </div>
  );
}

const FILE_TYPES = [
  { source: 'Photos & videos', format: '.HEIC / .JPG / .MOV / .MP4', notes: 'HEIC is Apple\'s default. Use iPhone → Settings → Camera → Formats → "Most Compatible" to force JPG/H.264 on export.' },
  { source: 'Live Photos', format: '.HEIC + .MOV pair', notes: 'Exports as two files. Keep them together or you lose the motion.' },
  { source: 'Contacts', format: '.vcf (vCard)', notes: 'Universal. Imports cleanly into anything from Outlook to a CSV converter.' },
  { source: 'Calendars', format: '.ics', notes: 'Standard iCalendar format. Re-importable to Google, Proton, anything.' },
  { source: 'Notes', format: 'PDF or .txt', notes: 'Apple Notes has no clean export — share each note as PDF, or use a Mac to drag from Notes.app.' },
  { source: 'Voice Memos', format: '.m4a', notes: 'AAC audio in an MP4 container. Plays everywhere.' },
  { source: 'Messages (iMessage / SMS)', format: 'SQLite + attachments', notes: 'Only via a full iPhone backup. Lives in `chat.db` inside the backup folder.' },
  { source: 'Health data', format: '.xml inside .zip', notes: 'Export from Health app → profile → "Export All Health Data". Massive but parseable.' },
  { source: 'Safari bookmarks', format: '.html', notes: 'Export via Finder/iCloud → Safari. Imports into any browser.' },
  { source: 'Full device backup', format: 'Encrypted backup folder', notes: 'Finder (macOS) or Apple Devices (Windows). Check "Encrypt local backup" or you lose passwords + Health.' },
];

function FileTypeReference() {
  return (
    <section className="mt-20">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // file type reference
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight">
        What your iPhone exports as what.
      </h2>
      <p className="mt-3 text-zinc-300 max-w-2xl">
        Knowing the format up front saves you a re-export. This is what
        each iPhone data type lands on disk as.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-ink-700/80 bg-ink-900/40">
        <table className="w-full text-sm">
          <thead className="bg-ink-800/60 text-spectre-mute uppercase text-[10px] tracking-widest">
            <tr>
              <th className="text-left font-mono font-medium px-4 py-3">Source</th>
              <th className="text-left font-mono font-medium px-4 py-3">Format</th>
              <th className="text-left font-mono font-medium px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {FILE_TYPES.map((row) => (
              <tr key={row.source} className="border-t border-ink-700/60 align-top">
                <td className="px-4 py-3 font-medium text-zinc-50">{row.source}</td>
                <td className="px-4 py-3 font-mono text-spectre-accent text-xs">
                  {row.format}
                </td>
                <td className="px-4 py-3 text-zinc-300">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const TROUBLESHOOTING = [
  {
    q: 'iPhone says "Trust This Computer" every time, or won\'t trust at all',
    a: [
      'Unlock the iPhone before plugging it in.',
      'Use an Apple-certified cable. Cheap cables drop the data pins and only carry power.',
      'On the Mac: Finder → select iPhone → click "Trust". On Windows: open Apple Devices (or iTunes) first.',
      'If the prompt never appears: Settings → General → Transfer or Reset iPhone → "Reset Location & Privacy". Reconnect.',
    ],
  },
  {
    q: 'USB connection not detected on Windows / Mac',
    a: [
      'Try a different USB-A or USB-C port. Avoid hubs and dongles for the first attempt.',
      'Windows: install or update "Apple Devices" from the Microsoft Store (it replaces iTunes on Win11).',
      'Mac: System Settings → General → Storage → make sure macOS isn\'t mid-update. Reboot if you just installed updates.',
      'Verify the cable carries data, not just power — try syncing the same cable with a different device.',
    ],
  },
  {
    q: 'Files missing or smaller than expected after export',
    a: [
      'Check Photos → Settings → "Download and Keep Originals". If "Optimize iPhone Storage" was on, originals are still in iCloud.',
      'Encrypted backups include passwords and Health data; unencrypted backups silently drop them.',
      'Live Photos show as a single thumbnail but export as two files (.HEIC + .MOV). Both must transfer.',
      'For Health / iMessage: the export is inside the backup, not loose on disk. Use a backup explorer (e.g. iMazing, libimobiledevice) to dig in.',
    ],
  },
  {
    q: 'Export is taking forever',
    a: [
      'Photos and videos dominate. Export them in a separate pass from everything else.',
      'iCloud Photo Library streams originals on demand — large libraries can take hours to fully download.',
      'For Google Takeout or Meta exports: split into multiple smaller exports by date range or product.',
    ],
  },
];

function Troubleshooting() {
  return (
    <section className="mt-20">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // troubleshooting
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight">
        When it doesn't just work.
      </h2>
      <p className="mt-3 text-zinc-300 max-w-2xl">
        The four problems we see most often, and the exact fixes.
      </p>

      <div className="mt-6 space-y-3">
        {TROUBLESHOOTING.map((item, i) => (
          <details
            key={item.q}
            className="group rounded-xl border border-ink-700/80 bg-ink-900/40 open:border-spectre-accent/60 transition"
            open={i === 0}
          >
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4">
              <span className="font-medium text-zinc-50">{item.q}</span>
              <span className="font-mono text-spectre-accent text-xl leading-none transition group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 border-t border-ink-700/60">
              <ul className="mt-4 space-y-2 text-sm text-zinc-300 list-disc list-inside marker:text-spectre-accent/70">
                {item.a.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </details>
        ))}
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
