import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container-tight pt-24 pb-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // 404
      </p>
      <h1 className="mt-3 font-display font-bold text-5xl tracking-tight">
        Nothing here.
      </h1>
      <p className="mt-4 text-zinc-300">
        Page not found. Maybe Big Tech got to it first.
      </p>
      <Link to="/" className="btn-ghost mt-8 inline-flex">
        Back home
      </Link>
    </section>
  );
}
