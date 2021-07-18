import React, { useState } from 'react';
import { ConnextModal } from '@connext/vector-modal';
import useStyles from './styles';
import { Container, Grid, Select, MenuItem, Typography } from '@material-ui/core';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import HelpIcon from '@material-ui/icons/Help';

import { Card, Divider } from '@gnosis.pm/safe-react-components';
import List from '@material-ui/core/List';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';
import { networks } from '../Constants/Networks';
import { TextField, Button } from '@gnosis.pm/safe-react-components';
import { NETWORK } from '../Models/Networks.model';

export default function Modal() {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const web3Provider = new SafeAppProvider(safe, sdk);
  const [showModal, setShowModal] = useState(false);

  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [open, setOpen] = React.useState(false);
  const [injectedProvider, setInjectedProvider] = React.useState();

  //const chainConfig = process.env.NEXT_PUBLIC_CHAIN_PROVIDERS;
  //const chainProviders = JSON.parse(chainConfig!);

  const handleAddressChange = (event) => {
    console.log(event.target.value);
    setWithdrawalAddress(event.target.value);
  };
  const amountController = (event) => {
    setTransferAmount(event.target.value);
  };

  const handleSubmit = (values) => {
    const errors = { receiverAddress: '', transferAmount: '' };
    if (!values.receiverAddress) {
      errors.receiverAddress = 'Required';
    }
    if (!values.transferAmount) {
      errors.transferAmount = 'Required';
    }
    return errors;
  };

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
      <Divider />
      <Container>
        <Grid className={classes.grid} container spacing={8}>
          <Grid item xs={12} sm={8}>
            <Card className={classes.card}>
              <Grid className={classes.gridWithSpace} container spacing={2}>
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
                    name=""
                    aria-describedby="receiverAddress"
                    value={withdrawalAddress}
                    type="search"
                    onChange={handleAddressChange}
                    required
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    label="Transfer Amount"
                    name="transferAmount"
                    aria-describedby="transferAmount"
                    value={transferAmount}
                    type="search"
                    onChange={amountController}
                    required
                  />
                </Grid>

                <Grid className={classes.grid} item xs={8}>
                  <Button
                    size="md"
                    iconType="chain"
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
                onReady={(params) => console.log('MODAL IS READY =======>', params)}
                depositChainProvider={'https://rinkeby.infura.io/v3/31a0f6f85580403986edab0be5f7673c'}
                withdrawChainProvider={'https://kovan.infura.io/v3/31a0f6f85580403986edab0be5f7673c'}
                injectedProvider={web3Provider}
                loginProvider={injectedProvider}
              />
              {/* </form> */}
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card className={classes.supportcard}>
              <Typography className={classes.text} align="center" variant="h6">
                Support
              </Typography>
              <List component="nav" aria-label="main mailbox folders">
                <ListItem>
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <Typography className={classes.text}>How it works</Typography>
                </ListItem>
              </List>
              <Divider />
              <List component="nav" aria-label="secondary mailbox folders">
                <ListItem>
                  <Typography className={classes.text}>1. Choose the network option</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>2. Enter the reciever address</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>3. Enter the amount you want to swap</Typography>
                </ListItem>
                {/* <ListItemLink href="#simple-list">
          <ListItemText primary="Spam" />
        </ListItemLink> */}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
