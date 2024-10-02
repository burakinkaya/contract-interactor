import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { networks } from "@/config/networks";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { contractAddress, chainId } = req.query;

  if (!contractAddress || !chainId) {
    return res.status(400).json({ error: "Missing contract address or chain ID" });
  }

  const selectedNetwork = networks[Number(chainId)];

  try {
    let response;

    if (chainId === "8008135") {
      response = await axios.get(`${selectedNetwork.url}/v2/smart-contracts/${contractAddress}`);
      const fhenixAbi = response.data.abi || [];

      if (fhenixAbi.length > 0) {
        return res.status(200).json({ verified: true, abi: fhenixAbi });
      } else {
        return res.status(404).json({ verified: false, error: "No ABI found for this contract on Fhenix" });
      }
    } else {
      response = await axios.get(
        `${selectedNetwork.url}?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );

      const { status, message, result } = response.data;

      if (status === "1" && message === "OK") {
        return res.status(200).json({ verified: true, abi: result });
      } else {
        return res.status(404).json({ verified: false, error: "ABI not found or contract not verified" });
      }
    }
  } catch (error: Error | any) {
    return res.status(500).json({ error: error.message || "Error checking contract verification" });
  }
}
