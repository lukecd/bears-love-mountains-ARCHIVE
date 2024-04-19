"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useConnect } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { sepolia } from "thirdweb/chains";
import { MediaRenderer, useReadContract } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { THIRD_WEB_CLIENT_ID } from "../../utils/constants";
import { totalListings, getListing, buyFromListing } from "thirdweb/extensions/marketplace";
import { useActiveWallet } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, getContract, toWei } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { useWaitForReceipt } from "thirdweb/react";

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

	const { connect, isConnecting, error } = useConnect();

	const activeAccount = useActiveAccount();
	const wallet = useActiveWallet();
	console.log("activeAccount", activeAccount);

	return (
		// Create a flexbox div with a background image
		<div className="flex flex-row w-full h-full bg-bg">
			<div className="flex flex-row justify-center items-center w-full gap-x-4">
				{nftMetadata && (
					<>
						<div className="w-2/3 flex flex-col">
							<MediaRenderer
								className="cursor-pointer mt-10 border-8 border-nftBorder shadow-2xl shadow-accent"
								client={client}
								src={nftMetadata.animation_url}
								width="500px"
								height="500px"
							/>
							<div className="rounded-md pb-1 ">
								<h1 className="mt-3 text-2xl text-black">Bears Love Mountains #{nftMetadata.id}</h1>
								<h1 className="text-xl text-black">
									Price {nftMetadata.price} {nftMetadata.token}
								</h1>
							</div>
						</div>
						<div className="w-1/3">
							<button
								className="h-12 border-2 p-2.5 rounded-full font-bold mt-4 w-full bg-buttonBg hover:bg-buttonAccent ease-in-out border-buttonAccent shadow-2xl shadow-buttonAccent text-buttonText"
								disabled={activeAccount ? false : true}
								onClick={doMint}
							>
								<span className="text-buttonText">{isPending ? "Minting..." : "Buy Now"}</span>
							</button>
						</div>
					</>
				)}
			</div>

			<video
				src="/hero/video-sprites/bear3.webm"
				autoPlay
				loop
				className="hidden md:block absolute bottom-[-130px] right-[-100px] scale-90"
				style={{ transform: "scaleX(-1)" }}
			></video>
		</div>
	);
};

export default NFTView;
