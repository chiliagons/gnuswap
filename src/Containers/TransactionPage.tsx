import React, { useContext } from "react";
import {
  Table,
  Title,
  TableRow,
  Divider,
  Loader,
} from "@gnosis.pm/safe-react-components";
import { TableContext } from "../Providers/Txprovider";
import { HistoricalTransaction } from "@connext/nxtp-sdk";
import { ethers } from "ethers";
import {
  activeTransactionCreator,
  historicalTransactionCreator,
} from "../Components/TransactionPageUtils";
import {
  activeHeaderCells,
  historicalHeaderCells,
} from "../Constants/TransactionPageConstant";

import ErrorBoundary from "../Components/ErrorBoundary";

const TransactionPage: React.FC = () => {
  // const [Loading, setLoading] = useState(false);
  const { historicalTransactions, activeTransactions } =
    useContext(TableContext);

  const historicalRows: TableRow[] = [];
  const activeRows: TableRow[] = [];
  let noOfActiveTransactions = 0;
  let noOfHistoricalTransactions = 0;

  if (
    historicalTransactions.transactions &&
    activeTransactions.activeTransactions
  ) {
    noOfActiveTransactions = activeTransactions.activeTransactions.length;
    noOfHistoricalTransactions = historicalTransactions.transactions.length;
    historicalTransactions.transactions.forEach(
      (element: HistoricalTransaction, index: any) => {
        // if(element.status != "CANCELLED") {
        historicalRows.push(
          historicalTransactionCreator(element, index, ethers)
        );
        // }
        // else {
        //   console.log("cancelled -- ", element)
        // }
        console.log(historicalRows);
      }
    );

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
                {/* {!!activeTransactions?.activeTransactions ? (
                <Loader size="sm"></Loader>
              ) : (
                noOfActiveTransactions
              )} */}
              </Title>
              <Divider />
              <Table headers={activeHeaderCells} rows={activeRows} />
            </div>
            <div style={{ paddingTop: "20px" }}>
              <Title size="md">
                Historical Transactions{" "}
                {/* {!!historicalTransactions?.transactions ? (
                 <Loader size="sm"></Loader>
               ) : (
                 noOfHistoricalTransactions
               )} */}
              </Title>
              <Divider />
              <Table headers={historicalHeaderCells} rows={historicalRows} />
            </div>
          </div>
        }
      </ErrorBoundary>
    </>
  );
};

export default TransactionPage;
