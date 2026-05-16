export default function Footer() {
  return (
    <footer className="border-t border-ink-700/60 mt-24">
      <div className="container-tight py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-spectre-mute">
        <div>
          <p className="font-mono uppercase tracking-widest text-xs text-zinc-400">
            SPECTRE
          </p>
          <p className="mt-1 max-w-md">
            Your data. Your AI. Your rules. No tracking. No accounts.
            No funny business.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a className="hover:text-spectre-accent transition" href="/export">
            Export
          </a>
          <a className="hover:text-spectre-accent transition" href="/setup">
            Setup
          </a>
          <a className="hover:text-spectre-accent transition" href="/ai-routing">
            AI Routing
          </a>
          <a className="hover:text-spectre-accent transition" href="/local-ai">
            Local AI
          </a>
          <a className="hover:text-spectre-accent transition" href="/faq">
            FAQ
          </a>
          <a className="hover:text-spectre-accent transition" href="/manifesto">
            Manifesto
          </a>
          <span className="text-xs font-mono">v0.2.0</span>
        </div>
      </div>
    </footer>
  );
}
