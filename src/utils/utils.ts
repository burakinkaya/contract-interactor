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
