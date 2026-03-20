import { Link, createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '~/components/layout/page-intro'
import { Panel } from '~/components/ui/panel'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { StitchReferenceCard, getFeaturedStitchScreens } from '~/components/stitch/stitch-reference-card'
import { primaryTracks } from '~/content/aegis'
import { Icon } from '~/components/ui/icon'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const featuredScreens = getFeaturedStitchScreens()

  return (
    <div className="space-y-8 pb-12">
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel tone="glass" className="px-6 py-8 sm:px-8 sm:py-10">
          <PageIntro
            eyebrow="Synthesis Hackathon • Private cognition + trusted receipts"
            title="Aegis helps crypto teams evaluate sensitive treasury actions without exposing confidential guardrails."
            description="The MVP accepts treasury policy, current treasury state, and a proposed action request. It returns a bounded recommendation — ALLOW, WARN, or BLOCK — together with private rationale, a public-safe explanation, and a structured receipt."
            actions={
              <>
                <Link to="/evaluation-dashboard" className="inline-flex">
                  <Button leftIcon={<Icon name="dashboard" className="text-lg" />}>Open dashboard</Button>
                </Link>
                <Link to="/screens" className="inline-flex">
                  <Button variant="secondary">Review Stitch references</Button>
                </Link>
              </>
            }
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge tone="primary">Venice</Badge>
            <Badge tone="info">ERC-8004</Badge>
            <Badge tone="warning">Base Service</Badge>
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="eyebrow text-aegis-text-muted">Ship discipline</p>
          <div className="mt-5 space-y-4 text-sm leading-6 text-aegis-text-muted">
            <p>This repo is optimized for one convincing end-to-end demo, not platform sprawl.</p>
            <div className="detail-list">
              <div className="detail-row">
                <span>Time pressure</span>
                <span className="font-semibold text-aegis-text">2–3 days left</span>
              </div>
              <div className="detail-row">
                <span>Stack</span>
                <span className="font-semibold text-aegis-text">React + TanStack Start + Bun</span>
              </div>
              <div className="detail-row">
                <span>Design source</span>
                <span className="font-semibold text-aegis-text">Stitch exports + system tokens</span>
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="text-2xl font-bold tracking-tight text-aegis-text font-headline">Primary tracks</h2>
          <div className="mt-5 space-y-4">
            {primaryTracks.map((track) => (
              <article key={track.name} className="rounded-3xl bg-aegis-highest/70 p-5">
                <h3 className="text-lg font-semibold text-aegis-text">{track.name}</h3>
                <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{track.description}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="text-2xl font-bold tracking-tight text-aegis-text font-headline">Core demo flow</h2>
          <ol className="mt-5 space-y-4 text-sm leading-6 text-aegis-text-muted">
            <li>1. Configure treasury policy and current treasury state.</li>
            <li>2. Submit a proposed treasury request.</li>
            <li>3. Run private policy reasoning over the request.</li>
            <li>4. Return ALLOW / WARN / BLOCK with confidence and triggered checks.</li>
            <li>5. Show a public-safe explanation and a structured receipt for review.</li>
          </ol>
          <div className="mt-6 rounded-3xl bg-black/15 p-5 text-sm leading-6 text-aegis-text-muted">
            The product should feel like a callable treasury decision service, not a static analytics screen.
          </div>
        </Panel>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-aegis-text font-headline">Featured implementation references</h2>
            <p className="mt-2 text-sm text-aegis-text-muted">
              These Stitch exports are preserved locally and mirrored as real routes in the app.
            </p>
          </div>
          <Link to="/screens" className="text-sm font-semibold text-aegis-primary hover:text-aegis-primary-bright">
            View all screen routes →
          </Link>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          {featuredScreens.map((screen) => (
            <StitchReferenceCard key={screen.id} screen={screen} />
          ))}
        </div>
      </section>
    </div>
  )
}
