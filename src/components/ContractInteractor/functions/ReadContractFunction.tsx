import React, { useState } from "react";
import { renderFunctionInputs } from "@/utils/contractHelper";
import { useAccount, useReadContract } from "wagmi";
import { AbiFunction } from "viem";

interface ReadContractFunctionProps {
  func: AbiFunction;
  contract: `0x${string}`;
}

const ReadContractFunction: React.FC<ReadContractFunctionProps> = ({ func, contract }) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});

  const { chainId } = useAccount();

  console.log("custom read contract called");
  const {
    data: readData,
    error: readError,
    isLoading: readIsLoading,
    refetch: readRefetch,
  } = useReadContract({
    address: contract,
    abi: [func],
    functionName: func.name,
    args: Object.values(inputs),
    chainId,
    query: {
      enabled: false,
    },
  });

  console.log("readdaata is", readData);

  return (
    <div className="mb-4">
      <div className="text-sm font-semibold mb-2 text-white">{func.name}</div>
      {func.inputs && func.inputs.length > 0 && renderFunctionInputs(func, inputs, setInputs)}
      <button
        onClick={() => readRefetch()}
        className={`border p-2 mb-2 rounded border-yellow-600 hover:bg-yellow-600 text-white focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 active:scale-95`}
      >
        Call {func.name}
      </button>
      <>
        {readIsLoading && <p className="text-yellow-500">Loading...</p>}
        {readError && <p className="text-red-500">Error: {readError.message}</p>}
      </>

      {readData !== undefined && readData !== null && (
        <p className="text-green-500 break-all w-full">{String(readData)}</p>
      )}
    </div>
  );
};

export default ReadContractFunction;
