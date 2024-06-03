"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import MintErc20Overlay from "../MintErc20Overlay";
import { getErc20BalanceForUser, getErc20Price, getErc20Supply } from "../../utils/contractInteraction";
import { formatUnits } from "viem";

const Memecoin: React.FC = () => {
	const { isConnected, address } = useAccount();
	const [showMintOverlay, setShowMintOverlay] = useState(false);
	const [price, setPrice] = useState<string>("");
	const [supply, setSupply] = useState<string>("");
	const [myBalance, setMyBalance] = useState<string>("");

	const handleMint = () => {
		setShowMintOverlay(true);
	};

	const handleBurn = () => {
		// Empty function for Burn button
	};

	useEffect(() => {
		const planets = document.querySelectorAll(".planet");

		planets.forEach((planet, index) => {
			const radius = 150 + index * 50; // Varying distances
			const speed = 0.001 * (index + 1); // Slow down the speed increment

			let angle = 0;
			setInterval(() => {
				angle += speed;
				const x = radius * Math.cos(angle);
				const y = radius * Math.sin(angle);
				(planet as HTMLElement).style.transform = `translate(${x}px, ${y}px) rotate(${angle * 2}rad)`;
			}, 20);
		});
	}, []);

	const fetchDetails = async () => {
		try {
			const newPrice = await getErc20Price("1");
			const newSupply = await getErc20Supply();
			console.log({ newPrice });
			console.log({ newSupply });

			setPrice(formatUnits(BigInt(newPrice), 18));
			setSupply(newSupply.toString());
		} catch (error) {
			console.error("Error fetching NFT holdings:", error);
		}
	};

	const fetchHoldings = async () => {
		try {
			if (isConnected && address) {
				const newBalance = await getErc20BalanceForUser(address);
				setMyBalance(newBalance.toString());
			}
		} catch (error) {
			console.error("Error fetching NFT holdings:", error);
		}
	};

	useEffect(() => {
		fetchDetails();
	}, []);

	useEffect(() => {
		fetchHoldings();
	}, [isConnected, address]);

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
		<div className="flex flex-col w-full h-full bg-bentoBg mt-[100px]">
			{showMintOverlay && (
				<MintErc20Overlay
					onClose={() => setShowMintOverlay(false)}
					onMintSuccess={() => {
						fetchDetails();
						fetchHoldings();
					}}
				/>
			)}
			<div className="text-white flex flex-col justify-center text-center mb-10">
				<p className="text-2xl">$BMEME is priced on a bonding curve.</p>
				<p className="">
					Mint them {"=>"} Burn them {"=> "}
					<Link className="underline decoration-bentoColor2" href="/rewards">
						Earn them as rewards for holding NFTs.
					</Link>{" "}
				</p>
			</div>
			<div className="flex flex-row md:justify-center items-center w-full md:gap-x-4">
				<div className="flex flex-col md:flex-row md:gap-4 mt-20 mb-20 md:mt-0 md:self-start">
					<div className="mt-2 relative w-[500px] h-[500px] flex justify-center items-center bg-bentoColor3">
						<img
							src="/hero/mountains/planet-1.png"
							alt="Central Planet"
							className="absolute z-10 animate-spin-slow"
							style={{ width: "150px", height: "150px" }}
						/>
						{["planet-4.png", "planet-6.png", "planet-8.png", "planet-9.png"].map((planet, index) => (
							<div
								key={index}
								className={`absolute rounded-full planet`}
								style={{
									width: "50px",
									height: "50px",
									backgroundImage: `url(/hero/mountains/${planet})`,
									backgroundSize: "cover",
									animationDuration: `${100 + index * 2}s`, // Further increase the duration
									animationTimingFunction: "linear",
								}}
							/>
						))}
						<video
							src="/hero/video-sprites/bear3.webm"
							autoPlay
							loop
							muted
							className="hidden md:block absolute z-20"
							style={{ bottom: "-13%", left: "0%", transform: "scale(0.6)" }}
						/>
					</div>
					<div className="w-full md:w-1/2 mt-2">
						<div className="grid grid-rows-6 grid-cols-2 gap-4 h-full">
							<div className="row-span-2 col-span-2 bg-bentoColor1 flex items-center justify-center text-2xl p-4">
								<div className="text-center">
									<p className="text-5xl">Price</p>
									<p>{price} $BERA</p>
								</div>
							</div>
							<div className="row-span-2 col-span-1 bg-bentoColor2 flex items-center justify-center text-2xl p-4">
								<div className="text-center">
									<p className="text-4xl">Total</p>
									<p className="text-5xl">{supply}</p>
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
			</div>
		</div>
	);
};

export default Memecoin;
