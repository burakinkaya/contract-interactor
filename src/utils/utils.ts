import axios from "axios";

export const getInputMessageColor = (inputMessage: string) => {
  switch (inputMessage) {
    case "Contract does not exist":
    case "Wrong Address!":
    case "ABI Not Found, Contract source code not verified. Enter your ABI if it is available.":
      return "text-red-500";
    case "Contract is verified, below you can interact with the contract":
      return "text-green-500";
    case "Searching for the contract...":
    case "Contract exists. Verifying ABI...":
      return "text-white";
    default:
      return "text-white";
  }
};

export const validateAbi = (abiString: string): boolean => {
  try {
    const parsedAbi = JSON.parse(abiString);
    return Array.isArray(parsedAbi);
  } catch (error) {
    return false;
  }
};

// Finding out if contract exists
export const getExistFromEtherscanishApi = async (url: string, contractAddress: string, apiKey?: string) => {
  try {
    const response = await axios.get(
      `${url}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${apiKey}`
    );
    const data = response.data;

    if (data.status === "1" && data.message === "OK") {
      return true;
    }
    throw new Error("Contract does not exist or is not verified");
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error checking contract existence");
  }
};

export const getExistFromBlockscoutishApi = async (url: string, contractAddress: string) => {
  try {
    const response = await axios.get(`${url}/v2/addresses/${contractAddress}`);
    const data = response.data;

    if (data.creation_tx_hash) {
      return true;
    }
    throw new Error("Contract does not exist on Blockscout");
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error checking contract existence on Blockscout");
  }
};

export const getExistWithFallback = async (
  primaryUrl: string,
  secondaryUrl: string,
  contractAddress: string,
  apiKey?: string
) => {
  try {
    return await getExistFromEtherscanishApi(primaryUrl, contractAddress, apiKey);
  } catch (etherscanError) {
    console.warn("Etherscan API failed, falling back to Blockscout API");

    return await getExistFromBlockscoutishApi(secondaryUrl, contractAddress);
  }
};

// Getting ABI

export const getAbiFromEtherscanishApi = async (url: string, contractAddress: string, apiKey?: string) => {
  try {
    const response = await axios.get(
      `${url}?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`
    );
    const data = response.data;

    if (data.status === "1" && data.message === "OK") {
      return data.result;
    }
    throw new Error("ABI not found or contract not verified");
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching ABI");
  }
};

export const getAbiFromBlockscoutishApi = async (url: string, contractAddress: string) => {
  try {
    const response = await axios.get(`${url}/v2/smart-contracts/${contractAddress}`);
    const data = response.data;

    if (data.abi) {
      return data.abi;
    }
    throw new Error("ABI not found on Blockscout");
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching ABI from Blockscout");
  }
};

export const getAbiWithFallback = async (
  primaryUrl: string,
  secondaryUrl: string,
  contractAddress: string,
  apiKey?: string
) => {
  try {
    return await getAbiFromEtherscanishApi(primaryUrl, contractAddress, apiKey);
  } catch (etherscanError) {
    console.warn("Etherscan API failed, falling back to Blockscout API");

    return await getAbiFromBlockscoutishApi(secondaryUrl, contractAddress);
  }
};
