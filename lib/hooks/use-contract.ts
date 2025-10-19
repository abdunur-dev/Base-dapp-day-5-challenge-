"use client"

import { useState, useCallback } from "react"
import { useWallet } from "./use-wallet"

export function useContract() {
  const { address, isConnected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const writeContract = useCallback(
    async (contractAddress: string, abi: any[], functionName: string, args: any[] = []) => {
      if (typeof window === "undefined" || !window.ethereum || !address) {
        throw new Error("Wallet not connected")
      }

      try {
        setIsLoading(true)
        setError(null)

        console.log("[v0] Sending transaction:", { contractAddress, functionName, args })

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: address,
              to: contractAddress,
              value: "0x0",
              data: "0x", // Empty data for demo - in production, encode the function call
            },
          ],
        })

        console.log("[v0] Transaction sent:", txHash)
        setIsLoading(false)
        return txHash
      } catch (err: any) {
        console.error("[v0] Transaction error:", err)
        setError(err.message)
        setIsLoading(false)
        throw err
      }
    },
    [address],
  )

  const readContract = useCallback(
    async (contractAddress: string, abi: any[], functionName: string, args: any[] = []) => {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet found")
      }

      try {
        setIsLoading(true)
        setError(null)

        console.log("[v0] Reading contract:", { contractAddress, functionName, args })

        const mockData = Math.floor(Math.random() * 1000)

        setIsLoading(false)
        return mockData
      } catch (err: any) {
        console.error("[v0] Read error:", err)
        setError(err.message)
        setIsLoading(false)
        throw err
      }
    },
    [],
  )

  return {
    readContract,
    writeContract,
    isLoading,
    error,
  }
}
