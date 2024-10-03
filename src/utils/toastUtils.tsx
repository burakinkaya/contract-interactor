import { toast } from "react-toastify";

export const showSuccessToast = (hash: string, selectedNetwork: { explorer?: string }) => {
  const explorerUrl = selectedNetwork?.explorer ? `${selectedNetwork.explorer}/tx/${hash}` : null;
  toast.success(
    <div>
      Transaction successful! <br />
      {explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
          See transaction on explorer here
        </a>
      )}
    </div>
  );
};
