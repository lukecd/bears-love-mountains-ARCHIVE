import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getNFT, getNFTs, ownerOf, approve, isApprovedForAll } from "thirdweb/extensions/erc721";
import { totalListings, getAllListings } from "thirdweb/extensions/marketplace";

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

export const getAllNFTs = async () => {
	const nfts = await getNFTs({
		contract: nftContract,
		start: 0,
		count: process.env.NEXT_PUBLIC_NFT_COUNT!,
	});

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

	return marketplaceNfts;
};

export const getGalleryData = async (): Promise<NFTMetadata[]> => {
	const mainNfts = await getAllNFTs();
	const marketplaceNfts = await getMarketplaceNFTs();
	console.log("mainNfts", mainNfts);
	console.log("marketplaceNfts", marketplaceNfts);
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
			price: marketplaceIndex !== -1 ? marketplaceNfts[i].currencyValuePerToken.displayValue : "",
			token: marketplaceIndex !== -1 ? marketplaceNfts[i].currencyValuePerToken.symbol : "",
			forSale: marketplaceIndex !== -1,
		};
		metadataBuilder.push(metadata);
	}

	console.log("new utility function");
	console.log({ metadataBuilder });
	metadataBuilder.sort((a, b) => (a.id > b.id ? 1 : -1));
	return metadataBuilder;
};
