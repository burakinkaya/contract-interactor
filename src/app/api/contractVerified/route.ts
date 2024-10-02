import { NextResponse } from "next/server";
import axios from "axios";
import { fhenixHelium, networks } from "@/config/networks";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contractAddress = searchParams.get("contractAddress");
  const chainId = searchParams.get("chainId");

  if (!contractAddress || !chainId) {
    return NextResponse.json({ error: "Missing contract address or chain ID" }, { status: 400 });
  }

  const selectedNetwork = networks[Number(chainId)];

  try {
    let response;

    if (Number(chainId) === fhenixHelium.chainId) {
      response = await axios.get(`${selectedNetwork.url}/v2/smart-contracts/${contractAddress}`);
      const fhenixAbi = response.data.abi || [];

      if (fhenixAbi.length > 0) {
        return NextResponse.json({ verified: true, abi: fhenixAbi }, { status: 200 });
      } else {
        return NextResponse.json(
          { verified: false, error: "No ABI found for this contract on Fhenix" },
          { status: 404 }
        );
      }
    } else {
      response = await axios.get(
        `${selectedNetwork.url}?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
      );

      const { status, message, result } = response.data;

      if (status === "1" && message === "OK") {
        return NextResponse.json({ verified: true, abi: result }, { status: 200 });
      } else {
        return NextResponse.json({ verified: false, error: "ABI not found or contract not verified" }, { status: 404 });
      }
    }
  } catch (error: Error | any) {
    return NextResponse.json({ error: error.message || "Error checking contract verification" }, { status: 500 });
  }
}
