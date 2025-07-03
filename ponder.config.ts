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
      address:
        (process.env.CONTRACT_ADDRESS as `0x${string}`) ||
        "0xfcb5b4b87E3c7716a136b290465A18e93a06fDBa",
      startBlock: 24436832,
    },
    Factory: {
      chain: "monadTestnet",
      abi: FactoryAbi,
      address:
        (process.env.CONTRACTFACTORY_ADDRESS as `0x${string}`) ||
        "0x45FF838c0160FB1E1675074C8552D22dD9E87c44",
      startBlock: 24436832,
    },
  },
});
