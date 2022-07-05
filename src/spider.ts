import { ethers, Contract, Wallet, BigNumber } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import LaunchpegABI from "./abis/Launchpeg.json";

const privateKeyIsValid = (privateKey: string | undefined): boolean => {
  if (privateKey === undefined) return false;
  else if (privateKey.length === 64 || privateKey.length === 68) {
    return true;
  }
  return false;
};

const formatPrivateKey = (privateKey: string): string => {
  if (privateKey.length === 64) {
    return "0x" + privateKey;
  }
  return privateKey;
};

let privateKey: string;
if (
  process.env.PRIVATE_KEY === undefined ||
  !privateKeyIsValid(process.env.PRIVATE_KEY)
) {
  throw new Error("Invalid Private Key");
} else {
  privateKey = process.env.PRIVATE_KEY;
}

const contractAddress: string = process.argv[2] || "";
const provider = new ethers.providers.JsonRpcProvider(
  "https://api.avax.network/ext/bc/C/rpc"
);
const wallet: Wallet = new Wallet(formatPrivateKey(privateKey), provider);
const MintContract: Contract = new ethers.Contract(
  contractAddress,
  LaunchpegABI,
  wallet
);

const mint = async (): Promise<void> => {
  const mintQuantity: number = process.argv[3] ? parseInt(process.argv[3]) : 1;
  try {
    const mintTx = await MintContract.publicSaleMint(mintQuantity);
    await mintTx.wait();
    console.log(mintTx.hash);
  } catch (err) {
    console.error(err);
  }
};
mint();

// const getTotalSupply = async (): Promise<void> => {
//   try {
//     const totalSupply: BigNumber = await MintContract.totalSupply();
//     console.log({ totalSupply: totalSupply.toString() });
//   } catch (err) {
//     console.error(err);
//   }
// }
// getTotalSupply();
