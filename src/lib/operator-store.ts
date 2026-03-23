import { randomUUID } from 'node:crypto'
import { getAddress } from 'viem'
import type { OperatorSession } from '~/lib/api'
import { BASE_CHAIN_ID } from '~/lib/api'

export const OPERATOR_SESSION_COOKIE = 'aegis_operator_session'

const CHALLENGE_TTL_MS = 10 * 60 * 1000
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

type ChallengeRecord = {
  address: string
  nonce: string
  message: string
  expiresAt: number
}

type SessionRecord = OperatorSession & {
  id: string
  expiresAtMs: number
}

type RuntimeStore = {
  challenges: Map<string, ChallengeRecord>
  sessions: Map<string, SessionRecord>
}

function nowIso() {
  return new Date().toISOString()
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function createInitialStore(): RuntimeStore {
  return {
    challenges: new Map(),
    sessions: new Map(),
  }
}

function getRuntimeStore() {
  const runtime = globalThis as typeof globalThis & {
    __aegisOperatorStore?: RuntimeStore
  }

  if (!runtime.__aegisOperatorStore) {
    runtime.__aegisOperatorStore = createInitialStore()
  }

  return runtime.__aegisOperatorStore
}

function parseCookies(headerValue: string | null) {
  if (!headerValue) {
    return new Map<string, string>()
  }

  return new Map(
    headerValue
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [name, ...rest] = part.split('=')
        return [name, decodeURIComponent(rest.join('='))]
      }),
  )
}

function serializeCookie(input: {
  name: string
  value: string
  request: Request
  expiresAt?: Date
  maxAge?: number
}) {
  const attributes = [
    `${input.name}=${encodeURIComponent(input.value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ]

  const url = new URL(input.request.url)

  if (url.protocol === 'https:' || process.env.NODE_ENV === 'production') {
    attributes.push('Secure')
  }

  if (typeof input.maxAge === 'number') {
    attributes.push(`Max-Age=${input.maxAge}`)
  }

  if (input.expiresAt) {
    attributes.push(`Expires=${input.expiresAt.toUTCString()}`)
  }

  return attributes.join('; ')
}

export function createChallenge(rawAddress: string) {
  const address = getAddress(rawAddress)
  const nonce = randomUUID()
  const issuedAt = nowIso()
  const expiresAt = Date.now() + CHALLENGE_TTL_MS
  const message = [
    'Aegis Treasury Guardrails operator sign-in',
    '',
    `Wallet: ${address}`,
    `Nonce: ${nonce}`,
    `Chain ID: ${BASE_CHAIN_ID}`,
    `Issued At: ${issuedAt}`,
    '',
    'Sign this message to start a server-backed operator session for policy administration.',
  ].join('\n')

  getRuntimeStore().challenges.set(nonce, {
    address,
    nonce,
    message,
    expiresAt,
  })

  return {
    address,
    nonce,
    message,
    expiresAt: new Date(expiresAt).toISOString(),
  }
}

export function takeChallenge(rawAddress: string, nonce: string) {
  const address = getAddress(rawAddress)
  const store = getRuntimeStore()
  const challenge = store.challenges.get(nonce)

  if (!challenge) {
    return null
  }

  if (challenge.expiresAt < Date.now()) {
    store.challenges.delete(nonce)
    return null
  }

  if (challenge.address.toLowerCase() !== address.toLowerCase()) {
    return null
  }

  store.challenges.delete(nonce)
  return challenge
}

export function createOperatorSession(rawAddress: string) {
  const address = getAddress(rawAddress)
  const issuedAt = nowIso()
  const expiresAtMs = Date.now() + SESSION_TTL_MS
  const session: SessionRecord = {
    id: randomUUID(),
    address,
    display: shortenAddress(address),
    chainId: BASE_CHAIN_ID,
    issuedAt,
    expiresAt: new Date(expiresAtMs).toISOString(),
    expiresAtMs,
  }

  getRuntimeStore().sessions.set(session.id, session)
  return session
}

export function getOperatorSessionFromRequest(request: Request) {
  const sessionId = parseCookies(request.headers.get('cookie')).get(OPERATOR_SESSION_COOKIE)

  if (!sessionId) {
    return null
  }

  const store = getRuntimeStore()
  const session = store.sessions.get(sessionId)

  if (!session) {
    return null
  }

  if (session.expiresAtMs < Date.now()) {
    store.sessions.delete(session.id)
    return null
  }

  return session satisfies OperatorSession
}

export function destroyOperatorSession(request: Request) {
  const sessionId = parseCookies(request.headers.get('cookie')).get(OPERATOR_SESSION_COOKIE)

  if (sessionId) {
    getRuntimeStore().sessions.delete(sessionId)
  }
}

export function createOperatorSessionCookie(request: Request, sessionId: string) {
  return serializeCookie({
    name: OPERATOR_SESSION_COOKIE,
    value: sessionId,
    request,
    maxAge: SESSION_TTL_MS / 1000,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  })
}

export function clearOperatorSessionCookie(request: Request) {
  return serializeCookie({
    name: OPERATOR_SESSION_COOKIE,
    value: '',
    request,
    maxAge: 0,
    expiresAt: new Date(0),
  })
}
