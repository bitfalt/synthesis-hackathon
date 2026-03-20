import { createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '~/components/layout/page-intro'
import { StitchReferenceCard } from '~/components/stitch/stitch-reference-card'
import { stitchScreens } from '~/lib/stitch-screens'

export const Route = createFileRoute('/screens')({
  component: ScreensPage,
})

function ScreensPage() {
  return (
    <div className="space-y-8 pb-12">
      <PageIntro
        eyebrow="Stitch reference registry"
        title="Imported Stitch screens are now mirrored as real app routes."
        description="The cards below link to both the implemented TanStack route and the original raw Stitch export. Use this page as the bridge between design reference material and the actual app surface."
      />
      <section className="grid gap-5 xl:grid-cols-2">
        {stitchScreens.map((screen) => (
          <StitchReferenceCard key={screen.id} screen={screen} />
        ))}
      </section>
    </div>
  )
}
