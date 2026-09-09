import * as React from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { shortenAddress } from '~/lib/api'
import { useOperatorIdentityFlow } from '~/lib/operator-auth-client'

export function OperatorIdentityBadge() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const identity = useOperatorIdentityFlow()

  if (identity.status === 'disconnected' || identity.status === 'connecting') {
    return (
      <div className="relative">
        <Button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          leftIcon={<Icon name={identity.status === 'connecting' ? 'hourglass_top' : 'account_balance_wallet'} className="text-base" />}
          className="min-w-[172px] justify-center"
          disabled={identity.status === 'connecting'}
        >
          {identity.status === 'connecting' ? 'Connecting wallet' : 'Connect wallet'}
        </Button>
        {menuOpen ? (
          <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-2xl border border-white/10 bg-aegis-shell p-3 shadow-2xl shadow-black/40">
            <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted/70">Operator wallets</div>
            <div className="space-y-2">
              {identity.connectors.map((connector) => (
                <button
                  key={connector.uid}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-left text-sm text-aegis-text transition-colors hover:bg-white/[0.04]"
                  onClick={() => {
                    identity.connect({ connector })
                    setMenuOpen(false)
                  }}
                >
                  <span>{connector.name}</span>
                  <Icon name="arrow_forward" className="text-sm text-aegis-text-muted" />
                </button>
              ))}
            </div>
            <p className="px-2 pt-3 text-xs leading-5 text-aegis-text-muted">Injected wallets and Coinbase Wallet are supported in this build. WalletConnect is intentionally not configured.</p>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 lg:gap-3">
      <span className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 font-mono text-xs text-aegis-text">
        {shortenAddress(identity.address)}
      </span>

      {identity.status === 'wrong-network' ? (
        <>
          <Badge tone="warning">Wrong network</Badge>
          <Button type="button" variant="secondary" onClick={() => void identity.switchToBase()} disabled={identity.isSwitchPending}>
            {identity.isSwitchPending ? 'Switching' : 'Switch to Base'}
          </Button>
        </>
      ) : identity.hasMatchingSession ? (
        <>
          <Badge tone="primary">Signed-in operator</Badge>
          <Button type="button" variant="secondary" onClick={() => void identity.logout()}>
            Log out
          </Button>
        </>
      ) : (
        <>
          <Badge tone="info">Connected</Badge>
          <Button type="button" variant="secondary" onClick={() => void identity.signIn()} disabled={identity.isAuthenticating}>
            {identity.isAuthenticating ? 'Sign challenge' : 'Sign operator session'}
          </Button>
        </>
      )}

      <Button type="button" variant="ghost" onClick={() => identity.disconnect()}>
        Disconnect
      </Button>

      {identity.errorMessage ? (
        <div className="w-full text-right text-xs text-aegis-warning">{identity.errorMessage}</div>
      ) : null}
    </div>
  )
}
