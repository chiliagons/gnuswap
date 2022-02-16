import React from "react";
import {
  Table,
  Title,
  TableRow,
  Divider,
  Loader,
} from "@gnosis.pm/safe-react-components";

import { ethers } from "ethers";
import { activeTransactionCreator } from "./TransactionUtils";

import {
  transactionConfig,
  activeHeaderCells,
} from "../Constants/TransactionConstant";

import ErrorBoundary from "./ErrorBoundary";


const TransactionTable = (transactionObj) => {
  const transactionType = transactionObj.transactionType;
  const transactions = transactionObj.transactionList[transactionType];
  const transactionName = transactionConfig[transactionType]?.name;

  const transactionRows: TableRow[] = [];
  const noOfTransactions = transactions ? transactions.length : 0;

  transactions &&
    transactions.forEach((element: any, index: any) => {
      transactionRows.push(activeTransactionCreator(element, index, ethers));
    });

  return (
    <>
      <ErrorBoundary>
        {
          <div>
            <div style={{ paddingTop: "20px" }}>
              <Title size="md">
                {`${transactionName} `}
                {noOfTransactions === (null || undefined) ? (
                  <Loader size="sm"></Loader>
                ) : (
                  noOfTransactions
                )}
              </Title>
              <Divider />
              <Table headers={activeHeaderCells} rows={transactionRows} />
            </div>
          </div>
        }
      </ErrorBoundary>
    </>
  );
};

export default TransactionTable;
