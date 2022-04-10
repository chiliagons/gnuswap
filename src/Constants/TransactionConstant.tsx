import { TableHeader } from "@gnosis.pm/safe-react-components";

export const historicalHeaderCells: TableHeader[] = [
  { id: "date", label: "Date" },
  { id: "transactionHash", label: "Tx Hash" },
  { id: "receiverAddress", label: "Receiver Address" },
  { id: "fromAmount", label: "From Amount" },
  { id: "toAmount", label: "To Amount" },
  { id: "status", label: "Status" },
];

export const activeHeaderCells: TableHeader[] = [
  { id: "date", label: "Date" },
  { id: "transactionHash", label: "Tx Hash" },
  { id: "receiverAddress", label: "Receiver Address" },
  { id: "amount", label: "Amount" },
  { id: "status", label: "Status" },
  { id: "action", label: "Action" },
];

export const transactionConfig = {
  activeTransactions: {
    name: "Active Transactions",
  },
  historicalTransactions: {
    name: "Historical Transactions",
  },
};
