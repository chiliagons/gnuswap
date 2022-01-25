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

const TransactionPage: React.FC = () => {
  // const [Loading, setLoading] = useState(false);
  const { historicalTransactions, activeTransactions } =
    useContext(TableContext);

  const rows: TableRow[] = [];
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
        rows.push(historicalTransactionCreator(element, index, ethers));
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
      {
        <div>
          <div style={{ paddingTop: "20px" }}>
            <Title size="md">
              Active Transactions{" "}
              {!!activeTransactions?.activeTransactions ? (
                <Loader size="sm"></Loader>
              ) : (
                noOfActiveTransactions
              )}
            </Title>
            <Divider />
            <Table headers={activeHeaderCells} rows={activeRows} />
          </div>
          <div style={{ paddingTop: "20px" }}>
            <Title size="md">
              Historical Transactions{" "}
              {!!historicalTransactions?.transactions ? (
                <Loader size="sm"></Loader>
              ) : (
                noOfHistoricalTransactions
              )}
            </Title>
            <Divider />
            <Table headers={historicalHeaderCells} rows={rows} />
          </div>
        </div>
      }
    </>
  );
};

export default TransactionPage;
