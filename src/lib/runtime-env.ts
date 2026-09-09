import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type RuntimeEnv = Record<string, string>

let cachedFileEnv: RuntimeEnv | null = null

export function getRuntimeEnv(key: string) {
  return process.env[key] ?? loadFileEnv()[key]
}

function loadFileEnv() {
  if (cachedFileEnv) {
    return cachedFileEnv
  }

  const merged: RuntimeEnv = {}
  const candidates = ['.env', '.env.local']

  for (const candidate of candidates) {
    const filePath = resolve(process.cwd(), candidate)

    if (!existsSync(filePath)) {
      continue
    }

    const contents = readFileSync(filePath, 'utf8')

    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
        continue
      }

      const separatorIndex = trimmed.indexOf('=')
      const key = trimmed.slice(0, separatorIndex).trim()
      const rawValue = trimmed.slice(separatorIndex + 1).trim()
      merged[key] = unquote(rawValue)
    }
  }

  cachedFileEnv = merged
  return merged
}

function unquote(value: string) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }

  return value
}
