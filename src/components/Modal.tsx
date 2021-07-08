import React, { useState } from "react";
import { ConnextModal } from "@connext/vector-modal";
import useStyles from './styles';
import { Grid, Button, TextField, Select, MenuItem, Card, Paper} from "@material-ui/core";
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import styled from 'styled-components';
import Icon from '@material-ui/core/Icon';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';

export default function Modal() {
  const Container = styled.form`
  margin-bottom: 2rem;
  width: 100%;
  max-width: 480px;
  margin-top: 20px;
  margin-left: 20px;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;

  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const web3Provider = new SafeAppProvider(safe, sdk);
  const [showModal, setShowModal] = useState(false);

  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [open, setOpen] = React.useState(false);
  const [injectedProvider, setInjectedProvider] = React.useState();

  //const chainConfig = process.env.NEXT_PUBLIC_CHAIN_PROVIDERS;
  //const chainProviders = JSON.parse(chainConfig!);


  const handleChange = (event) => {
    setWithdrawalAddress(event.target.value);
    
  };
  const amountController = (event) => {
    setTransferAmount(event.target.value);
  };

  const handleSubmit = (values) => {
    const errors = { receiverAddress: "", transferAmount:"" };
    if (!values.receiverAddress) {
      errors.receiverAddress = "Required";
    }
    if (!values.transferAmount) {
      errors.transferAmount = "Required";
    }
    return errors;
  };
  interface NETWORK {
    depositChainId: number;
    depositChainName: string;
    withdrawChainId: number;
    withdrawChainName: string;
    tokens: TOKEN[];
  }
  interface TOKEN {
    name: string;
    depositAssetId: string;
    withdrawAssetId: string;
  }

  const GOERLI_MUMBAI_TOKENS: TOKEN[] = [
    {
      name: "Test Token",
      depositAssetId: "0xbd69fC70FA1c3AED524Bb4E82Adc5fcCFFcD79Fa",
      withdrawAssetId: "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
    },
  ];

  const MUMBAI_GOERLI_TOKENS: TOKEN[] = [
    {
      name: "Test Token",
      depositAssetId: "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
      withdrawAssetId: "0xbd69fC70FA1c3AED524Bb4E82Adc5fcCFFcD79Fa",
    },
  ];

  const RINKEBY_KOVAN_TOKENS: TOKEN[] = [
    {
      name: "ETH",
      depositAssetId: "0x0000000000000000000000000000000000000000",
      withdrawAssetId: "0x0000000000000000000000000000000000000000",
    },
  ];

  const KOVAN_RINKEBY_TOKENS: TOKEN[] = [
    {
      name: "ETH",
      depositAssetId: "0x0000000000000000000000000000000000000000",
      withdrawAssetId: "0x0000000000000000000000000000000000000000",
    },
  ];

  // const KOVAN_ARBITRUM_TOKENS: TOKEN[] = [
  //   {
  //     name: "ETH",
  //     depositAssetId: "0x0000000000000000000000000000000000000000",
  //     withdrawAssetId: "0x0000000000000000000000000000000000000000",
  //   },
  // ];

  // const ARBITRUM_KOVAN_TOKENS: TOKEN[] = [
  //   {
  //     name: "ETH",
  //     depositAssetId: "0x0000000000000000000000000000000000000000",
  //     withdrawAssetId: "0x0000000000000000000000000000000000000000",
  //   },
  // ];

  // const ETH_MATIC_TOKENS: TOKEN[] = [
  //   {
  //     name: "Test Token",
  //     depositAssetId: "0x9E86dd60e0B1e7e142F033d1BdEf734c6b3224Bb",
  //     withdrawAssetId: "0x9E86dd60e0B1e7e142F033d1BdEf734c6b3224Bb",
  //   },
  // ];

  // const MATIC_ETH_TOKENS: TOKEN[] = [
  //   {
  //     name: "Test Token",
  //     depositAssetId: "0x9E86dd60e0B1e7e142F033d1BdEf734c6b3224Bb",
  //     withdrawAssetId: "0x9E86dd60e0B1e7e142F033d1BdEf734c6b3224Bb",
  //   },
  // ];

  const networks: NETWORK[] = [
    {
      depositChainId: 5,
      depositChainName: "Goerli Testnet",
      withdrawChainId: 80001,
      withdrawChainName: "Matic Testnet",
      tokens: GOERLI_MUMBAI_TOKENS,
    },
    {
      depositChainId: 80001,
      depositChainName: "Matic Testnet",
      withdrawChainId: 5,
      withdrawChainName: "Goerli Testnet",
      tokens: MUMBAI_GOERLI_TOKENS,
    },
    {
      depositChainId: 4,
      depositChainName: "Rinkeby Testnet",
      withdrawChainId: 42,
      withdrawChainName: "Kovan Testnet",
      tokens: RINKEBY_KOVAN_TOKENS,
    },
    {
      depositChainId: 42,
      depositChainName: "Kovan Testnet",
      withdrawChainId: 4,
      withdrawChainName: "Rinkeby Testnet",
      tokens: KOVAN_RINKEBY_TOKENS,
    },
    // {
    //   depositChainId: 42,
    //   depositChainName: "Kovan Testnet",
    //   withdrawChainId: 79377087078960,
    //   withdrawChainName: "Arbitrum Testnet V3",
    //   tokens: KOVAN_ARBITRUM_TOKENS,
    // },
    // {
    //   depositChainId: 79377087078960,
    //   depositChainName: "Arbitrum Testnet V3",
    //   withdrawChainId: 42,
    //   withdrawChainName: "Kovan Testnet",
    //   tokens: ARBITRUM_KOVAN_TOKENS,
    // },
    // {
    //   depositChainId: 137,
    //   depositChainName: "Matic Mainnet",
    //   withdrawChainId: 1,
    //   withdrawChainName: "ETH Mainnet",
    //   tokens: MATIC_ETH_TOKENS,
    // },
    // {
    //   depositChainId: 1,
    //   depositChainName: "ETH Mainnet",
    //   withdrawChainId: 137,
    //   withdrawChainName: "Matic Mainnet",
    //   tokens: ETH_MATIC_TOKENS,
    // },
  ];

  const handleNetwork = (event) => {
    setChain(networks[event.target.value]);
    setid(event.target.value);

  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const [chain, setChain] = useState<NETWORK>(networks[0]);
  const [id, setid] = useState(0);
  
  return (
    <>
    <Container>

    <Grid className={classes.grid} container spacing={2}>

     <Grid item xs={12} sm={6}>
     <Card className={classes.card}>
    
      {/* <Grid container spacing={2} >
        <Grid item style={{ marginTop: 16 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!!injectedProvider}
            onClick={async () => {
              if ((window as any).ethereum) {
                const req = await (window as any).ethereum.send(
                  "eth_requestAccounts"
                );
                console.log("req: ", req);
                setInjectedProvider((window as any).ethereum);
              }
            }}
          >
            Connect Metamask
          </Button>
        </Grid>
      </Grid> */}
      <form className={classes.form}  onSubmit={handleSubmit} noValidate>
       <Grid className={classes.grid} container spacing={2}>

          <Grid item xs={8}>
            <Select
              variant="outlined"
              id="demo-controlled-open-select"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              onChange={handleNetwork}
              fullWidth
              defaultValue={id}
              // component={Select}
            >
              {networks.map((t, index) => {
                return (
                  <MenuItem value={index} key={index}>
                    {t.depositChainName} to {t.withdrawChainName}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>

          <Grid item xs={8}>
            <TextField
              label="Receiver Address"
              name="receiverAddress"
              aria-describedby="receiverAddress"
              defaultValue={withdrawalAddress}
              type="search"
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={8}>
            <TextField
           
              label="Transfer Amount"
              name="transferAmount"
              aria-describedby="transferAmount"
              defaultValue={transferAmount}
              type="search"
              onChange={amountController}
              required
              fullWidth
           
            
            />
          </Grid>
          
        
      
        <Grid className={classes.grid} item style={{ marginTop: 16 }} xs={8}>
          <Button
          startIcon={ <SwapHorizontalCircleIcon/>}
          className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
            disabled={!withdrawalAddress || !chain || !transferAmount}
            onClick={async () => {
              // if (!injectedProvider) {
              //   alert("Please connect to Metamask to use this dapp.");
              //   throw new Error("Metamask not available");
              // }
              try {
                setInjectedProvider((window as any).ethereum);
              } catch (error) {
                console.log(error.message);
              }
              setShowModal(true);
            }}
          >
            Cross-Chain Transfer
          </Button>
    
      </Grid>
      </Grid>
      <ConnextModal
        showModal={showModal}
        transferAmount={transferAmount}
        routerPublicIdentifier="vector7tbbTxQp8ppEQUgPsbGiTrVdapLdU5dH7zTbVuXRf1M4CEBU9Q"
        depositAssetId={chain!.tokens[0].depositAssetId}
        depositChainId={chain!.depositChainId}
        withdrawAssetId={chain!.tokens[0].withdrawAssetId}
        withdrawChainId={chain!.withdrawChainId}
        withdrawalAddress={withdrawalAddress}
        onClose={() => setShowModal(false)}
        onReady={params => console.log('MODAL IS READY =======>', params)}
        depositChainProvider={"https://rinkeby.infura.io/v3/31a0f6f85580403986edab0be5f7673c"}
        withdrawChainProvider={"https://kovan.infura.io/v3/31a0f6f85580403986edab0be5f7673c"}
        injectedProvider={web3Provider}
        loginProvider={injectedProvider}
          />
        
      </form>
      

   
    </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
          <Paper>Support</Paper>
          </Grid>

        </Grid>
        </Container>
    
    </>
  );
}
