import { Link } from 'react-router-dom';

const PLATFORMS = [
  { id: 'chatgpt', name: 'ChatGPT', color: '#10A37F' },
  { id: 'apple', name: 'Apple', color: '#E5E5E7' },
  { id: 'google', name: 'Google', color: '#4285F4' },
  { id: 'meta', name: 'Meta', color: '#0866FF' },
];

export default function PlatformLogos() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {PLATFORMS.map((p) => (
        <Link
          to={`/export/${p.id}`}
          key={p.id}
          className="group flex items-center gap-3 rounded-lg border border-ink-700/80 bg-ink-900/60 px-4 py-3 hover:border-spectre-accent transition"
        >
          <PlatformGlyph id={p.id} color={p.color} />
          <span className="font-display font-medium text-zinc-100 group-hover:text-spectre-accent transition">
            {p.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

function PlatformGlyph({ id, color }) {
  const common = { width: 24, height: 24, fill: 'none', stroke: color, strokeWidth: 2 };

  switch (id) {
    case 'chatgpt':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M7 12h10" />
        </svg>
      );
    case 'apple':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill={color}>
          <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.4-1.1-1.6-2.7-1.8-3.3-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.7 1.1 8.9.8 1.1 1.7 2.3 2.9 2.2 1.2-.1 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.3-2.6 1.3-2.6-.1 0-2.7-1-2.7-4.1zM14.2 5.7c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.6 1 .1 2-.5 2.6-1.2z"/>
        </svg>
      );
    case 'google':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 4a8 8 0 1 0 7.7 10H12v-4h8" />
        </svg>
      );
    case 'meta':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 16c2-8 6-9 8-5s4 9 9 5" />
        </svg>
      );
    default:
      return null;
  }
}
