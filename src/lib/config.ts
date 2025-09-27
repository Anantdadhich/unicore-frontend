export const CHAIN_CONFIG = {
  ethereum: {
    chainId: 1,
    name: "Ethereum",
    rpcUrl: "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    layerZeroChainId: 101,
  },
  polygon: {
    chainId: 137,
    name: "Polygon",
    rpcUrl: "https://polygon.llamarpc.com",
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    layerZeroChainId: 109,
  },
  base: {
    chainId: 8453,
    name: "Base",
    rpcUrl: "https://base.llamarpc.com",
    explorerUrl: "https://basescan.org",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    layerZeroChainId: 184,
  },
  arbitrum: {
    chainId: 42161,
    name: "Arbitrum One",
    rpcUrl: "https://arbitrum.llamarpc.com",
    explorerUrl: "https://arbiscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    layerZeroChainId: 110,
  },
  optimism: {
    chainId: 10,
    name: "Optimism",
    rpcUrl: "https://optimism.llamarpc.com",
    explorerUrl: "https://optimistic.etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    layerZeroChainId: 111,
  },
  // Testnets
  sepolia: {
    chainId: 11155111,
    name: "Ethereum Sepolia",
    rpcUrl: "https://sepolia.llamarpc.com",
    explorerUrl: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    layerZeroChainId: 40161,
  },
  polygonMumbai: {
    chainId: 80001,
    name: "Polygon Mumbai",
    rpcUrl: "https://polygon-mumbai.llamarpc.com",
    explorerUrl: "https://mumbai.polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    layerZeroChainId: 40109,
  },
  baseSepolia: {
    chainId: 84532,
    name: "Base Sepolia",
    rpcUrl: "https://base-sepolia.llamarpc.com",
    explorerUrl: "https://sepolia.basescan.org",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    layerZeroChainId: 40184,
  },
} as const

export const COMMON_TOKENS = {
  ethereum: {
    USDC: "0xA0b86a33E6441b8C4C8C0E1234567890abcdef12", // USDC on Ethereum
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT on Ethereum
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH on Ethereum
  },
  polygon: {
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  },
  arbitrum: {
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  },
  optimism: {
    USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    WETH: "0x4200000000000000000000000000000000000006",
  },
} as const

export const CONTRACT_ADDRESSES = {
  // These would be the deployed contract addresses
  UniCoreSwap: {
    1: "0x0000000000000000000000000000000000000000", // Ethereum
    137: "0x0000000000000000000000000000000000000000", // Polygon
    42161: "0x0000000000000000000000000000000000000000", // Arbitrum
    10: "0x0000000000000000000000000000000000000000", // Optimism
  },
  SolverNetwork: {
    1: "0x0000000000000000000000000000000000000000",
    137: "0x0000000000000000000000000000000000000000",
    42161: "0x0000000000000000000000000000000000000000",
    10: "0x0000000000000000000000000000000000000000",
  },
  ZKVerifier: {
    1: "0x0000000000000000000000000000000000000000",
    137: "0x0000000000000000000000000000000000000000",
    42161: "0x0000000000000000000000000000000000000000",
    10: "0x0000000000000000000000000000000000000000",
  },
} as const
