import React, { useContext, useState } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Table, TableHeader, TableRow, Text, Divider, Icon, IconText, TableAlignment, EthHashInfo, Loader } from '@gnosis.pm/safe-react-components';
// import Transaction from '../components/Transaction';
// import { MockTransactions } from '../Constants/MockTransactions';
import { TableContext } from './Txprovider';
import { HistoricalTransaction } from '@connext/nxtp-sdk';
import { ethers, BigNumber } from 'ethers';

const TransactionPage: React.FC = () => {
  const [Loading, setLoading] = useState(true);
  const { transactions } = useContext(TableContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //const [transactions, setTransactions] = React.useState(MockTransactions);
  const headerCells: TableHeader[] = [
    { id: 'date', label: 'Date' },
    { id: 'transactionAddress', label: 'Transaction Address' },
    { id: 'receiverAddress', label: 'Receiver Address' },
    { id: 'fromAmount', label: 'From Amount' },
    { id: 'toAmount', label: 'To Amount' },
    { id: 'status', label: 'Status' },
  ];

  const rows: TableRow[] = [];
  function convertToDate(timestamp: number) {
    var date = new Date(timestamp * 1000);
    var result = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return result;
  }

  transactions.forEach((element: HistoricalTransaction, index: any) => {
    rows.push({
      id: index,
      cells: [
        { content: <Text size="xl">{convertToDate(element.preparedTimestamp)}</Text> },
        { content: <EthHashInfo textSize="xl" hash={element.fulfilledTxHash.toString()} showCopyBtn shortenHash={4} /> },
        { content: <EthHashInfo textSize="xl" hash={element.crosschainTx.invariant.receivingAddress.toString()} showCopyBtn shortenHash={4} /> },
        { content: <Text size="xl">{ethers.utils.formatEther(element.crosschainTx.sending.amount)} TEST</Text> },
        { content: <Text size="xl">{ethers.utils.formatEther(element.crosschainTx.receiving.amount)} TEST</Text> },
        {
          content: (
            <IconText iconSize="md" iconColor="primary" textSize="xl" iconType={element.status === 'FULFILLED' ? 'check' : 'alert'} text={element.status} />
          ),
        },
      ],
    });
  });
  return (
    <>
      <div>
        <Divider />
        <Table headers={headerCells} rows={rows} />
      </div>
    </>
  );
};

export default TransactionPage;
