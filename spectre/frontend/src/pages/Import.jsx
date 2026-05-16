import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PrivacyCallout } from '../components/PrivacyCallout.jsx';

const ACCEPT = '.jpg,.jpeg,.heic,.heif,.png,.webp,.gif,.pdf,.epub,.docx,.rtf,.m4a,.mp3,.wav,.flac,.aac,.ogg,.mov,.mp4,.mkv,.m4v,.webm,.txt,.md,.json,.csv,.html,.xml,.vcf,.ics,image/*,audio/*,video/*,application/pdf,text/*';

const MAX_BYTES = 50 * 1024 * 1024;
const MAX_FILES = 12;

export default function Import() {
  const [stage, setStage] = useState('pick');     // pick | uploading | done
  const [files, setFiles] = useState([]);          // [{file, preview}]
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(async (incoming) => {
    setError(null);
    const list = Array.from(incoming).slice(0, MAX_FILES);
    const oversize = list.find((f) => f.size > MAX_BYTES);
    if (oversize) {
      setError(`"${oversize.name}" is over the 50 MB per-file limit.`);
      return;
    }
    const payload = list.map((f) => ({
      filename: f.name,
      mime: f.type || '',
      size: f.size,
    }));
    try {
      const res = await fetch('/api/routing/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: payload }),
      });
      if (!res.ok) throw new Error(`Preview failed (${res.status})`);
      const data = await res.json();
      setFiles(
        list.map((file, i) => ({ file, preview: data.previews[i]?.route }))
      );
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeAt = (i) => setFiles((prev) => prev.filter((_, j) => j !== i));
  const clearAll = () => {
    setFiles([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const upload = async () => {
    if (files.length === 0) return;
    setStage('uploading');
    setError(null);
    const form = new FormData();
    for (const { file } of files) form.append('files', file);
    try {
      const res = await fetch('/api/import', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Upload failed (${res.status})`);
      setResult(data);
      setStage('done');
    } catch (e) {
      setError(e.message);
      setStage('pick');
    }
  };

  return (
    <section className="container-tight pt-16 pb-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // miss kimi · import
      </p>
      <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
        Import from your iPhone.
      </h1>
      <p className="mt-4 text-zinc-300 max-w-2xl">
        Drop the files you pulled off your phone. SPECTRE sniffs each one,
        shows you which AI it would route to, and waits for you to hit
        send. Nothing uploads on hover.
      </p>

      <div className="mt-8">
        <PrivacyCallout />
      </div>

      {stage === 'done' && result ? (
        <Results result={result} onReset={() => { clearAll(); setResult(null); setStage('pick'); }} />
      ) : (
        <>
          <DropZone
            dragOver={dragOver}
            disabled={stage === 'uploading'}
            onPickClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          />
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          {error && (
            <div className="mt-4 rounded-lg border border-spectre-warn/60 bg-spectre-warn/10 text-spectre-warn px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {files.length > 0 && (
            <>
              <div className="mt-8 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {files.length} file{files.length === 1 ? '' : 's'} ready ·{' '}
                  <span className="text-spectre-mute font-normal">
                    {fmtSize(files.reduce((s, x) => s + x.file.size, 0))}
                  </span>
                </h2>
                <button
                  onClick={clearAll}
                  disabled={stage === 'uploading'}
                  className="text-sm text-spectre-mute hover:text-spectre-warn transition disabled:opacity-50"
                >
                  Clear all
                </button>
              </div>

              <ul className="mt-4 space-y-2">
                {files.map(({ file, preview }, i) => (
                  <FileRow
                    key={`${file.name}-${i}`}
                    file={file}
                    preview={preview}
                    onRemove={() => removeAt(i)}
                    disabled={stage === 'uploading'}
                  />
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-spectre-mute">
                  Click <span className="text-zinc-200 font-semibold">Send to SPECTRE</span> when you're ready.
                  Files only leave your browser at that point.
                </p>
                <button
                  onClick={upload}
                  disabled={stage === 'uploading' || files.length === 0}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {stage === 'uploading' ? 'Uploading…' : 'Send to SPECTRE'}
                  <Arrow />
                </button>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

function DropZone({ dragOver, disabled, onPickClick, onDragOver, onDragLeave, onDrop }) {
  return (
    <div
      onClick={disabled ? undefined : onPickClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !disabled && onPickClick()}
      className={`mt-10 cursor-pointer rounded-2xl border-2 border-dashed p-10 md:p-14 text-center transition
        ${dragOver
          ? 'border-spectre-accent bg-spectre-accent/5 shadow-glow'
          : 'border-ink-600 hover:border-spectre-accent/60 bg-ink-900/40'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <CloudIcon />
      <p className="mt-4 text-lg font-semibold text-zinc-100">
        Drop files here, or click to browse
      </p>
      <p className="mt-2 text-sm text-spectre-mute">
        Photos · voice memos · PDFs · notes · contacts · calendars
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-spectre-mute">
        Max {MAX_FILES} files · 50 MB each
      </p>
    </div>
  );
}

function FileRow({ file, preview, onRemove, disabled }) {
  const cloud = preview?.cloud;
  const cloudMeta = cloud?.providerMeta;
  return (
    <li className="flex items-center gap-3 rounded-xl border border-ink-700/80 bg-ink-900/40 px-4 py-3">
      <FileGlyph routeId={preview?.id} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-50">{file.name}</p>
        <p className="text-xs text-spectre-mute mt-0.5">
          {fmtSize(file.size)} · {file.type || 'unknown type'}
          {preview?.label ? <> · <span className="text-zinc-300">{preview.label}</span></> : null}
        </p>
      </div>
      <RoutePill provider={cloud?.provider} model={cloud?.model} meta={cloudMeta} />
      <button
        onClick={onRemove}
        disabled={disabled}
        className="text-spectre-mute hover:text-spectre-warn transition disabled:opacity-30"
        aria-label={`Remove ${file.name}`}
      >
        <XIcon />
      </button>
    </li>
  );
}

function RoutePill({ provider, model, meta }) {
  if (!provider) {
    return (
      <span className="font-mono text-[10px] px-2 py-1 rounded-md border border-ink-700 text-spectre-mute">
        routing…
      </span>
    );
  }
  const color = meta?.color || '#7CFFB2';
  const name = meta?.name || provider;
  return (
    <div className="flex flex-col items-end shrink-0">
      <span
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest px-2.5 py-1 rounded-md border"
        style={{ borderColor: color + '66', color, background: color + '10' }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        {name}
      </span>
      <span className="font-mono text-[10px] text-spectre-mute mt-1">{model}</span>
    </div>
  );
}

function Results({ result, onReset }) {
  const byProvider = result.items.reduce((acc, it) => {
    const p = it.route?.cloud?.providerMeta?.name || it.route?.cloud?.provider || 'Unknown';
    (acc[p] = acc[p] || []).push(it);
    return acc;
  }, {});

  return (
    <section className="mt-10">
      <div className="rounded-xl border border-spectre-accent/60 bg-spectre-accent/5 p-6 md:p-8 shadow-glow">
        <p className="font-mono text-xs uppercase tracking-widest text-spectre-accent">
          // import complete
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          {result.count} file{result.count === 1 ? '' : 's'} routed.
        </h2>
        <p className="mt-2 text-sm text-zinc-300">
          Import ID <code className="font-mono text-spectre-accent">{result.importId}</code> ·{' '}
          {new Date(result.at).toLocaleString()}
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {Object.entries(byProvider).map(([provider, items]) => (
          <article
            key={provider}
            className="rounded-xl border border-ink-700/80 bg-ink-900/40 p-5"
          >
            <header className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold text-zinc-50">{provider}</h3>
              <span className="text-xs text-spectre-mute">{items.length} file{items.length === 1 ? '' : 's'}</span>
            </header>
            <ul className="mt-3 space-y-2">
              {items.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-zinc-200">{it.name}</span>
                  <span className="font-mono text-[11px] text-spectre-mute shrink-0">
                    {it.route?.cloud?.model}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <button onClick={onReset} className="btn-primary">
          Import more
          <Arrow />
        </button>
        <Link to="/ai-routing" className="btn-ghost">
          See full routing table
        </Link>
      </div>
    </section>
  );
}

function fmtSize(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function CloudIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7CFFB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
      <path d="M16 16l-4-4-4 4" />
      <path d="M12 12v9" />
      <path d="M20.4 14.5A6 6 0 0017 4a7 7 0 00-13.5 2.5A5 5 0 003.5 16h13" />
    </svg>
  );
}

function FileGlyph({ routeId }) {
  const color = routeIdColor(routeId);
  return (
    <span
      className="shrink-0 h-9 w-9 rounded-md grid place-items-center font-mono text-[10px] uppercase tracking-widest"
      style={{ background: color + '14', color, border: `1px solid ${color}40` }}
    >
      {(routeId || 'file').slice(0, 3)}
    </span>
  );
}

function routeIdColor(id) {
  switch (id) {
    case 'images': return '#9AD0FF';
    case 'documents': return '#FFD66B';
    case 'audio': return '#FF9AD0';
    case 'video': return '#C49AFF';
    case 'text':
    case 'code':
      return '#7CFFB2';
    case 'contacts-calendars': return '#7CFFB2';
    default: return '#8A93A6';
  }
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
