import { createContext, useContext } from 'react';
import { ActiveTransaction, HistoricalTransaction } from '@connext/nxtp-sdk';

export const TableContext = createContext({ transactions: null, setTransactions: (transaction: HistoricalTransaction[]) => {} });
export const TableContextProvider = TableContext.Provider;
export const TableContextConsumer = TableContext.Consumer;
