export const chainConfig: Record<number, { provider: string[]; subgraph?: string; transactionManagerAddress?: string }> = JSON.parse(
  '{"4":{"provider":["https://rinkeby.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]},"5":{"provider":["https://goerli.infura.io/v3/31a0f6f85580403986edab0be5f7673c"]}}',
);

// arrays of "swap pools"
export type SwapConfig = { name: string; assets: { [chainId: number]: string } };
export const swapConfig: SwapConfig[] = JSON.parse(
  '[{"name":"TEST","assets":{"4":"0x9aC2c46d7AcC21c881154D57c0Dc1c55a3139198","5":"0x8a1Cad3703E0beAe0e0237369B4fcD04228d1682"}}]',
);
