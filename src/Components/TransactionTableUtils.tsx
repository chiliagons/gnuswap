import React, { useState } from "react";

import {
  Text,
  IconText,
  EthHashInfo,
  Button,
} from "@gnosis.pm/safe-react-components";
import { convertToDate } from "../Utils/Shared";
import { contractAddresses } from "../Constants/constants";
import { finishTransfer } from "./Utils";

const cachedMapping = {}; // further optimize by storing this cache in local storage
const getDetails = (contractAddress: string, symbol: boolean) => {
  const [contractList] = useState(contractAddresses);
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

const handleFinishTransfer = async (element) => {
  // if (latestActiveTx)
  await finishTransfer({
    bidSignature: element.bidSignature,
    encodedBid: element.encodedBid,
    encryptedCallData: element.encryptedCallData,
    txData: {
      ...element.crosschainTx.invariant,
      ...element.crosschainTx.sending,
      amountReceived: element.crosschainTx.receiving.amount,
    },
  });
};

export const activeTransactionCreator = (
  element,
  index,
  ethers,
  finishTransfer
) => {
  return {
    id: index,
    cells: [
      {
        content: (
          <Text size="xl">{convertToDate(element.preparedTimestamp)}</Text>
        ),
      },
      {
        content: (
          <EthHashInfo
            textSize="xl"
            hash={element.transactionHash?.toString() || "NA"}
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <EthHashInfo
            textSize="xl"
            hash={
              element.crosschainTx?.invariant.receivingAddress.toString() ||
              "NA"
            }
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatUnits(
              element.crosschainTx?.sending.amount,
              getDetails(element.crosschainTx?.invariant.sendingAssetId, false)
            ) || 0}{" "}
            {getDetails(element.crosschainTx?.invariant.sendingAssetId, true)}
          </Text>
        ),
      },
      {
        content: (
          <IconText
            iconSize="md"
            iconColor="primary"
            textSize="xl"
            iconType="allowances"
            text={element.status || "NA"}
          />
        ),
      },
      {
        content: (
          <Button
            size="md"
            iconType="rocket"
            disabled={
              element.status === "ReceiverTransactionPrepared" ? false : true
            }
            onClick={async () => handleFinishTransfer(element)}
          >
            {element.status.toLowerCase() ===
            "ReceiverTransactionPrepared".toLowerCase()
              ? "Complete Transfer"
              : "unavailable"}
          </Button>
        ),
      },
    ],
  };
};

export const historicalTransactionCreator = (element, index, ethers) => {
  return {
    id: index,
    cells: [
      {
        content: (
          <Text size="xl">{convertToDate(element.preparedTimestamp)}</Text>
        ),
      },
      {
        content: (
          <Text size="xl">{convertToDate(element.preparedTimestamp)}</Text>
        ),
      },
      {
        content: (
          <EthHashInfo
            textSize="xl"
            hash={element.fulfilledTxHash?.toString() || "NA"}
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <EthHashInfo
            textSize="xl"
            hash={
              element.crosschainTx?.invariant.receivingAddress.toString() ||
              "NA"
            }
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatUnits(
              element.crosschainTx?.sending?.amount,
              getDetails(element.crosschainTx?.invariant.sendingAssetId, false)
            ) || 0}{" "}
            {getDetails(element.crosschainTx?.invariant.sendingAssetId, true)}
          </Text>
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatEther(
              element.crosschainTx?.receiving?.amount || "0"
            )}{" "}
            {getDetails(element.crosschainTx?.invariant.receivingAssetId, true)}
          </Text>
        ),
      },
      {
        content: (
          <IconText
            iconSize="md"
            iconColor="primary"
            textSize="xl"
            iconType={element.status === "FULFILLED" ? "check" : "alert"}
            text={element.status || "NA"}
          />
        ),
      },
    ],
  };
};
