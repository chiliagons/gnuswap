import { createContext } from "react";
import { ActiveTransaction, HistoricalTransaction } from "@connext/nxtp-sdk";

export const TableContext = createContext({
  value: {
    transactions: null,
    setTransactions: (transactions: HistoricalTransaction[]) => {},
  },
  value2: {
    activeTransactions: null,
    setActiveTransactions: (activeTransactions: ActiveTransaction[]) => {},
  },
});
export const TableContextProvider = TableContext.Provider;
export const TableContextConsumer = TableContext.Consumer;
