import React, { useState } from "react";
import { renderFunctionInputs } from "@/utils/contractHelper";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { toast } from "react-toastify";
import { waitForTransactionReceipt } from "@wagmi/core";
import { showSuccessToast } from "@/utils/toastUtils";
import { AbiFunction } from "viem";
import { networks } from "@/config";

interface WriteContractFunctionProps {
  func: AbiFunction;
  contract: `0x${string}`;
}

const WriteContractFunction: React.FC<WriteContractFunctionProps> = ({ func, contract }) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});

  const { writeContractAsync, isPending } = useWriteContract();
  const config = useConfig();

  const { address: account, chainId } = useAccount();

  const handleWriteFunctionCall = async (func: any, inputs: any[]) => {
    console.log("custom write contract called");

    const formattedArgs = Array.isArray(inputs) ? inputs : Object.values(inputs);

    try {
      const hash = await writeContractAsync({
        account,
        chainId,
        address: contract,
        abi: [func],
        functionName: func.name,
        args: formattedArgs,
      });
      await waitForTransactionReceipt(config, { hash, confirmations: 2 });
      showSuccessToast(hash, networks.find((network) => network.chainId === chainId)!.explorerUrl);
    } catch (error: Error | any) {
      const errorMessage = error.message.split("\n")[0];
      console.error(`Transaction failed, ${errorMessage}`);
      toast.error(`Transaction failed, ${errorMessage}`);
    }
  };

  return (
    <div className="mb-4">
      <div className="text-sm font-semibold mb-2 text-white">{func.name}</div>
      {func.inputs && func.inputs.length > 0 && renderFunctionInputs(func, inputs, setInputs)}
      <button
        onClick={() => handleWriteFunctionCall(func, Object.values(inputs))}
        className={`border p-2 mb-2 rounded  border-green-600 hover:bg-green-600 text-white focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 active:scale-95`}
      >
        Call {func.name}
      </button>
      {<>{isPending && <p className="text-yellow-500">Loading...</p>}</>}
    </div>
  );
};

export default WriteContractFunction;
