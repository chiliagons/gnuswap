import { createContext } from "react";
import { ActiveTransaction, HistoricalTransaction } from "@connext/nxtp-sdk";

export const TableContext = createContext({
  historicalTransactions: {
    historicalTransactions: null,
    setHistoricalTransactions: (
      historicalTransactions: HistoricalTransaction[]
    ) => {},
  },
  activeTransactions: {
    activeTransactions: null,
    setActiveTransactions: (activeTransactions: ActiveTransaction[]) => {},
  },
});
export const TableContextProvider = TableContext.Provider;
export const TableContextConsumer = TableContext.Consumer;
