import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getNFTPrice, mintNFT, burnNFT } from "../../utils/contractInteraction";
import { formatUnits } from "viem";

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

interface MintNftOverlayProps {
	nftMetadata: NFTMetadata;
	onClose: () => void;
	price: string;
	onMintSuccess: () => void;
	shouldMint: boolean;
}

const MintNftOverlay: React.FC<MintNftOverlayProps> = ({ nftMetadata, onClose, price, onMintSuccess, shouldMint }) => {
	const [numToMint, setNumToMint] = useState<string>("1");
	const [showSuccess, setShowSuccess] = useState<boolean>(false);
	const [priceTxActive, setPriceTxActive] = useState(false);
	const [mintTxActive, setMintTxActive] = useState(false);
	const [totalPrice, setTotalPrice] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const handleConfirmPrice = async () => {
		setPriceTxActive(true);
		if (shouldMint) {
			const price = await getNFTPrice(BigInt(nftMetadata.id), BigInt(parseInt(numToMint)), shouldMint);
			const formattedPrice = formatUnits(BigInt(price), 18);
			setTotalPrice(formattedPrice);
		} else {
			const price = await getNFTPrice(BigInt(nftMetadata.id), BigInt(parseInt(numToMint)), shouldMint);
			const formattedValue = formatUnits(BigInt(price), 18);
			setTotalPrice(formattedValue);
		}
		setPriceTxActive(false);
	};

	const handleTransaction = async () => {
		setMintTxActive(true);
		if (shouldMint) {
			await mintNFT(BigInt(nftMetadata.id), BigInt(parseInt(numToMint)));
		} else {
			await burnNFT(BigInt(nftMetadata.id), BigInt(parseInt(numToMint)));
		}
		setMintTxActive(false);
		setShowSuccess(true);
		onMintSuccess();
	};

	const handleNumToMintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "" || /^\d*\.?\d*$/.test(value)) {
			setNumToMint(value);
			setTotalPrice(null);
		}
	};

	const handleNumToMintBlur = () => {
		if (numToMint === "" || parseInt(numToMint) < 1) {
			setNumToMint("1");
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-bentoPageBg bg-opacity-90 z-50">
			<div className="relative text-center text-black p-6 bg-bentoColor5 rounded-lg shadow-lg w-128 h-128 border-8 border-bentoColor4">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-black bg-white rounded-full w-8 h-8 flex items-center justify-center z-1000"
				>
					×
				</button>
				{!showSuccess && (
					<div className="flex flex-col items-center justify-center h-full z-500">
						<p className="text-3xl mb-4 underline">{shouldMint ? "Mint NFT" : "Burn NFT"}</p>
						<div className="flex flex-col text-lg w-full gap-4">
							<div className="flex flex-row justify-center items-center">
								<div className="w-1/5 h-16 text-xl p-4 flex justify-center items-center bg-bentoColor4">
									<p>{shouldMint ? "Price" : "Value"}</p>
								</div>
								<div className="w-4/5 h-16 text-2xl p-4 flex justify-center items-center bg-bentoColor1">
									<p>{price} BERA</p>
								</div>
							</div>
							<div className="flex flex-row justify-center items-center">
								<div className="w-1/5 h-16 text-xl p-4 flex justify-center items-center bg-bentoColor4">
									<p>Number to {shouldMint ? "Mint" : "Burn"}</p>
								</div>
								<div className="w-4/5 h-16 text-2xl p-4 flex justify-center items-center bg-bentoColor1">
									<input
										type="text"
										className="w-full p-2 rounded text-black bg-bentoColor1 h-full"
										value={numToMint}
										onChange={handleNumToMintChange}
										onBlur={handleNumToMintBlur}
										disabled={priceTxActive || mintTxActive}
									/>
								</div>
							</div>
							<div className="flex flex-row justify-center items-center">
								<div className="w-1/5 h-16 text-xl p-4 flex justify-center items-center bg-bentoColor4">
									<p>Total {shouldMint ? "Price" : "Value"}</p>
								</div>
								<div className="w-4/5 h-16 text-2xl p-4 flex justify-center items-center bg-bentoColor1 relative">
									{priceTxActive || mintTxActive ? (
										<div className="flex justify-center items-center w-full h-16">
											<div key="1" className="animate-vflip4 scene w-1/4 h-16 bg-bentoPageBg"></div>
											<div key="1" className="animate-vflip2 scene w-1/4 h-16 bg-bentoColor5"></div>
											<div key="1" className="animate-vflip3 scene w-1/4 h-16 bg-bentoColor3"></div>
											<div key="1" className="animate-vflip4 scene w-1/4 h-16 bg-bentoColor4"></div>
										</div>
									) : (
										<input
											type="text"
											className="w-full p-2 rounded text-black bg-bentoColor1 h-full"
											value={totalPrice!}
											disabled
										/>
									)}
								</div>
							</div>

							{totalPrice ? (
								<button
									className="w-full bg-bentoColor2 text-white px-4 py-2 rounded mt-4 cursor-pointer hover:scale-105"
									onClick={handleTransaction}
									disabled={mintTxActive}
								>
									{mintTxActive ? (
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
									) : shouldMint ? (
										"MINT NOW"
									) : (
										"BURN NOW"
									)}
								</button>
							) : (
								<button
									disabled={priceTxActive}
									className="w-full bg-bentoPageBg text-white px-4 py-2 rounded mt-4 cursor-pointer hover:scale-105"
									style={{ height: "48px" }}
									onClick={handleConfirmPrice}
								>
									{priceTxActive ? (
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
							)}
						</div>
					</div>
				)}
				{showSuccess && (
					<div className="flex items-end justify-end h-full relative z-500">
						<video
							ref={videoRef}
							src="/hero/video-sprites/bear1.webm"
							loop
							autoPlay
							muted
							style={{
								transform: "scale(0.5)",
								position: "absolute",
								bottom: "-126px",
								right: "-100px",
								zIndex: 15,
							}}
						></video>
						<div className="speech-bubbleErc20 absolute" style={{ bottom: "150px", right: "130px" }}>
							<p className="text-6xl font-bold">Bope!</p>
							<p className="text-xl font-bold">
								You {shouldMint ? "minted" : "burned"} {numToMint} NFTs for {totalPrice} $BERA.
							</p>
							<Link href="#" className="text-sm underline decoration-bentoColor2 text-left">
								- Contract
							</Link>
							<br />
							<Link href="#" className="text-sm underline  decoration-bentoColor2 text-left">
								- Transaction
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MintNftOverlay;
