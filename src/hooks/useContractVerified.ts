import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useContractVerified = (contractAddress: string, shouldCheck: boolean) => {
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
        const response = await axios.get(
          `https://api.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY}`
        );

        const { status, message, result } = response.data;

        if (status === "1" && message === "OK") {
          setVerified(true);
          setAbi(result);
          console.log(result);
          toast.success("Contract is a verified contract!");
        } else {
          setVerified(false);
          toast.error("ABI Not Found, Contract source code not verified. Enter your ABI if it is available.");
        }
      } catch (error) {
        toast.error("Error checking contract verification");
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkContractVerified();
  }, [contractAddress, shouldCheck]);

  return { loading, verified, abi };
};
