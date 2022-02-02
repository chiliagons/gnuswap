import React from "react";
import { Text, IconText, EthHashInfo } from "@gnosis.pm/safe-react-components";
import { convertToDate } from "../Utils/Shared";

export const activeTransactionCreator = (element, index, ethers) => {
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
            hash={element.crosschainTx?.invariant.receivingAddress.toString()  || "NA"}
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatEther(element.crosschainTx?.sending.amount || "0")} TEST
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
            hash={element.crosschainTx?.invariant.receivingAddress.toString() || "NA"}
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatEther(element.crosschainTx?.sending?.amount) || 0} TEST
          </Text>
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatEther(element.crosschainTx?.receiving?.amount || "0")}{" "}
            TEST
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
            text={element.status  || "NA"}
          />
        ),
      },
    ],
  };
};
