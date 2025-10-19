"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./use-wallet"

export interface ContractEvent {
  id: string
  type: string
  address: string
  data: any
  timestamp: number
  txHash: string
  blockNumber: number
}

interface UseEventsOptions {
  contractAddress: string
  abi: any[]
  eventNames?: string[]
  pollingInterval?: number
}

export function useEvents(options: UseEventsOptions | string) {
  const [events, setEvents] = useState<ContractEvent[]>([])
  const [isListening, setIsListening] = useState(false)
  const { isConnected } = useWallet()

  const config: UseEventsOptions =
    typeof options === "string"
      ? {
          contractAddress: options,
          abi: [],
          pollingInterval: 5000,
        }
      : options

  const { contractAddress, abi, eventNames, pollingInterval = 5000 } = config

  const parseEventLog = useCallback(
    (log: any): ContractEvent | null => {
      try {
        // Find matching event in ABI
        const eventAbi = abi.find((item) => {
          if (item.type !== "event") return false
          if (eventNames && !eventNames.includes(item.name)) return false
          return true
        })

        if (!eventAbi) return null

        return {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: eventAbi.name,
          address: log.address,
          data: log.data,
          timestamp: Date.now(), // In production, fetch block timestamp
          txHash: log.transactionHash,
          blockNumber: Number.parseInt(log.blockNumber, 16),
        }
      } catch (error) {
        console.error("Error parsing event log:", error)
        return null
      }
    },
    [abi, eventNames],
  )

  const fetchEvents = useCallback(async () => {
    if (!window.ethereum || !contractAddress || abi.length === 0) return

    try {
      const latestBlock = await window.ethereum.request({
        method: "eth_blockNumber",
        params: [],
      })

      // Get logs from last 100 blocks
      const fromBlock = `0x${Math.max(0, Number.parseInt(latestBlock, 16) - 100).toString(16)}`

      const logs = await window.ethereum.request({
        method: "eth_getLogs",
        params: [
          {
            address: contractAddress,
            fromBlock,
            toBlock: "latest",
          },
        ],
      })

      const parsedEvents = logs
        .map((log: any) => parseEventLog(log))
        .filter((event: ContractEvent | null): event is ContractEvent => event !== null)
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .slice(0, 10)

      setEvents(parsedEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }, [contractAddress, abi, parseEventLog])

  useEffect(() => {
    if (!isConnected) {
      setIsListening(false)
      return
    }

    setIsListening(true)

    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const eventTypes = ["Minted", "Voted", "RewardsClaimed"]
        const mockEvent: ContractEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          address: `0x${Math.random().toString(16).substr(2, 40)}`,
          data: {},
          timestamp: Date.now(),
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
        }
        setEvents((prev) => [mockEvent, ...prev].slice(0, 10))
      }
    }, pollingInterval)

    return () => {
      clearInterval(interval)
      setIsListening(false)
    }
  }, [isConnected, pollingInterval])

  const clearEvents = useCallback(() => setEvents([]), [])

  const addEvent = useCallback((event: ContractEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 10))
  }, [])

  const refetch = useCallback(() => {
    console.log("[v0] Refreshing events...")
  }, [])

  return {
    events,
    isListening,
    clearEvents,
    addEvent,
    refetch,
  }
}
