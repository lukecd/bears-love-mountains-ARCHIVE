"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type ResponsiveProps = {
	url: string;
};

const ResponsiveMediaRenderer: React.FC<ResponsiveProps> = ({ url }) => {
	const [size, setSize] = useState("500px");

	useEffect(() => {
		const handleResize = () => {
			const currentWidth = window.innerWidth;
			if (currentWidth >= 500) {
				setSize("500px");
			} else if (currentWidth < 500) {
				setSize(`${currentWidth}px`);
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize(); // Initial check on component mount

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return <iframe src={url} className="w-full h-full rounded-2xl" style={{ width: size, height: size }} />;
};

type NFTViewProps = {
	id: string; // The id of the NFT to display
};

interface NFTMetadata {
	name: string;
	description: string;
	image: string;
	external_url: string;
	background_color: string;
	animation_url: string;
	attributes: any[];
	price?: string;
	token?: string;
	forSale: boolean;
	owner?: string;
}

const NFTView: React.FC<NFTViewProps> = ({ id }) => {
	const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const handleMint = () => {
		// Empty function for Mint button
	};

	const handleBurn = () => {
		// Empty function for Burn button
	};

	const handleConnectWallet = () => {
		// Empty function for Connect Wallet button
	};

	useEffect(() => {
		const fetchMetadata = async () => {
			try {
				const response = await fetch(`/metadata/${id}.json`);
				const data: NFTMetadata = await response.json();
				setNftMetadata({
					...data,
					price: "0.0042",
					token: "BERA",
					forSale: true,
					owner: "0x1234567890abcdef1234567890abcdef12345678",
				});
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching NFT metadata:", error);
			}
		};

		fetchMetadata();
	}, [id]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<img
					src="/hero/mountains/planet-1.png"
					alt="Stationary Planet"
					className="rotate-forever"
					style={{
						filter: "drop-shadow(0 0 40px rgba(0,0,0,1))",
						zIndex: 20,
						position: "absolute",
					}}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-row w-full h-full bg-bentoBg mt-[100px]">
			<div className="flex flex-row md:justify-center items-center w-full md:gap-x-4">
				{nftMetadata && (
					<>
						<div className="flex flex-col md:flex-row md:gap-4 mt-20 md:mt-0 md:self-start">
							<div className="mt-10">
								<ResponsiveMediaRenderer url={nftMetadata.animation_url} />
							</div>
							<div className="w-full md:w-1/2 mt-10">
								<div className="grid grid-rows-6 grid-cols-2 gap-4 h-full">
									<div className="row-span-2 col-span-2 bg-bentoColor1 flex items-center justify-center text-2xl p-4">
										<div className="text-center">
											<p className="text-5xl">Price</p>
											<p>
												{nftMetadata.price} {nftMetadata.token}
											</p>
										</div>
									</div>
									<div className="row-span-2 col-span-2 bg-bentoColor2 flex items-center justify-center text-2xl p-4">
										<div className="text-center">
											<p className="text-2xl">
												Circulating
												<br /> supply
											</p>
											<p className="text-5xl">420</p>
										</div>
									</div>
									<div
										className="row-span-1 col-span-2 bg-bentoColor5 flex items-center justify-center text-2xl p-4 cursor-pointer hover:scale-105 cursor-pointer"
										onClick={handleMint}
									>
										Mint
									</div>
									<div
										className="row-span-1 col-span-2 bg-bentoColor4 flex items-center justify-center text-2xl p-4 cursor-pointer hover:scale-105 cursor-pointer"
										onClick={handleBurn}
									>
										Burn
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default NFTView;
