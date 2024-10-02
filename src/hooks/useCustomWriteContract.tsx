import { useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { Abi } from "viem";
import { toast } from "react-toastify";
import { networks } from "@/config/networks";

const useCustomWriteContract = (contractAddress: `0x${string}`, abi: Abi, functionName: string, args: any[]) => {
  const { address: account, chainId } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  const selectedNetwork = networks[chainId!];

  const writeFunction = async () => {
    console.log("custom write contract called");

    const formattedArgs = Array.isArray(args) ? args : Object.values(args);

    try {
      setIsPending(true);
      const hash = await writeContractAsync({
        account,
        chainId,
        address: contractAddress,
        abi,
        functionName,
        args: formattedArgs,
      });
      await waitForTransactionReceipt(config, { hash, confirmations: 2 });

      showSuccessToast(hash, selectedNetwork);
    } catch (error: any) {
      const errorMessage = error.message.split("\n")[0];
      console.error(`Transaction failed, ${errorMessage}`);
      toast.error(`Transaction failed, ${errorMessage}`);
    } finally {
      setIsPending(false);
    }
  };

  return { writeFunction, isPending };
};

export const showSuccessToast = (hash: string, selectedNetwork: { explorer?: string }) => {
  const explorerUrl = selectedNetwork?.explorer ? `${selectedNetwork.explorer}/tx/${hash}` : null;
  toast.success(
    <div>
      Transaction successful! <br />
      {explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
          See transaction on explorer here
        </a>
      )}
    </div>
  );
};

export default useCustomWriteContract;
