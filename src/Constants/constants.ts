export const chainConfig: Record<
  number,
  { provider: string[]; subgraph?: string; transactionManagerAddress?: string }
> = JSON.parse(
  '{"3":{"provider":["https://ropsten.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]},"5":{"provider":["https://goerli.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]}}'
);

// arrays of "swap pools"
export type SwapConfig = {
  name: string;
  assets: { [chainId: number]: string };
};
export const swapConfig: SwapConfig[] = [
  {
    name: "TEST",
    assets: {
      4: "0x9aC2c46d7AcC21c881154D57c0Dc1c55a3139198",
      5: "0x8a1Cad3703E0beAe0e0237369B4fcD04228d1682",
    },
  },
  {
    name: "TEST TOKEN 2",
    assets: {
      "4": "0x9aC2c46d7AcC21c881154D57c0Dc1c55a3139198",
      "5": "0x8a1Cad3703E0beAe0e0237369B4fcD04228d1682",
    },
  },
  {
    name: "TEST TOKEN 3",
    assets: {
      "4": "0x9aC2c46d7AcC21c881154D57c0Dc1c55a3139198",
      "5": "0x8a1Cad3703E0beAe0e0237369B4fcD04228d1682",
    },
  },
];

export const chainAddresses = [
  {
    id: "rop",
    title: "Ropsten",
    short_name: "ROP",
    chain_id: 3,
    provider_params: [
      {
        chainId: "0x3",
        chainName: "Ethereum Testnet Ropsten",
        rpcUrls: [
          "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        ],
        nativeCurrency: { name: "Ropsten Ether", symbol: "ROP", decimals: 18 },
        blockExplorerUrls: ["https://ropsten.etherscan.io"],
      },
    ],
    explorer: {
      name: "Etherscan",
      url: "https://ropsten.etherscan.io",
      icon: "/logos/explorers/etherscan.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    subgraph: [
      "https://api.thegraph.com/subgraphs/name/connext/nxtp-ropsten-v1-runtime",
    ],
  },
  {
    id: "rin",
    title: "Rinkeby",
    short_name: "RIN",
    chain_id: 4,
    provider_params: [
      {
        chainId: "0x4",
        chainName: "Ethereum Testnet Rinkeby",
        rpcUrls: [
          "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        ],
        nativeCurrency: { name: "Rinkeby Ether", symbol: "RIN", decimals: 18 },
        blockExplorerUrls: ["https://rinkeby.etherscan.io"],
      },
    ],
    explorer: {
      name: "Etherscan",
      url: "https://rinkeby.etherscan.io",
      icon: "/logos/explorers/etherscan.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    subgraph: [
      "https://api.thegraph.com/subgraphs/name/connext/nxtp-rinkeby-v1-runtime",
    ],
  },
  {
    id: "gor",
    title: "Görli",
    short_name: "GOR",
    chain_id: 5,
    provider_params: [
      {
        chainId: "0x5",
        chainName: "Ethereum Testnet Görli",
        rpcUrls: [
          "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        ],
        nativeCurrency: { name: "Görli Ether", symbol: "GOR", decimals: 18 },
        blockExplorerUrls: ["https://goerli.etherscan.io"],
      },
    ],
    explorer: {
      name: "Etherscan",
      url: "https://goerli.etherscan.io",
      icon: "/logos/explorers/etherscan.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    subgraph: [
      "https://api.thegraph.com/subgraphs/name/connext/nxtp-goerli-v1-runtime",
    ],
  },
  {
    id: "kov",
    title: "Kovan",
    short_name: "KOV",
    chain_id: 42,
    provider_params: [
      {
        chainId: "0x2a",
        chainName: "Ethereum Testnet Kovan",
        rpcUrls: ["https://kovan.poa.network", "ws://kovan.poa.network:8546"],
        nativeCurrency: { name: "Kovan Ether", symbol: "KOV", decimals: 18 },
        blockExplorerUrls: ["https://kovan.etherscan.io"],
      },
    ],
    explorer: {
      name: "Etherscan",
      url: "https://kovan.etherscan.io",
      icon: "/logos/explorers/etherscan.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    nomad: { id: "kovan" },
    subgraph: [
      "https://api.thegraph.com/subgraphs/name/connext/nxtp-kovan-v1-runtime",
    ],
  },
  {
    id: "bsct",
    title: "Binance Smart Chain Testnet",
    short_name: "BSCT",
    chain_id: 97,
    provider_params: [
      {
        chainId: "0x61",
        chainName: "Binance Smart Chain Testnet",
        rpcUrls: [
          "https://data-seed-prebsc-1-s1.binance.org:8545",
          "https://data-seed-prebsc-1-s2.binance.org:8545",
          "https://data-seed-prebsc-1-s3.binance.org:8545",
          "https://data-seed-prebsc-2-s2.binance.org:8545",
          "https://data-seed-prebsc-2-s3.binance.org:8545",
        ],
        nativeCurrency: {
          name: "Binance Chain Native Token",
          symbol: "BNB",
          decimals: 18,
        },
        blockExplorerUrls: ["https://testnet.bscscan.com"],
      },
    ],
    explorer: {
      name: "BscScan",
      url: "https://testnet.bscscan.com",
      icon: "/logos/explorers/bscscan.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    subgraph: [
      "https://api.thegraph.com/subgraphs/name/connext/nxtp-chapel-v1-runtime",
    ],
  },
  {
    id: "mum",
    title: "Polygon Mumbai",
    short_name: "MUM",
    chain_id: 80001,
    provider_params: [
      {
        chainId: "0x13881",
        chainName: "Matic Testnet Mumbai",
        rpcUrls: [
          "https://rpc-mumbai.maticvigil.com/",
          "wss://ws-mumbai.matic.today",
        ],
        nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
        blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
      },
    ],
    explorer: {
      name: "PolygonScan",
      url: "https://mumbai.polygonscan.com",
      icon: "/logos/explorers/polygonscan.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    subgraph: [
      "https://api.thegraph.com/subgraphs/name/connext/nxtp-mumbai-v1-runtime",
    ],
  },
  {
    id: "arbr",
    title: "Arbitrum Rinkeby",
    short_name: "ARBR",
    chain_id: 421611,
    provider_params: [
      {
        chainId: "0x66eeb",
        chainName: "Arbitrum Testnet Rinkeby",
        rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
        nativeCurrency: {
          name: "Arbitrum Ether",
          symbol: "tETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
      },
    ],
    explorer: {
      name: "ARBISCAN",
      url: "https://testnet.arbiscan.io",
      icon: "/logos/explorers/arbiscan.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    subgraph: [
      "https://api.thegraph.com/subgraphs/name/connext/nxtp-arbitrum-rinkeby-v1-runtime",
    ],
  },
  {
    id: "optk",
    title: "Optimism Kovan",
    short_name: "OPTK",
    chain_id: 69,
    provider_params: [
      {
        chainId: "0x45",
        chainName: "Optimism Testnet Kovan",
        rpcUrls: ["https://kovan.optimism.io"],
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"],
      },
    ],
    explorer: {
      name: "Etherscan",
      url: "https://kovan-optimistic.etherscan.io",
      icon: "/logos/explorers/optimism.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    subgraph: [
      "https://api.thegraph.com/subgraphs/name/connext/nxtp-optimism-kovan-v1-runtime",
    ],
  },
  {
    id: "mbase",
    title: "Moonbase Alpha",
    short_name: "MBASE",
    chain_id: 1287,
    provider_params: [
      {
        chainId: "0x507",
        chainName: "Moonbase Alpha",
        rpcUrls: [
          "https://rpc.api.moonbase.moonbeam.network",
          "https://moonbeam-alpha.api.onfinality.io/public",
        ],
        nativeCurrency: { name: "Dev", symbol: "DEV", decimals: 18 },
        blockExplorerUrls: ["https://moonbase.moonscan.io"],
      },
    ],
    explorer: {
      name: "Moonscan",
      url: "https://moonbase.moonscan.io",
      icon: "/logos/explorers/moonbeam.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    optional_bridge_urls: ["https://development.app.nomad.xyz"],
    nomad: { id: "moonbasealpha" },
    subgraph: [
      "https://api.thegraph.com/subgraphs/name/connext/nxtp-mbase-v1-runtime",
    ],
  },
];