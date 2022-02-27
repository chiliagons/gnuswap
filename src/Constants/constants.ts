export const chainConfig: Record<
  number,
  { provider: string[]; subgraph?: string; transactionManagerAddress?: string }
> = JSON.parse(
  '{"1":{"provider":["https://mainnet.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]}, "3":{"provider":["https://ropsten.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]},"5":{"provider":["https://goerli.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]},"4":{"provider":["https://rinkeby.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]}}'
);

export const chainAddresses = [
  {
    "id": "ethereum",
    "title": "Ethereum",
    "short_name": "ETH",
    "chain_id": 1,
    "provider_params": [
        {
            "chainId": "0x1",
            "chainName": "Ethereum Mainnet",
            "rpcUrls": [
                "https://api.mycryptoapi.com/eth",
                "https://cloudflare-eth.com"
            ],
            "nativeCurrency": {
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://etherscan.io"
            ]
        }
    ],
    "explorer": {
        "name": "Etherscan",
        "url": "https://etherscan.io",
        "icon": "/logos/explorers/etherscan.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/ethereum.png",
    "nomad": {
        "id": "ethereum"
    }
},
{
    "id": "binance",
    "title": "Binance Smart Chain",
    "short_name": "BSC",
    "chain_id": 56,
    "provider_params": [
        {
            "chainId": "0x38",
            "chainName": "Binance Smart Chain Mainnet",
            "rpcUrls": [
                "https://bsc-dataseed1.ninicoin.io",
                "https://bsc-dataseed2.ninicoin.io",
                "https://bsc-dataseed3.ninicoin.io",
                "https://bsc-dataseed4.ninicoin.io",
                "https://bsc-dataseed1.binance.org",
                "https://bsc-dataseed2.binance.org",
                "https://bsc-dataseed3.binance.org",
                "https://bsc-dataseed4.binance.org",
                "https://bsc-dataseed1.defibit.io",
                "https://bsc-dataseed2.defibit.io",
                "https://bsc-dataseed3.defibit.io",
                "https://bsc-dataseed4.defibit.io",
                "wss://bsc-ws-node.nariox.org"
            ],
            "nativeCurrency": {
                "name": "Binance Chain Native Token",
                "symbol": "BNB",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://bscscan.com"
            ]
        }
    ],
    "explorer": {
        "name": "BscScan",
        "url": "https://bscscan.com",
        "icon": "/logos/explorers/bscscan.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/binance.png"
},
{
    "id": "polygon",
    "title": "Polygon",
    "short_name": "MATIC",
    "chain_id": 137,
    "provider_params": [
        {
            "chainId": "0x89",
            "chainName": "Matic Mainnet",
            "rpcUrls": [
                "https://polygon-rpc.com",
                "wss://ws-mainnet.matic.network"
            ],
            "nativeCurrency": {
                "name": "Matic",
                "symbol": "MATIC",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://polygonscan.com"
            ]
        }
    ],
    "explorer": {
        "name": "Polygonscan",
        "url": "https://polygonscan.com",
        "icon": "/logos/explorers/polygonscan.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/polygon.png"
},
{
    "id": "avalanche",
    "title": "Avalanche",
    "short_name": "AVAX",
    "chain_id": 43114,
    "provider_params": [
        {
            "chainId": "0xa86a",
            "chainName": "Avalanche Mainnet C-Chain",
            "rpcUrls": [
                "https://api.avax.network/ext/bc/C/rpc"
            ],
            "nativeCurrency": {
                "name": "Avalanche",
                "symbol": "AVAX",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://snowtrace.io"
            ]
        }
    ],
    "explorer": {
        "name": "Snowtrace",
        "url": "https://snowtrace.io",
        "icon": "/logos/explorers/snowtrace.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/avalanche.png"
},
{
    "id": "fantom",
    "title": "Fantom",
    "short_name": "FTM",
    "chain_id": 250,
    "provider_params": [
        {
            "chainId": "0xfa",
            "chainName": "Fantom Opera",
            "rpcUrls": [
                "https://rpc.ftm.tools",
                "https://rpcapi.fantom.network"
            ],
            "nativeCurrency": {
                "name": "Fantom",
                "symbol": "FTM",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://ftmscan.com"
            ]
        }
    ],
    "explorer": {
        "name": "FTMScan",
        "url": "https://ftmscan.com",
        "icon": "/logos/explorers/ftmscan.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/fantom.png"
},
{
    "id": "gnosis",
    "title": "Gnosis Chain",
    "short_name": "GNO",
    "chain_id": 100,
    "provider_params": [
        {
            "chainId": "0x64",
            "chainName": "Gnosis Chain",
            "rpcUrls": [
                "https://rpc.gnosischain.com",
                "https://rpc.xdaichain.com",
                "https://xdai.poanetwork.dev",
                "wss://rpc.xdaichain.com/wss",
                "wss://xdai.poanetwork.dev/wss",
                "https://dai.poa.network",
                "ws://xdai.poanetwork.dev:8546"
            ],
            "nativeCurrency": {
                "name": "xDAI",
                "symbol": "xDAI",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://blockscout.com/poa/xdai/"
            ]
        }
    ],
    "explorer": {
        "name": "BlockScout",
        "url": "https://blockscout.com/xdai/mainnet",
        "icon": "/logos/explorers/blockscout.png",
        "block_path": "/blocks/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/tokens/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/gnosis.png"
},
{
    "id": "arbitrum",
    "title": "Arbitrum",
    "short_name": "ARB",
    "chain_id": 42161,
    "provider_params": [
        {
            "chainId": "0xa4b1",
            "chainName": "Arbitrum One",
            "rpcUrls": [
                "https://arb1.arbitrum.io/rpc"
            ],
            "nativeCurrency": {
                "name": "Arbitrum Ether",
                "symbol": "tETH",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://arbiscan.io"
            ]
        }
    ],
    "explorer": {
        "name": "Arbiscan",
        "url": "https://arbiscan.io",
        "icon": "/logos/explorers/arbiscan.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/arbitrum.png"
},
{
    "id": "optimism",
    "title": "Optimism",
    "short_name": "OPT",
    "chain_id": 10,
    "provider_params": [
        {
            "chainId": "0xa",
            "chainName": "Optimism Mainnet",
            "rpcUrls": [
                "https://mainnet.optimism.io"
            ],
            "nativeCurrency": {
                "name": "Ether",
                "symbol": "OETH",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://optimistic.etherscan.io"
            ]
        }
    ],
    "explorer": {
        "name": "Etherscan",
        "url": "https://optimistic.etherscan.io",
        "icon": "/logos/explorers/optimism.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/optimism.png"
},
{
    "id": "moonbeam",
    "title": "Moonbeam",
    "short_name": "MBEAM",
    "chain_id": 1284,
    "provider_params": [
        {
            "chainId": "0x504",
            "chainName": "Moonbeam",
            "rpcUrls": [
                "https://rpc.api.moonbeam.network",
                "https://moonbeam.api.onfinality.io/public"
            ],
            "nativeCurrency": {
                "name": "Glimmer",
                "symbol": "GLMR",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://moonbeam.moonscan.io"
            ]
        }
    ],
    "explorer": {
        "name": "Moonscan",
        "url": "https://moonbeam.moonscan.io",
        "icon": "/logos/explorers/moonbeam.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/moonbeam.png",
    "optional_bridge_urls": [
        "https://app.nomad.xyz"
    ],
    "nomad": {
        "id": "moonbeam"
    }
},
{
    "id": "moonriver",
    "title": "Moonriver",
    "short_name": "MOVR",
    "chain_id": 1285,
    "provider_params": [
        {
            "chainId": "0x505",
            "chainName": "Moonriver",
            "rpcUrls": [
                "https://rpc.api.moonriver.moonbeam.network"
            ],
            "nativeCurrency": {
                "name": "Moonriver",
                "symbol": "MOVR",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://moonriver.moonscan.io"
            ]
        }
    ],
    "explorer": {
        "name": "Moonscan",
        "url": "https://moonriver.moonscan.io",
        "icon": "/logos/explorers/moonriver.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/moonriver.png"
},
{
    "id": "fuse",
    "title": "Fuse",
    "short_name": "FUSE",
    "chain_id": 122,
    "provider_params": [
        {
            "chainId": "0x7a",
            "chainName": "Fuse Network",
            "rpcUrls": [
                "https://rpc.fuse.io"
            ],
            "nativeCurrency": {
                "name": "Fuse Token",
                "symbol": "FUSE",
                "decimals": 18
            },
            "blockExplorerUrls": [
                "https://explorer.fuse.io"
            ]
        }
    ],
    "explorer": {
        "name": "Fuse Explorer",
        "url": "https://explorer.fuse.io",
        "icon": "/logos/explorers/fuse.png",
        "block_path": "/blocks/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/tokens/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
    },
    "image": "/logos/chains/mainnet/fuse.png"
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
    nomad_support: [
      {
        from_chain_id: 42,
        to_chain_id: 1287,
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
