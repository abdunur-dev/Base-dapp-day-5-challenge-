"use client"

import { ContractActionCard } from "@/components/contract-action-card"
import { ContractReadDisplay } from "@/components/contract-read-display"
import { EventLog } from "@/components/event-log"
import { CONTRACT_ADDRESSES, NFT_CONTRACT_ABI, DAO_CONTRACT_ABI, REWARDS_CONTRACT_ABI } from "@/lib/web3-config"
import { Coins, Vote, Gift, Package, Users, Trophy } from "lucide-react"

export function DAppContent() {
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8 md:py-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live on Base
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Advanced Wallet UX + Fullstack dApp
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty px-4">
              Connect your wallet and interact with smart contracts on Base. Mint NFTs, vote on proposals, and claim
              rewards.
            </p>
          </div>

          {/* Contract Read Displays Section */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Contract Data</h2>
              <p className="text-sm md:text-base text-muted-foreground">View real-time data from smart contracts</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <ContractReadDisplay
                title="Total NFTs"
                description="Total minted NFTs"
                icon={<Package className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                contractAddress={CONTRACT_ADDRESSES.nft}
                abi={NFT_CONTRACT_ABI}
                functionName="totalSupply"
              />

              <ContractReadDisplay
                title="Active Proposals"
                description="DAO proposals count"
                icon={<Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                contractAddress={CONTRACT_ADDRESSES.dao}
                abi={DAO_CONTRACT_ABI}
                functionName="proposalCount"
              />

              <ContractReadDisplay
                title="Your Rewards"
                description="Pending rewards balance"
                icon={<Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                contractAddress={CONTRACT_ADDRESSES.rewards}
                abi={REWARDS_CONTRACT_ABI}
                functionName="pendingRewards"
                format="eth"
              />
            </div>
          </div>

          {/* Contract Actions Grid */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Contract Actions</h2>
              <p className="text-sm md:text-base text-muted-foreground">Interact with smart contracts on Base</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <ContractActionCard
                title="Mint NFT"
                description="Mint a new NFT from the collection"
                icon={<Coins className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                contractAddress={CONTRACT_ADDRESSES.nft}
                abi={NFT_CONTRACT_ABI}
                functionName="mint"
                buttonText="Mint Now"
              />

              <ContractActionCard
                title="Vote on Proposal"
                description="Cast your vote on active DAO proposals"
                icon={<Vote className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                contractAddress={CONTRACT_ADDRESSES.dao}
                abi={DAO_CONTRACT_ABI}
                functionName="vote"
                requiresInput
                inputPlaceholder="Proposal ID (e.g., 1)"
                buttonText="Submit Vote"
              />

              <ContractActionCard
                title="Claim Rewards"
                description="Claim your pending rewards"
                icon={<Gift className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                contractAddress={CONTRACT_ADDRESSES.rewards}
                abi={REWARDS_CONTRACT_ABI}
                functionName="claim"
                buttonText="Claim Now"
              />
            </div>
          </div>

          {/* Event Log */}
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <EventLog />
          </div>

          {/* Info Section */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-8 animate-slide-up px-4 md:px-0"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="p-6 rounded-xl bg-card border border-border transition-smooth hover:border-primary/30 hover:shadow-lg">
              <h3 className="font-semibold text-foreground mb-2">Smart Contract ABIs</h3>
              <p className="text-sm text-muted-foreground">
                Read and write data from contracts using standardized ABIs
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border transition-smooth hover:border-primary/30 hover:shadow-lg">
              <h3 className="font-semibold text-foreground mb-2">Real-time Events</h3>
              <p className="text-sm text-muted-foreground">Monitor blockchain events as they happen in real-time</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border transition-smooth hover:border-primary/30 hover:shadow-lg">
              <h3 className="font-semibold text-foreground mb-2">Base Network</h3>
              <p className="text-sm text-muted-foreground">
                Built for the Base ecosystem with seamless wallet integration
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with abdu{dev}, shadcn/ui, and Base</p>
        </div>
      </footer>
    </>
  )
}
