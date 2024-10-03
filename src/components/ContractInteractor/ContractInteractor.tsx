import React, { useEffect, useState } from "react";

import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useReadContract, useWriteContract } from "wagmi";
import { Abi } from "viem";
import { toast } from "react-toastify";
import { networks } from "@/config/networks";
import { showSuccessToast } from "@/utils/toastUtils";

import ReadContractFunction from "./functions/ReadContractFunction";
import WriteContractFunction from "./functions/WriteContractFunction";

interface ContractInteractorProps {
  abi: Abi;
  contract: `0x${string}`;
  chainId: number;
}

const ContractInteractor: React.FC<ContractInteractorProps> = ({ abi, contract, chainId }) => {
  let parsedAbi;
  try {
    parsedAbi = typeof abi === "string" ? JSON.parse(abi) : abi;
  } catch (error) {
    parsedAbi = [];
  }

  if (!Array.isArray(parsedAbi)) {
    parsedAbi = [];
  }

  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<any>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [inputArgs, setInputArgs] = useState<any[]>([]);

  const { address: account } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  const selectedNetwork = networks[chainId!];

  const readFunctions = parsedAbi.filter((item: any) => item.type === "function" && item.stateMutability === "view");
  const writeFunctions = parsedAbi.filter((item: any) => item.type === "function" && item.stateMutability !== "view");

  const {
    data: readData,
    error: readError,
    isLoading: readIsLoading,
    refetch: refetchRead,
  } = useReadContract({
    address: contract,
    abi: parsedAbi,
    functionName: selectedFunction,
    args: inputArgs,
    chainId,
  }) as { data: bigint | number | string | any[] | null; error: any; isLoading: boolean; refetch: () => void };

  const handleReadFunctionCall = (func: any, inputs: any[]) => {
    console.log("custom read contract called");
    setSelectedFunction(func.name);
    setInputArgs(inputs);
    refetchRead();
  };

  const handleWriteFunctionCall = async (func: any, inputs: any[]) => {
    console.log("custom write contract called");

    setSelectedFunction(func.name);
    setInputArgs(inputs);

    const formattedArgs = Array.isArray(inputs) ? inputs : Object.values(inputs);

    try {
      setIsPending(true);
      const hash = await writeContractAsync({
        account,
        chainId,
        address: contract,
        abi: parsedAbi,
        functionName: func.name,
        args: formattedArgs,
      });
      await waitForTransactionReceipt(config, { hash, confirmations: 2 });
      showSuccessToast(hash, selectedNetwork);
    } catch (error: Error | any) {
      const errorMessage = error.message.split("\n")[0];
      console.error(`Transaction failed, ${errorMessage}`);
      toast.error(`Transaction failed, ${errorMessage}`);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    console.log("readData:", readData);

    if (readData !== undefined && readData !== null && selectedFunction) {
      if (typeof readData === "bigint") {
        setCurrentData(readData.toString(10));
      } else if (typeof readData === "number") {
        setCurrentData(readData.toString());
      } else if (typeof readData === "string") {
        setCurrentData(readData);
      } else if (Array.isArray(readData)) {
        const formattedArray = readData.map((item) => (typeof item === "bigint" ? item.toString(10) : item));
        setCurrentData(JSON.stringify(formattedArray));
      } else {
        setCurrentData(
          JSON.stringify(readData, (key, value) => (typeof value === "bigint" ? value.toString(10) : value))
        );
      }
    }
  }, [readData, selectedFunction]);

  return (
    <div className="flex flex-row justify-between gap-10 w-full">
      {/* Read Functions */}
      <div className="flex flex-col items-start justify-start gap-4 w-1/2">
        <h2 className="text-xl font-bold text-white">Read Contract</h2>
        {readFunctions.map((func: any, index: number) => (
          <ReadContractFunction
            key={index}
            func={func}
            handleFunctionCall={handleReadFunctionCall}
            isLoading={readIsLoading}
            isError={readError}
            currentData={currentData}
            selectedFunction={selectedFunction}
          />
        ))}
      </div>

      <div className="border border-white rounded-md"></div>

      {/* Write Functions */}
      <div className="flex flex-col items-start justify-start gap-4 w-1/2">
        <h2 className="text-xl font-bold text-white">Write Contract</h2>
        {writeFunctions.map((func: any, index: number) => (
          <WriteContractFunction
            key={index}
            func={func}
            handleFunctionCall={handleWriteFunctionCall}
            isLoading={isPending}
            isError={null}
            selectedFunction={selectedFunction}
          />
        ))}
      </div>
    </div>
  );
};

export default ContractInteractor;
