"use client";

import React, { useEffect, useState } from "react";

const Memecoin: React.FC = () => {
	const handleMint = () => {
		// Empty function for Mint button
	};

	const handleBurn = () => {
		// Empty function for Burn button
	};

	const handleConnectWallet = () => {
		// Empty function for Connect Wallet button
	};

	return (
		<div className="flex flex-row w-full h-full bg-bentoBg mt-[100px]">
			<div className="flex flex-row md:justify-center items-center w-full md:gap-x-4">
				<div className="flex flex-col md:flex-row md:gap-4 mt-20 mb-20 md:mt-0 md:self-start">
					<div className="mt-10 relative w-[500px] h-[500px] flex justify-center items-center bg-bentoColor3">
						<img
							src="/hero/mountains/planet-1.png"
							alt="Central Planet"
							className="absolute z-10 animate-spin-slow"
							style={{ width: "150px", height: "150px" }}
						/>
						{["planet-4.png", "planet-6.png", "planet-8.png", "planet-9.png"].map((planet, index) => (
							<div
								key={index}
								className={`absolute rounded-full animate-orbit planet-${index + 1} animate-spin-slow`}
								style={{
									width: "50px",
									height: "50px",
									backgroundImage: `url(/hero/mountains/${planet})`,
									backgroundSize: "cover",
									animationDuration: `${10 + index * 2}s`,
									animationTimingFunction: "linear",
								}}
							/>
						))}
						<video
							src="/hero/video-sprites/bear3.webm"
							autoPlay
							loop
							muted
							className="hidden md:block absolute z-20 "
							style={{ bottom: "-13%", left: "0%", transform: "scale(0.6) " }}
						/>
					</div>
					<div className="w-full md:w-1/2 mt-10">
						<div className="grid grid-rows-6 grid-cols-2 gap-4 h-full">
							<div className="row-span-2 col-span-2 bg-bentoColor1 flex items-center justify-center text-2xl p-4">
								<div className="text-center">
									<p className="text-5xl">Price</p>
									<p>0.0042 BERA</p>
								</div>
							</div>
							<div className="row-span-2 col-span-2 bg-bentoColor2 flex items-center justify-center text-2xl p-4">
								<div className="text-center">
									<p className="text-2xl">Circulating</p>
									<p className="text-2xl">Supply</p>
									<p className="text-5xl">420</p>
								</div>
							</div>
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Memecoin;
