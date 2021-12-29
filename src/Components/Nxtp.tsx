/* eslint-disable require-jsdoc */
import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import useStyles from "./styles";
import {
  Button,
  Card,
  Divider,
  Loader,
  Text,
  GenericModal,
  TextFieldInput,
  AddressInput,
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

  let addressField = "";

  interface ICrossChain {
    transferAmount: any;
    receivingAddress: any;
    sendingAssetTokenContract: any;
    receivedAmount: any;
    chain: any;
    token: any;
  }

  const { register, handleSubmit, control } = useForm<ICrossChain>();

  const onSubmit = async (crossChainData: ICrossChain) => {
    console.log(JSON.stringify(crossChainData));
    await getTransferQuote(
      5,
      crossChainData.sendingAssetTokenContract,
      3,
      "0xe71678794fff8846bff855f716b0ce9d9a78e844",
      utils.parseEther(crossChainData.transferAmount).toString(),
      crossChainData.receivingAddress
    );
  };

  const ethereum = (window as any).ethereum;

  const getTokensHandler = async (address) => {
    const tokenArr: Array<IBalance> = [];

    await fetch(
      `https://safe-transaction.goerli.gnosis.io/api/v1/safes/${address}/balances/?trusted=false&exclude_spam=false`
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
    const nsdk = await NxtpSdk.create({
      chainConfig: chainProviders,
      signer: _signer,
      logger: pino({ level: "info" }),
    });

    if (!nsdk) {
      return;
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
    const nsdk = new NxtpSdk({
      chainConfig: chainProviders,
      signer: _signerG,
      logger: pino({ level: "info" }),
    });
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

    const sdk = new NxtpSdk({
      chainConfig: chainProviders,
      signer: signer,
      logger: pino({ level: "info" }),
    });

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
    setShowConfirmation(false);
  };

  const getChainName = (chainId: number): string => {
    const chain = chainData.find((chain) => chain?.chainId === chainId);
    return chain?.name ?? chainId.toString();
  };

  const generateSelectedPoolOptions = () => {
    return Object.keys(selectedPool.assets).map((chainId) => {
      return (
        chainId && (
          <MenuItem key={chainId} value={chainId}>
            {" "}
            {chainId}{" "}
          </MenuItem>
        )
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
    <ErrorBoundary>
      <Divider />
      <Container>
        <div className={classes.grid}>
          <Card className={classes.card}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={classes.input}>
                <Controller
                  control={control}
                  name="chain"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      variant="outlined"
                      onChange={onChange}
                      value={value ? value : ""}
                    >
                      {generateSelectedPoolOptions()}
                    </Select>
                  )}
                />
              </div>
              <div className={classes.input}>
                <Controller
                  control={control}
                  name="token"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      variant="outlined"
                      onChange={onChange}
                      value={value ? value : ""}
                    >
                      {generateSelectTokenOptions()}
                    </Select>
                  )}
                />
              </div>
              <div className={classes.formContentRow}>
                <span>
                  <Controller
                    name={"transferAmount"}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextFieldInput
                        className={classes.input}
                        onChange={onChange}
                        value={value}
                        label={"Transfer Amount"}
                        name="transferAmount"
                      />
                    )}
                  />
                </span>
                Balance:
                <Button
                  onClick={() =>
                    setTransferAmount(utils.formatEther(userBalance ?? 0))
                  }
                  size="md"
                >
                  {utils.formatEther(userBalance ?? 0)}
                </Button>
              </div>
              <div className={classes.formContentColumn}>
                <Controller
                  name={"receivingAddress"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AddressInput
                      className={classes.input}
                      address={value}
                      defaultValue={value}
                      label={"Receiving Address"}
                      name="receivingAddress"
                      onChangeAddress={onChange}
                    />
                  )}
                />
                <Controller
                  name={"sendingAssetTokenContract"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextFieldInput
                      className={classes.input}
                      onChange={onChange}
                      value={value}
                      label={"Sending Asset Token Contract"}
                      name="sendingAssetTokenContract"
                    />
                  )}
                />
              </div>
              <div className={classes.formContentRow}>
                <span>
                  <Controller
                    name={"receivedAmount"}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <TextFieldInput
                        className={classes.input}
                        name="receivedAmount"
                        onChange={onChange}
                        value={
                          auctionResponse &&
                          utils.formatEther(auctionResponse?.bid.amountReceived)
                        }
                        label="..."
                        disabled={true}
                      />
                    )}
                  />
                </span>

                <Button
                  textSize="md"
                  size="md"
                  type="submit"
                  variant="bordered"
                >
                  Get Quote
                  {showLoading && <Loader size="xs" />}
                </Button>
              </div>
              <div
                className={classes.formContentRow}
                style={{ paddingTop: "1.5vh" }}
              >
                <Button
                  textSize="md"
                  iconType="chain"
                  iconSize="sm"
                  size="lg"
                  variant="bordered"
                >
                  {showLoadingTransfer ? "Transferring..." : "Start Transfer"}
                  <span>{showLoadingTransfer && <Loader size="xs" />}</span>
                </Button>
                <Button
                  textSize="md"
                  iconType="rocket"
                  iconSize="sm"
                  disabled={latestActiveTx?.status.length === 0}
                  size="lg"
                  variant="bordered"
                  onClick={async () => {
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
              </div>
            </form>
          </Card>
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
        </div>
      </Container>
      {showConfirmation && (
        <GenericModal
          onClose={() => setShowConfirmation(false)}
          title="Success!"
          body={
            <div>
              <Typography className={classes.text} align="center" variant="h6">
                Your transaction has been succesfully executed!
              </Typography>{" "}
            </div>
          }
        />
      )}
    </ErrorBoundary>
  );
};

export default App;
