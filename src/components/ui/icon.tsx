import { cn } from '~/lib/cn'

export function Icon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <span className={cn('material-symbols-outlined leading-none', className)}>
      {name}
    </span>
  )
}
