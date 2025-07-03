import { createConfig, factory } from "ponder";
import { MasterAbi } from "./abis/MasterAbi";
import { FactoryAbi } from "./abis/FactoryAbi";

export default createConfig({
  chains: {
    monadTestnet: {
      id: 10143,
      rpc: "https://testnet-rpc.monad.xyz/",
    },
  },
  contracts: {
    Master: {
      chain: "monadTestnet",
      abi: MasterAbi,
      address: process.env.MASTER_ADDRESS as `0x${string}`,
      startBlock: 24436113,
      endBlock: 24459809,
    },
    Factory: {
      chain: "monadTestnet",
      abi: FactoryAbi,
      address: process.env.CONTRACTFACTORY_ADDRESS as `0x${string}`,
      startBlock: 24436113,
      endBlock: 24459809,
    },
  },
});
