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

export const getExistFromEtherscanishApi = async (url: string, contractAddress: string, apiKey: string) => {
  const response = await fetch(
    `${url}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${apiKey}`
  );
  const data = await response.json();

  if (data.status === "1" && data.message === "OK") {
    return true;
  }

  throw new Error("Contract does not exist or is not verified");
};

export const getAbiFromEtherscanishApi = async (url: string, contractAddress: string, apiKey: string) => {
  const response = await fetch(`${url}?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`);
  const data = await response.json();

  if (data.status === "1" && data.message === "OK") {
    return data.result;
  }

  throw new Error("ABI not found or contract not verified");
};
