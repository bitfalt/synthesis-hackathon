import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Panel } from '~/components/ui/panel'
import { stitchScreens, type StitchScreen } from '~/lib/stitch-screens'

export function StitchReferenceCard({ screen }: { screen: StitchScreen }) {
  const tone =
    screen.status === 'Live MVP'
      ? 'primary'
      : screen.status === 'Supporting surface'
        ? 'info'
        : 'warning'

  return (
    <Panel className="overflow-hidden p-0">
      {screen.kind === 'design-system' ? (
        <div className="flex h-56 items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.15),transparent_40%),linear-gradient(180deg,#1c1b1b,#131313)] px-6 text-center">
          <div>
            <p className="eyebrow text-aegis-primary/70">Design system</p>
            <h3 className="mt-3 text-2xl font-bold text-aegis-text font-headline">{screen.title}</h3>
            {screen.notes ? <p className="mt-3 text-sm leading-6 text-aegis-text-muted">{screen.notes}</p> : null}
          </div>
        </div>
      ) : (
        <img src={screen.screenshotPath} alt={screen.title} className="h-64 w-full object-cover object-top" />
      )}
      <div className="space-y-4 p-5">
        <div>
          {screen.status ? <Badge tone={tone}>{screen.status}</Badge> : null}
          <h3 className="text-lg font-bold text-aegis-text font-headline">{screen.title}</h3>
          <p className="mt-1 text-sm text-aegis-text-muted">{screen.id}</p>
          {screen.judgeNote ? <p className="mt-3 text-sm leading-6 text-aegis-text-muted">{screen.judgeNote}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          {screen.route ? (
            <a href={screen.route} className="inline-flex">
              <Button variant="primary">Open route</Button>
            </a>
          ) : null}
          {screen.htmlPath ? (
            <a href={screen.htmlPath} target="_blank" rel="noreferrer" className="inline-flex">
              <Button variant="secondary">Open raw HTML</Button>
            </a>
          ) : null}
          {screen.screenshotPath ? (
            <a href={screen.screenshotPath} target="_blank" rel="noreferrer" className="inline-flex">
              <Button variant="ghost">Open screenshot</Button>
            </a>
          ) : null}
        </div>
      </div>
    </Panel>
  )
}

export function getFeaturedStitchScreens() {
  return stitchScreens.filter((screen) =>
    ['landing-page', 'evaluation-dashboard', 'decision-result'].includes(screen.slug),
  )
}
