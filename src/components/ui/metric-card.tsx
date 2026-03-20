import { Icon } from './icon'
import { Panel } from './panel'
import { cn } from '~/lib/cn'

type Tone = 'primary' | 'warning' | 'neutral'

const valueTone: Record<Tone, string> = {
  primary: 'text-aegis-primary-bright',
  warning: 'text-aegis-warning',
  neutral: 'text-aegis-text',
}

export function MetricCard({
  label,
  value,
  helper,
  icon,
  tone = 'neutral',
}: {
  label: string
  value: string
  helper: string
  icon: string
  tone?: Tone
}) {
  return (
    <Panel className="relative overflow-hidden p-6">
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-aegis-primary/10 blur-3xl" />
      <p className="eyebrow text-aegis-text-muted">{label}</p>
      <div className={cn('mt-4 text-4xl font-extrabold tracking-tight font-headline', valueTone[tone])}>{value}</div>
      <div className="mt-3 flex items-center gap-2 text-xs text-aegis-text-muted">
        <Icon name={icon} className="text-sm" />
        <span>{helper}</span>
      </div>
    </Panel>
  )
}
