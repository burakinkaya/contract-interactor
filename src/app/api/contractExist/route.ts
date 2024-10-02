import { NextResponse } from "next/server";
import axios from "axios";
import { fhenixHelium, networks, zamaDevnet } from "@/config/networks";

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
      try {
        response = await axios.get(`${selectedNetwork.url}/v2/addresses/${contractAddress}`);
        const { creation_tx_hash } = response.data;

        if (creation_tx_hash) {
          return NextResponse.json({ exists: true }, { status: 200 });
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          return NextResponse.json({ exists: false, error: "Contract does not exist on Fhenix" }, { status: 404 });
        } else {
          throw error;
        }
      }
    } else if (Number(chainId) === zamaDevnet.chainId) {
      return NextResponse.json({ exists: true, message: "Assuming contract exists on Zama network" }, { status: 200 });
    } else {
      response = await axios.get(
        `${selectedNetwork.url}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
      );

      const { status, message } = response.data;

      if (status === "1" && message === "OK") {
        return NextResponse.json({ exists: true }, { status: 200 });
      } else {
        return NextResponse.json({ exists: false, error: "Contract does not exist" }, { status: 404 });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error checking contract existence" }, { status: 500 });
  }
}
