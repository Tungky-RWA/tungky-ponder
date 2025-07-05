import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { brand } from "ponder:schema";
import { PinataSDK } from "pinata";
import {
  getContract,
  createWalletClient,
  http,
  PrivateKeyAccount,
  createPublicClient,
  isAddress,
} from "viem";
import { monadTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { BrandNFTAbi } from "../../abis/BrandNFTAbi";
interface Bindings {
  PINATA_JWT: string;
  GATEWAY_URL: string;
}

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Pastikan private key dari environment variable Anda diawali dengan '0x'
const rawPrivateKey = process.env.PRIVATE_KEY;

// Validasi dan format private key
let privateKey: `0x${string}`;
if (rawPrivateKey && rawPrivateKey.startsWith("0x")) {
  privateKey = rawPrivateKey as `0x${string}`;
} else if (rawPrivateKey) {
  privateKey = `0x${rawPrivateKey}` as `0x${string}`; // Tambahkan '0x' jika belum ada
} else {
  throw new Error("PRIVATE_KEY environment variable is not set.");
}

// --- Inisialisasi Viem Clients ---
const publicClient = createPublicClient({
  chain: monadTestnet, // Pastikan ini sesuai dengan jaringan Anda
  transport: http("https://testnet-rpc.monad.xyz/"),
});

const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({
  account,
  chain: monadTestnet, // Pastikan ini sesuai dengan jaringan Anda
  transport: http("https://testnet-rpc.monad.xyz/"),
});

const app = new Hono<{ Bindings: Bindings }>();

app.use("/sql/*", client({ db, schema }));

app.get("/brands", async (c: any) => {
  const brands = await db.select().from(brand);

  return c.json(brands);
});

app.get("/current-block", async (c: any) => {
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Current block number:", blockNumber);

  return c.json(blockNumber);
});

app.post("/api/claim-nft", async (c) => {
  try {
    // Membaca semua data dari body JSON
    const { contractAddress, to, tokenId } = await c.req.json();

    // 1. Validasi Input
    // Pastikan contractAddress adalah alamat Ethereum yang valid
    if (!isAddress(contractAddress)) {
      return c.json(
        {
          error:
            'Invalid input: "contractAddress" must be a valid Ethereum address.',
        },
        400
      );
    }
    // Validasi 'to' dan 'tokenId'
    if (!isAddress(to)) {
      return c.json(
        { error: 'Invalid input: "to" must be a valid Ethereum address.' },
        400
      );
    }
    if (typeof tokenId !== "number") {
      return c.json(
        { error: 'Invalid input: "tokenId" must be a number.' },
        400
      );
    }

    // Mendapatkan instance kontrak BrandNFT Anda DENGAN ALAMAT DARI REQUEST
    // Sekarang brandNFTContract akan dibuat spesifik untuk setiap panggilan

    // 2. Simulasi Transaksi menggunakan Viem
    // Perhatikan bahwa brandNFTContract yang digunakan di sini adalah instance yang baru dibuat
    const { request } = await publicClient.simulateContract({
      account,
      address: contractAddress, // Gunakan alamat dari body request
      abi: BrandNFTAbi,
      functionName: "claimNFT",
      args: [to, BigInt(tokenId)],
    });

    // 3. Kirim Transaksi ke blockchain menggunakan Viem
    const hash = await walletClient.writeContract(request);

    // 4. Tunggu Konfirmasi Transaksi menggunakan Viem
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // 5. Kirim Respon Sukses
    return c.json({
      message: `NFT with tokenId ${tokenId} claimed successfully by ${to} on contract ${contractAddress}!`,
      transactionHash: hash,
      receipt: receipt,
    });
  } catch (error: any) {
    console.error("Error claiming NFT:", error);
    const errorMessage =
      error.cause?.reason ||
      error.shortMessage ||
      error.message ||
      "Failed to claim NFT.";
    return c.json({ error: errorMessage }, 500);
  }
});

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

export default app;
