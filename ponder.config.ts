import { createConfig, factory } from "ponder";
import { MasterAbi } from "./abis/MasterAbi";
import { FactoryAbi } from "./abis/FactoryAbi";
import { parseAbiItem } from "viem";

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

      startBlock: 24436113,
      endBlock: 24459809,
      address: factory({
        // Address of the factory contract.
        address: process.env.CONTRACTFACTORY_ADDRESS as `0x${string}`,
        // Event from the factory contract ABI which contains the child address.
        event: parseAbiItem("event NewPair(address poolAddress)"),
        // Name of the event parameter containing the child address.
        parameter: "poolAddress",
      }),
    },
  },
});
