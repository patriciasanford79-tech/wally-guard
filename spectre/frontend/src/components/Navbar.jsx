import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/export', label: 'Export Guide' },
  { to: '/manifesto', label: 'Manifesto' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-ink-950/70 border-b border-ink-700/60">
      <div className="container-tight flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo />
          <span className="font-display font-bold tracking-widest text-lg group-hover:text-spectre-accent transition">
            SPECTRE
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition hover:text-spectre-accent ${
                  isActive ? 'text-spectre-accent' : 'text-zinc-300'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#0B0D12" />
      <path
        d="M16 22h32M16 32h32M16 42h22"
        stroke="#7CFFB2"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="48" cy="42" r="4" fill="#7CFFB2" />
    </svg>
  );
}
