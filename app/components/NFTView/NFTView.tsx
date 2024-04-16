"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useConnect } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { MediaRenderer, useReadContract } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { THIRD_WEB_CLIENT_ID } from "../../utils/constants";
import { totalListings, getListing } from "thirdweb/extensions/marketplace";
import { prepareContractCall, toWei } from "thirdweb";
import { useActiveWallet } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";

const client = createThirdwebClient({
	clientId: THIRD_WEB_CLIENT_ID,
});

import { ThirdwebProvider, ConnectButton, TransactionButton, darkTheme } from "thirdweb/react";
import { createWallet, walletConnect, inAppWallet } from "thirdweb/wallets";

const wallets = [
	createWallet("io.metamask"),
	createWallet("com.coinbase.wallet"),
	walletConnect(),
	inAppWallet({
		auth: {
			options: ["email", "google", "apple", "facebook"],
		},
	}),
];

interface InfoBoxProps {
	label: string;
	value: string;
	mainColor: string;
	accentColor: string;
}
const InfoBox: React.FC<InfoBoxProps> = ({ label, value, mainColor, accentColor }) => {
	return (
		<div
			className="flex items-start my-1 w-full rounded-lg shadow"
			style={{
				borderColor: mainColor,
				borderWidth: "2px",
				borderStyle: "solid",
				// boxShadow: `2px 2px ${accentColor}`,
			}}
		>
			<div
				className="text-center p-1 font-bold rounded-l-md lexend-mega-300"
				style={{ backgroundColor: mainColor, color: "white" }}
			>
				{label}
			</div>
			<div
				className="text-center p-1 font-bold rounded-r-md lexend-mega-300 w-full"
				style={{
					backgroundColor: "white",
					color: "black",
					borderLeftColor: mainColor,
					borderLeftWidth: "2px",
					borderStyle: "solid",
				}}
			>
				{value}
			</div>
		</div>
	);
};

type NFTViewProps = {
	id: string; // Define a type for the component props
};

interface NFTMetadata {
	id: number;
	price?: string;
	token?: string;
	image?: string;
	name?: string;
	animation_url?: string;
	description?: string;
}

const NFTView: React.FC<NFTViewProps> = ({ id }) => {
	const contract = getContract({
		client,
		address: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT!,
		chain: sepolia,
	});

	const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);

	const [mintSuccess, setMintSuccess] = useState(false);
	// Main and Accent Colors
	const mainColors = ["#E24330", "#8C262E", "#90A9EE", "#98282B", "#E24330", "#22A093"];
	const accentColors = ["#FEC901", "#FF7B02", "#F0F22F", "#FE91E7", "#FE91E7", "#FEC901"];
	const colorIndex = Math.floor(Math.random() * mainColors.length);
	const [mainColor, setMainColor] = useState<string>(mainColors[colorIndex]);
	const [accentColor, setAccentColor] = useState<string>(accentColors[colorIndex]);

	useEffect(() => {
		const loadNFTdata = async () => {
			// convert id to Bigint
			const bigId = BigInt(id);
			const listing = await getListing({ contract, listingId: bigId });

			const idNumber = Number(listing.asset.id.toString());
			const price = listing.currencyValuePerToken.displayValue;
			const metadata: NFTMetadata = {
				...listing.asset.metadata,
				id: idNumber,
				price: price,
				token: listing.currencyValuePerToken.symbol,
			};
			setNftMetadata(metadata);
		};
		loadNFTdata();
	}, []);

	const doMint = () => {
		setMintSuccess(true);
	};
	const { connect, isConnecting, error } = useConnect();

	const activeAccount = useActiveAccount();
	const wallet = useActiveWallet();
	console.log("activeAccount", activeAccount);

	return (
		// Create a flexbox div with a background image
		<div className="flex flex-row items-center justify-center w-full h-screen">
			{nftMetadata && (
				<>
					<div className={`flex flex-col justify-center items-center bg-white p-3 lg:pb-5 pb-1 px-5 rounded-2xl`}>
						{" "}
						<MediaRenderer
							className="h-auto cursor-pointer rounded-2xl rounded-lg"
							client={client}
							src={nftMetadata.animation_url}
							width="500px"
							height="500px"
						/>
						<div className="w-full rounded-md pr-2 pb-1 lexend-mega-300">
							<h1 className={`lexend-mega-300 mt-3 text-right text-2xl  text-black`}>
								Bears Love Mountains #{nftMetadata.id}
							</h1>
							<h1 className={`lexend-mega-300 text-right text-xl  text-black`}>
								Price {nftMetadata.price} {nftMetadata.token}
							</h1>
						</div>
						<div className="mt-3 flex flex-row text-right justify-end w-full">
							<ConnectButton
								client={client}
								theme={darkTheme({
									colors: {
										primaryButtonBg: mainColor,
										primaryButtonText: "#FFFFFF",
									},
								})}
								connectModal={{
									size: "wide",
									showThirdwebBranding: false,
								}}
							/>
							<div className="ml-2">
								{activeAccount && (
									<TransactionButton
										className="bg-red"
										transaction={() => {
											// Create a transaction object and return it
											const tx = prepareContractCall({
												contract,
												//@ts-ignore
												method: "mint",
												params: [activeAccount?.address, toWei("1")],
											});
											return tx;
										}}
									>
										Mint
									</TransactionButton>
								)}
							</div>
						</div>
					</div>
				</>
			)}

			<video
				src="/hero/video-sprites/bear3.webm"
				autoPlay
				loop
				className="hidden md:block absolute bottom-[-70px] left-[-100px] scale-90"
			></video>
		</div>
	);
};

export default NFTView;
