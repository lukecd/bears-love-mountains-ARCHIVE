"use client";

import React, { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";
import { sepolia } from "thirdweb/chains";
import { MediaRenderer, useReadContract, useActiveWalletChain } from "thirdweb/react";
import { THIRD_WEB_CLIENT_ID } from "../../utils/constants";
import { totalListings, getListing, buyFromListing, createListing } from "thirdweb/extensions/marketplace";
import { BaseTransactionOptions } from "thirdweb";
import { CreateListingParams } from "thirdweb/extensions/marketplace";
import { useActiveWallet } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, getContract, toWei } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

import { useWaitForReceipt } from "thirdweb/react";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { useConnect } from "thirdweb/react";
import { waitForReceipt } from "thirdweb";

import { ThirdwebProvider, ConnectButton, TransactionButton, darkTheme } from "thirdweb/react";
import { createWallet, walletConnect, inAppWallet, injectedProvider } from "thirdweb/wallets";

const client = createThirdwebClient({
	clientId: THIRD_WEB_CLIENT_ID,
});

type ResponsiveProps = {
	client: any;
	url: string;
};

const ResponsiveMediaRenderer: React.FC<ResponsiveProps> = ({ client, url }) => {
	const [size, setSize] = useState("500px");

	useEffect(() => {
		const handleResize = () => {
			const currentWidth = window.innerWidth;
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
	forSale: boolean;
}

const NFTView: React.FC<NFTViewProps> = ({ id }) => {
	const marketplaceContract = getContract({
		client,
		address: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT!,
		chain: sepolia,
	});

	const { mutate: sendTransaction, isPending: sendTxPending, data: txResult } = useSendTransaction();
	const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [mintSuccess, setMintSuccess] = useState(false);
	const switchChain = useSwitchActiveWalletChain();
	const { connect, isConnecting, error } = useConnect();
	const activeAccount = useActiveAccount();
	const wallet = useActiveWallet();
	const activeChain = useActiveWalletChain();
	const [txActive, setTxActive] = useState<boolean>(false);
	const [overlayOpacity, setOverlayOpacity] = useState(0);
	const [showOverlay, setShowOverlay] = useState(false);
	const [showSellOverlay, setSellShowOverlay] = useState(false);

	useEffect(() => {
		if (txActive) {
			setShowOverlay(true);
			setTimeout(() => setOverlayOpacity(1), 10); // trigger fade-in
		} else {
			setOverlayOpacity(0); // trigger fade-out
			setTimeout(() => setShowOverlay(false), 300); // delay to match transition duration
		}
	}, [txActive]);

	useEffect(() => {
		console.log("sendTxPending", sendTxPending);
		console.log("txResult", txResult?.transactionHash);
		if (txResult) {
			const doGetReceipt = async () => {
				console.log("waiting for receipt");

				const receipt = await waitForReceipt({
					client,
					chain: sepolia,
					transactionHash: txResult?.transactionHash!,
				});
				console.log("receipt", receipt);
				// Set nfMetadata to not for sale
				setNftMetadata({ ...nftMetadata!, forSale: false });
				setTxActive(false);
			};
			doGetReceipt();
		}
	}, [sendTxPending, txResult]);

	useEffect(() => {
		const loadNFTdata = async () => {
			setIsLoading(true);
			const bigId = BigInt(parseInt(id) + 1);
			const listing = await getListing({ contract: marketplaceContract, listingId: bigId });

			const idNumber = Number(listing.asset.id.toString());
			const price = listing.currencyValuePerToken.displayValue;
			const metadata: NFTMetadata = {
				...listing.asset.metadata,
				id: idNumber,
				price: price,
				token: listing.currencyValuePerToken.symbol,
				forSale: listing.status === "ACTIVE",
			};
			setNftMetadata(metadata);
			setIsLoading(false);
		};
		loadNFTdata();
	}, []);

	const doBuyNow = async () => {
		setTxActive(true);

		console.log("Preparing buy transaction");
		const buyTx = await buyFromListing({
			contract: marketplaceContract,
			listingId: BigInt(parseInt(id) + 1),
			quantity: BigInt(1),
			recipient: activeAccount?.address!,
		});
		console.log("Sending buy transaction");
		await sendTransaction(buyTx);
	};

	const setupSell = async () => {
		setSellShowOverlay(true); // Show the overlay with fading effect
		console.log("Setting up sell");
	};

	const doCancel = () => {
		setSellShowOverlay(false); // Hide the overlay with fading effect
	};

	const doCreateListing = async () => {
		if (nftMetadata) {
			console.log("Creating listing for", nftMetadata.id);
			setTxActive(true);
			const futureDate = new Date();
			futureDate.setFullYear(futureDate.getFullYear() + 10);

			const options: BaseTransactionOptions<CreateListingParams> = {
				contract: marketplaceContract,
				assetContractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
				tokenId: BigInt(nftMetadata.id),
				quantity: BigInt(1),
				pricePerToken: "0.001", // Ether value, adjust for actual usage
				startTimestamp: new Date(),
				endTimestamp: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
				isReservedListing: true,
			};

			try {
				const listingTx = await createListing(options);
				console.log("Listing transaction", listingTx);
				await sendTransaction(listingTx);
			} catch (error) {
				console.error("Failed to create listing:", error);
			}
		}
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

			// return the wallet
			return metamask;
		});
		// Switch to the correct chain
		if (activeChain?.name !== "sepolia") {
			await switchChain(sepolia);
		}
		setTxActive(false);
	};

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

	return (
		// Create a flexbox div with a background image
		<div className="flex flex-row w-full h-full bg-bg mt-10 mb-20">
			<div className="flex flex-row md:justify-center items-center w-full md:gap-x-4 ">
				{nftMetadata && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 mt-20 md:mt-0 md:self-start">
							<div className="md:col-span-2 md:p-4 mt-10 md:self-start">
								<ResponsiveMediaRenderer client={client} url={nftMetadata.animation_url!} />
								{showOverlay && (
									<div
										className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10 transition-opacity duration-300 ease-in-out"
										style={{ opacity: overlayOpacity }}
									>
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
								)}
							</div>

							<div className="md:col-span-2 md:self-start md:p-4 mt-10">
								<div className="rounded-md">
									<h1 className="mt-3 text-2xl text-black text-left">Bears Love Mountains #{nftMetadata.id}</h1>
									<h1 className="text-xl text-black text-left">
										{!nftMetadata.forSale ? (
											<p className="text-soldTextColor">SOLD</p>
										) : (
											"Price " + nftMetadata.price + " " + nftMetadata.token
										)}
									</h1>
								</div>
								{showSellOverlay && (
									<div className="bg-bg self-start p-5 rounded-lg shadow-xl shadow-buttonAccent flex flex-col justify-start">
										<div className="">
											<div>
												<label className="block font-medium text-text">Price</label>
												<div className="mt-1 relative rounded-md shadow-sm">
													<input
														type="number"
														className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 border-gray-300 rounded-md"
														placeholder="0.00"
													/>
													<div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
														{nftMetadata?.token}
													</div>
												</div>
											</div>
											<button className="mt-3 h-12 border-2 p-2.5 rounded-full font-bold w-full bg-buttonBg hover:bg-buttonAccent transition-shadow duration-300 ease-in-out shadow-xl text-buttonText">
												Approve Access
											</button>
											<button className="mt-3 h-12 border-2 p-2.5 rounded-full font-bold w-full bg-buttonBg hover:bg-buttonAccent transition-shadow duration-300 ease-in-out shadow-xl text-buttonText">
												List for Sale
											</button>
											<button
												onClick={doCancel}
												className="mt-3 h-12 border-2 p-2.5 rounded-full font-bold w-full bg-buttonAccent hover:buttonBg transition-shadow duration-300 ease-in-out shadow-xl text-white"
											>
												Cancel
											</button>
										</div>
									</div>
								)}
								{!showSellOverlay && (
									<button
										className="mb-20 h-12 border-2 p-2.5 rounded-full font-bold mt-10 w-[1/2] px-10 bg-buttonBg hover:bg-buttonAccent ease-in-out shadow-2xl shadow-buttonAccent text-buttonText hover:duration-300 ease-in-out"
										// disabled={isPending ? false : true}
										onClick={!activeAccount ? doConnect : !nftMetadata.forSale ? setupSell : doBuyNow}
									>
										{!activeAccount ? (
											<span className="text-buttonText text-xl">Connect wallet</span>
										) : !nftMetadata.forSale ? (
											<span className="text-buttonText text-xl">List for sale</span>
										) : sendTxPending ? (
											<span className="text-buttonText text-2xl">Buying...</span>
										) : isConnecting ? (
											<span className="text-buttonText text-2xl">Connecting...</span>
										) : (
											<span className="text-buttonText text-2xl">Buy Now</span>
										)}
									</button>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default NFTView;
