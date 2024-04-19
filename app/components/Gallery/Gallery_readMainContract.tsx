"use client";

import React, { useState, useEffect } from "react";
import NFTsmall from "../NFTsmall";
import Info from "../Info";
import { getContract } from "thirdweb";
import { MediaRenderer, useReadContract } from "thirdweb/react";
import { useRouter } from "next/router";
import { sepolia } from "thirdweb/chains";
import { createThirdwebClient, defineChain } from "thirdweb";
import { THIRD_WEB_CLIENT_ID } from "../../utils/constants";
import { totalSupply, getNFTs } from "thirdweb/extensions/erc721";
import { totalListings, getAllListings } from "thirdweb/extensions/marketplace";
import Link from "next/link";
const client = createThirdwebClient({
	clientId: THIRD_WEB_CLIENT_ID,
});

interface GalleryProps {
	showAll?: boolean; // If true show all NFTs in collection, if false show NFTs owned by that user
}

interface NFTMetadata {
	id: bigint;
	price?: string;
	image?: string;
	name?: string;
	animation_url?: string;
	description?: string;
}

const Gallery: React.FC<GalleryProps> = ({ showAll }) => {
	const [components, setComponents] = useState<React.ReactNode[]>([]);
	const [allNftMetadata, setAllNftMetadata] = useState<NFTMetadata[]>([]);
	const mainColors = ["#E24330", "#8C262E", "#90A9EE", "#98282B", "#E24330"];
	const accentColors = ["#FEC901", "#FF7B02", "#F0F22F", "#FE91E7", "#FE91E7"];
	const placeholderCount = 42; // There will be exactly 42 items

	const nftContract = getContract({
		client,
		address: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
		chain: sepolia,
	});

	const marketplaceContract = getContract({
		client,
		address: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT!,
		chain: sepolia,
	});
	const { data: nftCount } = useReadContract(totalSupply, { contract: nftContract });
	const { data: marketplaceNftCount } = useReadContract(totalListings, { contract: marketplaceContract });

	const { data: marketplaceNfts } = useReadContract(getAllListings, {
		contract: marketplaceContract,
		start: 0,
		count: marketplaceNftCount,
	});

	const { data: contractNfts } = useReadContract(getNFTs, {
		contract: nftContract,
		start: 0,
		count: 42,
	});

	interface NFTMetadata {
		id: number;
		price?: string;
		token?: string;
		image?: string;
		name?: string;
		animation_url?: string;
		description?: string;
		forSale: boolean;
		owner?: string;
	}

	useEffect(() => {
		if (marketplaceNfts && contractNfts) {
			console.log({ marketplaceNfts });
			const metadataBuilder: NFTMetadata[] = [];

			// Filter nfts to only contain nft.status === ACTIVE
			const activeNfts = marketplaceNfts.filter((nft) => nft.status === "ACTIVE");

			// Sort activeNfts by id
			activeNfts.sort((a, b) => (a.asset.id > b.asset.id ? 1 : -1));

			console.log({ contractNfts });

			// Sort contractNfts by id
			contractNfts.sort((a, b) => (a.id > b.id ? 1 : -1));

			for (let i = 0; i < contractNfts.length; i++) {
				const idNumber = Number(contractNfts[i].id.toString());
				// const price = contractNfts[i].currencyValuePerToken.displayValue;
				// const priceToken = contractNfts[i].currencyValuePerToken.symbol,

				// if idNumber is in markeplaceNfts, set forSale to true, else set to false
				const forSale = marketplaceNfts.some((nft) => nft.asset.id === contractNfts[i].id);
				console.log({ idNumber, forSale });

				const metadata: NFTMetadata = {
					...contractNfts[i].metadata,
					id: idNumber,
					price: "",
					token: "",
					forSale: forSale,
					// owner: nfts[i].seller,
				};
				metadataBuilder.push(metadata);
			}

			setAllNftMetadata(metadataBuilder);

			console.log("active NFT count", activeNfts.length);
		}
	}, [marketplaceNfts]);

	return (
		<div className="flex flex-wrap justify-center w-full gap-4 pt-10 pb-30 bg-gradient-to-b from-pink-500 via-pink-300 to-yellow-200">
			{allNftMetadata.length === 0
				? Array.from({ length: placeholderCount }, (_, i) => (
						<div
							key={i}
							className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center bg-white p-3 lg:pb-5 pb-1"
						>
							<div className="animate-pulse flex flex-col items-center justify-center h-full border border-gray-300 shadow rounded-md p-4 mx-auto w-full">
								<img
									src="/hero/mountains/planet-3.png"
									className="rotate-forever h-20 w-20 self-center"
									alt="Loading spinner"
								/>
								<div className="mt-2 space-y-2">
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
									<div className="h-4 bg-gray-200 rounded w-1/4"></div>
								</div>
							</div>
						</div>
				  ))
				: allNftMetadata.map((nft, i) => (
						<div
							key={i}
							style={{ boxShadow: `0 4px 6px #FEC901` }}
							className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center bg-white p-3 lg:pb-5 pb-1"
						>
							<Link href={`/nft/${nft.id}`}>
								<MediaRenderer
									className="h-auto hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md rounded-lg"
									client={client}
									src={nft.image}
									width="100%"
									height="100%"
								/>
							</Link>
							<div className="w-full rounded-md pr-2 pb-1">
								<h1 className="lexend-mega-300 mt-3 text-right lg:text-sm text-sm leading-none text-black">
									Bears Love Mountains #{nft.id}
								</h1>
								<h1 className="lexend-mega-300 mt-3 text-right lg:text-sm text-sm leading-none text-black">
									Price {nft.price}
								</h1>
							</div>
						</div>
				  ))}
		</div>
	);
};

export default Gallery;
