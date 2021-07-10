import { NETWORK } from '../Models/Networks.model';
import { RINKEBY_KOVAN_TOKENS, KOVAN_RINKEBY_TOKENS, GOERLI_MUMBAI_TOKENS, MUMBAI_GOERLI_TOKENS } from './Tokens';

export const networks: NETWORK[] = [
  {
    depositChainId: 4,
    depositChainName: 'Rinkeby Testnet',
    withdrawChainId: 42,
    withdrawChainName: 'Kovan Testnet',
    tokens: RINKEBY_KOVAN_TOKENS,
  },
  {
    depositChainId: 42,
    depositChainName: 'Kovan Testnet',
    withdrawChainId: 4,
    withdrawChainName: 'Rinkeby Testnet',
    tokens: KOVAN_RINKEBY_TOKENS,
  },
  {
    depositChainId: 5,
    depositChainName: 'Goerli Testnet',
    withdrawChainId: 80001,
    withdrawChainName: 'Matic Testnet',
    tokens: GOERLI_MUMBAI_TOKENS,
  },
  {
    depositChainId: 80001,
    depositChainName: 'Matic Testnet',
    withdrawChainId: 5,
    withdrawChainName: 'Goerli Testnet',
    tokens: MUMBAI_GOERLI_TOKENS,
  },
  // {
  //   depositChainId: 42,
  //   depositChainName: "Kovan Testnet",
  //   withdrawChainId: 79377087078960,
  //   withdrawChainName: "Arbitrum Testnet V3",
  //   tokens: KOVAN_ARBITRUM_TOKENS,
  // },
  // {
  //   depositChainId: 79377087078960,
  //   depositChainName: "Arbitrum Testnet V3",
  //   withdrawChainId: 42,
  //   withdrawChainName: "Kovan Testnet",
  //   tokens: ARBITRUM_KOVAN_TOKENS,
  // },
  // {
  //   depositChainId: 137,
  //   depositChainName: "Matic Mainnet",
  //   withdrawChainId: 1,
  //   withdrawChainName: "ETH Mainnet",
  //   tokens: MATIC_ETH_TOKENS,
  // },
  // {
  //   depositChainId: 1,
  //   depositChainName: "ETH Mainnet",
  //   withdrawChainId: 137,
  //   withdrawChainName: "Matic Mainnet",
  //   tokens: ETH_MATIC_TOKENS,
  // },
];
