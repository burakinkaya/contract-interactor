import { CaipNetwork } from "@reown/appkit";

export const zamaDevnet = {
  id: "eip155:9000",
  chainId: 9000,
  name: "Zama Devnet",
  currency: "ZAMA",
  rpcUrl: "https://devnet.zama.ai",
  explorerUrl: "https://explorer.devnet.zama.ai",
  chainNamespace: "eip155",
} as const satisfies CaipNetwork;

export const fhenixHelium = {
  id: "eip155:8008135",
  chainId: 8008135,
  name: "Fhenix Helium",
  currency: "tFHE",
  rpcUrl: "https://api.helium.fhenix.zone",
  explorerUrl: "ttps://explorer.helium.fhenix.zone",
  chainNamespace: "eip155",
} as const satisfies CaipNetwork;

export const optimismSepolia = {
  id: "eip155:11155420",
  chainId: 11155420,
  name: "Optimism Sepolia",
  currency: "ETH",
  rpcUrl: "https://sepolia.optimism.io",
  explorerUrl: "https://sepolia-optimism.etherscan.io",
  chainNamespace: "eip155",
} as const satisfies CaipNetwork;

export const arbitrumSepolia = {
  id: "eip155:421614",
  chainId: 421614,
  name: "Arbitrum Sepolia",
  currency: "ETH",
  rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
  explorerUrl: "https://sepolia.arbiscan.io",
  chainNamespace: "eip155",
} as const satisfies CaipNetwork;

export const networks: Record<number, { name: string; url: string; explorer?: string }> = {
  11155420: {
    name: "Optimism Sepolia",
    url: "https://api-sepolia-optimistic.etherscan.io/api",
    explorer: "https://sepolia-optimism.etherscan.io",
  },
  84532: {
    name: "Base Sepolia",
    url: "https://api-sepolia.basescan.org/api",
    explorer: "https://sepolia.basescan.org",
  },
  421614: {
    name: "Arbitrum Sepolia",
    url: "https://api-sepolia.arbiscan.io/api",
    explorer: "https://sepolia.arbiscan.io",
  },
  11155111: {
    name: "Ethereum Sepolia",
    url: "https://api-sepolia.etherscan.io/api",
    explorer: "https://sepolia.etherscan.io",
  },
  9000: {
    name: "Zama Devnet",
    url: "https://explorer.devnet.zama.ai",
  },
  8008135: {
    name: "Fhenix Devnet",
    url: "https://explorer.helium.fhenix.zone/api",
    explorer: "https://explorer.helium.fhenix.zone",
  },
};
