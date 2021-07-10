import { TOKEN } from './Tokens.model';

export interface NETWORK {
  depositChainId: number;
  depositChainName: string;
  withdrawChainId: number;
  withdrawChainName: string;
  tokens: TOKEN[];
}
