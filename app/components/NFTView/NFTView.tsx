"use client";

import React, { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";
import { sepolia } from "thirdweb/chains";
import { MediaRenderer, useReadContract, useActiveWalletChain } from "thirdweb/react";
import { readContract, resolveMethod } from "thirdweb";
import { prepareContractCall, getContract, toWei } from "thirdweb";

import {
	totalListings,
	getListing,
	buyFromListing,
	createListing,
	isBuyerApprovedForListing,
	approveBuyerForListing,
	getAllListings,
	cancelListing,
} from "thirdweb/extensions/marketplace";
import { sendAndConfirmTransaction } from "thirdweb";

import { getNFT, getNFTs, ownerOf, approve, isApprovedForAll } from "thirdweb/extensions/erc721";
import { BaseTransactionOptions } from "thirdweb";
import { CreateListingParams } from "thirdweb/extensions/marketplace";
import { useActiveWallet } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { useSendTransaction } from "thirdweb/react";
import { useWaitForReceipt } from "thirdweb/react";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { useConnect, useDisconnect } from "thirdweb/react";
import { waitForReceipt } from "thirdweb";

import { ThirdwebProvider, ConnectButton, TransactionButton, darkTheme } from "thirdweb/react";
import { createWallet, walletConnect, inAppWallet, injectedProvider } from "thirdweb/wallets";
import Link from "next/link";

import { client, marketplaceContract, nftContract } from "@/app/utils/contractInteraction";

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
			className="cursor-pointer border-8 border-nftBorder shadow-xl shadow-accent"
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
	listingId?: bigint; // Only present if the NFT is listed for sale
	owner?: string;
	price?: string;
	token?: string;
	image?: string;
	name?: string;
	animation_url?: string;
	description?: string;
	forSale: boolean;
}

const NFTView: React.FC<NFTViewProps> = ({ id }) => {
	const { mutate: sendTransaction, isPending: sendTxPending, data: txResult } = useSendTransaction();
	const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [mintSuccess, setMintSuccess] = useState(false);
	const switchChain = useSwitchActiveWalletChain();
	const { connect, isConnecting, error } = useConnect();
	const { disconnect } = useDisconnect();
	const activeAccount = useActiveAccount();
	const wallet = useActiveWallet();
	const activeChain = useActiveWalletChain();
	const [txActive, setTxActive] = useState<boolean>(false);
	const [overlayOpacity, setOverlayOpacity] = useState(0);
	const [showOverlay, setShowOverlay] = useState(false);
	const [showSellOverlay, setSellShowOverlay] = useState(false);
	const [isOwner, setIsOwner] = useState<boolean>(false);
	const [isApproved, setIsApproved] = useState<boolean>(false);
	const [listingPrice, setListingPrice] = useState<string>("0");

	// Called on page load to fetch NFT data
	useEffect(() => {
		loadNFTdata();
	}, []);

	// Used to fade in and out the "in progress" overlay
	useEffect(() => {
		if (txActive) {
			setShowOverlay(true);
			setTimeout(() => setOverlayOpacity(1), 10); // trigger fade-in
		} else {
			setOverlayOpacity(0); // trigger fade-out
			setTimeout(() => setShowOverlay(false), 300); // delay to match transition duration
		}
	}, [txActive]);

	// Check if the active account is the owner of the NFT
	// If it is the owner, we can show the "list for sale" button
	useEffect(() => {
		if (activeAccount) {
			setIsOwner(activeAccount.address === nftMetadata?.owner);
			checkApproval();
		}
	}, [activeAccount]);

	// Check if the owner has approved the marketplace contract
	const checkApproval = async () => {
		const checkApproval = await readContract({
			contract: nftContract,
			method: resolveMethod("getApproved"),
			params: [id],
		});

		setIsApproved(checkApproval.toString() === process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT!);
	};

	const loadNFTdata = async () => {
		setIsLoading(true);
		const bigId = BigInt(parseInt(id));

		// 1: get ownership & approval details from NFT contract
		const ownerWallet = await ownerOf({ contract: nftContract, tokenId: bigId });

		// 2: get NFT details from the NFT contract
		const nft = await getNFT({ contract: nftContract, tokenId: bigId });
		setIsOwner(ownerWallet === activeAccount?.address);

		// 3: get the listing details from the marketplace contract
		// I wish there was a way to query the marketplace contract for a specific NFT
		const allListings = await getAllListings({ contract: marketplaceContract });
		const activeListings = allListings.filter((nft) => nft.status === "ACTIVE");

		// Search through listings to see if this NFT is for sale
		let marketplaceIndex = -1;
		let price = "";
		let token = "";
		let listingId = BigInt(-1);
		for (let i = 0; i < activeListings.length; i++) {
			const nftId = activeListings[i].asset.id;
			// If for sale, record the price and token
			if (nftId === bigId) {
				marketplaceIndex = i;
				listingId = activeListings[i].id;
				price = activeListings[i].currencyValuePerToken.displayValue;
				token = activeListings[i].currencyValuePerToken.symbol;
				break;
			}
		}

		const idNumber = Number(nft.id.toString());
		const metadata: NFTMetadata = {
			...nft.metadata,
			id: idNumber,
			owner: ownerWallet,
			listingId,
			price,
			token,
			forSale: marketplaceIndex !== -1,
		};

		await checkApproval();

		setNftMetadata(metadata);
		setIsLoading(false);
	};

	const doCancelListing = async () => {
		if (nftMetadata && activeAccount) {
			setTxActive(true);

			const transaction = await cancelListing({
				contract: marketplaceContract,
				listingId: nftMetadata.listingId!,
			});
			await sendAndConfirmTransaction({ account: activeAccount, transaction });

			await loadNFTdata();
			setTxActive(false);
		}
	};

	// Called when the user clicks Buy Now
	const doBuyNow = async () => {
		// Start the "in progress" spinner
		if (nftMetadata && activeAccount) {
			setTxActive(true);

			const transaction = await buyFromListing({
				contract: marketplaceContract,
				listingId: nftMetadata.listingId!,
				quantity: BigInt(1),
				recipient: activeAccount?.address!,
			});
			await sendAndConfirmTransaction({ account: activeAccount, transaction });

			await loadNFTdata();
			setTxActive(false);
		}
	};

	// Show the for sale overlay with fading effect
	const setupSell = async () => {
		setSellShowOverlay(true);
	};

	// Hide the for sale overlay with fading effect
	const doCancel = () => {
		setSellShowOverlay(false);
	};

	// Creates a new marketplace listing for the NFT
	const doCreateListing = async () => {
		if (nftMetadata && activeAccount) {
			setTxActive(true);

			try {
				const currentTime: Date = new Date();

				// UNIX timestamp for 5 minutes ago in seconds
				// Set to 5 min ago to account of issues with block time
				const fiveMinutesAgo: number = Math.floor(currentTime.getTime() / 1000) - 5 * 60;

				// UNIX timestamp for next year in seconds
				const nextYear: Date = new Date();
				nextYear.setFullYear(nextYear.getFullYear() + 1);
				const nextYearTimestamp: number = Math.floor(nextYear.getTime() / 1000);

				const params = {
					assetContract: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
					tokenId: BigInt(nftMetadata.id),
					quantity: BigInt(1),
					currency: process.env.NEXT_PUBLIC_CURRENCY_CONTRACT_ADDRESS!,
					pricePerToken: toWei(listingPrice),
					startTimestamp: fiveMinutesAgo,
					endTimestamp: nextYearTimestamp,
					reserved: false,
				};

				const transaction = prepareContractCall({
					contract: marketplaceContract,
					method: resolveMethod("createListing"),
					params: [params],
				});

				await sendAndConfirmTransaction({ account: activeAccount, transaction });

				// Reload NFT data from contract
				await loadNFTdata();
				setTxActive(false);
				setSellShowOverlay(false);
			} catch (error) {
				console.error("Failed to create listing:", error);
			}
		}
	};

	// Connect wallet
	const doConnect = async () => {
		setTxActive(true);
		await connect(async () => {
			const metamask = createWallet("io.metamask");

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

	// Disconnect wallet
	const doDisconnect = async () => {
		if (wallet) {
			const returnType = await disconnect(wallet);
		}
	};

	// Approve marketplace to access NFT
	// Once this is done, we can can list the NFT for sale
	const doApproveAccess = async () => {
		if (nftMetadata && activeAccount) {
			setTxActive(true);
			const transaction = await approve({
				contract: nftContract,
				to: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT!,
				tokenId: BigInt(nftMetadata?.id!),
			});

			const tx = await sendAndConfirmTransaction({ account: activeAccount, transaction });
			setIsApproved(true);
			setTxActive(false);
		}
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
		<div className="flex flex-row w-full h-full bg-bg mt-[100px] ">
			<div className="flex flex-row md:justify-center items-center w-full md:gap-x-4">
				{nftMetadata && (
					<>
						<div className="flex flex-col md:flex-row md:gap-4 mt-20 md:mt-0 md:self-start">
							<div className=" mt-10">
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

							<div className="w-full md:w-1/2 mt-10">
								<div className="rounded-lg shadow-xl shadow-shadow bg-accent bg-opacity-50 px-5 py-5 shadow-accent ml-3 mr-3 md:ml-0 md:mr-0">
									<h1 className="text-2xl text-black text-left">Bears Love Mountains #{nftMetadata.id}</h1>
									<h1 className="text-xl text-black text-left">
										{!nftMetadata.forSale ? (
											<p className="text-soldTextColor">Not For Sale</p>
										) : (
											"Price: " + nftMetadata.price + " " + nftMetadata.token
										)}
									</h1>
									<h2 className="text-sm text-black text-left">
										Owner:{" "}
										<Link className="underline decoration-buttonAccent" href={`/collection/${nftMetadata.owner}`}>
											{activeAccount && isOwner
												? "YOU"
												: `${nftMetadata.owner?.slice(0, 5)}...${nftMetadata.owner?.slice(-5)}`}
										</Link>
									</h2>
								</div>
								{activeAccount && (
									<>
										{showSellOverlay && (
											<div className="bg-bg self-start p-5 rounded-lg shadow-xl shadow-buttonAccent flex flex-col justify-start mt-5">
												<div className="">
													{!isApproved && (
														<button
															className="mt-3 h-12 border-2 p-2.5 rounded-full font-bold w-full bg-buttonBg hover:bg-buttonAccent transition-shadow duration-500 ease-in-out shadow-xl text-buttonText"
															onClick={doApproveAccess}
														>
															Approve Access
														</button>
													)}
													{isApproved && (
														<>
															<div>
																<label className="block font-medium text-text">Price</label>

																<div className="mt-1 relative rounded-md shadow-sm">
																	<input
																		type="number"
																		className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 border-gray-300 rounded-md"
																		placeholder="0.00"
																		onChange={(e) => setListingPrice(e.target.value)}
																	/>
																	<div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
																		{nftMetadata?.token}
																	</div>
																</div>
															</div>

															<button
																className="mt-5 h-12 px-10 w-full md:w-[1/2] rounded-full font-bold bg-buttonBg hover:bg-buttonAccent text-buttonText hover:duration-300 ease-in-out shadow-2xl shadow-buttonAccent"
																onClick={doCreateListing}
															>
																List For Sale
															</button>
														</>
													)}
													<button
														onClick={doCancel}
														className="mt-3 h-12 border-2 p-2.5 rounded-full font-bold w-full bg-buttonAccent hover:buttonBg transition-shadow duration-300 ease-in-out shadow-xl text-white"
													>
														Cancel
													</button>
												</div>
											</div>
										)}
										{!showSellOverlay && isOwner && nftMetadata.forSale && (
											<div className="button-container flex flex-col items-center space-y-4">
												{/* I own it, it's listed for sale, offer option to cancel listing */}
												<button
													className="mt-5 h-12 px-10 w-full md:w-[1/2] rounded-full font-bold bg-buttonBg hover:bg-buttonAccent text-buttonText hover:duration-300 ease-in-out shadow-2xl shadow-buttonAccent"
													onClick={doCancelListing}
												>
													<span className="text-xl">Cancel Listing</span>
												</button>
											</div>
										)}
										{!showSellOverlay && isOwner && !nftMetadata.forSale && (
											<div className="button-container flex flex-col items-center space-y-4">
												{/* I own it, it's NOT listed for sale, offer option to list for sale */}
												<button
													className="mt-5 h-12 px-10 w-full md:w-[1/2] rounded-full font-bold bg-buttonBg hover:bg-buttonAccent text-buttonText hover:duration-300 ease-in-out shadow-2xl shadow-buttonAccent"
													onClick={setupSell}
												>
													<span className="text-xl">List For Sale</span>
												</button>
											</div>
										)}
										{!showSellOverlay && !isOwner && nftMetadata.forSale && (
											<div className="button-container flex flex-col items-center space-y-4">
												{/* I own it, it's NOT listed for sale, offer option to list for sale */}
												<button
													className="mt-5 h-12 px-10 w-full md:w-[1/2] rounded-full font-bold bg-buttonBg hover:bg-buttonAccent text-buttonText hover:duration-300 ease-in-out shadow-2xl shadow-buttonAccent"
													onClick={doBuyNow}
												>
													<span className="text-xl">Buy Now</span>
												</button>
											</div>
										)}
									</>
								)}
								<div className="mt-5button-container flex flex-col items-center space-y-4">
									{/* Button for connecting or disconnecting the wallet */}
									<button
										className="mt-5 h-12 px-10 w-full md:w-[1/2] rounded-full font-bold bg-buttonBg hover:bg-buttonAccent text-buttonText hover:duration-300 ease-in-out shadow-2xl shadow-buttonAccent"
										onClick={activeAccount ? doDisconnect : doConnect}
									>
										<span className="text-xl">{activeAccount ? "Disconnect wallet" : "Connect wallet"}</span>
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default NFTView;

// const doCreateListingExtension = async () => {
// 	if (nftMetadata && activeAccount) {
// 		console.log("Creating listing with extension for", nftMetadata.id);
// 		setTxActive(true);

// 		const options: BaseTransactionOptions<CreateListingParams> = {
// 			contract: marketplaceContract,
// 			assetContractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
// 			tokenId: BigInt(nftMetadata.id),
// 			quantity: BigInt(1),
// 			pricePerToken: listingPrice,
// 			startTimestamp: new Date(),
// 			endTimestamp: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
// 			isReservedListing: false,
// 		};

// 		try {
// 			const transaction = await createListing(options);
// 			console.log("Listing transaction", transaction);
// 			await sendAndConfirmTransaction({ account: activeAccount, transaction });

// 			// Reload NFT data from contract
// 			await loadNFTdata();
// 			setTxActive(false);
// 		} catch (error) {
// 			console.error("Failed to create listing:", error);
// 		}
// 	}
// };
