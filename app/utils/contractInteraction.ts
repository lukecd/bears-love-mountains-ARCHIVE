import { createViemClient, Contract, formatUnits } from "viem";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const provider = new viem.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const bearsLoveMemesAddress = publicRuntimeConfig.BEARS_LOVE_MEMES_ADDRESS;
const bearsLoveMountainsAddress = publicRuntimeConfig.BEARS_LOVE_MOUNTAINS_ADDRESS;

const client = createViemClient({
	provider,
	signer,
});

const bearsLoveMemesABI = [
	/* ABI from BearsLoveMemes.sol */
];
const bearsLoveMountainsABI = [
	/* ABI from BearsLoveMountains.sol */
];

const bearsLoveMemesContract = new Contract(bearsLoveMemesAddress, bearsLoveMemesABI, client);
const bearsLoveMountainsContract = new Contract(bearsLoveMountainsAddress, bearsLoveMountainsABI, client);

type NFTMetadata = {
	name: string;
	description: string;
	image: string;
	external_url: string;
	background_color: string;
	animation_url: string;
	attributes: any[];
	price: string;
};

export const getMetadataForNFT = async (id: number): Promise<NFTMetadata> => {
	const uri = await bearsLoveMountainsContract.methods.tokenURI(id).call();
	const response = await fetch(uri);
	const metadata = await response.json();
	const price = await bearsLoveMountainsContract.methods.getPrice(id).call();

	return {
		...metadata,
		price: formatUnits(price, 18),
	};
};

export const getAllNFTMetadata = async (): Promise<NFTMetadata[]> => {
	const metadataPromises = [];
	for (let id = 0; id <= 8; id++) {
		metadataPromises.push(getMetadataForNFT(id));
	}
	return Promise.all(metadataPromises);
};

export const getPriceToMintNNfts = async (number: number): Promise<string> => {
	// Assuming a fixed price per NFT or modifying to aggregate prices
	let totalPrice = BigNumber.from(0);
	for (let i = 0; i < number; i++) {
		const price = await bearsLoveMountainsContract.methods.getPrice(i).call();
		totalPrice = totalPrice.add(price);
	}
	return formatUnits(totalPrice, 18);
};

export const mintNFTs = async (number: number, uri: string, price: string): Promise<void> => {
	const tx = await bearsLoveMountainsContract.methods.mint(uri, price).send({ from: signer.address });
	await tx.wait();
};

export const burnNFTs = async (tokenId: number): Promise<void> => {
	const tx = await bearsLoveMountainsContract.methods.burn(tokenId).send({ from: signer.address });
	await tx.wait();
};

export const getMemeCoinBackingPrice = async (): Promise<string> => {
	const price = await bearsLoveMemesContract.methods.getBackingPrice().call();
	return formatUnits(price, 18);
};

export const getPriceToMintNMemeCoins = async (number: number): Promise<string> => {
	// Assuming fixed price per meme coin
	const price = await bearsLoveMemesContract.methods.getBackingPrice().call();
	const totalPrice = BigNumber.from(price).mul(number);
	return formatUnits(totalPrice, 18);
};

export const mintMemeCoins = async (amount: number): Promise<void> => {
	const tx = await bearsLoveMemesContract.methods.mint(signer.address, amount).send({ from: signer.address });
	await tx.wait();
};

export const burnMemeCoins = async (amount: number): Promise<void> => {
	const tx = await bearsLoveMemesContract.methods.burn(signer.address, amount).send({ from: signer.address });
	await tx.wait();
};
