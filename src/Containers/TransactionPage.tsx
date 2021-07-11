import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import Transaction from '../components/Transaction';
import { MockTransactions } from '../Constants/MockTransactions';

const TransactionPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactions, setTransactions] = React.useState(MockTransactions);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">No.</TableCell>
            <TableCell align="left">Sender Address</TableCell>
            <TableCell align="left">Receiver Address</TableCell>
            <TableCell align="left">Transfer Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => {
            return (
              <Transaction
                index={index}
                receiverAddress={transaction.receiverAddress}
                senderAddress={transaction.senderAddress}
                transferAmount={transaction.transferAmount}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionPage;
