import React from "react";
import { Abi } from "viem";

import ReadContractFunction from "./functions/ReadContractFunction";
import WriteContractFunction from "./functions/WriteContractFunction";

interface ContractInteractorProps {
  abi: Abi;
  contract: `0x${string}`;
}

const ContractInteractor: React.FC<ContractInteractorProps> = ({ abi, contract }) => {
  return (
    <div className="flex flex-row justify-between gap-10 w-full">
      {/* Read Functions */}
      <div className="flex flex-col items-start justify-start gap-4 w-1/2">
        <h2 className="text-xl font-bold text-white">Read Contract</h2>
        {abi
          .filter((item: any) => item.type === "function" && item.stateMutability === "view")
          .map((func: any, index: number) => (
            <ReadContractFunction key={index} func={func} contract={contract} />
          ))}
      </div>

      <div className="border border-white rounded-md"></div>

      {/* Write Functions */}
      <div className="flex flex-col items-start justify-start gap-4 w-1/2">
        <h2 className="text-xl font-bold text-white">Write Contract</h2>
        {abi
          .filter((item: any) => item.type === "function" && item.stateMutability !== "view")
          .map((func: any, index: number) => (
            <WriteContractFunction key={index} func={func} contract={contract} />
          ))}
      </div>
    </div>
  );
};

export default ContractInteractor;
