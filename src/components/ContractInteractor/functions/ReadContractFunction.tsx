import React, { useState } from "react";
import { renderFunctionInputs } from "@/utils/contractHelper";

interface ReadContractFunctionProps {
  func: any;
  handleFunctionCall: (func: any, inputs: any[]) => void;
  isLoading: boolean;
  isError: any;
  currentData: any;
  selectedFunction: string | null;
}

const ReadContractFunction: React.FC<ReadContractFunctionProps> = ({
  func,
  handleFunctionCall,
  isLoading,
  isError,
  currentData,
  selectedFunction,
}) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});

  return (
    <div className="mb-4">
      <div className="text-sm font-semibold mb-2 text-white">{func.name}</div>
      {func.inputs && func.inputs.length > 0 && renderFunctionInputs(func, inputs, setInputs)}
      <button
        onClick={() => handleFunctionCall(func, Object.values(inputs))}
        className={`border p-2 mb-2 rounded border-yellow-600 hover:bg-yellow-600 text-white focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 active:scale-95`}
      >
        Call {func.name}
      </button>
      {selectedFunction === func.name && (
        <>
          {isLoading && <p className="text-yellow-500">Loading...</p>}
          {isError && <p className="text-red-500">Error: {isError.message}</p>}
          {currentData && !isLoading && <p className="text-green-500 break-all w-full">{currentData}</p>}
        </>
      )}
    </div>
  );
};

export default ReadContractFunction;
