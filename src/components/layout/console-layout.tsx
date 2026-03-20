import { Link } from '@tanstack/react-router'
import { consoleNav } from '~/content/aegis'
import { cn } from '~/lib/cn'
import { Icon } from '~/components/ui/icon'
import { Button } from '~/components/ui/button'

export function ConsoleLayout({
  title,
  description,
  eyebrow,
  actions,
  children,
}: {
  title: string
  description?: string
  eyebrow?: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-7rem)] gap-6 lg:gap-8">
      <aside className="hidden w-72 shrink-0 lg:flex lg:flex-col">
        <div className="surface-shell ghost-outline sticky top-24 flex h-[calc(100vh-8rem)] flex-col rounded-[32px] p-6">
          <div className="mb-8">
            <p className="text-lg font-bold tracking-tight text-aegis-primary font-headline">
              Aegis Guardrails
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-aegis-text-muted/70">
              The Sovereign Vault
            </p>
          </div>

          <nav className="space-y-1">
            {consoleNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: 'console-nav-item console-nav-item-active' }}
                className="console-nav-item"
              >
                <Icon name={item.icon} className="text-xl" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4 pt-6">
            <div className="rounded-2xl bg-aegis-highest p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-aegis-text-muted">Vault health</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/25">
                <div className="h-full w-4/5 rounded-full bg-aegis-primary" />
              </div>
              <p className="mt-3 text-sm text-aegis-text-muted">80% operational readiness, all critical guardrails synced.</p>
            </div>
            <Link to="/request-service" className="block">
              <Button className="w-full justify-center" leftIcon={<Icon name="bolt" className="text-lg" />}>
                Request Service
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <header className="surface-glass ghost-outline flex flex-col gap-4 rounded-[32px] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            {eyebrow ? <p className="eyebrow text-aegis-primary/80">{eyebrow}</p> : null}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-aegis-text font-headline sm:text-4xl">
                {title}
              </h1>
              {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-aegis-text-muted sm:text-base">{description}</p> : null}
            </div>
          </div>
          <div className={cn('flex flex-wrap items-center gap-3', actions ? '' : 'sm:self-start')}>
            {actions}
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
