import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '~/lib/cn'

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="field-label">{children}</label>
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('field-control', props.className)} {...props} />
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('field-control', props.className)} {...props} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('field-control min-h-28 resize-none', props.className)} {...props} />
}

export function UnderlinedTextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('field-control-underlined', props.className)} {...props} />
}

export function UnderlinedSelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('field-control-underlined', props.className)} {...props} />
}

export function UnderlinedTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('field-control-underlined min-h-24 resize-none', props.className)} {...props} />
}
