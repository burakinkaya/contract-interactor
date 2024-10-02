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
      try {
        response = await axios.get(`${selectedNetwork.url}/v2/addresses/${contractAddress}`);
        const { creation_tx_hash } = response.data;

        if (creation_tx_hash) {
          return res.status(200).json({ exists: true });
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          return res.status(404).json({ exists: false, error: "Contract does not exist on Fhenix" });
        } else {
          throw error;
        }
      }
    } else if (chainId === "9000") {
      return res.status(200).json({ exists: true, message: "Assuming contract exists on Zama network" });
    } else {
      response = await axios.get(
        `${selectedNetwork.url}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );

      const { status, message } = response.data;

      if (status === "1" && message === "OK") {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(404).json({ exists: false, error: "Contract does not exist" });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Error checking contract existence" });
  }
}
