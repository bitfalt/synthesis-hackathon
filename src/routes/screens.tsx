import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { StitchReferenceCard } from '~/components/stitch/stitch-reference-card'
import { Button } from '~/components/ui/button'
import { stitchScreens } from '~/lib/stitch-screens'

export const Route = createFileRoute('/screens')({
  component: ScreensPage,
})

function ScreensPage() {
  return (
    <ConsoleLayout
      eyebrow="Stitch reference registry"
      title="Imported Stitch screens mirrored as real routes"
      description="Use this page as the bridge between the preserved Stitch exports and the implemented TanStack surfaces. Each card links to the live route, raw HTML, and reference screenshot."
      contentClassName="max-w-[1380px]"
      topbarActions={<Button className="px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
    >
      <section className="grid gap-5 xl:grid-cols-2">
        {stitchScreens.map((screen) => (
          <StitchReferenceCard key={screen.id} screen={screen} />
        ))}
      </section>
    </ConsoleLayout>
  )
}
