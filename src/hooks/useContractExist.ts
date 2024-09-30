import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { isAddress } from "viem";

export const useContractExist = (contractAddress: string) => {
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
        const [response] = await Promise.all([
          axios.get(
            `https://api.polygonscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY}`
          ),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);

        const { status, message } = response.data;

        if (status === "1" && message === "OK") {
          setExists(true);
        } else {
          setExists(false);
          toast.error("Contract does not exist.");
        }
      } catch (error) {
        toast.error("Error checking contract existence.");
        setExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkContractExist();
  }, [contractAddress]);

  return { loading, exists };
};
