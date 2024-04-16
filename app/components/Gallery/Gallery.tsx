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

	const contract = getContract({
		client,
		address: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT!,
		chain: sepolia,
	});

	const { data: nftCount } = useReadContract(totalListings, { contract });

	const { data: nfts } = useReadContract(getAllListings, {
		contract,
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
	}

	useEffect(() => {
		if (nfts) {
			console.log("nfts", nfts);
			const metadataBuilder: NFTMetadata[] = [];

			for (let i = 0; i < nfts.length; i++) {
				if (nfts[i].status === "ACTIVE") {
					const idNumber = Number(nfts[i].asset.id.toString());
					const price = nfts[i].currencyValuePerToken.displayValue;
					const metadata: NFTMetadata = {
						...nfts[i].asset.metadata,
						id: idNumber,
						price: price,
						token: nfts[i].currencyValuePerToken.symbol,
					};
					metadataBuilder.push(metadata);
				}
				// Sort metadataBuilder by id
				metadataBuilder.sort((a, b) => (a.id > b.id ? 1 : -1));

				setAllNftMetadata(metadataBuilder);
				console.log({ metadataBuilder });
			}
		}
	}, [nfts]);

	return (
		<div className="flex flex-wrap justify-center w-full gap-4 pt-10 pb-30 bg-gradient-to-b from-pink-500 via-pink-300 to-yellow-200">
			{!allNftMetadata && <h1 className="text-3xl h-full text-white">Loading...</h1>}
			{allNftMetadata &&
				allNftMetadata.map((nft: NFTMetadata, i) => (
					<div
						style={{ boxShadow: `0 4px 6px #FEC901` }}
						className={`flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center bg-white p-3 lg:pb-5 pb-1`}
						key={i}
					>
						{" "}
						<Link href={`/nft/${nft.id}`}>
							<MediaRenderer
								className={`h-auto hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md rounded-lg `}
								client={client}
								src={nft.image}
								width="100%"
								height="100%"
							/>
						</Link>
						<div className="w-full rounded-md pr-2 pb-1 lexend-mega-300">
							<h1 className={`lexend-mega-300 mt-3 text-right lg:text-sm text-sm leading-none text-black`}>
								Bears Love Mountains #{nft.id}
							</h1>
							<h1 className={`lexend-mega-300 mt-3 text-right lg:text-sm text-sm leading-none text-black`}>
								Price {nft.price} {nft.token}
							</h1>
						</div>
					</div>
				))}
		</div>
	);
};

export default Gallery;
