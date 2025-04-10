import type { Chain } from "thirdweb";
import { avalancheFuji, polygonAmoy, sepolia } from "./chains";

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";

  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};


export const NFT_CONTRACTS: NftContract[] = [
  {
    address: "0xfD4E00D4FFEad1cf4Cde66efc7EAc1572E700376",
    chain: sepolia,
    title: "AI SpeedZone",
    thumbnailUrl:
      "https://c0e15a3ae2a33960ae1893f1a6533e1b.ipfscdn.io/ipfs/QmRaoVEuioWsU9pZd6ZvgKfSJuYLdJu2L5HMYR7Gipw1P3/Gemini_Generated_Image_zdn6idzdn6idzdn6.jpeg",
    type: "ERC721",
  },
  {
    address: "0x8Db59F1A6783CD2F5ED7b9FEbB35f53d3d36714a",
    chain: sepolia,
    title: "Arcade Anomalies: Glitch Hunters",
    thumbnailUrl:
      "https://ipfs.io/ipfs/QmbXPm2Rx6ahG7JMHDhp2guqcXCfkA1AvUP96MKcc1KQ1m/ChatGPT%20Image%20Apr%2010%2C%202025%2C%2002_24_29%20AM-1.jpeg",
    type: "ERC721",
  },
];
