import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
} from 'wagmi'
import {
  BASE_CHAIN_ID,
  fetchOperatorSession,
  logoutOperatorSession,
  requestOperatorChallenge,
  verifyOperatorSession,
} from '~/lib/api'

export const operatorSessionQueryKey = ['operator-session'] as const

function isUserRejection(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false
  }

  const code = 'code' in error && typeof error.code === 'number' ? error.code : null
  const message = 'message' in error && typeof error.message === 'string'
    ? error.message.toLowerCase()
    : ''

  return code === 4001 || message.includes('user rejected') || message.includes('user denied')
}

export function useOperatorSessionQuery() {
  return useQuery({
    queryKey: operatorSessionQueryKey,
    queryFn: fetchOperatorSession,
  })
}

export function useOperatorIdentityFlow() {
  const queryClient = useQueryClient()
  const sessionQuery = useOperatorSessionQuery()
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const chainId = useChainId()
  const { connect, connectors, isPending: isConnectPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { switchChainAsync, isPending: isSwitchPending, error: switchError } = useSwitchChain()
  const [authError, setAuthError] = React.useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = React.useState(false)

  const session = sessionQuery.data ?? null
  const isWrongNetwork = isConnected && chainId !== BASE_CHAIN_ID
  const hasMatchingSession = Boolean(
    session && address && session.address.toLowerCase() === address.toLowerCase(),
  )

  const status = !isConnected
    ? isConnecting || isReconnecting || isConnectPending
      ? 'connecting'
      : 'disconnected'
    : isWrongNetwork
      ? 'wrong-network'
      : hasMatchingSession
        ? 'signed-in'
        : isAuthenticating
          ? 'connecting'
          : 'connected'

  const errorMessage = authError || switchError?.message || connectError?.message || null

  const signIn = React.useCallback(async () => {
    if (!address) {
      setAuthError('Connect a wallet before starting an operator session.')
      return false
    }

    if (chainId !== BASE_CHAIN_ID) {
      setAuthError('Switch to Base before signing the operator challenge.')
      return false
    }

    setAuthError(null)
    setIsAuthenticating(true)

    try {
      const challenge = await requestOperatorChallenge(address)
      const signature = await signMessageAsync({ message: challenge.message })

      await verifyOperatorSession({
        address,
        signature,
        nonce: challenge.nonce,
      })

      await queryClient.invalidateQueries({ queryKey: operatorSessionQueryKey })
      return true
    } catch (error) {
      if (!isUserRejection(error)) {
        setAuthError(error instanceof Error ? error.message : 'Unable to start the operator session.')
      }

      return false
    } finally {
      setIsAuthenticating(false)
    }
  }, [address, chainId, queryClient, signMessageAsync])

  const logout = React.useCallback(async () => {
    await logoutOperatorSession()
    await queryClient.invalidateQueries({ queryKey: operatorSessionQueryKey })
    setAuthError(null)
  }, [queryClient])

  const switchToBase = React.useCallback(async () => {
    if (!switchChainAsync) {
      setAuthError('This wallet does not support automatic chain switching.')
      return false
    }

    setAuthError(null)

    try {
      await switchChainAsync({ chainId: BASE_CHAIN_ID })
      return true
    } catch (error) {
      if (!isUserRejection(error)) {
        setAuthError(error instanceof Error ? error.message : 'Unable to switch to Base.')
      }

      return false
    }
  }, [switchChainAsync])

  return {
    address,
    chainId,
    connect,
    connectors,
    disconnect,
    errorMessage,
    hasMatchingSession,
    isAuthenticating,
    isConnected,
    isSwitchPending,
    isWrongNetwork,
    logout,
    session,
    signIn,
    status,
    switchToBase,
  }
}
