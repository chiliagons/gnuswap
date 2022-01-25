/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from "react";
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

import { BigNumber, providers, Signer, utils } from "ethers";
// @ts-ignore
import { ActiveTransaction, NxtpSdkEvents, NxtpSdk } from "@connext/nxtp-sdk";
// @ts-ignore
import { AuctionResponse, getRandomBytes32 } from "@connext/nxtp-utils";
import pino from "pino";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { SafeAppProvider } from "@gnosis.pm/safe-apps-provider";

import { chainProviders } from "../Utils/Shared";
import { Modal } from "./Modal";

import ErrorBoundary from "./ErrorBoundary";

import { chainAddresses, contractAddresses } from "../Constants/constants";

import { IBalance } from "../Models/Shared.model";
import { IContractAddress, ICrossChain } from "../Models/Nxtp.model";

const App: React.FC = () => {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const gnosisWeb3Provider = new SafeAppProvider(safe, sdk);

  const [web3Provider, setProvider] = useState<providers.Web3Provider>();
  const [signer, setSigner] = useState<Signer>();
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingTransfer, setShowLoadingTransfer] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [auctionResponse, setAuctionResponse] = useState<AuctionResponse>();

  const [chainList, setChainList] = useState(chainAddresses);
  const [contractList, setContractList] = useState(contractAddresses);
  const [tokenList, setTokenList] = useState<IBalance[]>([]);

  const [errorFetchedChecker, setErrorFetchedChecker] = useState(false);
  const [userBalance, setUserBalance] = useState<BigNumber>();
  const [latestActiveTx, setLatestActiveTx] = useState<ActiveTransaction>();
  const [showError, setShowError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { handleSubmit, control } = useForm<ICrossChain>();

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

  const onSubmit = async (crossChainData: ICrossChain) => {
    try {
      const sendingChain = await signer.getChainId();
      console.log("sendingChain - ", sendingChain);

      const sendingContractAddress = contractAddressHandler({
        contractGroupId: JSON.parse(crossChainData.token).token.symbol,
        chainId: sendingChain,
      });
      const receivingContractAddress = contractAddressHandler({
        contractGroupId: JSON.parse(crossChainData.token).token.symbol,
        chainId: crossChainData.chain,
      });
      console.log(
        "Contract Address",
        receivingContractAddress.contract_address
      );
      console.log(JSON.stringify(crossChainData));

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
      console.log(e.message);
    }
  };

  const ethereum = (window as any).ethereum;

  const getTokensHandler = async (address,network) => {
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
        console.log(e);
      });
  };
 
  const connectProvider = async () => {
    try {
      const gnosisProvider = new providers.Web3Provider(gnosisWeb3Provider);
      const _signerG = await gnosisProvider.getSigner();

      if (_signerG) {
      console.log("provider ---" , _signerG.provider["provider"].safe.network);
        const network = _signerG.provider["provider"].safe?.network?.toLowerCase();
        const address = await _signerG.getAddress();
        if(address)
        await getTokensHandler(address, network);

        setSigner(_signerG);
        setProvider(gnosisProvider);
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

  useEffect(() => {
    const init = async () => {
      console.log("We are in the init....");
      // here we should get the active transactions of the user or EOA
      const provider = new providers.Web3Provider(ethereum);
      const signerW = await provider.getSigner();
      const nsdk = await NxtpSdk.create({
        chainConfig: chainProviders,
        signer: signerW,
        logger: pino({ level: "info" }),
      });
      console.log("We are in the init after nsdk....");
     

      try {
        if(nsdk){
          
          const activeTxs = await nsdk.getActiveTransactions();
          // value2.setActiveTransactions(activeTxs);
          // setActiveTransferTableColumns(activeTxs);
          console.log("activeTxs   : ", activeTxs);
          if (activeTxs[activeTxs.length - 1]) {
            setLatestActiveTx(activeTxs[activeTxs.length - 1]);
            console.log("setLatestActiveTx: ", activeTxs[activeTxs.length - 1]);
          }
        }
        
      } catch (e) {
        console.log(e);
      }
      const historicalTxs = await nsdk.getHistoricalTransactions();
      // setHistoricalTransferTableColumns(historicalTxs);
      console.log("historicalTxs: ", historicalTxs);
      // value.setTransactions(historicalTxs);

      // nsdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
      //   const { amount, expiry, preparedBlockNumber, ...invariant } =
      //     data.txData;
      //   const table = [...activeTransferTableColumns];
      //   table.push({
      //     crosschainTx: {
      //       invariant,
      //       sending: { amount, expiry, preparedBlockNumber },
      //     },
      //     bidSignature: data.bidSignature,
      //     encodedBid: data.encodedBid,
      //     encryptedCallData: data.encryptedCallData,
      //     status: NxtpSdkEvents.SenderTransactionPrepared,
      //     preparedTimestamp: Math.floor(Date.now() / 1000),
      //   });
      //   setActiveTransferTableColumns(table);
      // });

      // nsdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
      //   console.log("SenderTransactionFulfilled:", data);
      //   setActiveTransferTableColumns(
      //     activeTransferTableColumns.filter(
      //       (t) =>
      //         t.crosschainTx.invariant.transactionId !==
      //         data.txData.transactionId
      //     )
      //   );
      // });

      // nsdk.attach(NxtpSdkEvents.SenderTransactionCancelled, (data) => {
      //   console.log("SenderTransactionCancelled:", data);
      //   setActiveTransferTableColumns(
      //     activeTransferTableColumns.filter(
      //       (t) =>
      //         t.crosschainTx.invariant.transactionId !==
      //         data.txData.transactionId
      //     )
      //   );
      // });

      // nsdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
      //   se[(false);
      //   const { amount, expiry, preparedBlockNumber, ...invariant } =
      //     data.txData;
      //   const index = activeTransferTableColumns.findIndex(
      //     (col) =>
      //       col.crosschainTx.invariant.transactionId === invariant.transactionId
      //   );
      //   const table = [...activeTransferTableColumns];
      //   if (index === -1) {
      //     // TODO: is there a better way to
      //     // get the info here?
      //     table.push({
      //       preparedTimestamp: Math.floor(Date.now() / 1000),
      //       crosschainTx: {
      //         invariant,
      //         sending: {} as any, // Find to do this, since it defaults to receiver side info
      //         receiving: { amount, expiry, preparedBlockNumber },
      //       },
      //       bidSignature: data.bidSignature,
      //       encodedBid: data.encodedBid,
      //       encryptedCallData: data.encryptedCallData,
      //       status: NxtpSdkEvents.ReceiverTransactionPrepared,
      //     });
      //     setActiveTransferTableColumns(table);
      //   } else {
      //     const item = { ...table[index] };
      //     table[index] = {
      //       ...item,
      //       status: NxtpSdkEvents.ReceiverTransactionPrepared,
      //       crosschainTx: {
      //         ...item.crosschainTx,
      //         receiving: { amount, expiry, preparedBlockNumber },
      //       },
      //     };
      //     setActiveTransferTableColumns(table);
      //   }
      // });

      // nsdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, async (data) => {
      //   console.log("ReceiverTransactionFulfilled:", data);
      //   setActiveTransferTableColumns(
      //     activeTransferTableColumns.filter(
      //       (t) =>
      //         t.crosschainTx.invariant.transactionId !==
      //         data.txData.transactionId
      //     )
      //   );

      //   const historicalTxs = await nsdk.getHistoricalTransactions();
      //   setHistoricalTransferTableColumns(historicalTxs);
      //   console.log("historicalTxs: ", historicalTxs);
      // });

      // nsdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, (data) => {
      //   console.log("ReceiverTransactionCancelled:", data);
      //   setActiveTransferTableColumns(
      //     activeTransferTableColumns.filter(
      //       (t) =>
      //         t.crosschainTx.invariant.transactionId !==
      //         data.txData.transactionId
      //     )
      //   );
      // });

      // nsdk.attach(NxtpSdkEvents.SenderTokenApprovalMined, (data) => {
      //   console.log("SenderTokenApprovalMined:", data);
      // });

      // nsdk.attach(NxtpSdkEvents.SenderTransactionPrepareSubmitted, (data) => {
      //   console.log("SenderTransactionPrepareSubmitted:", data);
      // });
    };
    init();
  }, []);
 
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
      receivingAddress,

    );
    setShowLoading(true);
    const provider = new providers.Web3Provider(ethereum);
    const signerW = await provider.getSigner();
    const nsdk = await NxtpSdk.create({
      chainConfig: chainProviders,
      signer: signerW,
      logger: pino({ level: "info" }),
    });
    const initiator = await signer.getAddress();
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
      signer: signer,
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
    console.log("finishTransfer", txData);
    
    const provider = new providers.Web3Provider(ethereum);
    const signerW = await provider.getSigner();
    const initiator = await signer.getAddress();
    txData.initiator = initiator;
    console.log('finishTransfer');

    
    const nsdk = new NxtpSdk({
      chainConfig: chainProviders,
      signer: signerW,
      logger: pino({ level: "info" }),
    });

    if (!nsdk) {
      return;
    }

    const finish = await nsdk.fulfillTransfer({
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
                        onChange={onChange}
                        value={value ? value : ""}
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
                          value={value}
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
                    onClick={
                      () => {}
                      // setTransferAmount(utils.formatEther(userBalance ?? 0))
                    }
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
