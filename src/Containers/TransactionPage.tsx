import React from 'react';

import Transaction from '../components/Transaction';
import { MockTransactions } from '../Constants/MockTransactions';

const TransactionPage = () => {
  const [transactions, setTransactions] = React.useState(MockTransactions);
  return (
    <div>
      {transactions.map((transaction) => {
        return (
          <Transaction receiverAddress={transaction.receiverAddress} senderAddress={transaction.senderAddress} transferAmount={transaction.transferAmount} />
        );
      })}
    </div>
  );
};

export default TransactionPage;
