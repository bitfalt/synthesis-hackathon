import { cn } from '~/lib/cn'

type PanelTone = 'panel' | 'elevated' | 'glass'

const toneClasses: Record<PanelTone, string> = {
  panel: 'surface-panel ghost-outline',
  elevated: 'surface-elevated ghost-outline',
  glass: 'surface-glass ghost-outline',
}

export function Panel({
  tone = 'panel',
  className,
  children,
}: {
  tone?: PanelTone
  className?: string
  children: React.ReactNode
}) {
  return <section className={cn('rounded-2xl p-6', toneClasses[tone], className)}>{children}</section>
}
