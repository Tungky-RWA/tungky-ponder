import { ponder } from "ponder:registry";
import { brand } from "ponder:schema";

ponder.on("Factory:BrandRegistered", async ({ event, context }) => {
  const { brandWallet, nftContractAddress, name, isLegalVerified } = event.args;
  console.log("📦 Event received:", event.args);

  // if (isLegalVerified) {
  //   console.log("MASUKKKK");
  //   await context.db
  //     .update(brand, { BrandWalletAddress: brandWallet })
  //     .set({ verified: isLegalVerified });
  // }

  await context.db
    .insert(brand)
    .values({
      BrandWalletAddress: brandWallet,
      name: name,
      verified: isLegalVerified,
      NftContractAddress: nftContractAddress,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      logIndex: event.log.logIndex.toString(),
    })
    .onConflictDoUpdate(() => ({
      verified: isLegalVerified,
      NftContractAddress: nftContractAddress,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      logIndex: event.log.logIndex.toString(),
    }));
});
