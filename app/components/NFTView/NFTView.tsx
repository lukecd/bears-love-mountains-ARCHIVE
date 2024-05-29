"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

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

const WalletOverlay: React.FC = () => (
	<div className="fixed inset-0 flex items-center justify-center bg-bentoPageBg bg-opacity-80 z-50">
		<div className="text-center text-white p-6 bg-bentoColor5 rounded-lg shadow-lg">
			<p className="text-2xl mb-4">Ready to do this? Connect your wallet first.</p>
			<ConnectButton />
		</div>
	</div>
);

const MintOverlay: React.FC<{ onClose: () => void; price: string }> = ({ onClose, price }) => {
	const [numToMint, setNumToMint] = useState(1);
	const [totalPrice, setTotalPrice] = useState<number | null>(null);

	const handleConfirmPrice = () => {
		setTotalPrice(Number(price) * numToMint);
	};

	const handleMintNow = () => {
		// Handle the minting process
		onClose();
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-bentoPageBg bg-opacity-90 z-50">
			<div className="relative text-center text-black p-6 bg-bentoColor5 rounded-lg shadow-lg w-96 border-8 border-bentoColor4">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-black bg-white rounded-full w-8 h-8 flex items-center justify-center"
				>
					×
				</button>
				<p className="text-3xl mb-4 underline">Mint NFT #42</p>
				<div className="grid grid-cols-2 gap-4 text-lg">
					<p>Backing Price:</p>
					<p className="">{price} BERA</p>
					<p>Number to Mint:</p>
					<input
						type="number"
						className="w-full p-2 rounded text-black"
						value={numToMint}
						onChange={(e) => setNumToMint(Number(e.target.value))}
					/>
					<button className="col-span-2 bg-bentoPageBg text-white px-4 py-2 rounded mt-4" onClick={handleConfirmPrice}>
						Confirm Price
					</button>
					{totalPrice !== null && (
						<>
							<p>Total Price:</p>
							<p>{totalPrice} BERA</p>
							<button className="col-span-2 bg-bentoColor2 text-white px-4 py-2 rounded mt-4" onClick={handleMintNow}>
								MINT NOW
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const NFTView: React.FC<NFTViewProps> = ({ id }) => {
	const { isConnected } = useAccount();
	const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showMintOverlay, setShowMintOverlay] = useState(false);

	const handleMint = () => {
		setShowMintOverlay(true);
	};

	const handleBurn = () => {
		// Empty function for Burn button
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
		<div className="flex flex-col w-full h-full bg-bentoBg mt-[100px] relative">
			{!isConnected && <WalletOverlay />}
			{showMintOverlay && nftMetadata && (
				<MintOverlay onClose={() => setShowMintOverlay(false)} price={nftMetadata.price ?? "0.0"} />
			)}
			<div className={`text-white flex flex-col justify-center text-center ${!isConnected ? "blur-sm" : ""}`}>
				<p className="text-2xl">NFTs are priced on a bonding curve.</p>
				<p className={inter.className}>
					Burns are taxed 3% {"=>"} Which is used to buy{" "}
					<Link className="underline decoration-bentoColor2" href="/memecoin">
						meme coins
					</Link>{" "}
					{"=>"} Which are distributed to NFT holders.
				</p>
			</div>
			<div
				className={`flex flex-row md:justify-center items-center w-full md:gap-x-4 ${!isConnected ? "blur-sm" : ""}`}
			>
				{nftMetadata && (
					<>
						<div className="flex flex-col md:flex-row md:gap-4 mb-20 md:mt-0 md:self-start">
							<div className="mt-3 relative">
								<ResponsiveMediaRenderer url={nftMetadata.animation_url} />
							</div>
							<div className="w-full md:w-1/2 mt-3">
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
