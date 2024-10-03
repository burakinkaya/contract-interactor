import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { isAddress } from "viem";
import { zamaDevnet } from "@/config/networks";

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

      try {
        const response = await axios.get("/api/contractExist", {
          params: {
            contractAddress,
            chainId,
          },
        });

        const { exists } = response.data;

        if (Number(chainId) === zamaDevnet.chainId) {
          toast.info(
            "Assuming contract exists on Zama network, because Zama doesn't yet have an explorer to check contract existence😳"
          );
        }

        if (exists) {
          setExists(true);
        } else {
          setExists(false);
          toast.error("Contract does not exist.");
        }
      } catch (error: Error | any) {
        const errorMessage = error.response?.data?.error || "Error checking contract existence.";
        toast.error(errorMessage);
        setExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkContractExist();
  }, [contractAddress, chainId]);

  return { loading, exists };
};
