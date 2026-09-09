import { Link } from '@tanstack/react-router'
import { Badge } from '~/components/ui/badge'
import { consoleNav } from '~/content/aegis'
import { cn } from '~/lib/cn'
import { Icon } from '~/components/ui/icon'
import { Button } from '~/components/ui/button'
import { OperatorIdentityBadge } from '~/components/operator/operator-identity-badge'

export function ConsoleLayout({
  title,
  description,
  eyebrow,
  actions,
  topbarActions,
  contentClassName,
  hidePageHeader,
  children,
}: {
  title: string
  description?: string
  eyebrow?: string
  actions?: React.ReactNode
  topbarActions?: React.ReactNode
  contentClassName?: string
  hidePageHeader?: boolean
  children: React.ReactNode
}) {
  const navStatusClassName: Record<(typeof consoleNav)[number]['status'], string> = {
    live: 'bg-aegis-primary/10 text-aegis-primary',
    support: 'bg-aegis-secondary/10 text-aegis-secondary',
    preview: 'bg-aegis-warning/10 text-aegis-warning',
  }

  const navStatusLabel: Record<(typeof consoleNav)[number]['status'], string> = {
    live: 'Live',
    support: 'Support',
    preview: 'Preview',
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="px-6 pb-8 pt-8">
          <p className="font-headline text-xl font-bold tracking-tight text-aegis-primary">The Sovereign Vault</p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.28em] text-aegis-text-muted/50">Enterprise grade</p>
        </div>

        <nav className="flex-1 px-4">
          {consoleNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: 'console-nav-item console-nav-item-active' }}
              className="console-nav-item"
            >
              <Icon name={item.icon} className="text-[20px]" />
              <span>{item.label}</span>
              <span
                className={cn(
                  'ml-auto rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]',
                  navStatusClassName[item.status],
                )}
              >
                {navStatusLabel[item.status]}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-4 pb-6">
          <Link to="/policy-management" className="block">
            <Button className="w-full justify-center">Policy workspace</Button>
          </Link>
          <div className="mt-6 flex items-center gap-3 border-t border-white/5 px-4 py-4 text-xs text-aegis-text-muted">
            <Icon name="verified_user" className="text-base" />
            <span>Base operator flow</span>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="flex items-center gap-4 lg:gap-6">
            <p className="font-headline text-xl font-bold tracking-tight text-aegis-primary">Aegis Treasury</p>
            <div className="hidden h-4 w-px bg-white/10 lg:block" />
            <div className="hidden items-center gap-2 rounded-lg border border-white/6 bg-black/20 px-3 py-2 lg:flex">
              <Icon name="search" className="text-sm text-aegis-text-muted/70" />
              <span className="text-xs text-aegis-text-muted">Search is not part of today's MVP</span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden items-center gap-2 lg:flex">
              <Badge tone="neutral">Operator identity</Badge>
              <Badge tone="info">Base 8453</Badge>
            </div>
            {topbarActions}
            <OperatorIdentityBadge />
          </div>
        </header>

        <main className={cn('dashboard-canvas', contentClassName)}>
          {hidePageHeader ? null : (
            <div className="dashboard-page-header">
              <div className="max-w-3xl">
                {eyebrow ? <p className="eyebrow mb-3 text-aegis-primary/80">{eyebrow}</p> : null}
                <h1 className="font-headline text-4xl font-extrabold tracking-tight text-aegis-text lg:text-5xl">{title}</h1>
                {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-aegis-text-muted">{description}</p> : null}
              </div>
              <div className={cn('flex flex-wrap items-center gap-3', actions ? '' : 'hidden')}>
                {actions}
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}
