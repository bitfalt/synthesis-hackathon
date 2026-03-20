/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: 'Aegis Treasury Guardrails' },
      {
        name: 'description',
        content:
          'Private treasury policy reasoning for crypto teams — Venice, ERC-8004, and Base.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function navLinkClass(active: boolean) {
  return active
    ? 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white'
    : 'rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white'
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-[#131313] text-zinc-100 antialiased">
        <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-teal-300/80">
                  Synthesis Hackathon
                </p>
                <Link to="/" className="text-2xl font-semibold tracking-tight text-white">
                  Aegis Treasury Guardrails
                </Link>
              </div>
              <nav className="flex flex-wrap items-center gap-2">
                <Link
                  to="/"
                  activeProps={{ className: navLinkClass(true) }}
                  activeOptions={{ exact: true }}
                  className={navLinkClass(false)}
                >
                  Overview
                </Link>
                <Link
                  to="/screens"
                  activeProps={{ className: navLinkClass(true) }}
                  className={navLinkClass(false)}
                >
                  Stitch Screens
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
