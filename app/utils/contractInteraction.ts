import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getNFT, getOwnedNFTs, getNFTs, ownerOf, approve, isApprovedForAll } from "thirdweb/extensions/erc721";
import { totalListings, getAllListings } from "thirdweb/extensions/marketplace";

/**                          INTERFACES                       */
export interface NFTMetadata {
	id: number;
	price?: string;
	token?: string;
	image?: string;
	name?: string;
	animation_url?: string;
	description?: string;
	forSale: boolean;
}

export const client = createThirdwebClient({
	clientId: process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT_ID!,
});

export const marketplaceContract = getContract({
	client,
	address: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT!,
	chain: sepolia,
});

export const nftContract = getContract({
	client,
	address: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
	chain: sepolia,
});

export const getAllNFTs = async (address?: string) => {
	console.log("Getting all NFTs");
	console.log("Address: ", address);
	let nfts;
	if (address) {
		nfts = await getOwnedNFTs({
			contract: nftContract,
			owner: address,
		});
	} else {
		nfts = await getNFTs({
			contract: nftContract,
			start: 0,
			count: parseInt(process.env.NEXT_PUBLIC_NFT_COUNT!),
		});
	}

	// Sort NFTs by ID
	nfts.sort((a, b) => (a.id > b.id ? 1 : -1));

	return nfts;
};

export const getMarketplaceNFTs = async () => {
	const marketplaceNftCount = await totalListings({
		contract: marketplaceContract,
	});
	const marketplaceNfts = await getAllListings({
		contract: marketplaceContract,
		start: 0,
		count: marketplaceNftCount,
	});

	// Filter marketplaceNfts to only show active listings
	// Might need to include
	const activeNfts = marketplaceNfts.filter((nft) => nft.status === "ACTIVE");

	return activeNfts;
};

export const getGalleryData = async (address?: string): Promise<NFTMetadata[]> => {
	const mainNfts = await getAllNFTs(address);
	const marketplaceNfts = await getMarketplaceNFTs();

	// Filter marketplaceNfts to only show active listings
	const metadataBuilder: NFTMetadata[] = [];

	for (let i = 0; i < mainNfts.length; i++) {
		// Check if the NFT is for sale, by searching in marketplaceNfts
		// Such that idNumber is marketplaceNfts.asset.id
		const marketplaceIndex = marketplaceNfts.findIndex((nft) => nft.asset.id === mainNfts[i].id);
		const idNumber = Number(mainNfts[i].id.toString());

		const metadata: NFTMetadata = {
			...mainNfts[i].metadata,
			id: idNumber,
			price: marketplaceIndex !== -1 ? marketplaceNfts[marketplaceIndex].currencyValuePerToken.displayValue : "",
			token: marketplaceIndex !== -1 ? marketplaceNfts[marketplaceIndex].currencyValuePerToken.symbol : "",
			forSale: marketplaceIndex !== -1,
		};
		metadataBuilder.push(metadata);
	}

	metadataBuilder.sort((a, b) => (a.id > b.id ? 1 : -1));
	return metadataBuilder;
};
