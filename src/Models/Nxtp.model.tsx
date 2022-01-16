export interface ICrossChain {
  transferAmount: any;
  receivingAddress: any;
  sendingAssetTokenContract: any;
  receivedAmount: any;
  chain: any;
  token: any;
}

export interface IContractAddress {
  contractGroupId: string;
  chainId: number;
}