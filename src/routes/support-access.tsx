import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'

export const Route = createFileRoute('/support-access')({
  component: SupportAccessPage,
})

const tickets = [
  { id: '#SR-9921', title: 'Whale Wallet Re-keying', detail: 'Our security lead is reviewing the multisig...', state: 'LIVE', active: true },
  { id: '#SR-9844', title: 'L2 Gas Optimization API', detail: 'Waiting for client confirmation...', state: 'PENDING', active: false },
  { id: '#SR-9012', title: 'Treasury Migration 0x...F32', detail: 'Closed engagement', state: 'DONE', active: false },
] as const

export function SupportAccessPage() {
  return (
    <ConsoleLayout
      eyebrow="Institutional priority access"
      title="Direct Support"
      description="A tri-pane concierge workspace that mirrors the Stitch support surface while remaining a UI-only operational demo."
      contentClassName="p-0"
      hidePageHeader
      topbarActions={<Button className="mr-6 px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
    >
      <div className="flex min-h-[calc(100vh-220px)] flex-col overflow-hidden border border-white/6 bg-aegis-foundation xl:flex-row">
        <section className="w-full border-r border-white/6 bg-aegis-shell xl:w-80">
          <div className="p-6">
            <h2 className="font-headline text-lg font-bold text-aegis-text">Direct Support</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-aegis-text-muted">Active engagements</p>
          </div>
          <div className="space-y-2 px-3 pb-4">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                className={`w-full rounded-xl border-l-2 p-4 text-left transition-all ${ticket.active ? 'border-aegis-primary bg-aegis-highest/40' : 'border-transparent hover:bg-white/[0.03]'} ${ticket.state === 'DONE' ? 'opacity-60' : ''}`}
                type="button"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <span className={`font-headline text-sm font-semibold ${ticket.active ? 'text-aegis-primary' : 'text-aegis-text'}`}>{ticket.id}</span>
                  <Badge tone={ticket.state === 'LIVE' ? 'primary' : ticket.state === 'PENDING' ? 'info' : 'neutral'}>{ticket.state}</Badge>
                </div>
                <p className="text-sm font-medium text-aegis-text">{ticket.title}</p>
                <p className="mt-1 text-xs text-aegis-text-muted">{ticket.detail}</p>
                {ticket.active ? (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-aegis-shell bg-aegis-primary/20 text-[9px] font-bold text-aegis-primary">EV</div>
                      <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-aegis-shell bg-aegis-secondary/20 text-[9px] font-bold text-aegis-secondary">SE</div>
                    </div>
                    <p className="text-[10px] italic text-aegis-text-muted">Updated 2m ago</p>
                  </div>
                ) : null}
              </button>
            ))}
          </div>
          <div className="border-t border-white/6 p-4">
            <Button variant="secondary" className="w-full justify-center">Open priority ticket</Button>
          </div>
        </section>

        <section className="flex min-w-0 flex-1 flex-col bg-aegis-foundation">
          <div className="flex h-20 items-center justify-between border-b border-white/6 bg-aegis-foundation/80 px-6 backdrop-blur-md lg:px-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-aegis-primary/15 text-aegis-primary">
                  <Icon name="support_agent" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-aegis-foundation bg-aegis-primary" />
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold text-aegis-text">Priority Agent: Erikson V.</h3>
                <p className="text-[11px] uppercase tracking-[0.18em] text-aegis-primary">Institutional escalation specialist</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-aegis-text-muted">
              <button className="rounded-lg p-2 hover:bg-white/5" type="button"><Icon name="videocam" /></button>
              <button className="rounded-lg p-2 hover:bg-white/5" type="button"><Icon name="call" /></button>
              <button className="rounded-lg p-2 hover:bg-white/5" type="button"><Icon name="more_vert" /></button>
            </div>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-8 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aegis-text-muted">Today, Oct 24</span>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            <div className="ml-auto max-w-[80%] space-y-2">
              <div className="rounded-2xl rounded-tr-none border border-white/8 bg-aegis-highest/50 p-4 text-sm leading-7 text-aegis-text">
                We are attempting to re-key the master treasury vault (ID: VAULT-772). The second signer is getting an Invalid Script Hash error during the broadcast phase. This is time-sensitive for our NY close.
              </div>
              <div className="text-right text-[10px] text-aegis-text-muted">14:02 | Delivered</div>
            </div>

            <div className="max-w-[80%] space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid h-6 w-6 place-items-center rounded-md bg-aegis-primary/20 text-[10px] font-bold text-aegis-primary">EV</div>
                <span className="text-xs font-bold tracking-wide text-aegis-primary">Erikson V.</span>
              </div>
              <div className="rounded-2xl rounded-tl-none border-l-2 border-aegis-primary/40 bg-aegis-shell p-4 text-sm leading-7 text-aegis-text-muted">
                Understood. I have pulled your vault manifest. It appears there is a mismatch in the witness script from the last upgrade. I am escalating this to our Lead Security Engineer now.
              </div>
              <div className="rounded-2xl border-l-2 border-aegis-primary/40 bg-aegis-shell p-4 text-sm leading-7 text-aegis-text-muted">
                Please do not attempt further signatures until we clear the cache on the node side. I will provide a status update in under 5 minutes.
              </div>
              <div className="text-[10px] text-aegis-text-muted">14:05</div>
            </div>

            <div className="mx-auto flex w-fit items-center gap-3 rounded-lg border border-aegis-secondary/10 bg-aegis-secondary/5 px-4 py-2">
              <Icon name="lock_open" className="text-sm text-aegis-secondary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aegis-secondary">Security engineer Sarah joined the session</span>
            </div>

            <div className="flex items-center gap-2 text-aegis-primary/60">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-aegis-primary/40" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-aegis-primary/40 [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-aegis-primary/40 [animation-delay:0.4s]" />
              </div>
              <span className="text-[10px] italic">Sarah is reviewing vault manifest...</span>
            </div>
          </div>

          <div className="border-t border-white/6 bg-aegis-shell p-4 lg:px-8">
            <div className="flex items-end gap-3 rounded-xl border border-white/8 bg-black/20 p-3">
              <div className="flex-1">
                <div className="min-h-12 text-sm text-aegis-text-muted">Type a message or drop files...</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-aegis-text-muted">
                    <button className="rounded-lg p-1.5 hover:bg-white/5" type="button"><Icon name="attach_file" className="text-sm" /></button>
                    <button className="rounded-lg p-1.5 hover:bg-white/5" type="button"><Icon name="image" className="text-sm" /></button>
                    <button className="rounded-lg p-1.5 hover:bg-white/5" type="button"><Icon name="password" className="text-sm" /></button>
                  </div>
                  <span className="text-[10px] font-mono text-aegis-text-muted/65">Vault connection: SECURE</span>
                </div>
              </div>
              <button className="rounded-lg bg-aegis-primary p-3 text-zinc-950" type="button">
                <Icon name="send" />
              </button>
            </div>
          </div>
        </section>

        <aside className="w-full border-l border-white/6 bg-aegis-shell p-6 xl:w-80">
          <h3 className="font-headline text-sm font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Case details</h3>
          <div className="mt-5 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-aegis-text-muted">Priority level</div>
              <div className="mt-2"><Badge tone="warning">Critical fund access</Badge></div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-aegis-text-muted">Asset level</div>
              <div className="mt-2 text-sm font-semibold text-aegis-text">37 BTC Main Treasury</div>
            </div>
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-aegis-text-muted">SLA compliance</div>
              <div className="h-2 overflow-hidden rounded-full bg-black/30">
                <div className="h-full w-[92%] bg-aegis-primary" />
              </div>
              <div className="mt-2 text-xs text-aegis-text-muted">Response time 3m / 15m</div>
            </div>
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-aegis-text-muted">Related assets</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-black/20 p-3 text-xs text-aegis-text-muted">
                  <Icon name="description" className="text-aegis-text-muted" />
                  <div>
                    <div className="text-aegis-text">vault-config-v4.json</div>
                    <div className="text-[9px] text-aegis-text-muted/60">JSON · 12.4 KB</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-black/20 p-3 text-xs text-aegis-text-muted">
                  <Icon name="image" className="text-aegis-text-muted" />
                  <div>
                    <div className="text-aegis-text">error_log_0x22.png</div>
                    <div className="text-[9px] text-aegis-text-muted/60">PNG · 1.2 MB</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-aegis-primary/12 bg-aegis-primary/6 p-4 text-sm leading-6 text-aegis-text-muted">
              This session has been flagged for institutional audit requirements and dual-control review.
            </div>
          </div>
        </aside>
      </div>
    </ConsoleLayout>
  )
}
