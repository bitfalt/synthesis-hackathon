import { Link, createFileRoute } from '@tanstack/react-router'
import { StitchReferenceCard, getFeaturedStitchScreens } from '~/components/stitch/stitch-reference-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { primaryTracks } from '~/content/aegis'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const stats = [
  ['TVL reviewed', '$4.2B+'],
  ['Median eval latency', '0.0ms'],
  ['Receipt coverage', '100%'],
] as const

const featureCards = [
  {
    title: 'Private analysis',
    body: 'Sensitive policy logic and operator rationale stay inside the confidential lane.',
    icon: 'shield_lock',
  },
  {
    title: 'Public summaries',
    body: 'A bounded explanation can circulate without leaking treasury guardrails.',
    icon: 'description',
  },
  {
    title: 'Trust receipts',
    body: 'Receipts, manifests, and hosted artifacts keep the decision inspectable.',
    icon: 'history_edu',
  },
  {
    title: 'Base-native service',
    body: 'Callable treasury evaluation framed as an institutional service, not just a dashboard.',
    icon: 'hub',
  },
] as const

function LandingPage() {
  const featuredScreens = getFeaturedStitchScreens()

  return (
    <div className="min-h-screen bg-aegis-foundation text-aegis-text">
      <header className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-3 font-headline text-sm font-bold tracking-tight text-aegis-text">
          <Icon name="shield" className="text-aegis-primary" />
          <span>Aegis Treasury Guardrails</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-aegis-text-muted md:flex">
          <a href="#capabilities">Capabilities</a>
          <a href="#tracks">Track fit</a>
          <a href="#screens">Screens</a>
        </nav>
        <Link to="/evaluation-dashboard" className="inline-flex">
          <Button className="px-4 py-2 text-[0.65rem]">Launch Demo</Button>
        </Link>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-20 px-6 pb-16 pt-6 lg:px-8 lg:pt-10">
        <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-aegis-shell px-8 py-10 lg:px-12 lg:py-14">
            <div className="absolute -left-16 top-8 h-40 w-40 rounded-full bg-aegis-primary/10 blur-3xl" />
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="primary">Private cognition</Badge>
              <Badge tone="info">Receipts with provenance</Badge>
            </div>
            <h1 className="max-w-4xl font-headline text-5xl font-extrabold leading-[0.98] tracking-tight text-aegis-text lg:text-7xl">
              Private Treasury
              <br />
              <span className="text-aegis-primary">Policy Copilot</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-aegis-text-muted">
              Aegis evaluates proposed treasury movements against private institutional guardrails and returns a bounded recommendation with public-safe receipts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/evaluation-dashboard" className="inline-flex">
                <Button>Request access</Button>
              </Link>
              <Link to="/screens" className="inline-flex">
                <Button variant="secondary">Schedule a demo</Button>
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-4" id="capabilities">
              {featureCards.map((card) => (
                <div key={card.title} className="rounded-xl border border-white/8 bg-black/20 p-5">
                  <Icon name={card.icon} className="text-xl text-aegis-primary" />
                  <h2 className="mt-4 text-sm font-bold text-aegis-text">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{card.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/8 bg-aegis-shell p-8">
              <div className="grid h-56 place-items-center rounded-2xl border border-white/8 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_42%),linear-gradient(180deg,rgba(18,18,18,0.95),rgba(32,31,31,0.95))]">
                <div className="text-center">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-aegis-primary/25 bg-aegis-primary/10">
                    <Icon name="lock" className="text-4xl text-aegis-primary" />
                  </div>
                  <div className="text-sm font-semibold text-aegis-text">Bounded trust layer</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-aegis-text-muted">Receipts and policy isolation</div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-aegis-shell p-8" id="tracks">
              <h2 className="font-headline text-2xl font-bold text-aegis-text">Enterprise Guardrails</h2>
              <div className="mt-5 space-y-4">
                {primaryTracks.map((track) => (
                  <div key={track.name} className="rounded-xl border border-white/8 bg-black/20 p-4">
                    <div className="text-sm font-bold text-aegis-text">{track.name}</div>
                    <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{track.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {stats.map(([label, value], index) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-aegis-shell p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-aegis-text-muted/60">{label}</div>
              <div className={`mt-3 font-headline text-4xl font-bold tracking-tight ${index === 0 ? 'text-aegis-primary' : 'text-aegis-text'}`}>{value}</div>
              <div className="mt-2 text-[11px] text-aegis-text-muted">Demo-oriented trust signal</div>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] border border-white/8 bg-aegis-shell p-8 lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-headline text-3xl font-extrabold tracking-tight text-aegis-text">Secure Your Treasury&apos;s Future Today</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-aegis-text-muted">A bounded evaluation service for modern crypto treasuries that need privacy, trust, and rapid operator clarity.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/evaluation-dashboard" className="inline-flex">
                <Button>Request Access</Button>
              </Link>
              <Link to="/decision-result" className="inline-flex">
                <Button variant="secondary">View Decision Demo</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="screens" className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-headline text-2xl font-bold tracking-tight text-aegis-text">Featured implementation references</h2>
              <p className="mt-2 text-sm text-aegis-text-muted">The routed app screens below are the live equivalents of the preserved Stitch exports.</p>
            </div>
            <Link to="/screens" className="text-sm font-semibold text-aegis-primary hover:text-aegis-primary-bright">
              View all screen routes -&gt;
            </Link>
          </div>
          <div className="grid gap-5 xl:grid-cols-3">
            {featuredScreens.map((screen) => (
              <StitchReferenceCard key={screen.id} screen={screen} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/6 bg-aegis-shell/70">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-8 text-sm text-aegis-text-muted lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div>
            <div className="font-headline text-base font-bold text-aegis-text">Aegis Guardrails</div>
            <p className="mt-2 max-w-md leading-6">Hackathon-built treasury guardrails with private reasoning, public-safe receipts, and Base-native service framing.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <FooterGroup title="Product" items={['Dashboard', 'Decision Result', 'Evaluation History']} />
            <FooterGroup title="Resources" items={['Help Center', 'Screens', 'Settings']} />
            <FooterGroup title="Contact" items={['Enterprise Desk', 'Audit Lane', '0x Bitfalter']} />
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted/65">{title}</div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  )
}
