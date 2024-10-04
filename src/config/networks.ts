import { getAbiFromEtherscanishApi, getExistFromEtherscanishApi } from "@/utils/utils";
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
    url: string;
    explorer?: string;
    getAbi: (contractAddress: string) => Promise<any>;
    getExist: (contractAddress: string) => Promise<boolean>;
  }
> = {
  11155420: {
    name: "Optimism Sepolia",
    url: "https://api-sepolia-optimistic.etherscan.io/api",
    explorer: "https://sepolia-optimism.etherscan.io",
    getAbi(contractAddress: string) {
      return getAbiFromEtherscanishApi(this.url, contractAddress);
    },
    getExist(contractAddress: string) {
      return getExistFromEtherscanishApi(this.url, contractAddress);
    },
  },
  421614: {
    name: "Arbitrum Sepolia",
    url: "https://api-sepolia.arbiscan.io/api",
    explorer: "https://sepolia.arbiscan.io",
    getAbi(contractAddress: string) {
      return getAbiFromEtherscanishApi(this.url, contractAddress);
    },
    getExist(contractAddress: string) {
      return getExistFromEtherscanishApi(this.url, contractAddress);
    },
  },
  84532: {
    name: "Base Sepolia",
    url: "https://api-sepolia.basescan.org/api",
    explorer: "https://sepolia.basescan.org",
    getAbi(contractAddress: string) {
      return getAbiFromEtherscanishApi(this.url, contractAddress);
    },
    getExist(contractAddress: string) {
      return getExistFromEtherscanishApi(this.url, contractAddress);
    },
  },
  11155111: {
    name: "Ethereum Sepolia",
    url: "https://api-sepolia.etherscan.io/api",
    explorer: "https://sepolia.etherscan.io",
    getAbi(contractAddress: string) {
      return getAbiFromEtherscanishApi(this.url, contractAddress, ETHERSCAN_API_KEY);
    },
    getExist(contractAddress: string) {
      return getExistFromEtherscanishApi(this.url, contractAddress, ETHERSCAN_API_KEY);
    },
  },
  9000: {
    name: "Zama Devnet",
    url: "https://explorer.devnet.zama.ai",
    async getAbi(contractAddress: string) {
      return Promise.resolve([]);
    },
    getExist(contractAddress: string) {
      return Promise.resolve(true);
    },
  },

  8008135: {
    name: "Fhenix Devnet",
    url: "https://explorer.helium.fhenix.zone/api",
    explorer: "https://explorer.helium.fhenix.zone",
    async getAbi(contractAddress: string) {
      const response = await fetch(`${this.url}/v2/smart-contracts/${contractAddress}`);
      const data = await response.json();
      if (data.abi) {
        return data.abi;
      }
      throw new Error("No ABI found for this contract on Fhenix");
    },
    async getExist(contractAddress: string) {
      const response = await fetch(`${this.url}/v2/addresses/${contractAddress}`);
      const data = await response.json();
      if (data.creation_tx_hash) {
        return true;
      }
      throw new Error("Contract does not exist on Fhenix");
    },
  },
};
