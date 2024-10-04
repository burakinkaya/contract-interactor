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
  const [parsedAbi, setParsedAbi] = useState<Abi>([]);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [functionResults, setFunctionResults] = useState<Record<string, any>>({});
  const [isPending, setIsPending] = useState<boolean>(false);
  const [inputArgs, setInputArgs] = useState<any[]>([]);

  const { address: account } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  const selectedNetwork = networks[chainId!];

  const {
    data: readData,
    error: readError,
    isLoading: readIsLoading,
  } = useReadContract({
    address: contract,
    abi: parsedAbi,
    functionName: selectedFunction!,
    args: inputArgs,
    chainId,
  }) as { data: bigint | number | string | any[] | null; error: any; isLoading: boolean; refetch: () => void };

  const handleReadFunctionCall = (func: any, inputs: any[]) => {
    console.log("custom read contract called");
    setSelectedFunction(func.name);
    setInputArgs(inputs);
  };

  const handleWriteFunctionCall = async (func: any, inputs: any[]) => {
    console.log("custom write contract called");
    setSelectedFunction(func.name);
    setInputArgs(inputs);

    const formattedArgs = Array.isArray(inputs) ? inputs : Object.values(inputs);

    setIsPending(true);
    try {
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
    let parsed = [];
    try {
      parsed = typeof abi === "string" ? JSON.parse(abi) : abi;
    } catch (error) {
      console.error("Failed to parse ABI");
    }
    if (Array.isArray(parsed)) {
      setParsedAbi(parsed);
    }
  }, [abi]);

  useEffect(() => {
    if (selectedFunction && readData !== undefined && readData !== null) {
      setFunctionResults((prevResults) => ({
        ...prevResults,
        [selectedFunction]: `${readData}`,
      }));
    }
  }, [readData, selectedFunction]);

  const readProps = { isLoading: readIsLoading, isError: readError, functionResults, selectedFunction };
  const writeProps = { isLoading: isPending, selectedFunction };

  return (
    <div className="flex flex-row justify-between gap-10 w-full">
      {/* Read Functions */}
      <div className="flex flex-col items-start justify-start gap-4 w-1/2">
        <h2 className="text-xl font-bold text-white">Read Contract</h2>
        {parsedAbi
          .filter((item: any) => item.type === "function" && item.stateMutability === "view")
          .map((func: any, index: number) => (
            <ReadContractFunction key={index} func={func} handleFunctionCall={handleReadFunctionCall} {...readProps} />
          ))}
      </div>

      <div className="border border-white rounded-md"></div>

      {/* Write Functions */}
      <div className="flex flex-col items-start justify-start gap-4 w-1/2">
        <h2 className="text-xl font-bold text-white">Write Contract</h2>
        {parsedAbi
          .filter((item: any) => item.type === "function" && item.stateMutability !== "view")
          .map((func: any, index: number) => (
            <WriteContractFunction
              key={index}
              func={func}
              handleFunctionCall={handleWriteFunctionCall}
              {...writeProps}
            />
          ))}
      </div>
    </div>
  );
};

export default ContractInteractor;
