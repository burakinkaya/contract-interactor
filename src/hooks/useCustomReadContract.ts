import { toast } from "react-toastify";
import { Abi } from "viem";
import { useReadContract } from "wagmi";

export const useCustomReadContract = (
  address: `0x${string}`,
  abi: Abi,
  functionName: string,
  args: any[],
  chainId: number,
  decimals: number = 18
) => {
  const formattedArgs = Array.isArray(args) ? args : Object.values(args || {});

  console.log("custom read contract called");

  const { data, error, isLoading } = useReadContract({
    address,
    abi,
    functionName,
    args: formattedArgs,
    chainId,
  });

  const formatBigInt = (value: bigint) => {
    return Number(value) / 10 ** decimals;
  };

  const formattedData = data && typeof data === "bigint" ? formatBigInt(data) : data;

  if (error) {
    toast.error(`Something went wrong: ${error.message}`);
  }

  return { data: formattedData, error, isLoading };
};
