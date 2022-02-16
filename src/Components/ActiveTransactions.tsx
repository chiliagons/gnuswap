import React, { useContext } from "react";
import {
  Table,
  Title,
  TableRow,
  Divider,
  Loader,
} from "@gnosis.pm/safe-react-components";

import { TableContext } from "../Providers/Txprovider";

import { ethers } from "ethers";
import { activeTransactionCreator } from "../Components/TransactionPageUtils";

import { activeHeaderCells } from "../Constants/TransactionPageConstant";

import ErrorBoundary from "../Components/ErrorBoundary";

const ActiveTransactions: React.FC = () => {
  const { activeTransactions } = useContext(TableContext);
  console.log("whats this", activeTransactions);
  const activeRows: TableRow[] = [];
  let noOfActiveTransactions = 0;

  if (activeTransactions.activeTransactions) {
    noOfActiveTransactions = activeTransactions.activeTransactions.length;

    activeTransactions.activeTransactions.forEach(
      (element: any, index: any) => {
        activeRows.push(activeTransactionCreator(element, index, ethers));
      }
    );
  }

  return (
    <>
      <ErrorBoundary>
        {
          <div>
            <div style={{ paddingTop: "20px" }}>
              <Title size="md">
                Active Transactions{" "}
                {noOfActiveTransactions === 0 ? (
                  <Loader size="sm"></Loader>
                ) : (
                  noOfActiveTransactions
                )}
              </Title>
              <Divider />
              <Table headers={activeHeaderCells} rows={activeRows} />
            </div>
          </div>
        }
      </ErrorBoundary>
    </>
  );
};

export default ActiveTransactions;
