import React, { useState, useEffect } from "react";

import {
  Table,
  Title,
  TableRow,
  Divider,
  Loader,
} from "@gnosis.pm/safe-react-components";
import { contractAddresses } from "../Constants/constants";
import { ethers } from "ethers";
import { activeTransactionCreator } from "./TransactionTableUtils";
import {
  ActiveTransaction,
} from "@connext/nxtp-sdk";
import {
  transactionConfig,
  activeHeaderCells,
} from "../Constants/TransactionConstant";

import ErrorBoundary from "./ErrorBoundary";
import { finishTransfer } from "./Utils";

interface TxObj {
  transactionList: any;
  transactionType: string;
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
          return symbol
            ? cachedMapping[contractAddress]["symbol"]
            : cachedMapping[contractAddress]["contracts"][0][
                "contract_decimals"
              ];
        } else {
          // TODO: here check if its the native token of the network
          return symbol ? "ETH" : 18;
        }
      });
    }
  }
};



const TransactionTable = (transactionObj:TxObj) => {
  const [contractList] = useState(contractAddresses);
  const transactionType = transactionObj.transactionType;
  const transactionName = transactionConfig[transactionType]?.name;
  const transactions =transactionObj.transactionList[transactionType];
  const noOfTransactions = transactions ? transactions.length : 0;
  const transactionRows: TableRow[] = [];
  useEffect(() => {
    async function txUpdate() {
      transactions &&
      transactions.forEach((element: any, index: any) => {
        const symbol =  getDetails(contractList, element.crosschainTx?.invariant.sendingAssetId, true);
        const decimals =  getDetails(contractList, element.crosschainTx?.invariant.sendingAssetId, false);
        transactionRows.push(
          activeTransactionCreator(element, index, ethers, finishTransfer, symbol, decimals)
        );
      console.log("TransactionTable Render called", transactionRows);

      });
    }
    txUpdate();
  }, [noOfTransactions]);
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
