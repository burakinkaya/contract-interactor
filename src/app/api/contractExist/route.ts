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
    const exists = await selectedNetwork.getExist(contractAddress);
    return NextResponse.json({ exists }, { status: 200 });
  } catch (error: Error | any) {
    return NextResponse.json({ exists: false, error: error.message }, { status: 500 });
  }
}
