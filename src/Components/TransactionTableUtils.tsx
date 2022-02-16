import React from "react";
import {
  Text,
  IconText,
  EthHashInfo,
  Button,
} from "@gnosis.pm/safe-react-components";
import { convertToDate } from "../Utils/Shared";
import { contractAddresses } from "../Constants/constants";

const cachedMapping = {}; // further optimize by storing this cache in local storage
const getSymbols = (contractAddress: string) => {
  if (contractAddress) {
    if (cachedMapping[contractAddress]) {
      return cachedMapping[contractAddress];
    } else {
      contractAddresses.forEach((token) => {
        if (JSON.stringify(token.contracts).indexOf(contractAddress) > -1) {
          cachedMapping[contractAddress] = token.symbol;
          return token.symbol;
        } else {
          // TODO: here check if its the native token of the network
          return "ETH";
        }
      });
    }
  }
};

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
            {ethers.utils.formatEther(
              element.crosschainTx?.sending.amount || "0"
            )}{" "}
            {getSymbols(element.crosschainTx?.invariant.sendingAssetId)}
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
              element.status === "SenderTransactionPrepared" ? false : true
            }
          >
            {element.status === "SenderTransactionPrepared"
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
            {ethers.utils.formatEther(element.crosschainTx?.sending?.amount) ||
              0}{" "}
            {getSymbols(element.crosschainTx?.invariant.sendingAssetId)}
          </Text>
        ),
      },
      {
        content: (
          <Text size="xl">
            {ethers.utils.formatEther(
              element.crosschainTx?.receiving?.amount || "0"
            )}{" "}
            {getSymbols(element.crosschainTx?.invariant.receivingAssetId)}
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
