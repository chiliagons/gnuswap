import React from "react";

import {
  Text,
  IconText,
  EthHashInfo,
  Button,
} from "@gnosis.pm/safe-react-components";
import { convertToDate } from "../Utils/Shared";

import { finishTransfer } from "./Utils";

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
  finishTransfer,
  symbol,
  decimals
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
              decimals || 18
            ) || 0}{" "}
            {symbol || ""}
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

export const historicalTransactionCreator = (
  element,
  index,
  ethers,
  symbol,
  decimals
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
              decimals || 18
            ) || 0}{" "}
            {symbol  || ""}
          </Text>
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatEther(
              element.crosschainTx?.receiving?.amount || "0"
            )}{" "}
            {symbol || "" }
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
