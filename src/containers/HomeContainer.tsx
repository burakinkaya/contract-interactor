"use client";

import Input from "@/components/Input";
import { useState, useEffect } from "react";
import { isAddress, Abi } from "viem";

import { getInputMessageColor, validateAbi } from "@/utils/utils";
import { useContractExist } from "@/hooks/useContractExist";
import { useContractVerified } from "@/hooks/useContractVerified";
import ContractInteractor from "@/components/ContractInteractor/ContractInteractor";
import { useAccount } from "wagmi";

const emptyAbi: Abi = [];
const HomeContainer = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [userAbi, setUserAbi] = useState<string | null>(null);
  const [validAbi, setValidAbi] = useState<boolean>(false);

  const { chainId } = useAccount();

  const { exists, loading: loadingExist } = useContractExist(contractAddress, chainId!);
  const { verified, loading: loadingVerified, abi } = useContractVerified(contractAddress, chainId!, exists === true);

  useEffect(() => {
    if (contractAddress) {
      if (isAddress(contractAddress)) {
        if (loadingExist) {
          setInputMessage("Searching for the contract...");
        } else if (exists !== null) {
          if (exists) {
            setInputMessage("Contract exists. Verifying ABI...");
          } else {
            setInputMessage("Contract does not exist");
          }
        }
      } else {
        setInputMessage("Wrong Address!");
      }
    } else {
      setInputMessage("");
    }
  }, [contractAddress, loadingExist, exists]);

  useEffect(() => {
    if (exists && !loadingVerified && verified !== null) {
      setInputMessage(
        verified
          ? "Contract is verified, below you can interact with the contract"
          : "ABI Not Found, Contract source code not verified. Enter your ABI if it is available."
      );
    }
  }, [loadingVerified, verified, exists]);

  useEffect(() => {
    if (userAbi) {
      setValidAbi(validateAbi(userAbi));
    }
  }, [userAbi]);

  return (
    <div className="flex flex-col min-h-screen w-full text-black gap-10">
      <h1 className="text-3xl font-bold mb-4 self-center text-white">Contract Interactor</h1>

      <div className="flex flex-col self-center gap-2 w-fit mb-6 items-center">
        <h2 className="text-white">Please enter your contract address</h2>
        <Input
          type="text"
          value={contractAddress}
          onChange={(e) => {
            setContractAddress(e.target.value);
            setUserAbi(null);
          }}
          placeholder="0xabc"
        />

        {inputMessage && <p className={`text-sm ${getInputMessageColor(inputMessage)}`}>{inputMessage}</p>}
      </div>

      {exists && !loadingVerified && verified === false && !abi && (
        <div className="flex flex-col self-center gap-2 w-1/3 mb-6 items-center">
          <h2 className="text-white">Please enter your contract ABI</h2>
          <textarea
            className="p-2 border bg-transparent text-white border-gray-300 rounded w-full text-sm"
            value={userAbi || ""}
            onChange={(e) => setUserAbi(e.target.value)}
            placeholder='[{"method": "transfer"}]'
            rows={4}
          />
          {!validAbi && userAbi && <p className="text-red-500 text-sm">Invalid ABI!</p>}
          {validAbi && userAbi && (
            <p className="text-green-500 text-sm">ABI is valid, below you can interact with the contract</p>
          )}
        </div>
      )}

      {(verified && abi) || (validAbi && userAbi) ? (
        <ContractInteractor
          contract={contractAddress as `0x${string}`}
          abi={verified ? abi! : validateAbi(userAbi!) ? JSON.parse(userAbi!) : emptyAbi}
          chainId={chainId!}
        />
      ) : null}
    </div>
  );
};

export default HomeContainer;
