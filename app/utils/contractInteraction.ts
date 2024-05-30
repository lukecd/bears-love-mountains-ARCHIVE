import { Address, createPublicClient, formatUnits, http } from "viem";
import getConfig from "next/config";
import { bearsLoveMemesAbi } from "../abis/BearsLoveMemes";
import { bearsLoveMountainsAbi } from "../abis/BearsLoveMountains";
import { bearsLoveDefiAbi } from "../abis/BearsLoveDefi";
import { sepolia } from "viem/chains";
import { sep } from "path";

const bearsLoveMemesAddress = process.env.NEXT_PUBLIC_MEME_CONTRACT_ADDRESS;
const bearsLoveMountainsAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

const publicClient = createPublicClient({
	chain: sepolia,
	transport: http("https://eth-sepolia.g.alchemy.com/v2/GhM1EP2edH5wym1A9B0u2NifZVgWAmz2"),
	// transport: http("https://rpc.bordel.wtf/sepolia"),
});

type NFTMetadata = {
	id: number;
	name: string;
	description: string;
	image: string;
	external_url: string;
	animation_url: string;
	price: string;
	circulatingSupply: number;
};

export const getMetadataForNFT = async (id: bigint): Promise<NFTMetadata> => {
	try {
		// Metadata
		console.log("Requesting URI for id=", id);
		const uri = await publicClient.readContract({
			address: bearsLoveMountainsAddress as Address,
			abi: bearsLoveMountainsAbi,
			functionName: "uri",
			args: [id],
		});
		console.log({ uri });
		const response = await fetch(uri);
		const metadata = await response.json();

		// Price
		const price = await publicClient.readContract({
			address: bearsLoveMountainsAddress as Address,
			abi: bearsLoveMountainsAbi,
			functionName: "getPrice",
			args: [id, BigInt(1), true],
		});

		// Circulating supply
		const circulatingSupply = await publicClient.readContract({
			address: bearsLoveMountainsAddress as Address,
			abi: bearsLoveMountainsAbi,
			functionName: "circulatingSupply",
			args: [id],
		});

		return {
			...metadata,
			price: formatUnits(price, 18),
			circulatingSupply: circulatingSupply.toString(),
		};
	} catch (error) {
		console.log("Error fetching metadata ", error);
	}
	return {
		id: 0,
		name: "error",
		description: "error",
		image: "error",
		external_url: "error",
		animation_url: "error",
		price: "error",
		circulatingSupply: 0,
	};
};

export const getAllNFTMetadata = async (): Promise<NFTMetadata[]> => {
	const metadataPromises = [];
	for (let id = 0; id <= 8; id++) {
		metadataPromises.push(getMetadataForNFT(BigInt(id)));
	}
	return Promise.all(metadataPromises);
};

// export const getMemeCoinBackingPrice = async (): Promise<string> => {
// 	const price = await publicClient.readContract({
// 		address: bearsLoveMemesAddress,
// 		abi: bearsLoveMemesAbi,
// 		functionName: "getBackingPrice",
// 	});
// 	return formatUnits(price, 18);
// };
