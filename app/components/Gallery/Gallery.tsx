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
import { totalListings, getAllListings } from "thirdweb/extensions/marketplace";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import HoverMediaRenderer from "../HoverMediaRenderer/HoverMediaRenderer";
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
	const activeAccount = useActiveAccount();
	const activeWallet = useActiveWallet();

	const [components, setComponents] = useState<React.ReactNode[]>([]);
	const [allNftMetadata, setAllNftMetadata] = useState<NFTMetadata[]>([]);
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

	const { data: nftCount } = useReadContract(totalListings, { contract: marketplaceContract });

	const { data: nfts } = useReadContract(getAllListings, {
		contract: marketplaceContract,
		start: 0,
		count: nftCount,
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
	}

	const loadOwnedNFTs = async () => {
		console.log("Loading owned NFTs");
		console.log({ activeAccount, activeWallet });
		// if (activeAccount) {
		const ownedNFTs = await getOwnedNFTs({
			contract: nftContract,
			owner: "0xe44d8e0126EE44014F32989514aF94C77Ab6C4d8",
			// owner: activeAccount.address,
		});
		console.log({ ownedNFTs });
		// }
	};

	useEffect(() => {
		if (!showAll) loadOwnedNFTs();
	}, []);

	useEffect(() => {
		if (nfts) {
			console.log("nfts", nfts);
			const metadataBuilder: NFTMetadata[] = [];

			const activeNfts = nfts.filter((nft) => nft.status !== "CANCELLED");
			activeNfts.sort((a, b) => (a.id > b.id ? 1 : -1));

			for (let i = 0; i < activeNfts.length; i++) {
				// if (nfts[i].status === "ACTIVE") {
				const idNumber = Number(activeNfts[i].asset.id.toString());
				const price = activeNfts[i].currencyValuePerToken.displayValue;
				const metadata: NFTMetadata = {
					...activeNfts[i].asset.metadata,
					id: idNumber,
					price: price,
					token: activeNfts[i].currencyValuePerToken.symbol,
					forSale: activeNfts[i].status === "ACTIVE",
				};
				metadataBuilder.push(metadata);
				// }
				// // Sort metadataBuilder by id
				// metadataBuilder.sort((a, b) => (a.id > b.id ? 1 : -1));
			}
			console.log({ metadataBuilder });
			setAllNftMetadata(metadataBuilder);
		}
	}, [nfts]);

	return (
		<div className="flex flex-wrap justify-center w-full gap-4 pt-10 pb-30 mb-30 mt-20">
			{allNftMetadata.length === 0
				? Array.from({ length: placeholderCount }, (_, i) => (
						<div
							key={i}
							className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3 lg:pb-5 pb-1"
						>
							<div className="animate-pulse flex flex-col items-center justify-center h-full border border-gray-300 shadow shadow-accent rounded-md p-4 mx-auto w-full">
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
							className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center bg-bg p-3 lg:pb-5 pb-1 shadow-accent shadow-2xl"
						>
							{/* <Link href={`/nft/${nft.id}`}> */}
							{/* <HoverMediaRenderer client={client} image={nft.image!} animation_url={nft.animation_url!} /> */}
							<MediaRenderer
								className="h-auto hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md rounded-lg"
								client={client}
								src={nft.image}
								width="100%"
								height="100%"
							/>
							{/* </Link> */}
							<div className="w-full rounded-md pr-2 pb-1">
								<Link href={`/nft/${nft.id}`}>
									<h1 className="mt-3 text-right lg:text-xl text-sm leading-none text-text underline decoration-accent">
										Bears Love Mountains #{nft.id}
									</h1>
								</Link>
								<h1 className="mt-3 text-right lg:text-base text-sm leading-none text-text">
									{!nft.forSale ? "SOLD" : "Price " + nft.price}
								</h1>
							</div>
						</div>
				  ))}
		</div>
	);
};

export default Gallery;
