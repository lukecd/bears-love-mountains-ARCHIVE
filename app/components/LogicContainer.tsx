"use client";
import { useState } from "react";
import NFTImage from "./NFTImage";
import PriceGraph from "./PriceGraph";
import BurnMintButtons from "./BurnMintButtons";
import { useEffect } from "react";
import NftDataLine from "./NftDataLine";
const LogicContainer = () => {
	const [priceData, setPriceData] = useState<{ mintBurn: number; price: number }[]>([]); // Initial price data
	// Initial reserve token balance (e.g., ETH)
	const [ethBalance, setEthBalance] = useState<number>(0.005);
	// Initial continuous token balance (e.g., NFT)
	const [nftBalance, setNftBalance] = useState<number>(1);
	// Initial reserve ratio
	const [reserveRatio, setReserveRatio] = useState<number>(0.35);
	// Initial price of the token
	const [price, setPrice] = useState<number>(1);

	useEffect(() => {
		// At contract deployment, the firss NFT is minted by sending 1 ETH to the contract
		const newPrice = ethBalance / (nftBalance * reserveRatio);
		setPrice(newPrice);
		setPriceData([...priceData, { mintBurn: priceData.length + 1, price: newPrice }]);
	}, []);

	const handleBurn = () => {
		// Continuous Token Price = Reserve Token Balance / (Continuous Token Supply x Reserve Ratio)
		// newPrice = ethBalance / (nftSupply x Reserve Ratio)

		// Calculate & store the new price
		const newEthBalance = ethBalance - price;
		const newNftBalance = nftBalance - 1;
		const newPrice = newEthBalance / (newNftBalance * reserveRatio);
		setPrice(newPrice);

		// Increase ETH balance by the current price
		setEthBalance(newEthBalance);

		// Increase the NFT balance
		setNftBalance(newNftBalance);

		// Update graph data
		setPriceData([...priceData, { mintBurn: priceData.length + 1, price: newPrice }]);
	};

	const handleMint = () => {
		// Continuous Token Price = Reserve Token Balance / (Continuous Token Supply x Reserve Ratio)
		// newPrice = ethBalance / (nftSupply x Reserve Ratio)

		// Calculate & store the new price
		const newEthBalance = ethBalance + price;
		const newNftBalance = nftBalance + 1;
		const newPrice = newEthBalance / (newNftBalance * reserveRatio);
		setPrice(newPrice);

		// Increase ETH balance by the current price
		setEthBalance(newEthBalance);

		// Increase the NFT balance
		setNftBalance(newNftBalance);

		// Update graph data
		setPriceData([...priceData, { mintBurn: priceData.length + 1, price: newPrice }]);
	};

	return (
		<div className="min-h-screen bg-bgColor flex flex-col justify-start items-center">
			<div className="flex w-full flex-col items-center justify-center mb-8">
				<div className="flex w-full flex-row gap-10 mb-10">
					<div className="">
						<PriceGraph data={priceData} />
						<div className="flex flex-col">
							<div className="flex flex-row">
								<div className="w-1/3 text-sm flex flex-col px-2 rounded-xl text-bgAccentOne text-center text-bold ">
									<label className="">Mint Price</label>
									{price.toFixed(5)} BERA
								</div>
								<div className="w-1/3 text-sm flex flex-col px-2 rounded-xl text-bgAccentOne text-center text-bold ">
									<label className="">BERA</label>
									{ethBalance.toFixed(5)}
								</div>
								<div className="w-1/3 text-sm flex flex-col px-2 rounded-xl text-bgAccentOne text-center text-bold ">
									<label className="">NFTs</label>
									{nftBalance}
								</div>
							</div>
						</div>
						<BurnMintButtons onBurn={handleBurn} onMint={handleMint} />
					</div>
				</div>
				{/* <div className="flex w-full justify-between space-x-2 mt-10">
					<div className="w-3/4 flex flex-col  bg-bgAccentTwo px-2 rounded-xl text-bgAccentOne text-center text-bold text-xl">
						<label className="">NFT Price</label>
						{price} ETH
					</div>
					<div className="w-3/4 flex flex-col  bg-bgAccentTwo px-2 rounded-xl text-bgAccentOne text-center text-bold text-xl">
						<label className="">ETH Balance</label>
						{ethBalance} ETH
					</div>
					<div className="w-3/4 flex flex-col  bg-bgAccentTwo px-2 rounded-xl text-bgAccentOne text-center text-bold text-xl">
						<label className="">NFT Count</label>
						{nftBalance} NFTs
					</div>
					<div className="w-3/4 flex flex-col  bg-bgAccentTwo px-2 rounded-xl text-bgAccentOne text-center text-bold text-xl shadow-sm shadow-highlight">
						<label className="">Reserve Ratio: {reserveRatio}</label>
						<input
							type="range"
							min={0.1}
							max={1}
							step={0.1}
							value={reserveRatio.toString()}
							onChange={(e) => setReserveRatio(Number(e.target.value))}
						/>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default LogicContainer;
