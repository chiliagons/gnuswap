import React, { useState, useEffect } from 'react';
import { ConnextModal } from '@connext/vector-modal';
import Axios from 'axios';
import useStyles from './styles';
import { Container, Grid, Select, MenuItem, Typography, List, ListItem, ListItemIcon } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

import { Card, Divider, TextField, Button } from '@gnosis.pm/safe-react-components';

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';

import { networks } from '../Constants/Networks';
import { mockTokens } from '../Constants/Tokens';
import { NETWORK } from '../Models/Networks.model';
import { getSupportedCodeFixes, isConstructorDeclaration } from 'typescript';

export default function Modal() {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const web3Provider = new SafeAppProvider(safe, sdk);
  const [showModal, setShowModal] = useState(false);

  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [openNetworkOptions, setOpenNetworkOptions] = React.useState(false);
  const [openTokenOptions, setOpenTokenOptions] = React.useState(false);
  const [injectedProvider, setInjectedProvider] = React.useState();
  const [chain, setChain] = useState<NETWORK>(networks[0]);
  const [id, setid] = useState(0);
  const [token, setToken] = useState(mockTokens[0]);
  const [tokenId, setTokenId] = useState(0);
  const [userAddress, setUserAddress] = useState();
  const [errorFetchedChecker, setErrorFetchedChecker] = useState(false);

  //const chainConfig = process.env.NEXT_PUBLIC_CHAIN_PROVIDERS;
  //const chainProviders = JSON.parse(chainConfig!);

  const handleAddressChange = (event) => {
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

  //Handlers
  const handleNetworkOptions = (event) => {
    setChain(networks[event.target.value]);
    setid(event.target.value);
  };

  const handleTokenSelection = (event) => {
    setToken(mockTokens[event.target.value]);
    setTokenId(event.target.value);
  };

  const handleCloseNetworkOptions = () => {
    setOpenNetworkOptions(false);
  };

  const handleOpenNetworkOptions = () => {
    setOpenNetworkOptions(true);
  };

  const handleCloseTokenOptions = () => {
    setOpenTokenOptions(false);
  };

  const handleOpenTokenOptions = () => {
    setOpenTokenOptions(true);
  };

  const getUserAddress = () => {
    return web3Provider
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        return accounts[0];
      })
      .catch((error) => console.error(error));
  };

  const userAddressHandler = async () => {
    const res: any = await getUserAddress();
    if (res === '') {
      setErrorFetchedChecker((c) => !c);
    } else {
      setUserAddress(res);
      getSomething(userAddress);
    }
  };

  const getSomething = async (inputAddress) => {
    const address = '0x73551b69314de75364fb5B58e766e40cB2c2973f';
    await Axios.get(`https://safe-transaction.gnosis.io/api/v1/safes/${address}/balances/?trusted=false&exclude_spam=false`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    userAddressHandler();
  }, [errorFetchedChecker]);

  return (
    <>
      <Divider />
      <Container>
        <Grid className={classes.grid} container spacing={8}>
          <Grid item xs={12} sm={8}>
            <Card className={classes.card}>
              <Grid className={classes.gridWithSpace} container spacing={2}>
                <Grid item xs={8}>
                  you are currently on : <h4>{userAddress}</h4>
                  <Select
                    variant="outlined"
                    id="demo-controlled-open-select"
                    open={openNetworkOptions}
                    onClose={handleCloseNetworkOptions}
                    onOpen={handleOpenNetworkOptions}
                    onChange={handleNetworkOptions}
                    fullWidth
                    defaultValue={id ? id : 0}
                  >
                    <MenuItem disabled>Select Receiver Network</MenuItem>
                    {networks.map((t, index) => {
                      return (
                        <MenuItem value={index} key={index}>
                          {t.withdrawChainName}
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
                  <Select
                    disabled={!withdrawalAddress}
                    label="Select the token"
                    variant="outlined"
                    id="demo-controlled-openToken-select"
                    open={openTokenOptions}
                    onClose={handleCloseTokenOptions}
                    onOpen={handleOpenTokenOptions}
                    onChange={handleTokenSelection}
                    fullWidth
                    value={tokenId ? tokenId : 0}
                  >
                    {mockTokens.map((token, index) => {
                      return (
                        <MenuItem value={index} key={index}>
                          {token.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
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
                <ListItem>
                  <Typography className={classes.text}>4. The app is powered by connext.network</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>5. A pop up from connext network will pop up to confirm details</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>6. Confirm and wait for the transfer to take place</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>
                    7. In case of any issues you can create a support ticket{' '}
                    <a target="blank" className={classes.a} href="https://support.connext.network/hc/en-us">
                      here
                    </a>
                  </Typography>
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
