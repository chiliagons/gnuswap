/* eslint-disable require-jsdoc */
import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import useStyles from "./styles";
import {
  Button,
  Card,
  Divider,
  EthHashInfo,
  Loader,
  TextFieldInput,
  AddressInput,
  Stepper,
} from "@gnosis.pm/safe-react-components";
import {
  MenuItem,
  Select,
  Container,
  FormControl,
  InputLabel,
} from "@material-ui/core";

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
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";

import { chainProviders } from "../Utils/Shared";
import ErrorBoundary from "./ErrorBoundary";
import TransactionTable from "./TransactionTable";

import { chainAddresses, contractAddresses } from "../Constants/constants";

import { IBalance } from "../Models/Shared.model";
import { IContractAddress, ICrossChain } from "../Models/Nxtp.model";

import { TableContext } from "../Providers/Txprovider";
import { SupportModal } from "./Modals/SupportModal";
import { AlertModal } from "./Modals/AlertModal";

import { finishTransfer } from "./Utils";

declare let window: any;
const ethereum = (window as any).ethereum;
const steps = [
  { id: "connect", label: "Connect Owner Wallet" },
  { id: "chain", label: "Choose Chain to Send Assets" },
  { id: "asset", label: "Select an Asset" },
  { id: "quote", label: "Get a Quote" },
  { id: "start", label: "Start A Transfer" },
  { id: "finish", label: "Finish Transfer in Table" },
];
let currentOnboardInstance;
const App: React.FC = () => {
  const { historicalTransactions, activeTransactions } =
    useContext(TableContext);
  const classes = useStyles();
  const { sdk, connected, safe } = useSafeAppsSDK();

  const gnosisWeb3Provider = new SafeAppProvider(safe, sdk);

  const [ownerList, setOwnerList] = useState<string[]>([]);
  const [walletAddress, setWallet] = useState("");
  const [stepNumber, setStepNumber] = useState(0);
  const [signerGnosis, setSignerGnosis] = useState<Signer>();
  const [signerWallet, setSignerWallet] = useState<Signer>();
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingTransfer, setShowLoadingTransfer] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [auctionResponse, setAuctionResponse] = useState<AuctionResponse>();
  const [chainList] = useState(chainAddresses);
  const [contractList] = useState(contractAddresses);
  const [tokenList, setTokenList] = useState<IBalance[]>([]);
  const [userBalance, setUserBalance] = useState<BigNumber>();
  const [transferAmount, setTransferAmount] = useState<string>();
  const [latestActiveTx, setLatestActiveTx] = useState<ActiveTransaction>();
  const [showError, setShowError] = useState<Boolean>(false);
  const [showSupport, setShowSupport] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { handleSubmit, control } = useForm<ICrossChain>();
  const [selectedTokenDecimals, setSelectedTokenDecimals] =
    useState<number>(18);
  const [historicalTransferTableColumns, setHistoricalTransferTableColumns] =
    useState<HistoricalTransaction[]>([]);

  const injected = injectedModule();

  // check if gnosis provider is connected else keep trying to connect
  useEffect(() => {
    async function connectedToSafe() {
      console.log("The safe is connected", safe);
      await connectProvider();
    }
    connectedToSafe();
  }, [connected]);

  const connectProvider = async () => {
    try {
      if (safe.safeAddress) {
        const network = safe["network"].toLowerCase();
        await getTokensHandler(safe.safeAddress, network);
        const gnosisProvider = new providers.Web3Provider(gnosisWeb3Provider);
        const _signerG = await gnosisProvider.getSigner();
        setSignerGnosis(_signerG);
        setOwnerList(safe.owners);
        return true;
      }
    } catch (e) {
      console.error("Error in connect - > ", e);
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
        utils
          .parseUnits(
            transferAmount.toString(),
            sendingContractAddress.contract_decimals
              ? sendingContractAddress.contract_decimals
              : 18
          )
          .toString(),
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
        console.log(tokenArr);
      })
      .catch((e) => {
        setErrorMessage(e.message);
        setShowError(true);
      });
  };

  const tokenSelected = (element) => {
    try {
      if (element.target?.value) {
        const token = JSON.parse(element.target.value);
        if (token.balance) {
          setSelectedTokenDecimals(token.token?.decimals);
          setUserBalance(BigNumber.from(token.balance));
        }
      }
    } catch (E) {
      console.log(E);
    }
  };

  const getOnboard = () => {
    const config = {
      wallets: [injected],
      chains: [
        {
          id: "0x5",
          token: "ETH",
          label: "Goerli Testnet",
          rpcUrl:
            "https://goerli.infura.io/v3/31a0f6f85580403986edab0be5f7673c",
        },
      ],
      appMetadata: {
        name: "GNUSWAP",
        icon: '<?xml version="1.0" standalone="no"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"> <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> </g> </svg>',
        description: "gnuswap - cross chain swap using gnosis safe",
      },
    };

    // eslint-disable-next-line new-cap
    return Onboard(config);
  };

  const onboard = () => {
    console.log(
      "currentOnboardInstance?.state.get(----)",
      currentOnboardInstance?.state.get()
    );
    if (
      !currentOnboardInstance ||
      currentOnboardInstance?.state.get().chains.length < 1
    ) {
      currentOnboardInstance = getOnboard();
    }

    return currentOnboardInstance;
  };

  const disconnectWallet = async () => {
    // eslint-disable-next-line new-cap
    setStepNumber(0);
    await onboard().disconnectWallet({ label: "Metamask" });
    setWallet("");
  };

  const connectWallet = async () => {
    // This should be the wallet that is connected to the safe currently
    // So we need to get the gnosis provider
    let [primaryWallet] = await onboard().state.get().wallets;
    if (!primaryWallet) {
      const connectedWallets = await onboard().connectWallet();

      console.log(connectedWallets);
    }

    [primaryWallet] = onboard().state.get().wallets;
    console.log("primaryWallet -- ", primaryWallet);

    const providers = new ethers.providers.Web3Provider(primaryWallet.provider);
    const owner1 = providers.getSigner(0);
    const address = await owner1.getAddress();
    console.log("Metamask providers ---> ", address, ownerList);

    if (ownerList.findIndex((addr) => addr === address) > -1) {
      setWallet(address);

      try {
        const signerW = await providers.getSigner();
        setSignerWallet(signerW);
        const nsdk = await NxtpSdk.create({
          chainConfig: chainProviders,
          signer: signerW,
          logger: pino({ level: "info" }),
        });
        setStepNumber(1);
        if (nsdk && address) {
          // here we should get the active transactions of the user or EOA
          const activeTxs = await nsdk.getActiveTransactions();
          const historicalTxs = await nsdk.getHistoricalTransactions();
          setHistoricalTransferTableColumns(historicalTxs);
          historicalTransactions.setTransactions(historicalTxs);
          activeTransactions.setActiveTransactions(activeTxs);
          if (activeTxs[activeTxs.length - 1]) {
            setLatestActiveTx(activeTxs[0]);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getTransferQuote = async (
    sendingChainId: number,
    sendingAssetId: string,
    receivingChainId: number,
    receivingAssetId: string,
    amount: string,
    receivingAddress: string
  ): Promise<AuctionResponse | undefined> => {
    setShowLoading(true);
    const nsdk = await NxtpSdk.create({
      chainConfig: chainProviders,
      signer: signerWallet,
      logger: pino({ level: "info" }),
    });
    const initiator = await signerGnosis.getAddress();
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
      setStepNumber(4);
      return response;
    } catch (e) {
      if (e.type === "ConfigError") {
        setErrorMessage("This chain configuration is not supported");
      } else {
        setErrorMessage(e.message);
      }
      setStepNumber(3);
      setShowError(true);
      setShowLoading(false);
      return null;
    }
  };

  const transfer = async () => {
    try {
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
        throw new Error("Please request quote first");
      }
      const prepTransfer = await nsdk.prepareTransfer(auctionResponse, true);
      if (prepTransfer.transactionId) {
        console.log("Prepared transaction", prepTransfer);
      }
      setShowLoadingTransfer(false);
      setStepNumber(5);
    } catch (err) {
      setShowLoadingTransfer(false);
      alert(err.message);
    }
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
      // if (_bal.token.symbol === "USDT")
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
          <AlertModal
            setTrigger={setShowError}
            title="Error"
            message={errorMessage}
            styling={classes.text}
          />
        )}
        <div className={classes.grid}>
          <Card className={classes.card}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={classes.formContentRow}>
                <span>
                  <EthHashInfo
                    shortName="User"
                    hash={walletAddress}
                    name="Selected Owner"
                    shortenHash={14}
                    showCopyBtn
                    shouldShowShortName
                  />
                </span>
                <span className={classes.formContentRow}>
                  {walletAddress ? (
                    <Button
                      iconType="wallet"
                      size="md"
                      variant="contained"
                      onClick={() => disconnectWallet()}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      iconType="wallet"
                      size="md"
                      variant="contained"
                      onClick={() => connectWallet()}
                    >
                      Connect
                    </Button>
                  )}
                </span>
              </div>
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
                    Select Token (USDT, USDC)
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
                          onChange={(event) => {
                            setTransferAmount(event.target.value);
                          }}
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
                    Balance
                  </h2>
                  <Button
                    onClick={() => {
                      setTransferAmount(
                        utils.formatUnits(
                          userBalance ?? 0,
                          selectedTokenDecimals
                        )
                      );
                    }}
                    size="md"
                  >
                    {utils.formatUnits(userBalance ?? 0, selectedTokenDecimals)}
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
                          utils.formatUnits(
                            auctionResponse?.bid.amountReceived,
                            selectedTokenDecimals
                          )
                        }
                        label="Received Amount"
                        placeholder="Swap Amount"
                        type="number"
                        hiddenLabel={true}
                      />
                    )}
                  />
                </span>
                <Button size="lg" type="submit" variant="bordered">
                  {showLoading ? <Loader size="xs" /> : <span>Get Quote </span>}
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
                {/* <Button
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
                        amountReceived:
                          latestActiveTx.crosschainTx.receiving.amount,
                      },
                    });
                  }}
                >
                  Transfer
                </Button> */}
              </div>
              <span className={classes.actionAnnouncement}>
                {showLoadingTransfer
                  ? "Transfer has started. Please wait."
                  : " "}
              </span>
            </form>
          </Card>

          <Stepper
            steps={steps}
            activeStepIndex={stepNumber}
            orientation="vertical"
          />
          <Button
            iconType="question"
            size="lg"
            variant="contained"
            onClick={() => setShowSupport(true)}
          >
            How it works?
          </Button>
          {showSupport && (
            <SupportModal
              setTrigger={setShowSupport}
              title="How it works"
              classes={classes}
            />
          )}
        </div>
      </Container>
      <TransactionTable
        transactionList={activeTransactions}
        transactionType={"activeTransactions"}
      />
      {showConfirmation && (
        <AlertModal
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
function disconnectWallet(): void {
  throw new Error("Function not implemented.");
}
