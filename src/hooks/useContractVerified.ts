import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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

      try {
        const response = await axios.get("/api/contractVerified", {
          params: {
            contractAddress,
            chainId,
          },
        });

        const { verified, abi } = response.data;

        if (verified) {
          const parsedAbi = typeof abi === "string" ? JSON.parse(abi) : abi;
          setVerified(true);
          setAbi(parsedAbi);
          toast.success("Contract ABI fetched successfully!");
        } else {
          setVerified(false);
          toast.error("ABI not found or contract not verified.");
        }
      } catch (error: Error | any) {
        const errorMessage = error.response?.data?.error || "Error checking contract verification.";
        toast.error(errorMessage);
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkContractVerified();
  }, [contractAddress, shouldCheck, chainId]);

  return { loading, verified, abi };
};
