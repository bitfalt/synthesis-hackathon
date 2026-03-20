import { Icon } from '~/components/ui/icon'

export function SectionHeading({
  title,
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: string
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-aegis-text font-headline">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{description}</p> : null}
      </div>
      {icon ? (
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-aegis-primary/10 text-aegis-primary">
          <Icon name={icon} className="text-xl" />
        </div>
      ) : null}
    </div>
  )
}
