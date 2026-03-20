import { Link, createFileRoute } from '@tanstack/react-router'
import { stitchScreens } from '~/lib/stitch-screens'

export const Route = createFileRoute('/')({
  component: Home,
})

const primaryTracks = [
  {
    name: 'Agents With Receipts — ERC-8004',
    description:
      'Trusted agent identity, manifests, receipts, and verifiable treasury decision logs.',
  },
  {
    name: 'Private Agents, Trusted Actions — Venice',
    description:
      'Private reasoning over treasury policy, with public-safe outputs that do not leak sensitive constraints.',
  },
  {
    name: 'Agent Services on Base',
    description:
      'Aegis is framed as a callable treasury decision service, not just an internal dashboard.',
  },
]

function Home() {
  const featuredScreens = stitchScreens.filter((screen) =>
    ['landing-page', 'evaluation-dashboard', 'decision-result'].includes(screen.slug),
  )

  return (
    <div className="space-y-8 pb-12">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[32px] bg-zinc-900 px-6 py-8 shadow-2xl shadow-black/20 ring-1 ring-white/10">
          <div className="mb-6 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-teal-200">
            Private treasury policy reasoning
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Aegis helps crypto teams evaluate sensitive treasury actions without exposing confidential guardrails.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            The MVP accepts a treasury policy, current treasury state, and a proposed action request. It returns a bounded recommendation — ALLOW, WARN, or BLOCK — together with private rationale, a public-safe explanation, and a structured receipt.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/screens"
              className="rounded-full bg-teal-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-teal-300"
            >
              Review Stitch screens
            </Link>
            <a
              href="/stitch/html/landing-page.html"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Open raw landing export
            </a>
          </div>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-zinc-900 via-zinc-900 to-teal-950/60 px-6 py-8 ring-1 ring-white/10">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Build constraints</p>
          <ul className="mt-4 space-y-4 text-sm text-zinc-200">
            <li className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <span className="font-semibold text-white">Shipping window:</span> 2–3 days left, so the repo is optimized for speed and reviewability.
            </li>
            <li className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <span className="font-semibold text-white">Stack:</span> React, TanStack Start, Tailwind CSS, Bun.
            </li>
            <li className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <span className="font-semibold text-white">Frontend source:</span> Stitch exports are stored locally for rapid iteration.
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[28px] bg-zinc-900/80 p-6 ring-1 ring-white/10">
          <h2 className="text-2xl font-semibold text-white">Primary tracks</h2>
          <div className="mt-4 space-y-4">
            {primaryTracks.map((track) => (
              <article key={track.name} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <h3 className="text-base font-semibold text-white">{track.name}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{track.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-zinc-900/80 p-6 ring-1 ring-white/10">
          <h2 className="text-2xl font-semibold text-white">Core demo flow</h2>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
            <li>1. Configure treasury policy and current treasury state.</li>
            <li>2. Submit a proposed treasury request.</li>
            <li>3. Run private policy reasoning.</li>
            <li>4. Return ALLOW / WARN / BLOCK with confidence and triggered checks.</li>
            <li>5. Show a public-safe explanation and a structured receipt for review.</li>
          </ol>
          <p className="mt-6 text-sm text-zinc-400">
            The goal is not broad platform scope — it is one clear, trustworthy end-to-end workflow.
          </p>
        </div>
      </section>

      <section className="rounded-[28px] bg-zinc-900/80 p-6 ring-1 ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Featured Stitch references</h2>
            <p className="mt-2 text-sm text-zinc-400">
              These references were exported from Stitch and are wired into the repo as implementation accelerators.
            </p>
          </div>
          <Link to="/screens" className="text-sm font-semibold text-teal-300 hover:text-teal-200">
            View all screen references →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {featuredScreens.map((screen) => (
            <article key={screen.id} className="overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
              <img src={screen.screenshotPath} alt={screen.title} className="h-52 w-full object-cover object-top" />
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="text-base font-semibold text-white">{screen.title}</h3>
                  <p className="text-sm text-zinc-400">{screen.slug}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <a
                    href={screen.htmlPath}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/15 px-3 py-2 text-zinc-200 transition hover:bg-white/5"
                  >
                    Open raw HTML
                  </a>
                  <a
                    href={screen.screenshotPath}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-2 text-teal-200 transition hover:bg-teal-400/20"
                  >
                    Open screenshot
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
