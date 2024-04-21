"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface NFTsmallProps {
	imageUrl: string;
	animationUrl: string;
	id: number;
	mainColor: string;
	accentColor: string;
}

const NFTsmall: React.FC<NFTsmallProps> = ({ imageUrl, animationUrl, id }) => {
	const router = useRouter();
	const showNFT = () => {
		// Split the URL by '/' and get the last segment
		const lastSegment = animationUrl.split("/").pop();

		// Use lastSegment as the data value
		router.push(`/nft?data=${lastSegment}`);
	};

	return (
		<div className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center border-imageBorder shadow-accent shadow-2xl p-3 lg:pb-5 pb-1">
			<img
				src={imageUrl}
				alt="NFT"
				className={`h-auto hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md rounded-lg `}
				onClick={showNFT}
			/>
			<div className="w-full rounded-md pr-2 pb-1">
				<h1 className={`mt-3 text-right lg:text-sm text-sm leading-none text-headerText`}>
					Bears Love Mountains #{id}
				</h1>
			</div>
		</div>
	);
};

export default NFTsmall;
