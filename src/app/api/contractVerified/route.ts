import { NextResponse } from "next/server";
import { networks } from "@/config/networks";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contractAddress = searchParams.get("contractAddress");
  const chainId = searchParams.get("chainId");

  if (!contractAddress || !chainId) {
    return NextResponse.json({ error: "Missing contract address or chain ID" }, { status: 400 });
  }

  const selectedNetwork = networks[Number(chainId)];

  if (!selectedNetwork) {
    return NextResponse.json({ error: "Unsupported network" }, { status: 400 });
  }

  try {
    const abi = await selectedNetwork.getAbi(contractAddress);

    const verified = abi.length > 0;

    return NextResponse.json({ verified, abi }, { status: 200 });
  } catch (error: Error | any) {
    return NextResponse.json({ verified: false, error: error.message }, { status: 500 });
  }
}
