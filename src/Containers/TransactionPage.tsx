import React, { useContext } from "react";
import { TableContext } from "../Providers/Txprovider";

import ErrorBoundary from "../Components/ErrorBoundary";
import TransactionTable from "../Components/TransactionTable";

const TransactionPage: React.FC = () => {
  const { historicalTransactions, activeTransactions } =
    useContext(TableContext);

  return (
    <>
      <ErrorBoundary>
        {
          <div>
            <TransactionTable
              transactionList={activeTransactions}
              transactionType={"activeTransactions"}
            />
            <TransactionTable
              transactionList={historicalTransactions}
              transactionType={"historicalTransactions"}
            />
          </div>
        }
      </ErrorBoundary>
    </>
  );
};

export default TransactionPage;
