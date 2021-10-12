import React, { useContext } from "react";
import {
  Table,
  Title,
  TableHeader,
  TableRow,
  Text,
  Divider,
  IconText,
  EthHashInfo,
  Loader,
} from "@gnosis.pm/safe-react-components";
import { TableContext } from "../Providers/Txprovider";
import { HistoricalTransaction } from "@connext/nxtp-sdk";
import { ethers } from "ethers";

const TransactionPage: React.FC = () => {
  // const [Loading, setLoading] = useState(false);
  const { value, value2 } = useContext(TableContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [transactions, setTransactions] = React.useState(MockTransactions);
  const headerCells: TableHeader[] = [
    { id: "date", label: "Date" },
    { id: "transactionHash", label: "Tx Hash" },
    { id: "receiverAddress", label: "Receiver Address" },
    { id: "fromAmount", label: "From Amount" },
    { id: "toAmount", label: "To Amount" },
    { id: "status", label: "Status" },
  ];

  const activeHeaderCells: TableHeader[] = [
    { id: "date", label: "Date" },
    { id: "transactionHash", label: "Tx Hash" },
    { id: "receiverAddress", label: "Receiver Address" },
    { id: "amount", label: "Amount" },
    { id: "status", label: "Status" },
  ];

  const rows: TableRow[] = [];
  const activeRows: TableRow[] = [];
  let noOfActiveTransactions = -1;
  let noOfHistoricalTransactions = -1;
  function convertToDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const result =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    return result;
  }
  if (value.transactions && value2.activeTransactions) {
    noOfActiveTransactions = value2.activeTransactions.length;
    noOfHistoricalTransactions = value.transactions.length;

    value.transactions.forEach((element: HistoricalTransaction, index: any) => {
      rows.push({
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
                {ethers.utils.formatEther(element.crosschainTx.sending.amount)}{" "}
                TEST
              </Text>
            ),
          },
          {
            content: (
              <Text size="xl">
                {ethers.utils.formatEther(
                  element.crosschainTx.receiving.amount
                )}{" "}
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
      });
    });

    value2.activeTransactions.forEach((element: any, index: any) => {
      activeRows.push({
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
                {ethers.utils.formatEther(element.crosschainTx.sending.amount)}{" "}
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
                iconType="allowances"
                text={element.status}
              />
            ),
          },
        ],
      });
    });
  }

  return (
    <>
      {
        <div>
          <div style={{ paddingTop: "20px" }}>
            <Title size="md">
              Active Transactions{" "}
              {noOfActiveTransactions === -1 ? (
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
              {noOfHistoricalTransactions === -1 ? (
                <Loader size="sm"></Loader>
              ) : (
                noOfHistoricalTransactions
              )}
            </Title>
            <Divider />
            <Table headers={headerCells} rows={rows} />
          </div>
        </div>
      }
    </>
  );
};

export default TransactionPage;
