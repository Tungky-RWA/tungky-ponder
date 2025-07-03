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
  Id: t.text().primaryKey(),
  NameNFT: t.text(),
  ownerAddress: t.hex(),
  NftContractAddress: t.hex(),
  blockNumber: t.bigint(),
  blockTimestamp: t.bigint(),
  transactionHash: t.hex(),
  logIndex: t.bigint(),
  latitude: t.bigint(),
  longitude: t.bigint(),
}));

export const nftTransfer = onchainTable("nftTransfer", (t) => ({
  id: t.bigint().primaryKey(), // auto-increment id
  serial: t.text(), // serial.
  contractAddress: t.hex(),
  tokenId: t.bigint(),
  from: t.hex(),
  to: t.hex(),
  blockNumber: t.bigint(),
  blockTimestamp: t.bigint(),
  transactionHash: t.text(),
}));

// 3️⃣ Relasi: Brand has many NFTs
export const brandRelations = relations(brand, ({ many }) => ({
  nfts: many(nft), // ← many NFT
}));

// 4️⃣ Relasi: NFT belongs to one Brand
export const nftRelations = relations(nft, ({ one }) => ({
  brand: one(brand, {
    fields: [nft.NftContractAddress], // ← foreign key di nft
    references: [brand.NftContractAddress], // ← primary key (or unique key) di brand
  }),
}));
