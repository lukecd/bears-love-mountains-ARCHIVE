import { Address, createPublicClient, formatUnits, http, createWalletClient, custom, parseEther } from "viem";
import getConfig from "next/config";
import { bearsLoveMemesAbi } from "../abis/BearsLoveMemesAbi";
import { bearsLoveMountainsAbi } from "../abis/BearsLoveMountainsAbi";
import { bearsLoveDefiAbi } from "../abis/BearsLoveDefiAbi";

import { sepolia } from "viem/chains";
import { sep } from "path";

const bearsLoveMemesAddress = process.env.NEXT_PUBLIC_MEME_CONTRACT_ADDRESS;
const bearsLoveMountainsAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
const baseAssetAddress = process.env.NEXT_PUBLIC_BASE_ASSET_ADDRESS;

const publicClient = createPublicClient({
	chain: sepolia,
	transport: http("https://eth-sepolia.g.alchemy.com/v2/GhM1EP2edH5wym1A9B0u2NifZVgWAmz2"),
});

let client;

if (typeof window !== "undefined" && window.ethereum) {
	client = createWalletClient({
		chain: sepolia,
		transport: custom(window.ethereum),
	});
} else {
	client = null;
	console.error("Ethereum provider is not available");
}

/**                               MISC FUNCTIONS																 */
export const getEthBalanceForUser = async (address: string): Promise<bigint> => {
	const convertedAddress = address as Address;
	const balance = await publicClient.getBalance({ address: convertedAddress });
	return balance;
};

/**                               NFT FUNCTIONS																	 */
/**                               NFT READING 																	 */
type NFTMetadata = {
	id: string;
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
			id: id.toString(),
			price: formatUnits(price, 18),
			circulatingSupply: circulatingSupply.toString(),
		};
	} catch (error) {
		console.log("Error fetching metadata ", error);
	}
	return {
		id: id.toString(),
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
	for (let id = 8; id >= 0; id--) {
		metadataPromises.push(getMetadataForNFT(BigInt(id)));
	}
	return Promise.all(metadataPromises);
};

export const getNFTPrice = async (id: bigint, quantity: bigint, isMint: boolean): Promise<bigint> => {
	const price = await publicClient.readContract({
		address: bearsLoveMountainsAddress as Address,
		abi: bearsLoveMountainsAbi,
		functionName: "getPrice",
		args: [id, quantity, isMint],
	});

	return price;
};

export const getBalanceForUserAndId = async (address: string, id: bigint): Promise<bigint> => {
	const balance = await publicClient.readContract({
		address: bearsLoveMountainsAddress as Address,
		abi: bearsLoveMountainsAbi,
		functionName: "balanceOf",
		args: [address as Address, id],
	});

	return balance;
};

/**                               NFT WRITING  																	 */
export const mintNFT = async (id: bigint, quantity: bigint): Promise<boolean> => {
	try {
		if (client) {
			console.log({ client });

			const [account] = await client.getAddresses();
			console.log({ account });

			const price = await getNFTPrice(id, quantity, true);
			console.log({ price });

			const hash = await client.writeContract({
				address: bearsLoveMountainsAddress as Address,
				abi: bearsLoveMountainsAbi,
				functionName: "mint",
				args: [id, quantity],
				value: price,
				account,
			});
			console.log({ hash });

			const receipt = await publicClient.waitForTransactionReceipt({ hash });
			console.log({ receipt });
			return true;
		}
	} catch (e) {
		console.log("Error minting NFT ", e);
	}
	return false;
};

export const burnNFT = async (id: bigint, quantity: bigint): Promise<boolean> => {
	try {
		if (client) {
			const [account] = await client.getAddresses();
			console.log({ account });

			const hash = await client.writeContract({
				address: bearsLoveMountainsAddress as Address,
				abi: bearsLoveMountainsAbi,
				functionName: "burn",
				args: [id, quantity],
				account,
			});
			console.log({ hash });

			const receipt = await publicClient.waitForTransactionReceipt({ hash });
			console.log({ receipt });

			return true;
		}
	} catch (e) {
		console.log("Error minting NFT ", e);
	}
	return false;
};

/**                               ERC20 FUNCTIONS																	 */
/**                               ERC20 READING 																	 */
export const calculateTokensForETH = async (quantity: string): Promise<bigint> => {
	const quantityBigInt = parseEther(quantity);

	const price = await publicClient.readContract({
		address: bearsLoveMemesAddress as Address,
		abi: bearsLoveMemesAbi,
		functionName: "calculateTokensForETH",
		args: [quantityBigInt],
	});

	return price;
};

export const getErc20Price = async (quantity: string): Promise<bigint> => {
	const quantityBigInt = parseEther(quantity);

	const price = await publicClient.readContract({
		address: bearsLoveMemesAddress as Address,
		abi: bearsLoveMemesAbi,
		functionName: "getPrice",
		args: [quantityBigInt],
	});

	return price;
};

export const getErc20Supply = async (): Promise<bigint> => {
	console.log("supply");
	const supply = await publicClient.readContract({
		address: bearsLoveMemesAddress as Address,
		abi: bearsLoveMemesAbi,
		functionName: "circulatingSupply",
	});
	console.log({ supply });
	return supply;
};

export const getErc20BalanceForUser = async (address: string): Promise<bigint> => {
	const balance = await publicClient.readContract({
		address: bearsLoveMemesAddress as Address,
		abi: bearsLoveMemesAbi,
		functionName: "balanceOf",
		args: [address as Address],
	});

	return balance;
};

/**                              ERC20 WRITING  																	 */
export const mintErc20 = async (quantityOfEth: string): Promise<boolean> => {
	try {
		if (client) {
			const [account] = await client.getAddresses();
			const quantityInWei = parseEther(quantityOfEth);
			const hash = await client.writeContract({
				address: bearsLoveMemesAddress as Address,
				abi: bearsLoveMemesAbi,
				functionName: "mintWithETH",
				value: quantityInWei,
				account,
			});
			console.log({ hash });

			const receipt = await publicClient.waitForTransactionReceipt({ hash });
			console.log({ receipt });
			return true;
		}
	} catch (e) {
		console.log("Error minting NFT ", e);
	}
	return false;
};
