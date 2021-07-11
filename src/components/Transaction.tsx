import React from 'react';
import { Paper } from '@material-ui/core';

const Transaction = (props) => {
  const { receiverAddress, senderAddress, transferAmount } = props;
  return (
    <div>
      <Paper>
        {receiverAddress}
        {senderAddress}
        {transferAmount}
      </Paper>
    </div>
  );
};

export default Transaction;
