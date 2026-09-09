import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { formatEvaluationTimestamp, shortenAddress } from '~/lib/api'
import { useOperatorIdentityFlow } from '~/lib/operator-auth-client'

export function OperatorSessionCard() {
  const identity = useOperatorIdentityFlow()

  return (
    <section className="dashboard-card p-8 xl:col-span-7">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-xl font-bold text-aegis-text">Operator identity</h2>
          <p className="mt-1 text-sm text-aegis-text-muted">Wallet connection is passive browsing only until the operator signs a server challenge on Base.</p>
        </div>
        <Badge tone={identity.hasMatchingSession ? 'primary' : identity.isWrongNetwork ? 'warning' : 'info'}>
          {identity.hasMatchingSession ? 'Signed session' : identity.isWrongNetwork ? 'Wrong network' : identity.isConnected ? 'Wallet connected' : 'Disconnected'}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OperatorMetric label="Wallet" value={identity.address ? shortenAddress(identity.address) : 'Not connected'} icon="account_balance_wallet" />
        <OperatorMetric label="Required chain" value="Base (8453)" icon="hub" />
        <OperatorMetric label="Server session" value={identity.hasMatchingSession ? 'Active' : 'Required'} icon="verified_user" />
        <OperatorMetric label="Session expires" value={identity.session ? formatEvaluationTimestamp(identity.session.expiresAt) : 'N/A'} icon="schedule" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {!identity.isConnected ? null : identity.isWrongNetwork ? (
          <Button type="button" variant="secondary" onClick={() => void identity.switchToBase()} disabled={identity.isSwitchPending}>
            {identity.isSwitchPending ? 'Switching to Base' : 'Switch to Base'}
          </Button>
        ) : identity.hasMatchingSession ? (
          <Button type="button" variant="secondary" onClick={() => void identity.logout()}>
            Log out operator session
          </Button>
        ) : (
          <Button type="button" variant="secondary" onClick={() => void identity.signIn()} disabled={identity.isAuthenticating}>
            {identity.isAuthenticating ? 'Awaiting signature' : 'Sign operator session'}
          </Button>
        )}

        {identity.isConnected ? (
          <Button type="button" variant="ghost" onClick={() => identity.disconnect()}>
            Disconnect wallet
          </Button>
        ) : null}
      </div>

      <div className="mt-6 rounded-xl border border-white/8 bg-black/20 p-5 text-sm leading-7 text-aegis-text-muted">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge tone="info">Passive browsing stays open</Badge>
          <Badge tone="warning">Policy mutations require auth</Badge>
        </div>
        <p>
          Policy create, edit, archive, and activate actions are blocked until the connected wallet is on Base and signs the operator challenge. Evaluation runs stay available for demo accessibility and automatically attach operator metadata when a signed session exists.
        </p>
        {identity.errorMessage ? (
          <div className="mt-4 flex items-center gap-2 text-aegis-warning">
            <Icon name="warning" className="text-base" />
            <span>{identity.errorMessage}</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function OperatorMetric({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-5">
      <div className="flex items-center gap-3 text-aegis-primary">
        <Icon name={icon} className="text-lg" />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">{label}</span>
      </div>
      <div className="mt-4 text-sm font-semibold text-aegis-text">{value}</div>
    </div>
  )
}
