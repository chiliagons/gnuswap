import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import { ChainInfo } from "@gnosis.pm/safe-react-gateway-sdk";
const ETH_MAINNET_RPC = `https://mainnet.infura.io/v3/31a0f6f85580403986edab0be5f7673c`;

const injected = injectedModule();

type ChainId = ChainInfo["chainId"];
// const getNetworkName = (chainId: ChainId) => {
//   // 'mainnet' is hardcoded in onboard v1
//   const NETWORK_NAMES: Record<ChainId, string> = {
//     [CHAIN_ID.ETHEREUM]: 'mainnet',
//   }

//   // Ledger requires lowercase names
//   return NETWORK_NAMES[chainId] || getChainName().toLowerCase()
// }
const getOnboard = (chainId: ChainId) => {
  const config = {
    networkId: parseInt(chainId, 10),
    // networkName: getNetworkName(chainId),
    wallets: [injected],
    chains: [
      {
        id: "0x5",
        token: "ETH",
        label: "Goerli Testnet",
        rpcUrl: "https://goerli.infura.io/v3/31a0f6f85580403986edab0be5f7673c",
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
// const onboard = (): API => {
//   const chainId = _getChainId()
//   if (!currentOnboardInstance || currentOnboardInstance.getState().appNetworkId.toString() !== chainId) {
//     currentOnboardInstance = getOnboard(chainId)
//   }

//   return currentOnboardInstance
// }
// export default onboard
