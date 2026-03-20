import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '~/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  leftIcon?: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

export function Button({
  className,
  variant = 'primary',
  leftIcon,
  children,
  ...props
}: Props) {
  return (
    <button className={cn(variants[variant], className)} {...props}>
      {leftIcon}
      <span>{children}</span>
    </button>
  )
}
