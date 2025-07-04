import { onchainTable, relations, onchainEnum, primaryKey } from "ponder";

export const statusMint = onchainEnum("statusMint", ["premint", "mint"]);

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

export const nft = onchainTable(
  "nft",
  (t) => ({
    tokenId: t.bigint(),
    NftContractAddress: t.hex(),
    ownerAddress: t.hex(),
    blockNumber: t.bigint(),
    blockTimestamp: t.bigint(),
    transactionHash: t.hex(),
    logIndex: t.bigint(),
    latitude: t.bigint(),
    longitude: t.bigint(),
    status: statusMint("statusMint"),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.tokenId, table.NftContractAddress] }),
  })
);

export const nftTransfer = onchainTable("nftTransfer", (t) => ({
  id: t.text().primaryKey(), // auto-increment id
  NftContractAddress: t.hex(),
  tokenId: t.bigint(),
  from: t.hex(),
  to: t.hex(),
  blockNumber: t.bigint(),
  blockTimestamp: t.bigint(),
  transactionHash: t.text(),
}));

// Brand has many NFTs
export const brandRelations = relations(brand, ({ many }) => ({
  nfts: many(nft),
}));

// NFT belongs to one Brand & has many Transfers
export const nftRelations = relations(nft, ({ one, many }) => ({
  brand: one(brand, {
    fields: [nft.NftContractAddress],
    references: [brand.NftContractAddress],
  }),
  transfers: many(nftTransfer),
}));

// NFTTransfer belongs to one NFT
export const nftTransferRelations = relations(nftTransfer, ({ one }) => ({
  nft: one(nft, {
    fields: [nftTransfer.tokenId, nftTransfer.NftContractAddress],
    references: [nft.tokenId, nft.NftContractAddress],
  }),
}));
