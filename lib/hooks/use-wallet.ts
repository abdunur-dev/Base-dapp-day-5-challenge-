"use client"

import { useState, useEffect, useCallback } from "react"

export interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWallet({
          address: null,
          chainId: null,
          isConnected: false,
          isConnecting: false,
          error: null,
        })
      } else {
        setWallet((prev) => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
        }))
      }
    }

    const handleChainChanged = (chainId: string) => {
      setWallet((prev) => ({
        ...prev,
        chainId: Number.parseInt(chainId, 16),
      }))
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    checkConnection()

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window === "undefined" || !window.ethereum) return

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      })
      if (accounts.length > 0) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        })
        setWallet({
          address: accounts[0],
          chainId: Number.parseInt(chainId, 16),
          isConnected: true,
          isConnecting: false,
          error: null,
        })
      }
    } catch (error) {
      console.error("[v0] Error checking connection:", error)
    }
  }

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setWallet((prev) => ({
        ...prev,
        error: "Please install MetaMask or Coinbase Wallet to continue",
      }))
      return
    }

    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      setWallet({
        address: accounts[0],
        chainId: Number.parseInt(chainId, 16),
        isConnected: true,
        isConnecting: false,
        error: null,
      })
    } catch (error: any) {
      console.error("[v0] Connection error:", error)
      setWallet({
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        error: error.message || "Failed to connect wallet",
      })
    }
  }, [])

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    })
  }, [])

  const switchNetwork = async (chainId: number) => {
    if (typeof window === "undefined" || !window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      console.error("[v0] Network switch error:", error)
      if (error.code === 4902) {
        setWallet((prev) => ({
          ...prev,
          error: "Please add this network to your wallet",
        }))
      }
    }
  }

  return {
    ...wallet,
    connect,
    disconnect,
    switchNetwork,
  }
}

declare global {
  interface Window {
    ethereum?: any
  }
}
