export const chainConfig: Record<
  number,
  { provider: string[]; subgraph?: string; transactionManagerAddress?: string }
> = JSON.parse(
  '{"1":{"provider":["https://mainnet.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]}, "137":{"provider":["https://polygon-mainnet.g.alchemy.com/v2/cFIHD92RIO17NEFpWtXQOqBxTx6hhLxs"]}, "3":{"provider":["https://ropsten.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]},"5":{"provider":["https://goerli.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]},"4":{"provider":["https://rinkeby.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]}}'
);

export const chainAddresses = [
  {
    id: "ethereum",
    title: "Ethereum",
    short_name: "ETH",
    chain_id: 1,
    provider_params: [
      {
        chainId: "0x1",
        chainName: "Ethereum Mainnet",
        rpcUrls: [
          "https://api.mycryptoapi.com/eth",
          "https://cloudflare-eth.com",
        ],
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://etherscan.io"],
      },
    ],
    explorer: {
      name: "Etherscan",
      url: "https://etherscan.io",
      icon: "/logos/explorers/etherscan.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    image: "/logos/chains/mainnet/ethereum.png",
    nomad: {
      id: "ethereum",
    },
  },
  {
    id: "polygon",
    title: "Polygon",
    short_name: "MATIC",
    chain_id: 137,
    provider_params: [
      {
        chainId: "0x89",
        chainName: "Matic Mainnet",
        rpcUrls: ["https://polygon-rpc.com", "wss://ws-mainnet.matic.network"],
        nativeCurrency: {
          name: "Matic",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com"],
      },
    ],
    explorer: {
      name: "Polygonscan",
      url: "https://polygonscan.com",
      icon: "/logos/explorers/polygonscan.png",
      block_path: "/block/{block}",
      address_path: "/address/{address}",
      contract_path: "/token/{address}",
      contract_0_path: "/address/{address}",
      transaction_path: "/tx/{tx}",
    },
    image: "/logos/chains/mainnet/polygon.png",
  },
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
          "https://ropsten.infura.io/v3/31a0f6f85580403986edab0be5f7673c",
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
          "https://rinkeby.infura.io/v3/31a0f6f85580403986edab0be5f7673c",
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
          "https://goerli.infura.io/v3/31a0f6f85580403986edab0be5f7673c",
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
  // {
  //   id: "gnosis",
  //   title: "Gnosis Chain",
  //   short_name: "GNO",
  //   chain_id: 100,
  //   provider_params: [
  //     {
  //       chainId: "0x64",
  //       chainName: "Gnosis Chain",
  //       rpcUrls: [
  //         "https://rpc.gnosischain.com",
  //         "https://rpc.xdaichain.com",
  //         "https://xdai.poanetwork.dev",
  //         "wss://rpc.xdaichain.com/wss",
  //         "wss://xdai.poanetwork.dev/wss",
  //         "https://dai.poa.network",
  //         "ws://xdai.poanetwork.dev:8546",
  //       ],
  //       nativeCurrency: {
  //         name: "xDAI",
  //         symbol: "xDAI",
  //         decimals: 18,
  //       },
  //       blockExplorerUrls: ["https://blockscout.com/poa/xdai/"],
  //     },
  //   ],
  //   explorer: {
  //     name: "BlockScout",
  //     url: "https://blockscout.com/xdai/mainnet",
  //     icon: "/logos/explorers/blockscout.png",
  //     block_path: "/blocks/{block}",
  //     address_path: "/address/{address}",
  //     contract_path: "/tokens/{address}",
  //     contract_0_path: "/address/{address}",
  //     transaction_path: "/tx/{tx}",
  //   },
  //   image: "/logos/chains/mainnet/gnosis.png",
  // },
  // {
  //   id: "arbitrum",
  //   title: "Arbitrum",
  //   short_name: "ARB",
  //   chain_id: 42161,
  //   provider_params: [
  //     {
  //       chainId: "0xa4b1",
  //       chainName: "Arbitrum One",
  //       rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  //       nativeCurrency: {
  //         name: "Arbitrum Ether",
  //         symbol: "tETH",
  //         decimals: 18,
  //       },
  //       blockExplorerUrls: ["https://arbiscan.io"],
  //     },
  //   ],
  //   explorer: {
  //     name: "Arbiscan",
  //     url: "https://arbiscan.io",
  //     icon: "/logos/explorers/arbiscan.png",
  //     block_path: "/block/{block}",
  //     address_path: "/address/{address}",
  //     contract_path: "/token/{address}",
  //     contract_0_path: "/address/{address}",
  //     transaction_path: "/tx/{tx}",
  //   },
  //   image: "/logos/chains/mainnet/arbitrum.png",
  // }
];

export const contractAddresses = [
  {
    id: "test",
    symbol: "TEST",
    contracts: [
      {
        contract_address: "0xe71678794fff8846bff855f716b0ce9d9a78e844",
        chain_id: 3,
        contract_decimals: 18,
      },
      {
        contract_address: "0x9ac2c46d7acc21c881154d57c0dc1c55a3139198",
        chain_id: 4,
        contract_decimals: 18,
      },
      {
        contract_address: "0x8a1cad3703e0beae0e0237369b4fcd04228d1682",
        chain_id: 5,
        contract_decimals: 18,
      },
      {
        contract_address: "0xe71678794fff8846bff855f716b0ce9d9a78e844",
        chain_id: 42,
        contract_decimals: 18,
      },
      {
        contract_address: "0xd86bcb7d85163fbc81756bb9cc22225d6abccadb",
        chain_id: 97,
        contract_decimals: 18,
      },
      {
        contract_address: "0xe71678794fff8846bff855f716b0ce9d9a78e844",
        chain_id: 80001,
        contract_decimals: 18,
      },
      {
        contract_address: "0xe71678794fff8846bff855f716b0ce9d9a78e844",
        chain_id: 421611,
        contract_decimals: 18,
      },
      {
        contract_address: "0x29fbdcf834d3f85dd5d25adedba19380837cdf21",
        chain_id: 69,
        contract_decimals: 6,
      },
      {
        contract_address: "0x7195845bfa648c04c1571979dc1bcf240af60aeb",
        chain_id: 1287,
        contract_decimals: 18,
      },
    ],
  },
  {
    id: "usdt",
    symbol: "USDT",
    contracts: [
      {
        contract_address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        chain_id: 1,
        contract_decimals: 6,
      },
      {
        contract_address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        chain_id: 137,
        contract_decimals: 6,
      },
    ],
  },
];
