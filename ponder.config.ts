import { createConfig, factory } from "ponder";
import { MasterAbi } from "./abis/MasterAbi";
import { FactoryAbi } from "./abis/FactoryAbi";
import { BrandNFTAbi } from "./abis/BrandNFTAbi";
import { parseAbiItem } from "viem";
import { baseSepolia, liskSepolia } from "viem/chains";

const FactoryEvent = parseAbiItem(
  "event BrandRegistered(address indexed brandWallet,address indexed nftContractAddress,string name,bool isLegalVerified)"
);

export default createConfig({
  chains: {
    liskSepolia: {
      id: 4202,
      rpc: "https://rpc.sepolia-api.lisk.com",
      disableCache: false,
      maxRequestsPerSecond: 10
    },
  },

  contracts: {
    Master: {
      chain: "liskSepolia",
      abi: MasterAbi,
      address: process.env.MASTER_ADDRESS as `0x${string}`,
      startBlock: 24230866,
      // endBlock: 24459809,
    },
    Factory: {
      chain: "liskSepolia",
      abi: FactoryAbi,
      address: process.env.CONTRACTFACTORY_ADDRESS as `0x${string}`,
      startBlock: 24230866,
      // endBlock: 24459809,
    },
    BrandNFT: {
      chain: "liskSepolia",
      abi: BrandNFTAbi,
      startBlock: 24230866,
      // endBlock: 24459809,
      address: factory({
        // Address of the factory contract.
        address: process.env.CONTRACTFACTORY_ADDRESS as `0x${string}`,
        // Event from the factory contract ABI which contains the child address.
        event: FactoryEvent,
        // Name of the event parameter containing the child address.
        parameter: "nftContractAddress",
      }),
    },
  },
});
