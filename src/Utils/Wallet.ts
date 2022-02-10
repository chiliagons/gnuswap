import { ethers, providers } from "ethers";

declare let window: any;
const ethereum = (window as any).ethereum;

export const connectWallet = async () => {
  if (ethereum) {
    try {
      const addressArray = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        address: ethers.utils.getAddress(addressArray[0]),
        status: "Connected",
      };
      return obj;
    } catch (err: any) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "Please install metamask.",
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (ethereum) {
    try {
      const addressArray = await ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: ethers.utils.getAddress(addressArray[0]),
          status: "Connected",
          providers: new providers.Web3Provider(ethereum),
        };
      } else {
        return {
          address: "",
          status: "🦊 Please connect to Metamask",
          providers: null,
        };
      }
    } catch (err: any) {
      return {
        address: "",
        status: "😥 " + err.message,
        providers: null,
      };
    }
  } else {
    return {
      address: "",
      status: "Please install Metamask.",
      providers: null,
    };
  }
};