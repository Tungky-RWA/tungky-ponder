import { onchainTable, relations } from "ponder";

export const brand = onchainTable("brand", (t) => ({
  BrandWalletAddress: t.hex().primaryKey(), // ← primary key
  name: t.text(),
  verified: t.boolean(),
  NftContractAddress: t.hex(),
  blockNumber: t.bigint(),
  blockTimestamp: t.bigint(),
  transactionHash: t.text(),
  logIndex: t.text(),
}));

export const nft = onchainTable("nft", (t) => ({
  id: t.text().primaryKey(),
  NameNFT: t.text(),
  ownerAddress: t.hex(),
  NFTBrandAddress: t.hex(),
  blockNumber: t.bigint(),
  blockTimestamp: t.bigint(),
  transactionHash: t.hex(),
  logIndex: t.bigint(),
  latitude: t.bigint(),
  longitude: t.bigint(),
}));

export const buyer = onchainTable("buyer", (t) => ({
  id: t.text().primaryKey(),
  NameNFT: t.text(),
  NFTBrandAddress: t.hex(),
  blockNumber: t.bigint(),
  blockTimestamp: t.bigint(),
  transactionHash: t.hex(),
}));
