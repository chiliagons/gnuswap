import React from 'react';
import { TableRow, TableCell, makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: '2rem',
  },
});

const Transaction = (props) => {
  const classes = useStyles();
  const { index, receiverAddress, senderAddress, transferAmount } = props;
  return (
    <TableRow>
      <TableCell>
        <Typography className={classes.title} color="textPrimary">
          {index + 1}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography className={classes.title} color="textPrimary">
          {receiverAddress}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography className={classes.title} color="textPrimary">
          {senderAddress}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography className={classes.title} color="textPrimary">
          {transferAmount}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default Transaction;
