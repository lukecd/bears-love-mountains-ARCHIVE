"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getMetadataForNFT, getBalanceForUserAndId } from "../../utils/contractInteraction";
import ResponsiveMediaRenderer from "../ResponsiveMediaRenderer";
import MintOverlay from "../MintOverlay";

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

const NFTView: React.FC<NFTViewProps> = ({ id }) => {
	const { isConnected, addresses } = useAccount();
	const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [myBalance, setMyBalance] = useState<string>("-1");
	const [showMintOverlay, setShowMintOverlay] = useState(false);
	const [showBurnOverlay, setShowBurnOverlay] = useState(false);

	const handleMint = () => {
		setShowMintOverlay(true);
	};

	const handleBurn = () => {
		setShowBurnOverlay(true);
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

	useEffect(() => {
		const fetchHoldings = async () => {
			try {
				const balance = await getBalanceForUserAndId(addresses![0], BigInt(id));
				setMyBalance(balance.toString());
			} catch (error) {
				console.error("Error fetching NFT metadata:", error);
			}
		};

		if (isConnected && addresses && addresses?.length > 0) fetchHoldings();
	}, [isConnected]);

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

	const buttonStyle: React.CSSProperties = {
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "2rem",
		padding: "1rem",
		cursor: "pointer",
		backgroundColor: "var(--bentoColor4)",
		transition: "transform 0.2s",
	};

	return (
		<div className="flex flex-col w-full h-full bg-bentoBg mt-[100px] relative">
			{showMintOverlay && nftMetadata && (
				<MintOverlay
					nftMetadata={nftMetadata}
					onClose={() => setShowMintOverlay(false)}
					price={nftMetadata.price ?? "0.0"}
				/>
			)}
			<div className="text-white flex flex-col justify-center text-center">
				<p className="text-2xl">NFTs are priced on a bonding curve.</p>
				<p className={inter.className}>
					Burns are taxed 3% {"=>"} Which is used to buy{" "}
					<Link className="underline decoration-bentoColor2" href="/memecoin">
						meme coins
					</Link>{" "}
					{"=>"} Which are distributed to NFT holders.
				</p>
			</div>
			<div className="flex flex-row md:justify-center items-center w-full md:gap-x-4">
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
									<div className="row-span-2 col-span-1 bg-bentoColor2 flex items-center justify-center text-2xl p-4">
										<div className="text-center">
											<p className="text-4xl">Total</p>
											<p className="text-5xl">{nftMetadata.circulatingSupply}</p>
										</div>
									</div>
									<div className="row-span-2 col-span-1 bg-bentoColor2 flex items-center justify-center text-2xl p-4">
										<div className="text-center">
											<p className="text-4xl">Yours</p>
											<p className="text-5xl">{myBalance === "-1" ? "___" : myBalance}</p>
										</div>
									</div>
									{isConnected ? (
										<>
											<div
												className="row-span-1 col-span-2 bg-bentoColor5 flex items-center justify-center text-2xl p-4 cursor-pointer hover:scale-105"
												onClick={handleMint}
											>
												Mint
											</div>
											<div
												className="row-span-1 col-span-2 bg-bentoColor4 flex items-center justify-center text-2xl p-4 cursor-pointer hover:scale-105"
												onClick={handleBurn}
											>
												Burn
											</div>
										</>
									) : (
										<div className="row-span-2 col-span-2 bg-bentoColor4 cursor-pointer hover:scale-105">
											<ConnectButton.Custom>
												{({
													account,
													chain,
													openAccountModal,
													openChainModal,
													openConnectModal,
													authenticationStatus,
													mounted,
												}) => {
													const ready = mounted && authenticationStatus !== "loading";
													const connected =
														ready &&
														account &&
														chain &&
														(!authenticationStatus || authenticationStatus === "authenticated");

													return (
														<div
															{...(!ready && {
																"aria-hidden": true,
																style: {
																	opacity: 0,
																	pointerEvents: "none",
																	userSelect: "none",
																},
															})}
															style={buttonStyle}
														>
															{(() => {
																if (!connected) {
																	return (
																		<button
																			onClick={openConnectModal}
																			type="button"
																			style={{
																				width: "100%",
																				height: "100%",
																				backgroundColor: "inherit",
																				border: "none",
																				color: "white",
																			}}
																		>
																			Connect Wallet
																		</button>
																	);
																}

																if (chain.unsupported) {
																	return (
																		<button
																			onClick={openChainModal}
																			type="button"
																			style={{
																				width: "100%",
																				height: "100%",
																				backgroundColor: "inherit",
																				border: "none",
																				color: "white",
																			}}
																		>
																			Wrong network
																		</button>
																	);
																}

																return (
																	<div style={{ display: "flex", gap: 12, width: "100%", height: "100%" }}>
																		<button
																			onClick={openChainModal}
																			style={{
																				display: "flex",
																				alignItems: "center",
																				backgroundColor: "inherit",
																				border: "none",
																				color: "white",
																			}}
																			type="button"
																		>
																			{chain.hasIcon && (
																				<div
																					style={{
																						background: chain.iconBackground,
																						width: 12,
																						height: 12,
																						borderRadius: 999,
																						overflow: "hidden",
																						marginRight: 4,
																					}}
																				>
																					{chain.iconUrl && (
																						<img
																							alt={chain.name ?? "Chain icon"}
																							src={chain.iconUrl}
																							style={{ width: 12, height: 12 }}
																						/>
																					)}
																				</div>
																			)}
																			{chain.name}
																		</button>

																		<button
																			onClick={openAccountModal}
																			type="button"
																			style={{ backgroundColor: "inherit", border: "none", color: "white" }}
																		>
																			{account.displayName}
																			{account.displayBalance ? ` (${account.displayBalance})` : ""}
																		</button>
																	</div>
																);
															})()}
														</div>
													);
												}}
											</ConnectButton.Custom>
										</div>
									)}
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
