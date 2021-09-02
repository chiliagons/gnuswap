import { MOCKTOKEN } from './Tokens.model';

export interface NETWORK {
  depositChainId: number;
  depositChainName: string;
  withdrawChainId: number;
  withdrawChainName: string;
  tokens: MOCKTOKEN[];
}
