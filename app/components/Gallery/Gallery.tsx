"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllNFTMetadata } from "../../utils/contractInteraction";

interface GalleryProps {
	showAll?: boolean; // If true show all NFTs in collection, if false show NFTs owned by that user
	address?: string; // Address of the user to show NFTs for, if blank and showAll is true, shows NFTs for logged in user
}

interface NFTMetadata {
	id: number;
	name: string;
	description: string;
	image: string;
	external_url: string;
	animation_url: string;
	price: string;
	circulatingSupply: number;
}

const Gallery: React.FC<GalleryProps> = ({ showAll, address }) => {
	const [allNftMetadata, setAllNftMetadata] = useState<NFTMetadata[]>([]);
	const [placeholderCount, setPlaceHolderCount] = useState<number>(9); // There will be exactly 9 items

	useEffect(() => {
		const loadMetadata = async () => {
			const newMetaData = await getAllNFTMetadata();
			console.log({ newMetaData });
			setAllNftMetadata(newMetaData);
			setPlaceHolderCount(0);

			// const metadata: NFTMetadata[] = [];
			// for (let i = 0; i < 9; i++) {
			// 	const response = await fetch(`/metadata/${i}.json`);
			// 	const data = await response.json();
			// 	metadata.push(data);
			// }
			// setAllNftMetadata(metadata);
		};
		loadMetadata();
	}, []);

	return (
		<div className="flex flex-wrap flex-col justify-center w-full gap-4 pt-10 pb-30 mb-20 mt-20">
			<div className="flex flex-wrap flex-row justify-center w-full gap-4 pb-30 mt-5 mb-20">
				{placeholderCount > 0
					? Array.from({ length: placeholderCount }, (_, i) => (
							<div
								key={i}
								className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3 lg:pb-5 pb-1"
							>
								<div className="animate-pulse flex flex-col items-center justify-center h-full border border-gray-300 shadow shadow-accent rounded-md p-4 mx-auto w-full">
									<img
										src="/hero/mountains/planet-3.png"
										className="rotate-forever h-20 w-20 mt-10 self-center"
										alt="Loading spinner"
									/>
									<div className="mt-2 space-y-2">
										<div className="h-4 bg-gray-200 rounded w-3/4"></div>
										<div className="h-4 bg-gray-200 rounded w-1/4"></div>
									</div>
								</div>
							</div>
					  ))
					: allNftMetadata.map((nft, i) => <NFTSmall key={i} id={i} metadata={nft} />)}
			</div>
		</div>
	);
};

interface NFTSmallProps {
	metadata: NFTMetadata;
	id: number;
}

const NFTSmall: React.FC<NFTSmallProps> = ({ metadata, id }) => {
	return (
		<div
			className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center bg-bentoColor5 p-6 rounded-md transform transition-transform duration-300 hover:scale-105 cursor-pointer relative"
			onClick={() => (window.location.href = `/nft/${id}`)}
		>
			<iframe
				src={metadata.animation_url}
				className="w-[340px] h-[340px] rounded-2xl shadow-xl pointer-events-none"
			></iframe>
			<div className="w-full text-start rounded-b-md text-bentoColor3">
				<p className="">Price: {metadata.price} BERA</p>
				<p className="">Circulating supply: {metadata.circulatingSupply}</p>
			</div>
			<div className="absolute top-0 left-0 w-full h-full bg-transparent"></div>
		</div>
	);
};

export default Gallery;
