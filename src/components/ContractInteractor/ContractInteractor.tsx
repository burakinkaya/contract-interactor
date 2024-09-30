import React, { useCallback, useEffect, useState } from "react";
import Input from "../Input";
import { useCustomReadContract } from "@/hooks/useCustomReadContract";
import useCustomWriteContract from "@/hooks/useCustomWriteContract";
import { polygon } from "viem/chains";

interface ContractInteractorProps {
  abi: string;
  contract: `0x${string}`;
}

const ContractInteractor: React.FC<ContractInteractorProps> = ({ abi, contract }) => {
  const parsedAbi = JSON.parse(abi);

  const readFunctions = parsedAbi.filter((item: any) => item.type === "function" && item.stateMutability === "view");
  const writeFunctions = parsedAbi.filter((item: any) => item.type === "function" && item.stateMutability !== "view");

  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentData, setCurrentData] = useState<any>(null);
  const [isWriteTriggered, setIsWriteTriggered] = useState<boolean>(false);
  const [shouldReadFetch, setShouldReadFetch] = useState<boolean>(false);

  const {
    data: readData,
    error: readError,
    isLoading: readIsLoading,
  } = useCustomReadContract(
    contract,
    parsedAbi,
    shouldReadFetch ? selectedFunction || "" : "",
    formData[selectedFunction || ""] || [],
    polygon.id
  );

  const { writeFunction, isPending } = useCustomWriteContract(
    contract,
    parsedAbi,
    selectedFunction || "",
    formData[selectedFunction || ""] || []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, funcName: string, inputName: string) => {
    const value = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [funcName]: {
        ...prevData[funcName],
        [inputName]: value,
      },
    }));
  };

  const handleReadFunctionCall = useCallback((func: any) => {
    setSelectedFunction(func.name);
    setShouldReadFetch(true);
    setIsWriteTriggered(false);
  }, []);

  const handleWriteFunctionCall = (func: any) => {
    setSelectedFunction(func.name);
    setShouldReadFetch(false);
    setIsWriteTriggered(true);
  };

  useEffect(() => {
    const executeWriteFunction = async () => {
      if (isWriteTriggered && !isPending && selectedFunction) {
        await writeFunction();
        setIsWriteTriggered(false);
      }
    };

    executeWriteFunction();
  }, [selectedFunction, isWriteTriggered]);

  useEffect(() => {
    if (readData !== undefined && readData !== null && selectedFunction) {
      if (typeof readData === "bigint") {
        setCurrentData(readData.toString(10));
      } else {
        setCurrentData(readData);
      }
    }
  }, [readData, selectedFunction]);

  const renderFunctionInputs = (func: any) => {
    return func.inputs.map((input: any, index: number) => (
      <Input
        key={index}
        type="text"
        placeholder={input.name || input.internalType}
        onChange={(e) => handleInputChange(e, func.name, input.name)}
        className="border p-2 mb-4 w-full"
      />
    ));
  };

  return (
    <div className="flex flex-row justify-between gap-10 w-full ">
      <div className="flex flex-col items-start justify-start gap-4 w-1/2">
        <h2 className="text-xl font-bold text-white">Read Contract</h2>
        <div className="border border-white rounded-md w-full"></div>
        {readFunctions.map((func: any, index: number) => (
          <div key={index} className="mb-4">
            <div className="text-sm font-semibold mb-2 text-white">{func.name}</div>
            {renderFunctionInputs(func)}
            <button
              onClick={() => handleReadFunctionCall(func)}
              className="border border-yellow-600 text-white p-2 mb-2 rounded hover:bg-yellow-600 focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 active:scale-95"
            >
              Call {func.name}
            </button>
            {selectedFunction === func.name && !readIsLoading && !readError && currentData && (
              <div>
                <p className="text-green-500">{currentData}</p>
              </div>
            )}
            {selectedFunction === func.name && readIsLoading && <p className="text-yellow-500">Loading...</p>}
            {selectedFunction === func.name && readError && <p className="text-red-500">Error: {readError.message}</p>}
          </div>
        ))}
      </div>

      <div className="border border-white rounded-md"></div>

      {/* Write Contract Section */}
      <div className="flex flex-col items-start justify-start gap-4 w-1/2">
        <h2 className="text-xl font-bold text-white">Write Contract</h2>
        <div className="border border-white rounded-md w-full"></div>
        {writeFunctions.map((func: any, index: number) => (
          <div key={index} className="mb-4">
            <div className="text-sm font-semibold mb-2 text-white">{func.name}</div>
            {renderFunctionInputs(func)}
            <button
              onClick={() => handleWriteFunctionCall(func)}
              className="border border-green-600 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 active:scale-95"
            >
              Call {func.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractInteractor;
