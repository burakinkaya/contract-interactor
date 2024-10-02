import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { isAddress } from "viem";
import { networks } from "@/config/networks";

export const useContractExist = (contractAddress: string, chainId: number) => {
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkContractExist = async () => {
      if (!contractAddress || !isAddress(contractAddress)) {
        setExists(null);
        return;
      }

      setLoading(true);
      const selectedNetwork = networks[chainId];

      try {
        let response;

        if (chainId === 8008135) {
          response = await axios.get(`${selectedNetwork.url}/v2/addresses/${contractAddress}`);
          const { creation_tx_hash } = response.data;
          if (creation_tx_hash) {
            setExists(true);
          } else {
            setExists(false);
            toast.error("Contract does not exist on Fhenix.");
          }
        } else if (chainId === 9000) {
          setExists(true);
          toast.info("Zama network doesn't have an endpoint or even an explorer😳, assuming contract exists.");
        } else {
          response = await axios.get(
            `${selectedNetwork.url}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
          );
          const { status, message } = response.data;

          if (status === "1" && message === "OK") {
            setExists(true);
          } else {
            setExists(false);
            toast.error("Contract does not exist.");
          }
        }
      } catch (error) {
        toast.error("Error checking contract existence.");
        setExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkContractExist();
  }, [contractAddress, chainId]);

  return { loading, exists };
};
