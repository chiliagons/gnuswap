import React, { useState, useEffect } from "react";

import {
  Table,
  Text,
  Title,
  TableRow,
  Divider,
  Loader,
} from "@gnosis.pm/safe-react-components";
import { contractAddresses } from "../Constants/constants";
import { ethers } from "ethers";
import {
  activeTransactionCreator,
  historicalTransactionCreator,
} from "./TransactionTableUtils";
import { ActiveTransaction } from "@connext/nxtp-sdk";
import {
  transactionConfig,
  activeHeaderCells,
  historicalHeaderCells,
} from "../Constants/TransactionConstant";

import ErrorBoundary from "./ErrorBoundary";
import { finishTransfer } from "./Utils";

interface TxObj {
  transactionList: any;
  transactionType: string;
}

interface TxData {
  noOfTransactions: number;
  transactionType: string;
  transactionName: string;
}

const cachedMapping = {}; // further optimize by storing this cache in local storage
const getDetails = (contractList, contractAddress: string, symbol: boolean) => {
  console.log("contractList", contractList);
  if (contractAddress) {
    if (cachedMapping[contractAddress]) {
      return symbol
        ? cachedMapping[contractAddress]["symbol"]
        : cachedMapping[contractAddress]["contracts"][0]["contract_decimals"];
    } else {
      contractList.forEach((token) => {
        if (
          JSON.stringify(token.contracts)
            .toLowerCase()
            .indexOf(contractAddress) > -1
        ) {
          cachedMapping[contractAddress] = token;
          const returnValue = symbol
            ? cachedMapping[contractAddress]["symbol"]
            : cachedMapping[contractAddress]["contracts"][0][
                "contract_decimals"
              ];
          return returnValue;
        } else {
          // TODO: here check if its the native token of the network
          return symbol ? "ETH" : 18;
        }
      });
    }
  }
};

const TransactionTable = (transactionObj: TxObj) => {
  const [contractList] = useState(contractAddresses);

  const tableTxObj = {} as TxData;
  tableTxObj.transactionType = transactionObj.transactionType;
  tableTxObj.transactionName =
    transactionConfig[tableTxObj.transactionType]?.name;
  const transactions =
    transactionObj.transactionList[tableTxObj.transactionType];
  tableTxObj.noOfTransactions = transactions ? transactions.length : 0;

  const [transactionRows, setTransactionRows] = useState<TableRow[]>([]);
  const [historicalTransactionRows, setHistoricalTransactionRows] = useState<
    TableRow[]
  >([]);

  const manyRows: TableRow[] = Array.from(new Array<string>(1).keys()).map(
    (val, idx) => ({
      id: idx.toString(),
      cells: [
        {
          content: <Text size="xl">test</Text>,
        },
      ],
    })
  );
  useEffect(() => {
    async function txUpdate() {
      const _transactionRows: TableRow[] = [];
      transactions &&
        transactions.forEach((element: any, index: any) => {
          const symbol = getDetails(
            contractList,
            element.crosschainTx?.invariant.sendingAssetId,
            true
          );
          const decimals = getDetails(
            contractList,
            element.crosschainTx?.invariant.sendingAssetId,
            false
          );
          if (decimals && tableTxObj.transactionType === "activeTransactions") {
            _transactionRows.push(
              activeTransactionCreator(
                element,
                index,
                ethers,
                finishTransfer,
                symbol,
                decimals
              )
            );
            console.log("TransactionTable Render called", _transactionRows);
          } else if (
            decimals &&
            tableTxObj.transactionType === "historicalTransactions"
          ) {
            _transactionRows.push(
              historicalTransactionCreator(
                element,
                index,
                ethers,
                symbol,
                decimals
              )
            );
            console.log(
              "TransactionTable Render called for historical",
              _transactionRows
            );
          }
        });
      if (tableTxObj.transactionType === "activeTransactions") {
        setTransactionRows(_transactionRows);
      } else if (tableTxObj.transactionType === "historicalTransactions") {
        setHistoricalTransactionRows(_transactionRows);
      }
    }
    txUpdate();
  }, [tableTxObj.noOfTransactions]);
  return (
    <>
      <ErrorBoundary>
        {
          <div>
            <div style={{ paddingTop: "20px" }}>
              {transactionRows &&
                tableTxObj.transactionType === "activeTransactions" && (
                  <>
                    <Title size="md">
                      {`${tableTxObj.transactionName} `}
                      {tableTxObj.noOfTransactions === (null || undefined) ? (
                        <Loader size="sm"></Loader>
                      ) : (
                        tableTxObj.noOfTransactions
                      )}
                    </Title>
                    <Divider />
                    <Table headers={activeHeaderCells} rows={transactionRows} />
                  </>
                )}
            </div>
            <div style={{ paddingTop: "20px" }}>
              {historicalTransactionRows &&
                tableTxObj.transactionType === "historicalTransactions" && (
                  <>
                    <Title size="md">
                      {`${tableTxObj.transactionName} `}
                      {tableTxObj.noOfTransactions === (null || undefined) ? (
                        <Loader size="sm"></Loader>
                      ) : (
                        tableTxObj.noOfTransactions
                      )}
                    </Title>
                    <Divider />
                    <Table
                      headers={historicalHeaderCells}
                      rows={historicalTransactionRows}
                    />
                  </>
                )}
            </div>
          </div>
        }
      </ErrorBoundary>
    </>
  );
};

export default TransactionTable;
