export interface IToken {
  name: string;
  symbol: string;
  decimals: number;
  logoUri: string;
}

export interface IBalance {
  tokenAddress: string;
  token: IToken;
  balance: number;
}
