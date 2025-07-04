import { ponder } from "ponder:registry";
import { brand, nft, nftTransfer } from "ponder:schema";

ponder.on("Factory:BrandRegistered", async ({ event, context }) => {
  const { brandWallet, nftContractAddress, name, isLegalVerified } = event.args;

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

// Event 1: Saat NFT dipre-mint
ponder.on("BrandNFT:PreMintedNFT", async ({ event, context }) => {
  const { tokenId } = event.args;

  await context.db.insert(nft).values({
    tokenId: BigInt(tokenId),
    NftContractAddress: event.log.address,
    ownerAddress: "0x0000000000000000000000000000000000000000",
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: BigInt(event.log.logIndex),
    status: "premint",
  }).onConflictDoNothing;
});

// Event 2: Saat NFT di-update
ponder.on("BrandNFT:PreMintNFTUpdated", async ({ event, context }) => {
  const { oldTokenId, newTokenId } = event.args;
  const contractAddress = event.log.address;

  await context.db.delete(nft, {
    tokenId: oldTokenId,
    NftContractAddress: contractAddress,
  });

  await context.db.insert(nft).values({
    tokenId: BigInt(newTokenId),
    NftContractAddress: contractAddress,
    ownerAddress: "0x0000000000000000000000000000000000000000",
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: BigInt(event.log.logIndex),
    latitude: BigInt(0), // or replace with real value if exists
    longitude: BigInt(0), // or replace with real value if exists
    status: "premint",
  }).onConflictDoNothing;
});

ponder.on("BrandNFT:Transfer", async ({ event, context }) => {
  const { from, to, tokenId } = event.args;
  const contractAddress = event.log.address;
  const id = `${event.transaction.hash}-${event.log.logIndex}`;

  await context.db.insert(nftTransfer).values({
    id,
    NftContractAddress: contractAddress,
    tokenId: BigInt(tokenId),
    from,
    to,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: BigInt(event.log.logIndex),
  });

  await context.db
    .update(nft, {
      NftContractAddress: contractAddress,
      tokenId: BigInt(tokenId),
    })
    .set({
      ownerAddress: to,
      status: "mint",
    });
});
