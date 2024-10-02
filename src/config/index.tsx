import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage, http } from "@wagmi/core";
import { mainnet, sepolia, baseSepolia } from "@reown/appkit/networks";
import { optimismSepolia, arbitrumSepolia, fhenixHelium, zamaDevnet } from "./networks";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const networks = [mainnet, sepolia, baseSepolia, optimismSepolia, arbitrumSepolia, zamaDevnet, fhenixHelium];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
