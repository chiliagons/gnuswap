/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from 'react';
import '../App.css';
import useStyles from './styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, Divider, TextField, Button } from '@gnosis.pm/safe-react-components';
import { MenuItem, Select, Grid, Container, Typography, List, ListItem, ListItemIcon } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { Col, Row, Input, Form } from 'antd';

import { BigNumber, providers, Signer, utils } from 'ethers';
//@ts-ignore
import { ActiveTransaction, NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
//@ts-ignore
import { AuctionResponse, getRandomBytes32 } from '@connext/nxtp-utils';
import pino from 'pino';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';

import { chainProviders } from '../Utils/Shared';
import { swapConfig } from '../constants';
import { IBalance } from '../Models/Shared.model';

const App: React.FC = () => {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const gnosisWeb3Provider = new SafeAppProvider(safe, sdk);
  const [chainData, setChainData] = useState<any[]>([]);
  const [web3Provider, setProvider] = useState<providers.Web3Provider>();
  const [injectedProviderChainId, setInjectedProviderChainId] = useState<number>();
  const [gnosisChainId, setGnosisChainId] = useState<number>();
  const [signer, setSigner] = useState<Signer>();
  const [nsdk, setSdk] = useState<NxtpSdk>();
  const [auctionResponse, setAuctionResponse] = useState<AuctionResponse>();
  const [activeTransferTableColumns, setActiveTransferTableColumns] = useState<ActiveTransaction[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPool, setSelectedPool] = useState(swapConfig[0]);
  const [tokenList, setTokenList] = useState<IBalance[]>([]);
  const [errorFetchedChecker, setErrorFetchedChecker] = useState(false);
  const [userBalance, setUserBalance] = useState<BigNumber>();
  const [transferAmount, setTransferAmount] = useState('');
  const [sendingAssetToken, setSendingAssetToken] = useState<IBalance>();
  var address_field = '';
  const [form] = Form.useForm();
  const ethereum = (window as any).ethereum;

  const getTokensHandler = async (address) => {
    let tokenArr: Array<IBalance> = [];

    await fetch(`https://safe-transaction.gnosis.io/api/v1/safes/${address}/balances/?trusted=false&exclude_spam=false`)
      .then((res) => res.json())
      .then((response) => {
        response.forEach((_bal: IBalance) => {
          if (_bal.token !== null) {
            tokenArr.push(_bal);
          }
        });
        setTokenList(tokenArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setTokenWithBalance = (bal) => {
    const tokenAsBal: IBalance = JSON.parse(bal);
    setSendingAssetToken(tokenAsBal);
    setUserBalance(BigNumber.from(tokenAsBal.balance));
  };

  const connectProvider = async () => {
    try {
      const gnosisProvider = new providers.Web3Provider(gnosisWeb3Provider);
      const _signerG = await gnosisProvider.getSigner();
      if (_signerG) {
        const address = await _signerG.getAddress();
        await getTokensHandler(address);
        const sendingChain = await _signerG.getChainId();
        console.log('sendingChain: ', sendingChain);
        setGnosisChainId(sendingChain);
        setSigner(_signerG);
        setProvider(gnosisProvider);
        form.setFieldsValue({ receivingAddress: address });
        address_field = address;
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    async function testFunc() {
      const flag: boolean = await connectProvider();
      if (!flag) {
        setErrorFetchedChecker((c) => !c);
      }
    }
    testFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorFetchedChecker]);

  useEffect(() => {
    const init = async () => {
      const json = await utils.fetchJson('https://raw.githubusercontent.com/connext/chaindata/main/crossChain.json');
      setChainData(json);
      if (!signer || !web3Provider) {
        return;
      }
      const { chainId } = await signer.provider!.getNetwork();
      setInjectedProviderChainId(chainId);
      const _sdk = new NxtpSdk(
        chainProviders,
        signer,
        pino({ level: 'info' }),
        (process.env.REACT_APP_NETWORK as 'mainnet') ?? 'mainnet',
        process.env.REACT_APP_NATS_URL_OVERRIDE,
        process.env.REACT_APP_AUTH_URL_OVERRIDE,
      );
      setSdk(_sdk);
      const activeTxs = await _sdk.getActiveTransactions();

      setActiveTransferTableColumns(activeTxs);

      _sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
        const { amount, expiry, preparedBlockNumber, ...invariant } = data.txData;
        const table = [...activeTransferTableColumns];
        table.push({
          crosschainTx: {
            invariant,
            sending: { amount, expiry, preparedBlockNumber },
          },
          bidSignature: data.bidSignature,
          encodedBid: data.encodedBid,
          encryptedCallData: data.encryptedCallData,
          status: NxtpSdkEvents.SenderTransactionPrepared,
        });
        setActiveTransferTableColumns(table);
      });

      _sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
        setActiveTransferTableColumns(activeTransferTableColumns.filter((t) => t.crosschainTx.invariant.transactionId !== data.txData.transactionId));
      });

      _sdk.attach(NxtpSdkEvents.SenderTransactionCancelled, (data) => {
        setActiveTransferTableColumns(activeTransferTableColumns.filter((t) => t.crosschainTx.invariant.transactionId !== data.txData.transactionId));
      });

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
        const { amount, expiry, preparedBlockNumber, ...invariant } = data.txData;
        const index = activeTransferTableColumns.findIndex((col) => col.crosschainTx.invariant.transactionId === invariant.transactionId);

        const table = [...activeTransferTableColumns];
        if (index === -1) {
          table.push({
            crosschainTx: {
              invariant,
              sending: {} as any, // Find to do this, since it defaults to receiver side info
              receiving: { amount, expiry, preparedBlockNumber },
            },
            bidSignature: data.bidSignature,
            encodedBid: data.encodedBid,
            encryptedCallData: data.encryptedCallData,
            status: NxtpSdkEvents.ReceiverTransactionPrepared,
          });
          setActiveTransferTableColumns(table);
        } else {
          const item = { ...table[index] };
          table[index] = {
            ...item,
            status: NxtpSdkEvents.ReceiverTransactionPrepared,
            crosschainTx: {
              ...item.crosschainTx,
              receiving: { amount, expiry, preparedBlockNumber },
            },
          };
          setActiveTransferTableColumns(table);
        }
      });

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, (data) => {
        setActiveTransferTableColumns(activeTransferTableColumns.filter((t) => t.crosschainTx.invariant.transactionId !== data.txData.transactionId));
      });

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, (data) => {
        setActiveTransferTableColumns(activeTransferTableColumns.filter((t) => t.crosschainTx.invariant.transactionId !== data.txData.transactionId));
      });

      _sdk.attach(NxtpSdkEvents.SenderTokenApprovalMined, (data) => {
        console.log('SenderTokenApprovalMined:', data);
      });

      _sdk.attach(NxtpSdkEvents.SenderTransactionPrepareSubmitted, (data) => {
        console.log('SenderTransactionPrepareSubmitted:', data);
      });
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Provider, signer]);

  const getTransferQuote = async (
    sendingChainId: number,
    sendingAssetId: string,
    receivingChainId: number,
    receivingAssetId: string,
    amount: string,
    receivingAddress: string,
  ): Promise<AuctionResponse | undefined> => {
    if (!nsdk) {
      return;
    }
    const provider = new providers.Web3Provider(ethereum);
    const _signer = provider.getSigner();
    setSigner(_signer);
    setProvider(provider);

    if (injectedProviderChainId !== sendingChainId) {
      alert('Please switch chains to the sending chain!');
      throw new Error('Wrong chain');
    }

    // Create txid
    const transactionId = getRandomBytes32();

    const response = await nsdk.getTransferQuote({
      sendingAssetId,
      sendingChainId,
      receivingChainId,
      receivingAssetId,
      receivingAddress,
      amount,
      transactionId,
      expiry: Math.floor(Date.now() / 1000) + 3600 * 24 * 3, // 3 days
    });

    setAuctionResponse(response);
    return response;
  };

  const transfer = async () => {
    if (!nsdk) {
      return;
    }
    const gnosisProvider = new providers.Web3Provider(gnosisWeb3Provider);
    const _signerG = gnosisProvider.getSigner();
    setSigner(_signerG);
    setProvider(gnosisProvider);
    if (!auctionResponse) {
      alert('Please request quote first');
      throw new Error('Please request quote first');
    }

    if (injectedProviderChainId !== auctionResponse.bid.sendingChainId) {
      alert('Please switch chains to the sending chain!');
      throw new Error('Wrong chain');
    }
    await nsdk.prepareTransfer(auctionResponse, true);
  };

  const getChainName = (chainId: number): string => {
    const chain = chainData.find((chain) => chain?.chainId === chainId);
    return chain?.name ?? chainId.toString();
  };

  //UI HERE
  return (
    <>
      <Divider />
      <Container>
        <Grid className={classes.grid} container spacing={8}>
          <Grid item xs={12} sm={8}>
            <Card className={classes.card}>
              <Form
                form={form}
                name="basic"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 100 }}
                onFinish={() => {
                  transfer();
                }}
                initialValues={{
                  sendingChain: getChainName(parseInt(Object.keys(selectedPool.assets)[0])),
                  receivingChain: getChainName(parseInt(Object.keys(selectedPool.assets)[1])),
                  asset: selectedPool.name,
                  amount: '1',
                }}
              >
                <Form.Item name="sendingChain">
                  <Row gutter={18}>
                    <Col span={16}></Col>
                    <Col span={8}></Col>
                  </Row>
                </Form.Item>

                <Form.Item>
                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item name="receivingChain">
                        <Select variant="outlined">
                          {Object.keys(selectedPool.assets).map((chainId) => (
                            <MenuItem key={chainId} value={chainId}>
                              {getChainName(parseInt(chainId))}
                            </MenuItem>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item name="asset">
                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item name="asset">
                        <Select variant="outlined" onChange={(e) => setTokenWithBalance(e.target.value)}>
                          {tokenList.map((_bal) => (
                            <MenuItem key={_bal.token.symbol} value={JSON.stringify(_bal)}>
                              {_bal.token.symbol}
                            </MenuItem>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item>
                  <Row gutter={18}>
                    <Col span={16}>
                      <TextField label="Transfer Amount" name="amount" value={transferAmount} type="text" onChange={(e) => setTransferAmount(e.target.value)} />
                    </Col>
                    <Col span={8}>
                      Balance:{' '}
                      <Button onClick={() => setTransferAmount(utils.formatEther(userBalance ?? 0))} size="md">
                        {utils.formatEther(userBalance ?? 0)}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item name="receivingAddress">
                  <TextField label="Receiving Address" name="receivingAddress" aria-describedby="receivingAddress" value={address_field} type="text" required />
                </Form.Item>

                <Form.Item name="receivedAmount">
                  <Input
                    disabled
                    placeholder="..."
                    addonAfter={
                      //Need to select sendingChainId
                      //need to select the asset from the drop down
                      <Button
                        size="md"
                        disabled={!web3Provider || injectedProviderChainId !== parseInt(form.getFieldValue('sendingChain'))}
                        onClick={async () => {
                          const sendingAssetId = sendingAssetToken.tokenAddress; //from _bal -> set the tokenaddress
                          const receivingAssetId = sendingAssetToken.tokenAddress; //from _bal -> set the tokenaddress
                          if (!sendingAssetId || !receivingAssetId) {
                            throw new Error("Configuration doesn't support selected swap");
                          }

                          const response = await getTransferQuote(
                            gnosisChainId,
                            sendingAssetId,
                            parseInt(form.getFieldValue('receivingChain')),
                            receivingAssetId,
                            utils.parseEther(transferAmount).toString(),
                            form.getFieldValue('receivingAddress'),
                          );
                          form.setFieldsValue({ receivedAmount: utils.formatEther(response!.bid.amountReceived) });
                        }}
                      >
                        Get Quote
                      </Button>
                    }
                  />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 0, span: 15 }} dependencies={['sendingChain', 'receivingChain']}>
                  {() => (
                    <Button
                      iconType="chain"
                      disabled={form.getFieldValue('sendingChain') === form.getFieldValue('receivingChain') || !auctionResponse}
                      size="md"
                      type="submit"
                    >
                      Cross Chain Transfer
                    </Button>
                  )}
                </Form.Item>
              </Form>
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
                  <Typography className={classes.text}>1. Choose the receiving network</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>2. Set the asset that you want to swap</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>3. Enter the amount you want to swap</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>2. Enter the reciever address</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>4. Get a quotation!</Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>5. Once quote is received request for Cross Chain Swap</Typography>
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
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default App;
