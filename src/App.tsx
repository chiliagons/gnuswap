import React, { useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';


import { ethers } from 'ethers';
import Web3 from 'web3';
import { Button, Loader, Title, Card, Text, Select, Divider, TextField } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK, SafeProvider } from '@gnosis.pm/safe-apps-react-sdk';

import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';
import { ConnextModal } from '@connext/vector-modal';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}


const Container = styled.form`
  margin-bottom: 2rem;
  width: 100%;
  max-width: 480px;

  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;
export type SelectItem = {
  id: string;
  label: string;
};
const App: React.FC = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const web3Provider = new SafeAppProvider(safe, sdk);

  const ethEnabled = async () => {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
      return true;
    }
    return false;
  }
  if (!ethEnabled()) {
    alert("Please install MetaMask to use this dApp!");
  }
  const [showModal, setShowModal] = React.useState(false);
  const items: Array<SelectItem> = [
    { id: '1', label: 'Rinkeby testnet to Kovan testnet' },
    { id: '2', label: 'Goerli testnet to Mumbai testnet'},
    { id: '2', label: 'Kovan testnet to Rinkeby testnet'},
    { id: '3', label: 'Arbitrum testnet to Kovan testnet' },
  ];  
  const [value, setValue] = useState<string>('');
  const [activeItemId, setActiveItemId] = useState('');

  return (
    <>
    
      <Container>
      <Card>
    <Title size="sm">Connext Network Cross Chain Swap </Title>
    <Select
      items={items}
      activeItemId={activeItemId}
      onItemClick={(id) => {
        setActiveItemId(id);
      }}
      
    />
    <p>
      <TextField
        id="standard-name"
        label="Amount To Swap"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        input={{ type: 'number', min: 0.1, max: 10, step: 1 }}
      />
      </p>
    <Divider />
    <Button
      size="lg"
      iconType="resync"
      color="primary"
      variant="contained"
      onClick={() => setShowModal(true)}
      >
      <Text size="xl" color="secondary">
        SWAP
      </Text>
    </Button>
  </Card>
        {/* <Button size="lg" color="primary" onClick={() => setShowModal(true)}>Hello World</Button> */}
        <ConnextModal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          onReady={params => console.log('MODAL IS READY =======>', params)}
          injectedProvider={web3Provider}
          loginProvider={window.ethereum}
          withdrawalAddress={'0x7BF0C0259DA2db1Cc9A484945722221c5B800139'}
          routerPublicIdentifier="vector7tbbTxQp8ppEQUgPsbGiTrVdapLdU5dH7zTbVuXRf1M4CEBU9Q"
          depositAssetId={'0x0000000000000000000000000000000000000000'}
          depositChainProvider="https://rinkeby.infura.io/v3/31a0f6f85580403986edab0be5f7673c"
          depositChainId={4}
          withdrawAssetId={'0x0000000000000000000000000000000000000000'} // likely use injected signer
          withdrawChainProvider="https://kovan.infura.io/v3/31a0f6f85580403986edab0be5f7673c"
          withdrawChainId={42}
          onDepositTxCreated={(txHash) => { console.log('Deposit Tx Created =======>', txHash) }}
        />
        { }
      </Container>
    </>
    

  );
};

export default App;
