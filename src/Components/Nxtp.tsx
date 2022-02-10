/* eslint-disable require-jsdoc */
import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import useStyles from "./styles";
import {
  Button,
  Card,
  Divider,
  Loader,
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
  FormControl,
  InputLabel,
} from "@material-ui/core";

import HelpIcon from "@material-ui/icons/Help";
import { Controller, useForm } from "react-hook-form";
import { BigNumber, ethers, providers, Signer, utils } from "ethers";
// @ts-ignore
import {
  ActiveTransaction,
  HistoricalTransaction,
  NxtpSdkEvents,
  NxtpSdk,
} from "@connext/nxtp-sdk";
// @ts-ignore
import { AuctionResponse, getRandomBytes32 } from "@connext/nxtp-utils";
import pino from "pino";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { SafeAppProvider } from "@gnosis.pm/safe-apps-provider";
import { chainProviders } from "../Utils/Shared";
import { connectWallet, getCurrentWalletConnected } from "../Utils/Wallet";
import { Modal } from "./Modal";
import ErrorBoundary from "./ErrorBoundary";
import { chainAddresses, contractAddresses } from "../Constants/constants";
import { IBalance } from "../Models/Shared.model";
import { IContractAddress, ICrossChain } from "../Models/Nxtp.model";
import { TableContext } from "../Providers/Txprovider";

declare let window: any;
const ethereum = (window as any).ethereum;

const App: React.FC = () => {
  const { historicalTransactions, activeTransactions } =
    useContext(TableContext);
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const gnosisWeb3Provider = new SafeAppProvider(safe, sdk);
  const [web3Provider, setProvider] = useState<providers.Web3Provider>();
  const [signerGnosis, setSignerGnosis] = useState<Signer>();
  const [signerWallet, setSignerWallet] = useState<Signer>();
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingTransfer, setShowLoadingTransfer] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [auctionResponse, setAuctionResponse] = useState<AuctionResponse>();

  const [chainList, setChainList] = useState(chainAddresses);
  const [contractList, setContractList] = useState(contractAddresses);
  const [tokenList, setTokenList] = useState<IBalance[]>([]);

  const [errorFetchedChecker, setErrorFetchedChecker] = useState(false);
  const [userBalance, setUserBalance] = useState<BigNumber>();
  const [transferAmount, setTransferAmount] = useState<string>();
  const [latestActiveTx, setLatestActiveTx] = useState<ActiveTransaction>();
  const [showError, setShowError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { handleSubmit, control } = useForm<ICrossChain>();

  const [historicalTransferTableColumns, setHistoricalTransferTableColumns] =
    useState<HistoricalTransaction[]>([]);

  const connectProvider = async () => {
    try {
      const gnosisProvider = new providers.Web3Provider(gnosisWeb3Provider);
      const _signerG = await gnosisProvider.getSigner();
      if (_signerG) {
        const network =
          _signerG.provider["provider"].safe?.network?.toLowerCase();
        const address = await _signerG.getAddress();
        if (address) {
          await getTokensHandler(address, network);
          setSignerGnosis(_signerG);
          setProvider(gnosisProvider);
          return true;
        }
      }
    } catch (e) {
      return false;
    }
  };
  const contractAddressHandler = ({
    contractGroupId,
    chainId,
  }: IContractAddress) => {
    const chosenContractList = contractList.find((contractGroup) => {
      return contractGroup.symbol === contractGroupId;
    });

    const chosenContractAddress = chosenContractList.contracts.find(
      (contract) => {
        return contract.chain_id === chainId;
      }
    );
    return chosenContractAddress;
  };

  // called on submission of get Quote
  const onSubmit = async (crossChainData: ICrossChain) => {
    try {
      const sendingChain = await signerGnosis.getChainId();

      const sendingContractAddress = contractAddressHandler({
        contractGroupId: JSON.parse(crossChainData.token).token.symbol,
        chainId: sendingChain,
      });
      const receivingContractAddress = contractAddressHandler({
        contractGroupId: JSON.parse(crossChainData.token).token.symbol,
        chainId: crossChainData.chain,
      });

      await getTransferQuote(
        sendingChain,
        sendingContractAddress.contract_address,
        crossChainData.chain,
        receivingContractAddress.contract_address,
        utils.parseEther(crossChainData.transferAmount).toString(),
        crossChainData.receivingAddress
      );
    } catch (e) {
      setErrorMessage(e.message);
      setShowError(true);
    }
  };

  // utilizing a network call to get the safe token details rather than from SDK
  const getTokensHandler = async (address, network) => {
    const tokenArr: Array<IBalance> = [];
    await fetch(
      `https://safe-transaction.${network}.gnosis.io/api/v1/safes/${address}/balances/?trusted=false&exclude_spam=false`
    )
      .then((res) => res.json())
      .then((response) => {
        response.forEach((_bal: IBalance) => {
          if (_bal.token === null) {
            _bal.token = {
              decimals: 18,
              logoUri:
                "https://gnosis-safe-token-logos.s3.amazonaws.com/0xF5238462E7235c7B62811567E63Dd17d12C2EAA0.png",
              name: "Ethereum",
              symbol: "ETH",
            };
          }
          tokenArr.push(_bal);
        });
        setTokenList(tokenArr);
      })
      .catch((e) => {
        setErrorMessage(e.message);
        setShowError(true);
      });
  };

  const tokenSelected = (element) => {
    try {
      if (element.target?.value) {
        if (JSON.parse(element.target.value).balance)
          setUserBalance(
            BigNumber.from(JSON.parse(element.target.value).balance)
          );
      }
    } catch (E) {
      console.log(E);
    }
  };

  // check if gnosis provider is connected else keep trying to connect
  useEffect(() => {
    async function testFunc() {
      const flag: boolean = await connectProvider();
      if (!flag) {
        setErrorFetchedChecker((c) => !c);
      }
    }
    testFunc();
  }, [errorFetchedChecker]);

  useEffect(() => {
    const init = async () => {
      await connectWallet(); // on load connect to the wallet if not already connected
      const { address, status, providers } = await getCurrentWalletConnected();
      setStatus(status);
      setWallet(address);
      if (status === "Connected") {
        try {
          const signerW = await providers.getSigner();

          setSignerWallet(signerW);
          const nsdk = await NxtpSdk.create({
            chainConfig: chainProviders,
            signer: signerW,
            logger: pino({ level: "info" }),
          });

          if (nsdk && address) {
            // here we should get the active transactions of the user or EOA
            const activeTxs = await nsdk.getActiveTransactions();
            const historicalTxs = await nsdk.getHistoricalTransactions();
            setHistoricalTransferTableColumns(historicalTxs);
            console.log("historicalTxs: ", historicalTxs);
            historicalTransactions.setTransactions(historicalTxs);

            // value2.setActiveTransactions(activeTxs);
            // setActiveTransferTableColumns(activeTxs);
            activeTransactions.setActiveTransactions(activeTxs);
            console.log("activeTxs   : ", activeTxs);
            if (activeTxs[activeTxs.length - 1]) {
              setLatestActiveTx(activeTxs[0]);
              console.log(
                "setLatestActiveTx: ",
                activeTxs[0]
              );
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
      addWalletListener();
    };
    init();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts: any) => {
        if (accounts.length > 0) {
          const address = ethers.utils.getAddress(accounts[0]);
          setWallet(address);
          setStatus("Ready to mint!");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask.");
        }
      });
    } else {
      setStatus("Please install Metamask.");
    }
  }
  const getTransferQuote = async (
    sendingChainId: number,
    sendingAssetId: string,
    receivingChainId: number,
    receivingAssetId: string,
    amount: string,
    receivingAddress: string
  ): Promise<AuctionResponse | undefined> => {
    console.log(
      "Start getting quote",
      sendingChainId,
      sendingAssetId,
      receivingChainId,
      receivingAssetId,
      amount,
      receivingAddress
    );
    setShowLoading(true);
    // const provider = new providers.Web3Provider(ethereum);
    // const signerW = await provider.getSigner();
    const nsdk = await NxtpSdk.create({
      chainConfig: chainProviders,
      signer: signerWallet,
      logger: pino({ level: "info" }),
    });
    const initiator = await signerGnosis.getAddress();
    if (!nsdk) {
      return;
    }

    console.log("Initiating request as ",initiator )

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
        initiator,
        transactionId,
        expiry: Math.floor(Date.now() / 1000) + 3600 * 24 * 3, // 3 days
      });
      setShowLoading(false);
      setAuctionResponse(response);
      return response;
    } catch (e) {
      console.log(e);
      if (e.type === "ConfigError") {
        setErrorMessage("This chain configuration is not supported");
        setShowError(true);
      }
      setShowLoading(false);
      return null;
    }
  };

  const transfer = async () => {
    setShowLoadingTransfer(true);
    const nsdk = new NxtpSdk({
      chainConfig: chainProviders,
      signer: signerGnosis,
      logger: pino({ level: "info" }),
    });
    if (!nsdk) {
      return;
    }
    if (!auctionResponse) {
      alert("Please request quote first");
      throw new Error("Please request quote first");
    }
    const prepTransfer = await nsdk.prepareTransfer(auctionResponse, true);
    if (prepTransfer.transactionId) {
      console.log("Prepared transaction", prepTransfer);
      setShowLoadingTransfer(false);
    }
  };

  const finishTransfer = async ({
    bidSignature,
    encodedBid,
    encryptedCallData,
    txData,
  }) => {
    const provider = new providers.Web3Provider(ethereum);
    const signerW = await provider.getSigner();
    // const initiator = await signerGnosis.getAddress();

    const nsdk = new NxtpSdk({
      chainConfig: chainProviders,
      signer: signerW,
      logger: pino({ level: "info" }),
    });

    if (!nsdk) {
      return;
    }
    try{

    const finish = await nsdk.fulfillTransfer({
      bidSignature,
      encodedBid,
      encryptedCallData,
      txData,
    });
    
      }
    catch(err) {
      console.log("Unable to fulfillTransfer", err)
    }
    // setShowConfirmation(true);
    // console.log(showConfirmation);
    // setShowConfirmation(false);
  };

  const selectMenuChainAddresses = () => {
    return chainList.map((address) => {
      return (
        address && (
          <MenuItem key={address.id} value={address.chain_id}>
            {address.title}
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
        {showError && (
          <Modal
            setTrigger={setShowError}
            title="Error"
            message={errorMessage}
            styling={classes.text}
          />
        )}
        <div className={classes.grid}>
          <Card className={classes.card}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={classes.input}>
                <FormControl>
                  <InputLabel
                    style={{ paddingLeft: "10px" }}
                    htmlFor="chainAddress"
                  >
                    Select the chain you want to send the assets to
                  </InputLabel>
                  <Controller
                    control={control}
                    name="chain"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        variant="outlined"
                        onChange={onChange}
                        value={value ? value : ""}
                        label="chainAddressSelect"
                        id="chainAddressSelect"
                      >
                        {selectMenuChainAddresses()}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              <div className={classes.input}>
                <FormControl>
                  <InputLabel style={{ paddingLeft: "10px" }} htmlFor="token">
                    Select Token
                  </InputLabel>
                  <Controller
                    control={control}
                    name="token"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        variant="outlined"
                        value={value ? value : ""}
                        onChange={(value) => {
                          onChange(value);
                          tokenSelected(value);
                        }}
                      >
                        {generateSelectTokenOptions()}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              <div className={classes.formContentRow}>
                <FormControl>
                  <span>
                    <Controller
                      name={"transferAmount"}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TextFieldInput
                          className={classes.input}
                          id="transferAmountInput"
                          label="transferAmount"
                          name="transferAmount"
                          placeholder="Transfer Amount"
                          value={transferAmount}
                          onChange={onChange}
                          hiddenLabel={true}
                        />
                      )}
                    />
                  </span>
                </FormControl>
                <span className={classes.formContentRow}>
                  <h2
                    style={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      marginBottom: 0,
                    }}
                  >
                    Balance:
                  </h2>
                  <Button
                    onClick={() => {
                      setTransferAmount(utils.formatEther(userBalance ?? 0));
                    }}
                    size="md"
                  >
                    {utils.formatEther(userBalance ?? 0)}
                  </Button>
                </span>
              </div>
              <div className={classes.formContentColumn}>
                <Controller
                  name={"receivingAddress"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AddressInput
                      className={classes.input}
                      address={value}
                      label={"Receiving Address"}
                      name="receivingAddress"
                      onChangeAddress={onChange}
                      placeholder="Receiving Address"
                      hiddenLabel={true}
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
                        placeholder="Swap Amount"
                        disabled={true}
                      />
                    )}
                  />
                </span>
                <Button size="lg" type="submit" variant="bordered">
                  Get Quote
                  {showLoading && <Loader size="xs" />}
                </Button>
              </div>
              <Divider />
              <div
                className={classes.formContentSubmitRow}
                style={{ paddingTop: "1vh" }}
              >
                <Button
                  iconType="chain"
                  size="lg"
                  variant="bordered"
                  onClick={async () => {
                    await transfer();
                  }}
                >
                  {showLoadingTransfer ? "Starting Transfer..." : "Start"}
                  <span>{showLoadingTransfer && <Loader size="xs" />}</span>
                </Button>

                <Button
                  iconType="rocket"
                  // disabled={latestActiveTx?.status.length === 0}
                  size="lg"
                  variant="bordered"
                  onClick={async () => {
                    // if (latestActiveTx)
                    await finishTransfer({
                      bidSignature: latestActiveTx.bidSignature,
                      encodedBid: latestActiveTx.encodedBid,
                      encryptedCallData: latestActiveTx.encryptedCallData,
                      txData: {
                        ...latestActiveTx.crosschainTx.invariant,
                        ...latestActiveTx.crosschainTx.sending,
                        amountReceived: latestActiveTx.crosschainTx.receiving.amount
                      },
                    });
                  }}
                >
                  Transfer
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
                    1. Choose the receiving network/chain
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
                    4. Get a quotation from different routers!
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>
                    5. Once quote is received request, Start the swap! Check
                    Transactions for Acive Transfers
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>
                    6. Once the transaction has been prepared Finish the
                    transfer
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.text}>
                    7. In case of any issues you can create a support ticket{" "}
                    <a
                      target="blank"
                      className={classes.a}
                      href="https://github.com/chiliagons/gnuswap/issues"
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
        <Modal
          setTrigger={setShowConfirmation}
          title="Success!"
          message={"Your transaction has been succesfully executed!"}
          styling={classes.text}
        />
      )}
    </ErrorBoundary>
  );
};

export default App;
