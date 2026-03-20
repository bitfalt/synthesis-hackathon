import { createFileRoute } from '@tanstack/react-router'
import { stitchScreens } from '~/lib/stitch-screens'

export const Route = createFileRoute('/screens')({
  component: StitchScreensPage,
})

function StitchScreensPage() {
  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-[28px] bg-zinc-900/80 p-6 ring-1 ring-white/10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Stitch screen imports</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
          The screens below were exported from Stitch and saved locally as raw HTML plus screenshots. They are the implementation baseline for the hackathon UI, while the TanStack Start app provides the React/Tailwind shell we can iterate inside.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {stitchScreens.map((screen) => (
          <article
            key={screen.id}
            className="overflow-hidden rounded-[28px] bg-zinc-900/80 ring-1 ring-white/10"
          >
            {screen.kind === 'design-system' ? (
              <div className="flex h-64 items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-teal-950/60 px-6 text-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-teal-300/80">Design system</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{screen.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{screen.notes}</p>
                </div>
              </div>
            ) : (
              <img
                src={screen.screenshotPath}
                alt={screen.title}
                className="h-72 w-full object-cover object-top"
              />
            )}

            <div className="space-y-4 p-5">
              <div>
                <h2 className="text-xl font-semibold text-white">{screen.title}</h2>
                <p className="mt-1 text-sm text-zinc-400">{screen.id}</p>
              </div>

              {screen.notes ? <p className="text-sm leading-6 text-zinc-300">{screen.notes}</p> : null}

              <div className="flex flex-wrap gap-3 text-sm">
                {screen.htmlPath ? (
                  <a
                    href={screen.htmlPath}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-teal-400 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-teal-300"
                  >
                    Open raw HTML
                  </a>
                ) : null}
                {screen.screenshotPath ? (
                  <a
                    href={screen.screenshotPath}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/15 px-4 py-2 font-semibold text-zinc-100 transition hover:bg-white/5"
                  >
                    Open screenshot
                  </a>
                ) : null}
                {screen.kind === 'design-system' ? (
                  <a
                    href="https://github.com/bitfalt/synthesis-hackathon/blob/main/docs/stitch/design-system-spec.md"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/15 px-4 py-2 font-semibold text-zinc-100 transition hover:bg-white/5"
                  >
                    Open design system spec
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
