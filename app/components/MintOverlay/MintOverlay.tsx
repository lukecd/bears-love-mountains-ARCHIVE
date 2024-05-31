import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getNFTPrice, mintNFT } from "../../utils/contractInteraction";
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

interface MintOverlayProps {
	nftMetadata: NFTMetadata;
	onClose: () => void;
	price: string;
}

const MintOverlay: React.FC<MintOverlayProps> = ({ nftMetadata, onClose, price }) => {
	const [numToMint, setNumToMint] = useState<string>("1");
	const [showSuccess, setShowSuccess] = useState<boolean>(false);
	const [priceTxActive, setPriceTxActive] = useState(false);
	const [mintTxActive, setMintTxActive] = useState(false);
	const [totalPrice, setTotalPrice] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const handleConfirmPrice = async () => {
		setPriceTxActive(true);
		const price = await getNFTPrice(BigInt(nftMetadata.id), BigInt(parseInt(numToMint)));
		const formattedPrice = formatUnits(BigInt(price), 18);
		setTotalPrice(formattedPrice);
		setPriceTxActive(false);
	};

	const handleMintNow = async () => {
		setMintTxActive(true);
		await mintNFT(BigInt(nftMetadata.id), BigInt(parseInt(numToMint)));
		setMintTxActive(false);
		setShowSuccess(true);
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
			<div className="relative text-center text-black p-6 bg-bentoColor5 rounded-lg shadow-lg w-128 h-128 border-8 border-bentoColor4">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-black bg-white rounded-full w-8 h-8 flex items-center justify-center"
				>
					×
				</button>
				{!showSuccess && (
					<div className="flex flex-col items-center justify-center h-full">
						<p className="text-3xl mb-4 underline">Mint NFT</p>
						<div className="grid grid-cols-2 gap-4 text-lg w-full">
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
								disabled={priceTxActive}
								className="col-span-2 bg-bentoPageBg text-white px-4 py-2 rounded mt-4"
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
							{totalPrice !== null && (
								<>
									<p>Total Price:</p>
									<p>{totalPrice} BERA</p>
									<button
										className="col-span-2 bg-bentoColor2 text-white px-4 py-2 rounded mt-4"
										onClick={handleMintNow}
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
										) : (
											"MINT NOW"
										)}
									</button>
								</>
							)}
						</div>
					</div>
				)}
				{showSuccess && (
					<div className="flex items-end justify-end h-full relative">
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
						<div className="speech-bubble absolute" style={{ bottom: "150px", right: "150px" }}>
							<p className="text-8xl font-bold">Bope!</p>
							<p className="text-3xl font-bold">Congrats on the mint.</p>
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

export default MintOverlay;
