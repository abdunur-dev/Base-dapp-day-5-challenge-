"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEvents } from "@/lib/hooks/use-events"
import { Button } from "@/components/ui/button"
import { Trash2, Activity, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CONTRACT_ADDRESSES, NFT_CONTRACT_ABI, DAO_CONTRACT_ABI, REWARDS_CONTRACT_ABI } from "@/lib/web3-config"
import { useMemo } from "react"

export function EventLog() {
  const combinedAbi = useMemo(() => [...NFT_CONTRACT_ABI, ...DAO_CONTRACT_ABI, ...REWARDS_CONTRACT_ABI], [])

  const { events, clearEvents, isListening, refetch } = useEvents({
    contractAddress: CONTRACT_ADDRESSES.nft,
    abi: combinedAbi,
    pollingInterval: 5000,
  })

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "Minted":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Voted":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "RewardsClaimed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "Minted":
        return "🎨"
      case "Voted":
        return "🗳️"
      case "RewardsClaimed":
        return "🎁"
      default:
        return "📝"
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-foreground">Live Event Monitor</CardTitle>
                <Badge variant="outline" className={isListening ? "text-green-500" : "text-muted-foreground"}>
                  {isListening ? (
                    <>
                      <Wifi className="w-3 h-3 mr-1" />
                      Live
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 mr-1" />
                      Offline
                    </>
                  )}
                </Badge>
              </div>
              <CardDescription className="text-muted-foreground">Real-time blockchain events</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {events.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearEvents}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No events yet</p>
              <p className="text-sm text-muted-foreground mt-1">Events will appear here when transactions occur</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="text-2xl">{getEventIcon(event.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={getEventColor(event.type)}>
                        {event.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</span>
                      <Badge variant="outline" className="text-xs">
                        Block #{event.blockNumber}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground">
                        Address: <span className="font-mono text-primary">{formatAddress(event.address)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">Tx: {formatAddress(event.txHash)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
