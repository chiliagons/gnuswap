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
            hash={element.transactionHash.toString()}
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <EthHashInfo
            textSize="xl"
            hash={element.crosschainTx.invariant.receivingAddress.toString()}
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatEther(element.crosschainTx.sending.amount)} TEST
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
            text={element.status}
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
            hash={element.fulfilledTxHash.toString()}
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <EthHashInfo
            textSize="xl"
            hash={element.crosschainTx.invariant.receivingAddress.toString()}
            showCopyBtn
            shortenHash={4}
          />
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatEther(element.crosschainTx.sending.amount)} TEST
          </Text>
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatEther(element.crosschainTx.receiving.amount)}{" "}
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
            text={element.status}
          />
        ),
      },
    ],
  };
};
