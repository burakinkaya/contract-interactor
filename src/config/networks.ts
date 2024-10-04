import {
  getExistWithFallback,
  getAbiWithFallback,
  getAbiFromBlockscoutishApi,
  getExistFromBlockscoutishApi,
} from "@/utils/utils";
import { CaipNetwork } from "@reown/appkit";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!;

if (!ETHERSCAN_API_KEY) {
  throw new Error("Missing ETHERSCAN_API_KEY in environment variables. Please set it in .env file");
}

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
  explorerUrl: "https://explorer.helium.fhenix.zone",
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

export const networks: Record<
  number,
  {
    name: string;
    primaryUrl: string;
    explorer?: string;
    secondaryUrl?: string;
    getAbi: (contractAddress: string) => Promise<any>;
    getExist: (contractAddress: string) => Promise<boolean>;
  }
> = {
  11155420: {
    name: "Optimism Sepolia",
    primaryUrl: "https://api-sepolia-optimistic.etherscan.io/api",
    explorer: "https://sepolia-optimism.etherscan.io",
    secondaryUrl: "https://optimism-sepolia.blockscout.com/api",
    getAbi(contractAddress: string) {
      return getAbiWithFallback(this.primaryUrl, this.secondaryUrl!, contractAddress);
    },
    getExist(contractAddress: string) {
      return getExistWithFallback(this.primaryUrl, this.secondaryUrl!, contractAddress);
    },
  },
  421614: {
    name: "Arbitrum Sepolia",
    primaryUrl: "https://api-sepolia.arbiscan.io/api",
    explorer: "https://sepolia.arbiscan.io",
    secondaryUrl: "https://arbitrum-sepolia.blockscout.com/api",
    getAbi(contractAddress: string) {
      return getAbiWithFallback(this.primaryUrl, this.secondaryUrl!, contractAddress);
    },
    getExist(contractAddress: string) {
      return getExistWithFallback(this.primaryUrl, this.secondaryUrl!, contractAddress);
    },
  },
  84532: {
    name: "Base Sepolia",
    primaryUrl: "https://api-sepolia.basescan.org/api",
    explorer: "https://sepolia.basescan.org",
    secondaryUrl: "https://base-sepolia.blockscout.com/api",
    getAbi(contractAddress: string) {
      return getAbiWithFallback(this.primaryUrl, this.secondaryUrl!, contractAddress);
    },
    getExist(contractAddress: string) {
      return getExistWithFallback(this.primaryUrl, this.secondaryUrl!, contractAddress);
    },
  },
  11155111: {
    name: "Ethereum Sepolia",
    primaryUrl: "https://api-sepolia.etherscan.io/api",
    explorer: "https://sepolia.etherscan.io",
    secondaryUrl: "https://sepolia.blockscout.com/api",
    getAbi(contractAddress: string) {
      return getAbiWithFallback(this.primaryUrl, this.secondaryUrl!, contractAddress, ETHERSCAN_API_KEY);
    },
    getExist(contractAddress: string) {
      return getExistWithFallback(this.primaryUrl, this.secondaryUrl!, contractAddress, ETHERSCAN_API_KEY);
    },
  },
  9000: {
    name: "Zama Devnet",
    primaryUrl: "https://explorer.devnet.zama.ai",
    async getAbi(contractAddress: string) {
      return Promise.resolve([]);
    },
    getExist(contractAddress: string) {
      return Promise.resolve(true);
    },
  },
  8008135: {
    name: "Fhenix Devnet",
    primaryUrl: "https://explorer.helium.fhenix.zone/api",
    explorer: "https://explorer.helium.fhenix.zone",
    async getAbi(contractAddress: string) {
      return getAbiFromBlockscoutishApi(this.primaryUrl, contractAddress);
    },
    async getExist(contractAddress: string) {
      return getExistFromBlockscoutishApi(this.primaryUrl, contractAddress);
    },
  },
};
