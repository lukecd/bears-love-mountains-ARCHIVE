import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getErc20BalanceForUser, getErc20Price, getErc20Supply } from "../../utils/contractInteraction";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

interface MintErc20OverlayProps {
	onClose: () => void;
	onMintSuccess: () => void;
}

const MintErc20Overlay: React.FC<MintErc20OverlayProps> = ({ onClose, onMintSuccess }) => {
	const { isConnected, address } = useAccount();
	const [numToMint, setNumToMint] = useState<string>("1");
	const [showSuccess, setShowSuccess] = useState<boolean>(false);
	const [priceTxActive, setPriceTxActive] = useState(false);
	const [mintTxActive, setMintTxActive] = useState(false);
	const [totalPrice, setTotalPrice] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [price, setPrice] = useState<string>("");
	const [supply, setSupply] = useState<string>("");
	const [myBalance, setMyBalance] = useState<string>("");

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

	// const handleConfirmPrice = async () => {
	// 	setPriceTxActive(true);
	// 	const newTotalPrice = await getErc20Price(numToMint);
	// 	setTotalPrice(newTotalPrice.toString());
	// 	setPriceTxActive(false);
	// };
	const handleConfirmPrice = async () => {
		setPriceTxActive(true);
		// Simulate minting process
		setTimeout(() => {
			setPriceTxActive(false);

			setTotalPrice("420000");
		}, 2000);
	};

	const handleMintNow = async () => {
		setMintTxActive(true);
		// Simulate minting process
		setTimeout(() => {
			setMintTxActive(false);
			setShowSuccess(true);
			onMintSuccess(); // Call the success callback
		}, 2000);
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
						<p className="text-3xl mb-4 underline">Mint BMEME</p>
						<div className="flex flex-col text-lg w-full gap-4">
							<div className="flex flex-row justify-center items-center">
								<div className="w-1/5 h-16 text-xl p-4 flex justify-center items-center bg-bentoColor4">
									<p>$BERA</p>
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
									<p>$BMEME</p>
								</div>
								<div className="w-4/5 h-16 text-2xl p-4 flex justify-center items-center bg-bentoColor1 relative">
									{priceTxActive || mintTxActive ? (
										<div className="flex justify-center items-center w-full h-16">
											<div key="1" className="animate-vflip4 scene w-1/4 h-16 bg-bentoPageBg	"></div>
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
										"Mint"
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
										"Estimate Return"
									)}
								</button>
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
						<div className="speech-bubbleErc20 absolute" style={{ bottom: "150px", right: "130px" }}>
							<p className="text-6xl font-bold">Noicee</p>
							<p className="text-xl font-bold">
								You minted {numToMint} $BMEME for {totalPrice} $BERA.
							</p>
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

export default MintErc20Overlay;
