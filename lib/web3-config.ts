export const BASE_CHAIN_ID = 8453
export const BASE_TESTNET_CHAIN_ID = 84532

export const NETWORKS = {
  base: {
    id: BASE_CHAIN_ID,
    name: "Base",
    network: "base",
    nativeCurrency: {
      decimals: 18,
      name: "Ethereum",
      symbol: "ETH",
    },
    rpcUrls: {
      default: { http: ["https://mainnet.base.org"] },
      public: { http: ["https://mainnet.base.org"] },
    },
    blockExplorers: {
      default: { name: "BaseScan", url: "https://basescan.org" },
    },
  },
  baseTestnet: {
    id: BASE_TESTNET_CHAIN_ID,
    name: "Base Sepolia",
    network: "base-sepolia",
    nativeCurrency: {
      decimals: 18,
      name: "Ethereum",
      symbol: "ETH",
    },
    rpcUrls: {
      default: { http: ["https://sepolia.base.org"] },
      public: { http: ["https://sepolia.base.org"] },
    },
    blockExplorers: {
      default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
    },
  },
}

// Example NFT contract ABI (simplified)
export const NFT_CONTRACT_ABI = [
  {
    inputs: [{ name: "to", type: "address" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "Minted",
    type: "event",
  },
] as const

// Example DAO contract ABI (simplified)
export const DAO_CONTRACT_ABI = [
  {
    inputs: [{ name: "proposalId", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "voter", type: "address" },
      { indexed: true, name: "proposalId", type: "uint256" },
    ],
    name: "Voted",
    type: "event",
  },
] as const

// Example Rewards contract ABI (simplified)
export const REWARDS_CONTRACT_ABI = [
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "pendingRewards",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "RewardsClaimed",
    type: "event",
  },
] as const

// Example contract addresses (replace with real addresses)
export const CONTRACT_ADDRESSES = {
  nft: "0x1234567890123456789012345678901234567890",
  dao: "0x2345678901234567890123456789012345678901",
  rewards: "0x3456789012345678901234567890123456789012",
}
