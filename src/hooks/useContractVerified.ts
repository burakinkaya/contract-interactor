import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { networks } from "@/config/networks";

export const useContractVerified = (contractAddress: string, chainId: number, shouldCheck: boolean) => {
  const [loading, setLoading] = useState(false);
  const [abi, setAbi] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkContractVerified = async () => {
      if (!contractAddress || !shouldCheck) {
        setVerified(null);
        setAbi(null);
        return;
      }

      setLoading(true);
      const selectedNetwork = networks[chainId];

      try {
        let response;

        if (chainId === 8008135) {
          response = await axios.get(`${selectedNetwork.url}/v2/smart-contracts/${contractAddress}`);

          const fhenixAbi = response.data.abi || [];

          if (fhenixAbi.length > 0) {
            setVerified(response.data.is_verified);
            setAbi(JSON.stringify(fhenixAbi));
            console.log("Fhenix ABI:", fhenixAbi);
            toast.success("Contract ABI fetched from Fhenix!");
          } else {
            setVerified(false);
            toast.error("No ABI found for this contract on Fhenix.");
          }
        } else {
          response = await axios.get(
            `${selectedNetwork.url}?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
          );

          const { status, message, result } = response.data;

          if (status === "1" && message === "OK") {
            setVerified(true);
            setAbi(result);
            console.log(result);
            toast.success("Contract ABI fetched successfully!");
          } else {
            setVerified(false);
            toast.error("ABI Not Found, Contract source code not verified. Enter your ABI if it is available.");
          }
        }
      } catch (error) {
        toast.error("Error checking contract verification.");
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkContractVerified();
  }, [contractAddress, shouldCheck, chainId]);

  return { loading, verified, abi };
};
