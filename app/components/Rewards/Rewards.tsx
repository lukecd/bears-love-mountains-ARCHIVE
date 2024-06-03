"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { getErc20BalanceForUser, getErc20Price, getErc20Supply } from "../../utils/contractInteraction";
import { formatUnits } from "viem";
import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

const Rewards: React.FC = () => {
	const { isConnected, address } = useAccount();
	const [totalProtocolRewards, setTotalProtocolRewards] = useState<number>(45006948.48438);
	const [totalAvailableToClaim, setTotalAvailableToClaim] = useState<number>(420);
	const [claimTxActive, setClaimTxActive] = useState<boolean>(false);
	const [showSuccess, setShowSuccess] = useState<boolean>(false);

	const handleClaim = async () => {
		setClaimTxActive(true);
		// Simulate the claiming process
		setTimeout(() => {
			setClaimTxActive(false);
			setShowSuccess(true);
		}, 2000);
	};

	return (
		<div className="flex flex-col w-full h-full bg-bentoPageBg items-center mt-20 mb-20 justify-center py-10">
			<div className="text-white flex flex-col justify-center text-center mb-10">
				<p className="text-2xl mb-2">Earn $BMEME by holding $BMTN NFTs.</p>
				<p className={inter.className}>
					The more{" "}
					<Link className="underline decoration-bentoColor2" href="/nfts">
						NFTs
					</Link>{" "}
					you hold, the more $BMEME you earn.
				</p>
			</div>
			<div
				id="rewardsBox"
				className="relative text-center text-black p-6 bg-bentoColor5 w-128 h-128 border-8 border-bentoColor4"
			>
				{!showSuccess ? (
					<div className="flex flex-col items-center justify-center gap-4">
						<div className="flex flex-row justify-between items-center w-full h-full text-lg bg-bentoColor1 p-4">
							<div className="w-1/3 text-xl bg-bentoColor4 p-2">Total Protocol Rewards</div>
							<div className="w-2/2 text-xl bg-bentoColor1 p-2 text-right">{totalProtocolRewards} $BMEME</div>
						</div>
						<div className="flex flex-row justify-between items-center w-full h-full text-lg bg-bentoColor1 p-4">
							<div className="w-1/3 text-xl bg-bentoColor4 p-2">Total Rewards Available To Claim</div>
							<div className="w-2/3 text-xl bg-bentoColor1 p-2 text-right">{totalAvailableToClaim} $BMEME</div>
						</div>
						<div
							className={`w-full h-16 bg-bentoColor2 text-white px-4 py-2 rounded mt-4 cursor-pointer hover:scale-105 flex items-center justify-center ${
								claimTxActive ? "pointer-events-none" : ""
							}`}
							onClick={handleClaim}
						>
							{claimTxActive ? (
								<div className="flex justify-center items-center">
									<img
										src="/hero/mountains/planet-9.png"
										alt="Stationary Planet"
										className="rotate-forever"
										style={{
											filter: "drop-shadow(0 0 40px rgba(0,0,0,1))",
											height: "36px",
										}}
									/>
								</div>
							) : (
								"CLAIM NOW"
							)}
						</div>
					</div>
				) : (
					<div className="flex items-end justify-end h-full relative">
						<video
							src="/hero/video-sprites/bear1.webm"
							loop
							autoPlay
							muted
							style={{
								transform: "scale(0.5)",
								position: "absolute",
								bottom: "-126px",
								right: "-100px",
								zIndex: 420,
							}}
						></video>
						<div className="speech-bubbleErc20 absolute" style={{ bottom: "180px", right: "170px" }}>
							<p className="text-6xl font-bold">Bope!</p>
							<p className="text-xl font-bold">You claimed {totalAvailableToClaim} $BMEME.</p>
							<div className={`text-center  ${inter.className}`}>
								(
								<Link href="#" className="text-sm underline decoration-bentoColor2 text-left">
									Contract
								</Link>
								{" • "}
								<Link href="#" className="text-sm underline decoration-bentoColor2 text-left">
									Transaction
								</Link>
								)
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Rewards;
