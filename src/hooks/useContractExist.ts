import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { isAddress } from "viem";

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

        if (chainId === 9000) {
          toast.info(
            "Assuming contract exists on Zama network, because Zama has not even an explorer to check contract existence😳"
          );
        }

        if (exists) {
          setExists(true);
        } else {
          setExists(false);
          toast.error("Contract does not exist.");
        }
      } catch (error: any) {
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
