"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getMetadataForNFT, getNFTPrice } from "../../utils/contractInteraction";
import ResponsiveMediaRenderer from "../ResponsiveMediaRenderer";
import { formatUnits } from "viem";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

type NFTViewProps = {
	id: string; // The id of the NFT to display
};

interface NFTMetadata {
	id: string;
	name: string;
	description: string;
	image: string;
	external_url: string;
	animation_url: string;
	price: string;
	circulatingSupply: number;
}

const WalletOverlay: React.FC = () => (
	<div className="fixed inset-0 flex items-center justify-center bg-bentoPageBg bg-opacity-80 z-50">
		<div className="text-center text-white p-6 bg-bentoColor5 rounded-lg shadow-lg">
			<p className="text-2xl mb-4">Ready to do this? Connect your wallet first.</p>
			<ConnectButton />
		</div>
	</div>
);

interface NFTMetadata {
	id: string;
}

interface MintOverlayProps {
	nftMetadata: NFTMetadata;
	onClose: () => void;
	price: string;
}

const MintOverlay: React.FC<MintOverlayProps> = ({ nftMetadata, onClose, price }) => {
	const [numToMint, setNumToMint] = useState<string>("1");
	const [txActive, setTxActive] = useState(false);
	const [totalPrice, setTotalPrice] = useState<string | null>(null);

	const handleConfirmPrice = async () => {
		setTxActive(true);
		const price = await getNFTPrice(BigInt(nftMetadata.id), BigInt(parseInt(numToMint)));
		const formattedPrice = formatUnits(BigInt(price), 18);
		setTotalPrice(formattedPrice);
		setTxActive(false);
	};

	const handleMintNow = () => {
		// Handle the minting process
		onClose();
	};

	const handleNumToMintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "" || /^[1-9]\d*$/.test(value)) {
			setNumToMint(value);
		}
	};

	const handleNumToMintBlur = () => {
		if (numToMint === "" || parseInt(numToMint) < 1) {
			setNumToMint("1");
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-bentoPageBg bg-opacity-90 z-50">
			<div className="relative text-center text-black p-6 bg-bentoColor5 rounded-lg shadow-lg w-128 border-8 border-bentoColor4">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-black bg-white rounded-full w-8 h-8 flex items-center justify-center"
				>
					×
				</button>
				<p className="text-3xl mb-4 underline">Mint NFT</p>
				<div className="grid grid-cols-2 gap-4 text-lg">
					<p>Backing Price:</p>
					<p className="">{price} BERA</p>
					<p>Number to Mint:</p>
					<input
						type="text"
						className="w-full p-2 rounded text-black"
						value={numToMint}
						onChange={handleNumToMintChange}
						onBlur={handleNumToMintBlur}
					/>
					<button
						disabled={txActive}
						className="col-span-2 bg-bentoPageBg text-white px-4 py-2 rounded mt-4"
						style={{ height: "48px" }}
						onClick={handleConfirmPrice}
					>
						{txActive ? (
							<div className="flex justify-center items-center" style={{ height: "100%" }}>
								<img
									src="/hero/mountains/planet-9.png"
									alt="Stationary Planet"
									className="rotate-forever"
									style={{
										filter: "drop-shadow(0 0 40px rgba(0,0,0,1))",
										zIndex: 20,
										height: "36px",
									}}
								/>
							</div>
						) : (
							"Confirm Price"
						)}
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
				const metadata = await getMetadataForNFT(BigInt(id));
				console.log({ metadata });
				setNftMetadata(metadata);
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
				<MintOverlay
					nftMetadata={nftMetadata}
					onClose={() => setShowMintOverlay(false)}
					price={nftMetadata.price ?? "0.0"}
				/>
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
							<div className="mt-3 relative" id={`nft-viewer-${id}`}>
								<ResponsiveMediaRenderer id={`nft-viewer-${id}`} url={nftMetadata.animation_url} />
							</div>
							<div className="w-full md:w-1/2 mt-3">
								<div className="grid grid-rows-6 grid-cols-2 gap-4 h-full">
									<div className="row-span-2 col-span-2 bg-bentoColor1 flex items-center justify-center text-2xl p-4">
										<div className="text-center">
											<p className="text-5xl">Price</p>
											<p>{nftMetadata.price}</p>
										</div>
									</div>
									<div className="row-span-2 col-span-2 bg-bentoColor2 flex items-center justify-center text-2xl p-4">
										<div className="text-center">
											<p className="text-2xl">
												Circulating
												<br /> supply
											</p>
											<p className="text-5xl">{nftMetadata.circulatingSupply}</p>
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
