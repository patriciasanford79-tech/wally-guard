export default function Manifesto() {
  return (
    <section className="container-tight pt-16 pb-24 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // manifesto
      </p>
      <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
        Your data. Your AI. Your rules.
      </h1>

      <div className="mt-8 space-y-6 text-zinc-200 leading-relaxed">
        <p>
          You typed it. You took the photo. You wrote the email. You asked
          the question. The fact that you did all of this on someone else's
          server doesn't make it theirs.
        </p>
        <p>
          The big platforms built a one-way mirror: they see all of you, and
          you see a glossy app. They train models on what you wrote. They
          rank your feed. They decide what you remember.
        </p>
        <p>
          SPECTRE doesn't argue with that. It just shows you the door. Every
          platform here has a legally-required export. We just made it
          impossible to miss.
        </p>
        <p>
          Get your data. Run a local model on it. Or don't. Burn the file
          to a USB stick and put it in a drawer. The point isn't what you
          do with it — the point is that <em>you can</em>.
        </p>
        <p className="font-mono text-spectre-accent">— SPECTRE</p>
      </div>
    </section>
  );
}
