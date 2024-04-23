"use client";

import React, { useState, useEffect } from "react";
import NFTsmall from "../NFTsmall";
import Info from "../Info";
import { getContract } from "thirdweb";
import { MediaRenderer, useReadContract, useActiveWalletChain } from "thirdweb/react";
import { useRouter } from "next/router";
import { sepolia } from "thirdweb/chains";
import { createThirdwebClient, defineChain } from "thirdweb";
import { THIRD_WEB_CLIENT_ID } from "../../utils/constants";
import { totalListings, getAllListings } from "thirdweb/extensions/marketplace";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { useActiveAccount } from "thirdweb/react";
import HoverMediaRenderer from "../HoverMediaRenderer/HoverMediaRenderer";
import { useConnect } from "thirdweb/react";
import { createWallet, walletConnect, inAppWallet, injectedProvider } from "thirdweb/wallets";
import { useSwitchActiveWalletChain } from "thirdweb/react";

import Link from "next/link";
const client = createThirdwebClient({
	clientId: THIRD_WEB_CLIENT_ID,
});

interface GalleryProps {
	showAll?: boolean; // If true show all NFTs in collection, if false show NFTs owned by that user
}

interface NFTMetadata {
	id: bigint;
	price?: string;
	image?: string;
	name?: string;
	animation_url?: string;
	description?: string;
}

const Gallery: React.FC<GalleryProps> = ({ showAll }) => {
	const { connect, isConnecting, error } = useConnect();
	const switchChain = useSwitchActiveWalletChain();
	const activeChain = useActiveWalletChain();

	const [components, setComponents] = useState<React.ReactNode[]>([]);
	const [allNftMetadata, setAllNftMetadata] = useState<NFTMetadata[]>([]);
	const [placeholderCount, setPlaceHolderCount] = useState<number>(42); // There will be exactly 42 items
	const [txActive, setTxActive] = useState<boolean>(false);
	const [overlayOpacity, setOverlayOpacity] = useState(0);
	const [showOverlay, setShowOverlay] = useState(false);
	const [activeAddress, setactiveAddress] = useState<string>("");

	const nftContract = getContract({
		client,
		address: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
		chain: sepolia,
	});

	const marketplaceContract = getContract({
		client,
		address: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT!,
		chain: sepolia,
	});

	const { data: nftCount } = useReadContract(totalListings, { contract: marketplaceContract });

	const { data: nfts } = useReadContract(getAllListings, {
		contract: marketplaceContract,
		start: 0,
		count: nftCount,
	});

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

	const doConnect = async () => {
		setTxActive(true);
		console.log("Connecting wallet");
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
			console.log({ client });

			console.log("metamask", metamask.getAccount());
			setactiveAddress(metamask.getAccount()?.address!);
			// return the wallet
			return metamask;
		});
		// Switch to the correct chain
		if (activeChain?.name !== "sepolia") {
			await switchChain(sepolia);
		}
		setTxActive(false);
	};

	// Called when activeAddress is set
	useEffect(() => {
		// ETH addresses are 42 characters long (with the 0x)
		if (activeAddress.length === 42) {
			const doLoad = async () => {
				const ownedNFTs = await getOwnedNFTs({
					contract: nftContract,
					owner: activeAddress!,
				});
				console.log({ ownedNFTs });
				setPlaceHolderCount(ownedNFTs.length);

				const metadataBuilder: NFTMetadata[] = [];

				for (let i = 0; i < ownedNFTs.length; i++) {
					const idNumber = Number(ownedNFTs[i].id.toString());
					const price = ownedNFTs[i].metadata.price || "0";
					const metadata: NFTMetadata = {
						...ownedNFTs[i].metadata,
						id: idNumber,
						price: "NA",
						token: "NA",
						forSale: false,
					};
					metadataBuilder.push(metadata);
				}
				console.log({ metadataBuilder });
				metadataBuilder.sort((a, b) => (a.id > b.id ? 1 : -1));

				setAllNftMetadata(metadataBuilder);
			};
			doLoad();
		}
	}, [setIsOwner]);

	// Confirm re-connect wallet when showing a user's collection
	useEffect(() => {
		if (!showAll) doConnect();
	}, []);

	useEffect(() => {
		if (nfts && showAll) {
			console.log("nfts", nfts);
			const metadataBuilder: NFTMetadata[] = [];

			const activeNfts = nfts.filter((nft) => nft.status !== "CANCELLED");

			for (let i = 0; i < activeNfts.length; i++) {
				const idNumber = Number(activeNfts[i].asset.id.toString());
				const price = activeNfts[i].currencyValuePerToken.displayValue;
				const metadata: NFTMetadata = {
					...activeNfts[i].asset.metadata,
					id: idNumber,
					price: price,
					token: activeNfts[i].currencyValuePerToken.symbol,
					forSale: activeNfts[i].status === "ACTIVE",
				};
				metadataBuilder.push(metadata);
			}
			console.log({ metadataBuilder });
			metadataBuilder.sort((a, b) => (a.id > b.id ? 1 : -1));

			setAllNftMetadata(metadataBuilder);
			setPlaceHolderCount(metadataBuilder.length);
		}
	}, [nfts]);

	return (
		<div className="flex flex-wrap flex-col justify-center w-full gap-4 pt-10 pb-30 mb-20 mt-20">
			<div className="flex flex-col">
				{activeAddress && <h1 className="text-xl md:text-3xl text-center">BM, {activeAddress}</h1>}
				{!showAll &&
					(allNftMetadata.length === 0 ? (
						<h1 className="text-xl md:text-2xl text-center">
							Your collection is looking lonely, why not{" "}
							<Link className="underline decoration-buttonAccent" href="/">
								go shopping
							</Link>
						</h1>
					) : (
						<h1 className="text-xl md:text-2xl text-center">Nice collection!</h1>
					))}
			</div>
			<div className="flex flex-wrap flex-row justify-center w-full gap-4 pt-10 pb-30 mb-20 mt-20">
				{allNftMetadata.length === 0
					? Array.from({ length: placeholderCount }, (_, i) => (
							<div
								key={i}
								className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3 lg:pb-5 pb-1"
							>
								<div className="animate-pulse flex flex-col items-center justify-center h-full border border-gray-300 shadow shadow-accent rounded-md p-4 mx-auto w-full">
									<img
										src="/hero/mountains/planet-3.png"
										className="rotate-forever h-20 w-20 mt-10 self-center"
										alt="Loading spinner"
									/>
									<div className="mt-2 space-y-2">
										<div className="h-4 bg-gray-200 rounded w-3/4"></div>
										<div className="h-4 bg-gray-200 rounded w-1/4"></div>
									</div>
								</div>
							</div>
					  ))
					: allNftMetadata.map((nft, i) => (
							<div
								key={i}
								className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center bg-bg p-3 lg:pb-5 pb-1 shadow-accent shadow-2xl"
							>
								{/* <Link href={`/nft/${nft.id}`}> */}
								{/* <HoverMediaRenderer client={client} image={nft.image!} animation_url={nft.animation_url!} /> */}
								<MediaRenderer
									className="h-auto hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md rounded-lg"
									client={client}
									src={nft.image}
									width="100%"
									height="100%"
								/>
								{/* </Link> */}
								<div className="w-full rounded-md pr-2 pb-1">
									<Link href={`/nft/${nft.id}`}>
										<h1 className="mt-3 text-right lg:text-xl text-sm leading-none text-text underline decoration-headerBg">
											Bears Love Mountains #{nft.id}
										</h1>
									</Link>
									<h1 className="mt-3 text-right lg:text-base text-sm leading-none text-text">
										{!nft.forSale ? (
											<p className="text-soldTextColor">Not For Sale</p>
										) : (
											"Price " + nft.price + "   $" + nft.token
										)}
									</h1>
								</div>
							</div>
					  ))}
			</div>
		</div>
	);
};

export default Gallery;
