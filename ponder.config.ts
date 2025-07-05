import { createConfig, factory } from "ponder";
import { MasterAbi } from "./abis/MasterAbi";
import { FactoryAbi } from "./abis/FactoryAbi";
import { BrandNFTAbi } from "./abis/BrandNFTAbi";
import { parseAbiItem } from "viem";

const FactoryEvent = parseAbiItem(
  "event BrandRegistered(address indexed brandWallet,address indexed nftContractAddress,string name,bool isLegalVerified)"
);

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
      startBlock: 4746700,
      // endBlock: 24459809,
    },
    Factory: {
      chain: "monadTestnet",
      abi: FactoryAbi,
      address: process.env.CONTRACTFACTORY_ADDRESS as `0x${string}`,
      startBlock: 4746700,
      // endBlock: 24459809,
    },
    BrandNFT: {
      chain: "monadTestnet",
      abi: BrandNFTAbi,
      startBlock: 4746700,
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
