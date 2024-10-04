import React, { useState } from "react";
import { renderFunctionInputs } from "@/utils/contractHelper";

interface WriteContractFunctionProps {
  func: any;
  handleFunctionCall: (func: any, inputs: any[]) => void;
  isLoading: boolean;
  selectedFunction: string | null;
}

const WriteContractFunction: React.FC<WriteContractFunctionProps> = ({
  func,
  handleFunctionCall,
  isLoading,
  selectedFunction,
}) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});

  return (
    <div className="mb-4">
      <div className="text-sm font-semibold mb-2 text-white">{func.name}</div>
      {func.inputs && func.inputs.length > 0 && renderFunctionInputs(func, inputs, setInputs)}
      <button
        onClick={() => handleFunctionCall(func, Object.values(inputs))}
        className={`border p-2 mb-2 rounded  border-green-600 hover:bg-green-600 text-white focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 active:scale-95`}
      >
        Call {func.name}
      </button>
      {selectedFunction === func.name && <>{isLoading && <p className="text-yellow-500">Loading...</p>}</>}
    </div>
  );
};

export default WriteContractFunction;
