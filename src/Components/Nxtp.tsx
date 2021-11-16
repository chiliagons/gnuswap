/* eslint-disable require-jsdoc */
import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import useStyles from "./styles";
import {
  Button,
  Card,
  Divider,
  Icon,
  Loader,
  Text,
  GenericModal,
} from "@gnosis.pm/safe-react-components";
import {
  MenuItem,
  Select,
  Grid,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Input,
} from "@material-ui/core";

import HelpIcon from "@material-ui/icons/Help";

import { Controller, useForm } from "react-hook-form";

import { BigNumber, providers, Signer, utils } from "ethers";
// @ts-ignore
import {
  ActiveTransaction,
  NxtpSdk,
  NxtpSdkEvents,
  HistoricalTransaction,
} from "@connext/nxtp-sdk";
// @ts-ignore
import { AuctionResponse, getRandomBytes32 } from "@connext/nxtp-utils";
import pino from "pino";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { SafeAppProvider } from "@gnosis.pm/safe-apps-provider";

import { chainProviders } from "../Utils/Shared";
import { swapConfig } from "../Constants/constants";
import { IBalance } from "../Models/Shared.model";
import { TableContext } from "../Providers/Txprovider";
import ErrorBoundary from "./ErrorBoundary";

const App: React.FC = () => {
  const { value, value2 } = useContext(TableContext);
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const gnosisWeb3Provider = new SafeAppProvider(safe, sdk);
  const [transferStateStarted, setTransferStateStarted] =
    useState<boolean>(false);
  const [chainData, setChainData] = useState<any[]>([]);
  const [web3Provider, setProvider] = useState<providers.Web3Provider>();
  const [injectedProviderChainId, setInjectedProviderChainId] =
    useState<number>();
  const [gnosisChainId, setGnosisChainId] = useState<number>();
  const [signer, setSigner] = useState<Signer>();
  const [nsdk, setSdk] = useState<NxtpSdk>();
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingTransfer, setShowLoadingTransfer] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [auctionResponse, setAuctionResponse] = useState<AuctionResponse>();
  const [activeTransferTableColumns, setActiveTransferTableColumns] = useState<
    ActiveTransaction[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPool, setSelectedPool] = useState(swapConfig[0]);
  const [tokenList, setTokenList] = useState<IBalance[]>([]);
  const [errorFetchedChecker, setErrorFetchedChecker] = useState(false);
  const [userBalance, setUserBalance] = useState<BigNumber>();
  const [transferAmount, setTransferAmount] = useState("");
  const [receivingTokenAdrress, setReceiveTokenAddress] = useState(
    "0x8a1Cad3703E0beAe0e0237369B4fcD04228d1682"
  );
  const [sendingAssetToken, setSendingAssetToken] = useState<IBalance>();
  const [historicalTransferTableColumns, setHistoricalTransferTableColumns] =
    useState<HistoricalTransaction[]>([]);
  const [latestActiveTx, setLatestActiveTx] = useState<ActiveTransaction>();
  const adornmentReceivingAddress = <Icon size="md" type="addressBook" />;
  const adornSendingContractAddress = <Icon size="md" type="sent" />;

  let addressField = "";

  interface ICrossChain {
    transferAmount: any;
    chain: any;
    token: any;
  }

  const { register, handleSubmit, control} = useForm<ICrossChain>();

  const onSubmit = (data: ICrossChain) => {
    alert(JSON.stringify(data));
  };

  const ethereum = (window as any).ethereum;

  const getTokensHandler = async (address) => {
    const tokenArr: Array<IBalance> = [];

    await fetch(
      `https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${address}/balances/?trusted=false&exclude_spam=false`
    )
      .then((res) => res.json())
      .then((response) => {
        response.forEach((_bal: IBalance) => {
          console.log(_bal);
          if (_bal.token !== null) {
            tokenArr.push(_bal);
          } else if (_bal.token === null) {
            _bal.token = {
              decimals: 18,
              logoUri:
                "https://gnosis-safe-token-logos.s3.amazonaws.com/0xF5238462E7235c7B62811567E63Dd17d12C2EAA0.png",
              name: "Ethereum",
              symbol: "ETH",
            };
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
    setReceiveTokenAddress(tokenAsBal.tokenAddress);
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
        console.log("sendingChain: ", sendingChain);
        setGnosisChainId(sendingChain);
        setSigner(_signerG);
        setProvider(gnosisProvider);
        // form.setFieldsValue({ receivingAddress: address });
        addressField = address;
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
  }, [errorFetchedChecker]);

  // useEffect(() => {
  //   const init = async () => {
  //     const json = await utils.fetchJson(
  //       "https://raw.githubusercontent.com/connext/chaindata/main/crossChain.json"
  //     );
  //     setChainData(json);
  //     const provider = new providers.Web3Provider(ethereum);
  //     const signer = await provider.getSigner();
  //     console.log("Signeer was triggered");
  //     const { chainId } = await signer.provider!.getNetwork();
  //     setInjectedProviderChainId(chainId);
  //     // const _sdk = new NxtpSdk(
  //     //   chainProviders,
  //     //   signer,
  //     //   pino({ level: "info" }),
  //     //   (process.env.REACT_APP_NETWORK as "mainnet") ?? "mainnet",
  //     //   process.env.REACT_APP_NATS_URL_OVERRIDE,
  //     //   process.env.REACT_APP_AUTH_URL_OVERRIDE
  //     // );
  //     // setSdk(_sdk);
  //     // const activeTxs = await _sdk.getActiveTransactions();
  //     // value2.setActiveTransactions(activeTxs);
  //     // setActiveTransferTableColumns(activeTxs);
  //     // console.log("activeTxs: ", activeTxs);
  //     // if (activeTxs[activeTxs.length - 1]) {
  //     //   setLatestActiveTx(activeTxs[activeTxs.length - 1]);
  //     // }

  //     // const historicalTxs = await _sdk.getHistoricalTransactions();
  //     // setHistoricalTransferTableColumns(historicalTxs);
  //     // console.log("historicalTxs: ", historicalTxs);
  //     // value.setTransactions(historicalTxs);

  //   //   _sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
  //   //     const { amount, expiry, preparedBlockNumber, ...invariant } =
  //   //       data.txData;
  //   //     const table = [...activeTransferTableColumns];
  //   //     table.push({
  //   //       crosschainTx: {
  //   //         invariant,
  //   //         sending: { amount, expiry, preparedBlockNumber },
  //   //       },
  //   //       bidSignature: data.bidSignature,
  //   //       encodedBid: data.encodedBid,
  //   //       encryptedCallData: data.encryptedCallData,
  //   //       status: NxtpSdkEvents.SenderTransactionPrepared,
  //   //       preparedTimestamp: Math.floor(Date.now() / 1000),
  //   //     });
  //   //     setActiveTransferTableColumns(table);
  //   //   });

  //   //   _sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
  //   //     console.log("SenderTransactionFulfilled:", data);
  //   //     setActiveTransferTableColumns(
  //   //       activeTransferTableColumns.filter(
  //   //         (t) =>
  //   //           t.crosschainTx.invariant.transactionId !==
  //   //           data.txData.transactionId
  //   //       )
  //   //     );
  //   //   });

  //   //   _sdk.attach(NxtpSdkEvents.SenderTransactionCancelled, (data) => {
  //   //     console.log("SenderTransactionCancelled:", data);
  //   //     setActiveTransferTableColumns(
  //   //       activeTransferTableColumns.filter(
  //   //         (t) =>
  //   //           t.crosschainTx.invariant.transactionId !==
  //   //           data.txData.transactionId
  //   //       )
  //   //     );
  //   //   });

  //   //   _sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
  //   //     setShowLoadingTransfer(false);
  //   //     const { amount, expiry, preparedBlockNumber, ...invariant } =
  //   //       data.txData;
  //   //     const index = activeTransferTableColumns.findIndex(
  //   //       (col) =>
  //   //         col.crosschainTx.invariant.transactionId === invariant.transactionId
  //   //     );
  //   //     const table = [...activeTransferTableColumns];
  //   //     if (index === -1) {
  //   //       // TODO: is there a better way to
  //   //       // get the info here?
  //   //       table.push({
  //   //         preparedTimestamp: Math.floor(Date.now() / 1000),
  //   //         crosschainTx: {
  //   //           invariant,
  //   //           sending: {} as any, // Find to do this, since it defaults to receiver side info
  //   //           receiving: { amount, expiry, preparedBlockNumber },
  //   //         },
  //   //         bidSignature: data.bidSignature,
  //   //         encodedBid: data.encodedBid,
  //   //         encryptedCallData: data.encryptedCallData,
  //   //         status: NxtpSdkEvents.ReceiverTransactionPrepared,
  //   //       });
  //   //       setActiveTransferTableColumns(table);
  //   //     } else {
  //   //       const item = { ...table[index] };
  //   //       table[index] = {
  //   //         ...item,
  //   //         status: NxtpSdkEvents.ReceiverTransactionPrepared,
  //   //         crosschainTx: {
  //   //           ...item.crosschainTx,
  //   //           receiving: { amount, expiry, preparedBlockNumber },
  //   //         },
  //   //       };
  //   //       setActiveTransferTableColumns(table);
  //   //     }
  //   //   });

  //   //   _sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, async (data) => {
  //   //     console.log("ReceiverTransactionFulfilled:", data);
  //   //     setActiveTransferTableColumns(
  //   //       activeTransferTableColumns.filter(
  //   //         (t) =>
  //   //           t.crosschainTx.invariant.transactionId !==
  //   //           data.txData.transactionId
  //   //       )
  //   //     );

  //   //     const historicalTxs = await _sdk.getHistoricalTransactions();
  //   //     setHistoricalTransferTableColumns(historicalTxs);
  //   //     console.log("historicalTxs: ", historicalTxs);
  //   //   });

  //   //   _sdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, (data) => {
  //   //     console.log("ReceiverTransactionCancelled:", data);
  //   //     setActiveTransferTableColumns(
  //   //       activeTransferTableColumns.filter(
  //   //         (t) =>
  //   //           t.crosschainTx.invariant.transactionId !==
  //   //           data.txData.transactionId
  //   //       )
  //   //     );
  //   //   });

  //   //   _sdk.attach(NxtpSdkEvents.SenderTokenApprovalMined, (data) => {
  //   //     console.log("SenderTokenApprovalMined:", data);
  //   //   });

  //   //   _sdk.attach(NxtpSdkEvents.SenderTransactionPrepareSubmitted, (data) => {
  //   //     console.log("SenderTransactionPrepareSubmitted:", data);
  //   //   });
  //   // };
  //   init();
  // }, [transferStateStarted, showLoadingTransfer]);

  const getTransferQuote = async (
    sendingChainId: number,
    sendingAssetId: string,
    receivingChainId: number,
    receivingAssetId: string,
    amount: string,
    receivingAddress: string
  ): Promise<AuctionResponse | undefined> => {
    console.log(
      sendingChainId,
      sendingAssetId,
      receivingChainId,
      receivingAssetId,
      amount,
      receivingAddress
    );
    setShowLoading(true);
    const provider = new providers.Web3Provider(ethereum);
    const _signer = await provider.getSigner();

    const nsdk = new NxtpSdk(
      chainProviders,
      _signer,
      pino({ level: "info" }),
      (process.env.REACT_APP_NETWORK as "mainnet") ?? "mainnet",
      process.env.REACT_APP_NATS_URL_OVERRIDE,
      process.env.REACT_APP_AUTH_URL_OVERRIDE
    );
    if (!nsdk) {
      return;
    }

    if (injectedProviderChainId !== sendingChainId) {
      alert("Please switch chains to the sending chain!");
      throw new Error("Wrong chain");
    }

    // Create txid
    const transactionId = getRandomBytes32();
    try {
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
      setShowLoading(false);
      setAuctionResponse(response);
      return response;
    } catch (e) {
      setShowLoading(false);
      setErrorMsg(e.message);
      return null;
    }
  };

  const transfer = async () => {
    const gnosisProvider = new providers.Web3Provider(gnosisWeb3Provider);
    const _signerG = gnosisProvider.getSigner();
    setTransferStateStarted(true);
    setShowLoadingTransfer(true);
    const nsdk = new NxtpSdk(
      chainProviders,
      _signerG,
      pino({ level: "info" }),
      (process.env.REACT_APP_NETWORK as "mainnet") ?? "mainnet",
      process.env.REACT_APP_NATS_URL_OVERRIDE,
      process.env.REACT_APP_AUTH_URL_OVERRIDE
    );
    if (!nsdk) {
      return;
    }
    if (!auctionResponse) {
      alert("Please request quote first");
      throw new Error("Please request quote first");
    }

    if (injectedProviderChainId !== auctionResponse.bid.sendingChainId) {
      alert("Please switch chains to the sending chain!");
      throw new Error("Wrong chain");
    }
    await nsdk.prepareTransfer(auctionResponse, true);

    // setTransferStateStarted(false);
  };

  const finishTransfer = async ({
    bidSignature,
    encodedBid,
    encryptedCallData,
    txData,
  }) => {
    console.log("finishTransfer", txData);

    const provider = new providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();
    console.log("finishTransfer");

    const sdk = new NxtpSdk(
      chainProviders,
      signer,
      pino({ level: "info" }),
      (process.env.REACT_APP_NETWORK as "mainnet") ?? "mainnet",
      process.env.REACT_APP_NATS_URL_OVERRIDE,
      process.env.REACT_APP_AUTH_URL_OVERRIDE
    );

    if (!sdk) {
      return;
    }

    const finish = await sdk.fulfillTransfer({
      bidSignature,
      encodedBid,
      encryptedCallData,
      txData,
    });
    console.log("finish: ", finish);
    setShowConfirmation(true);
    console.log(showConfirmation);
    if (
      finish.metaTxResponse?.transactionHash ||
      finish.metaTxResponse?.transactionHash === ""
    ) {
      setActiveTransferTableColumns(
        activeTransferTableColumns.filter(
          (t) => t.crosschainTx.invariant.transactionId !== txData.transactionId
        )
      );
    }
    setShowConfirmation(false);
  };

  const getChainName = (chainId: number): string => {
    const chain = chainData.find((chain) => chain?.chainId === chainId);
    return chain?.name ?? chainId.toString();
  };

    const generateSelectedPoolOptions = () => {
      return Object.keys(selectedPool.assets).map((chainId) => {
        return (
          <MenuItem key={chainId} value={chainId}>
            {chainId}
          </MenuItem>
        );
      });
    };
    const generateSelectTokenOptions = () => {
      return tokenList.map((_bal) => {
        return (
          <MenuItem key={_bal.token.symbol} value={JSON.stringify(_bal)}>
            {_bal.token.symbol}
          </MenuItem>
        );
      });
    };
    
  // UI HERE
  return (
    <>
      <ErrorBoundary>
        <Divider />
        <Container>
          <Grid className={classes.grid} container spacing={8}>
            <Grid item xs={12} sm={8}>
              <Card className={classes.card}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* <Form
                  form={form}
                  name="basic"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 100 }}
                  onFinish={() => {
                    transfer();
                  }}
                  initialValues={{
                    sendingChain: getChainName(
                      parseInt(Object.keys(selectedPool.assets)[0])
                    ),
                    receivingChain: getChainName(
                      parseInt(Object.keys(selectedPool.assets)[1])
                    ),
                    asset: selectedPool.name,
                    amount: "1",
                  }}
                > */}
                  <Controller
                    control={control}
                    name="chain"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        variant="outlined"
                        onChange={onChange}
                        value={value}
                      >
                        {generateSelectedPoolOptions()}
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name="token"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        variant="outlined"
                        onChange={onChange}
                        value={value}
                      >
                        {generateSelectTokenOptions()}
                      </Select>
                    )}
                  />
                  {/* <Select
                    onChange={(e) => setTokenWithBalance(e.target.value)}
                  >
                    {tokenList.map((_bal) => (
                      <option
                        key={_bal.token.symbol}
                        value={JSON.stringify(_bal)}
                      >
                        {_bal.token.symbol}
                      </option>
                    ))}
                  </Select> */}
                  <Input
                    value={register}
                    {...register("transferAmount")}
                    name="transferAmount"
                    placeholder="Add in your transfer amount"
                    type="text"
                    required
                  />
                  Balance:{" "}
                  <Button
                    onClick={() =>
                      setTransferAmount(utils.formatEther(userBalance ?? 0))
                    }
                    size="md"
                  >
                    {utils.formatEther(userBalance ?? 0)}
                  </Button>
                  <Input
                    aria-describedby="receivingAddress"
                    value={addressField}
                    type="text"
                    startAdornment={adornmentReceivingAddress}
                    required
                  />
                  <Input
                    // label="Sending Token Contract Address"
                    name="sendingAssetTokenContract"
                    value={receivingTokenAdrress}
                    placeholder={receivingTokenAdrress}
                    type="text"
                    // onChange={(re) => {
                    //   console.log(
                    //     "Change receivingTokenAdrress",
                    //     re.target.value
                    //   );
                    //   setReceiveTokenAddress(re.target.value);
                    // }}
                    startAdornment={adornSendingContractAddress}
                  />
                  <Input
                    name="receivedAmount"
                    type="text"
                    value={
                      auctionResponse &&
                      utils.formatEther(auctionResponse?.bid.amountReceived)
                    }
                    disabled
                    placeholder="..."
                  />
                  <Button
                    variant="bordered"
                    size="lg"
                    // disabled={!web3Provider || injectedProviderChainId !== parseInt(form.getFieldValue('sendingChain'))}
                    onClick={async () => {
                      const sendingAssetId = sendingAssetToken.tokenAddress; // from _bal -> set the tokenaddress
                      const receivingAssetId = receivingTokenAdrress; // from _bal -> set the tokenaddress
                      if (!sendingAssetId || !receivingAssetId) {
                        throw new Error(
                          "Configuration doesn't support selected swap"
                        );
                      }

                      // await getTransferQuote(
                      //   gnosisChainId,
                      //   sendingAssetId,
                      //   parseInt(.formgetFieldValue("receivingChain")),
                      //   receivingAssetId,
                      //   utils.parseEther(transferAmount).toString(),
                      //   form.getFieldValue("receivingAddress")
                      // );
                    }}
                  >
                    <p>Get Quote</p>

                    {showLoading && <Loader size="xs" />}
                  </Button>
                  {errorMsg.length !== 0 && (
                    <Text color="error" size="sm">
                      {errorMsg}
                    </Text>
                  )}
                  {() => (
                    <Button
                      iconType="chain"
                      // disabled={
                      //   form.getFieldValue("sendingChain") ===
                      //     form.getFieldValue("receivingChain") ||
                      //   !auctionResponse
                      // }
                      size="lg"
                      variant="bordered"
                      type="submit"
                    >
                      {showLoadingTransfer
                        ? "Transferring..."
                        : "Start Transfer"}
                      <span style={{ paddingLeft: 10 }}>
                        {showLoadingTransfer && <Loader size="xs" />}
                      </span>
                    </Button>
                  )}
                  <Button
                    iconType="rocket"
                    disabled={latestActiveTx?.status.length === 0}
                    size="lg"
                    variant="bordered"
                    onClick={async () => {
                      console.log("Clicked finish");
                      if (latestActiveTx)
                        await finishTransfer({
                          bidSignature: latestActiveTx.bidSignature,
                          encodedBid: latestActiveTx.encodedBid,
                          encryptedCallData: latestActiveTx.encryptedCallData,
                          txData: {
                            ...latestActiveTx.crosschainTx.invariant,
                            ...latestActiveTx.crosschainTx.receiving,
                          },
                        });
                    }}
                  >
                    Finish Transfer
                  </Button>
                </form>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card className={classes.supportcard}>
                <Typography
                  className={classes.text}
                  align="center"
                  variant="h6"
                >
                  Support
                </Typography>
                <List component="nav" aria-label="main mailbox folders">
                  <ListItem>
                    <ListItemIcon>
                      <HelpIcon />
                    </ListItemIcon>
                    <Typography className={classes.text}>
                      How it works
                    </Typography>
                  </ListItem>
                </List>
                <Divider />
                <List component="nav" aria-label="secondary mailbox folders">
                  <ListItem>
                    <Typography className={classes.text}>
                      1. Choose the receiving network
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography className={classes.text}>
                      2. Set the asset that you want to swap
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography className={classes.text}>
                      3. Enter the amount you want to swap
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography className={classes.text}>
                      2. Enter the reciever address
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography className={classes.text}>
                      4. Get a quotation!
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography className={classes.text}>
                      5. Once quote is received request for Starting a Swap and
                      then Finish it!!
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography className={classes.text}>
                      6. Confirm and wait for the transfer to take place
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography className={classes.text}>
                      7. In case of any issues you can create a support ticket{" "}
                      <a
                        target="blank"
                        className={classes.a}
                        href="https://support.connext.network/hc/en-us"
                      >
                        here
                      </a>
                    </Typography>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Container>
        {showConfirmation && (
          <GenericModal
            onClose={() => setShowConfirmation(false)}
            title="Success!"
            body={
              <div>
                <Typography
                  className={classes.text}
                  align="center"
                  variant="h6"
                >
                  Your transaction has been succesfully executed!
                </Typography>{" "}
              </div>
            }
          />
        )}
      </ErrorBoundary>
    </>
  );
};

export default App;
