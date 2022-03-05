import { providers } from "ethers";
import pino from "pino";
import { NxtpSdk } from "@connext/nxtp-sdk";
import { chainProviders } from "../Utils/Shared";

declare let window: any;
const ethereum = (window as any).ethereum;

export const finishTransfer = async ({
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
  try {
    await nsdk.fulfillTransfer({
      bidSignature,
      encodedBid,
      encryptedCallData,
      txData,
      // relayerFee: "780",
    });
  } catch (err) {
    console.log("Unable to fulfillTransfer", err);
  }
  // setShowConfirmation(true);
  // console.log(showConfirmation);
  // setShowConfirmation(false);
};
