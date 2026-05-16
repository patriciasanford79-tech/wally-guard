export function PrivacyCallout() {
  return (
    <aside
      role="note"
      aria-label="Privacy guarantee"
      className="rounded-xl border border-spectre-accent/60 bg-spectre-accent/5
                 p-5 md:p-6 shadow-glow"
    >
      <div className="flex items-start gap-4">
        <ShieldIcon />
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-spectre-accent">
            Privacy guarantee
          </p>
          <h3 className="mt-1 text-lg md:text-xl font-semibold text-zinc-50">
            None of your data leaves your network.
          </h3>
          <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
            SPECTRE runs on your machine. Exports land on your device. The
            optional local AI runs through Ollama on localhost. No SPECTRE
            server ever sees your files, your prompts, or your replies.
          </p>
        </div>
      </div>
    </aside>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7CFFB2"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d="M12 3l8 3v6c0 4.5-3.4 8.5-8 9-4.6-.5-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
