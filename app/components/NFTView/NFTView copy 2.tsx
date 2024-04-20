"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";
import { sepolia } from "thirdweb/chains";
import { MediaRenderer, useReadContract, useActiveWalletChain } from "thirdweb/react";
import { THIRD_WEB_CLIENT_ID } from "../../utils/constants";
import { totalListings, getListing, buyFromListing } from "thirdweb/extensions/marketplace";
import { useActiveWallet } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, getContract, toWei } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { useWaitForReceipt } from "thirdweb/react";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { useConnect } from "thirdweb/react";

import { ThirdwebProvider, ConnectButton, TransactionButton, darkTheme } from "thirdweb/react";
import { createWallet, walletConnect, inAppWallet, injectedProvider } from "thirdweb/wallets";

const client = createThirdwebClient({
	clientId: THIRD_WEB_CLIENT_ID,
});

// const wallets = [
// 	createWallet("io.metamask"),
// 	createWallet("com.coinbase.wallet"),
// 	walletConnect(),
// 	inAppWallet({
// 		auth: {
// 			options: ["email", "google", "apple", "facebook"],
// 		},
// 	}),
// ];

type ResponsiveProps = {
	client: any;
	url: string;
};

const ResponsiveMediaRenderer: React.FC<ResponsiveProps> = ({ client, url }) => {
	const [size, setSize] = useState("500px");

	useEffect(() => {
		const handleResize = () => {
			const currentWidth = window.innerWidth;
			console.log({ window });
			console.log("currentWidth", currentWidth);
			if (currentWidth >= 500) {
				setSize("500px");
			} else if (currentWidth < 500) {
				setSize(`${currentWidth}px`);
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize(); // Initial check on component mount

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<MediaRenderer
			className="cursor-pointer mt-10 border-8 border-nftBorder shadow-xl shadow-accent"
			client={client}
			src={url}
			width={size}
			height={size}
		/>
	);
};

type NFTViewProps = {
	id: string; // The id of the NFT to display
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

	const { mutate: sendTransaction, isPending } = useSendTransaction();
	const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
	const [mintSuccess, setMintSuccess] = useState(false);
	const switchChain = useSwitchActiveWalletChain();
	const { connect, isConnecting, error } = useConnect();
	const activeAccount = useActiveAccount();
	const wallet = useActiveWallet();
	const activeChain = useActiveWalletChain();
	const [txActive, setTxActive] = useState<boolean>(false);

	useEffect(() => {
		const loadNFTdata = async () => {
			// convert id to Bigint
			const bigId = BigInt(parseInt(id) + 1);
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

	const doMint = async () => {
		console.log("Minting NFT to account: ", activeAccount?.address);
		const tx = await buyFromListing({
			contract,
			listingId: BigInt(parseInt(id) + 1),
			quantity: BigInt(1),
			recipient: activeAccount?.address!,
		});
		console.log("tx", tx);
		const receipt = await sendTransaction(tx);
		console.log("receipt", receipt);
	};

	const doConnect = async () => {
		setTxActive(true);
		await connect(async () => {
			const metamask = createWallet("io.metamask"); // pass the wallet id

			// if user has metamask installed, connect to it
			if (injectedProvider("io.metamask")) {
				await metamask.connect({ client });
			}

			// open wallet connect modal so user can scan the QR code and connect
			else {
				await metamask.connect({
					client,
					walletConnect: { showQrModal: true },
				});
			}
			console.log("metamask", metamask);

			// return the wallet
			return metamask;
		});
		// Switch to the correct chain
		if (activeChain?.name !== "sepolia") {
			await switchChain(sepolia);
		}
		setTxActive(false);
	};

	console.log("wallet", wallet);

	console.log("activeAccount", activeAccount);

	return (
		// Create a flexbox div with a background image
		<div className="flex flex-row w-full h-full bg-bg">
			<div className="flex flex-row md:justify-center md:items-center w-full md:gap-x-4 ">
				{nftMetadata && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 mt-20 md:mt-0">
							<div className="md:col-span-2 md:p-4">
								<ResponsiveMediaRenderer client={client} url={nftMetadata.animation_url!} />
								{/* <MediaRenderer
									className="cursor-pointer mt-10 border-8 border-nftBorder shadow-xl shadow-accent"
									client={client}
									src={nftMetadata.animation_url}
									width="500px"
									height="500px"
								/> */}
								<div className="rounded-md pb-1 mt-5">
									<h1 className="mt-3 text-2xl text-black text-right">Bears Love Mountains #{nftMetadata.id}</h1>
									<h1 className="text-xl text-black text-right">
										Price {nftMetadata.price} {nftMetadata.token}
									</h1>
								</div>
							</div>
							<div className="md:col-span-1 md:self-end p-4 md:mb-20 ">
								<button
									className="h-12 border-2 p-2.5 rounded-full font-bold mt-4 w-full bg-buttonBg hover:bg-buttonAccent ease-in-out border-buttonAccent shadow-2xl shadow-buttonAccent text-buttonText"
									// disabled={isPending ? false : true}
									onClick={!activeAccount ? doConnect : doMint}
								>
									{!activeAccount ? (
										<span className="text-buttonText text-xl">Connect Wallet</span>
									) : isPending ? (
										<span className="text-buttonText text-2xl">Minting...</span>
									) : isConnecting ? (
										<span className="text-buttonText text-2xl">Connecting...</span>
									) : (
										<span className="text-buttonText text-2xl">Buy Now</span>
									)}
								</button>
							</div>
						</div>
					</>
				)}
			</div>

			<video
				src="/hero/video-sprites/bear1.webm"
				autoPlay
				loop
				className="hidden lg:block absolute bottom-[-220px] right-[-100px] scale-90"
				style={{ transform: "scale(0.7)" }}
			></video>
		</div>
	);
};

export default NFTView;
