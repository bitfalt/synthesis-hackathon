import { cn } from '~/lib/cn'

type BadgeTone = 'primary' | 'warning' | 'info' | 'neutral'

const tones: Record<BadgeTone, string> = {
  primary: 'badge badge-primary',
  warning: 'badge badge-warning',
  info: 'badge badge-info',
  neutral: 'badge badge-neutral',
}

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: BadgeTone
  children: React.ReactNode
  className?: string
}) {
  return <span className={cn(tones[tone], className)}>{children}</span>
}
