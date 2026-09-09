import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '~/components/ui/badge'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { StitchReferenceCard } from '~/components/stitch/stitch-reference-card'
import { stitchScreens } from '~/lib/stitch-screens'

export const Route = createFileRoute('/screens')({
  component: ScreensPage,
})

function ScreensPage() {
  return (
    <ConsoleLayout
      eyebrow="Stitch reference registry"
      title="Implementation Reference Registry"
      description="Use this page as the bridge between the preserved Stitch exports and the implemented TanStack surfaces. Some routes are live MVP flows; others remain intentionally labeled submission previews."
      contentClassName="max-w-[1380px]"
      topbarActions={<Badge tone="info">Supporting surface</Badge>}
    >
      <section className="grid gap-5 xl:grid-cols-2">
        {stitchScreens.map((screen) => (
          <StitchReferenceCard key={screen.id} screen={screen} />
        ))}
      </section>
    </ConsoleLayout>
  )
}
