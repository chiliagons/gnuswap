import React from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Table, TableHeader, TableRow, Text, Divider, Icon, IconText, TableAlignment, EthHashInfo } from '@gnosis.pm/safe-react-components';
// import Transaction from '../components/Transaction';
import { MockTransactions } from '../Constants/MockTransactions';

const TransactionPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactions, setTransactions] = React.useState(MockTransactions);
  const headerCells:TableHeader[] = [{"id":"sender", "label":"Sender Address"}, {"id":"receiverAddress", "label":"Receiver Address"}, {"id":"Amount", "label":"Amount"}, {"id":"status", "label":"Status"}, {"id":"retry", alignment: TableAlignment.right , "label":"Retry"}, ];
  const rows: TableRow[]= [{"id":"1","cells":[{"content":<EthHashInfo
  hash='0x7BF0C0259DA2db1Cc9A484945722221c5B800139'
  showCopyBtn
  shortenHash={4}
/>}, {"content":<EthHashInfo
  hash='0x7BF0C0259DA2db1Cc9A484945722221c5B800139'
  showCopyBtn
  shortenHash={4}
/>}, {"content": <Text size="sm">100.123456789 ETH</Text>}, 
{"content":<IconText  iconSize='sm' textSize='md' iconType='alert' text='failed' /> }, {alignment: TableAlignment.right , "content":<Icon size='md' type='resync' />}] }];

  return (
    <div>
      <Divider />
    <Table headers={headerCells} rows={rows} />
    </div>
  );
};

export default TransactionPage;
