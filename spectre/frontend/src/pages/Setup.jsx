import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PrivacyCallout } from '../components/PrivacyCallout.jsx';

const DOCKER_CMD = `docker run -d \\
  --name spectre \\
  -p 4000:4000 \\
  -v spectre-data:/data \\
  ghcr.io/spectre-app/spectre:latest`;

const MANUAL_STEPS = [
  {
    title: 'Install prerequisites',
    body: 'Node.js 18 or newer, and git. That\'s it.',
    code: `# macOS
brew install node git

# Ubuntu / Debian
sudo apt install -y nodejs npm git`,
  },
  {
    title: 'Clone the repo',
    body: 'SPECTRE is open source. Pull it from GitHub.',
    code: `git clone https://github.com/spectre-app/spectre.git
cd spectre`,
  },
  {
    title: 'Install backend',
    body: 'Express API for routing exports and talking to local AI.',
    code: `cd backend
npm install
cp .env.example .env   # optional — defaults work`,
  },
  {
    title: 'Install frontend',
    body: 'React + Vite UI.',
    code: `cd ../frontend
npm install
npm run build`,
  },
  {
    title: 'Run it',
    body: 'Production mode serves the built frontend from Express on port 4000.',
    code: `cd ../backend
NODE_ENV=production npm start
# open http://localhost:4000`,
  },
];

export default function Setup() {
  const [tab, setTab] = useState('docker');

  return (
    <section className="container-tight pt-16 pb-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spectre-accent">
        // setup
      </p>
      <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
        Install SPECTRE.
      </h1>
      <p className="mt-4 text-zinc-300 max-w-2xl">
        Two ways in. Docker is one command. Manual is five. Either runs
        entirely on your machine — no SPECTRE account, no cloud signup,
        no calling home.
      </p>

      <div className="mt-8">
        <PrivacyCallout />
      </div>

      <div className="mt-10 flex gap-2 border-b border-ink-700/80">
        <TabButton active={tab === 'docker'} onClick={() => setTab('docker')}>
          Docker (one command)
        </TabButton>
        <TabButton active={tab === 'manual'} onClick={() => setTab('manual')}>
          Manual install
        </TabButton>
      </div>

      <div className="mt-8">
        {tab === 'docker' ? <DockerTab /> : <ManualTab />}
      </div>

      <div className="mt-16 rounded-xl border border-ink-700/80 bg-ink-900/40 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-spectre-accent">
          What's next?
        </p>
        <h3 className="mt-2 text-xl font-semibold">Wire up a local AI.</h3>
        <p className="mt-2 text-zinc-300 text-sm leading-relaxed">
          With SPECTRE running, head to{' '}
          <Link to="/local-ai" className="text-spectre-accent underline">
            the local AI guide
          </Link>{' '}
          to point it at Ollama so exports get processed without ever
          touching the cloud.
        </p>
      </div>
    </section>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition ${
        active
          ? 'border-spectre-accent text-spectre-accent'
          : 'border-transparent text-zinc-400 hover:text-zinc-100'
      }`}
    >
      {children}
    </button>
  );
}

function DockerTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">One command. You're done.</h2>
        <p className="mt-2 text-zinc-300">
          Pulls the image, mounts a persistent volume, exposes the UI on{' '}
          <span className="font-mono text-spectre-accent">localhost:4000</span>.
        </p>
      </div>

      <CodeBlock code={DOCKER_CMD} />

      <div className="grid md:grid-cols-3 gap-3">
        <Fact label="Image size" value="~180 MB" />
        <Fact label="Persisted at" value="/data (named volume)" />
        <Fact label="Default port" value="4000" />
      </div>

      <div className="rounded-lg border border-ink-700/80 bg-ink-900/40 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-spectre-accent mb-2">
          Stop / restart
        </p>
        <CodeBlock
          inline
          code={`docker stop spectre
docker start spectre
docker rm -f spectre   # nuke it`}
        />
      </div>
    </div>
  );
}

function ManualTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Five steps. Five minutes.</h2>
        <p className="mt-2 text-zinc-300">
          Production mode is the default — Express serves the built React app
          on port 4000. No separate dev server in your way.
        </p>
      </div>

      <ol className="space-y-6">
        {MANUAL_STEPS.map((step, i) => (
          <li
            key={step.title}
            className="rounded-xl border border-ink-700/80 bg-ink-900/40 p-5"
          >
            <div className="flex items-start gap-4">
              <span className="shrink-0 mt-0.5 h-7 w-7 rounded-md bg-spectre-accent/10 border border-spectre-accent/40 text-spectre-accent font-mono text-sm grid place-items-center">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-zinc-50">
                  {step.title}
                </h3>
                <p className="mt-1 text-zinc-300 text-sm">{step.body}</p>
                <div className="mt-4">
                  <CodeBlock code={step.code} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="rounded-md border border-ink-700/80 bg-ink-800/40 px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-spectre-mute">
        {label}
      </p>
      <p className="mt-1 text-zinc-100">{value}</p>
    </div>
  );
}

function CodeBlock({ code, inline = false }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      },
      () => {}
    );
  };
  return (
    <div
      className={`relative rounded-lg border border-ink-700/80 bg-ink-950/80 ${
        inline ? '' : 'shadow-glow'
      }`}
    >
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded border border-ink-600 text-zinc-300 hover:border-spectre-accent hover:text-spectre-accent transition"
        aria-label="Copy to clipboard"
      >
        {copied ? 'copied' : 'copy'}
      </button>
      <pre className="overflow-x-auto px-4 py-4 text-sm font-mono text-zinc-100 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
