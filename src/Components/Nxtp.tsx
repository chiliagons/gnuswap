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
import { ActiveTransaction, NxtpSdk } from "@connext/nxtp-sdk";
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

  const getTokensHandler = async (address) => {
    const tokenArr: Array<IBalance> = [];
    await fetch(
      `https://safe-transaction.goerli.gnosis.io/api/v1/safes/${address}/balances/?trusted=false&exclude_spam=false`
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
        const address = await _signerG.getAddress();
        await getTokensHandler(address);

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
    try {
      const gnosisProvider = new providers.Web3Provider(gnosisWeb3Provider);
      const _signerG = gnosisProvider.getSigner();
      // setShowLoadingTransfer(true);
      const nsdk = new NxtpSdk({
        chainConfig: chainProviders,
        signer: _signerG,
        logger: pino({ level: "info" }),
      });
      if (!nsdk) {
        return;
      }
      if (!auctionResponse) {
        throw new Error("Please request quote first");
      }
      const prepTransfer = await nsdk.prepareTransfer(auctionResponse, true);
      if (prepTransfer.transactionId) {
        console.log("Prepared transaction", prepTransfer);
        setShowLoadingTransfer(false);
      }
    } catch (e) {
      setErrorMessage(e.message);
      setShowError(true);
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
                  {showLoadingTransfer ? "Approving..." : "Approve"}
                  <span>{showLoadingTransfer && <Loader size="xs" />}</span>
                </Button>

                <Button
                  iconType="rocket"
                  disabled={latestActiveTx?.status.length === 0}
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
                        ...latestActiveTx.crosschainTx.receiving,
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
