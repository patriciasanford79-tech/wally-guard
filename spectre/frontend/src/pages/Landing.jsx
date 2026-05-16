import { Link } from 'react-router-dom';
import PlatformLogos from '../components/PlatformLogos.jsx';

export default function Landing() {
  return (
    <>
      <section className="container-tight pt-24 md:pt-32 pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
          // your data. your ai. your rules.
        </p>
        <h1 className="mt-6 font-display font-bold leading-[1.05] tracking-tight
                       text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Big Tech locked your data.
          <br />
          <span className="text-spectre-accent">We're giving it back.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-300">
          SPECTRE is a free, open project that walks you through pulling every
          byte you own out of ChatGPT, Apple, Google, and Meta. No accounts.
          No tracking. No middleman. Just instructions, links, and the truth
          about what they have on you.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link to="/export" className="btn-primary text-lg">
            Export Your Data Free
            <Arrow />
          </Link>
          <Link to="/import" className="btn-ghost text-lg">
            Try the import demo
          </Link>
        </div>

        <div className="mt-16">
          <p className="font-mono text-xs uppercase tracking-widest text-spectre-mute mb-4">
            Supported platforms
          </p>
          <PlatformLogos />
        </div>
      </section>

      <section className="container-tight pb-24">
        <div className="grid md:grid-cols-3 gap-4">
          <Pillar
            kicker="01"
            title="Own it."
            body="Every export is yours, downloaded to your device. We never touch the file."
          />
          <Pillar
            kicker="02"
            title="Move it."
            body="Plain formats — JSON, mbox, CSV — that work with any AI you choose to run."
          />
          <Pillar
            kicker="03"
            title="Use it."
            body="Run a private model on your own data. Your laptop. Your rules. No telemetry."
          />
        </div>
      </section>
    </>
  );
}

function Pillar({ kicker, title, body }) {
  return (
    <div className="rounded-xl border border-ink-700/80 bg-ink-900/40 p-6 hover:border-spectre-accent/60 transition">
      <p className="font-mono text-xs text-spectre-accent">{kicker}</p>
      <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-zinc-300 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
