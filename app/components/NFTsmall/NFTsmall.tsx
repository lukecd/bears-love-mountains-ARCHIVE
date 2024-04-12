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

const MountainTripLoader = ({ imageUrl, animationUrl }) => {
	useEffect(() => {
		const loadHtmlContent = async () => {
			try {
				// Create an iframe and write the HTML content to it
				const iframe = document.createElement("iframe");
				iframe.style.border = "none";
				iframe.style.overflow = "hidden";
			} catch (error) {
				console.error("Failed to load HTML content:", error);
			}
		};

		loadHtmlContent();
	}, []);

	return <div id="iframeContainer" className="w-[600px] h-[600px] overflow-y-hidden"></div>;
};

const NFTsmall: React.FC<NFTsmallProps> = ({ imageUrl, animationUrl, id, mainColor, accentColor }) => {
	const router = useRouter();
	const showNFT = () => {
		// Split the URL by '/' and get the last segment
		const lastSegment = animationUrl.split("/").pop();

		// Use lastSegment as the data value
		router.push(`/nft?data=${lastSegment}`);
	};

	return (
		<div
			style={{ boxShadow: `0 4px 6px ${accentColor}` }}
			className={`flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center bg-white p-3 lg:pb-5 pb-1`}
		>
			<img
				src={imageUrl}
				alt="NFT"
				className={`h-auto hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md rounded-lg `}
				onClick={showNFT}
			/>
			<div className="w-full rounded-md pr-2 pb-1 lexend-mega-300">
				<h1 className={`lexend-mega-300 mt-3 text-right lg:text-sm text-sm leading-none text-black`}>
					Bears Love Mountains #{id}
				</h1>
			</div>
		</div>
	);
};

export default NFTsmall;
