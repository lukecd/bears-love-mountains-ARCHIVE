"use client";

import React, { useState, useEffect } from "react";
import NFTsmall from "../NFTsmall";
import Info from "../Info";

interface GalleryProps {
	showAll?: boolean; // If true show all NFTs in collection, if false show NFTs owned by that user
}

interface NFTMetadata {
	image: string;
	name: string;
	animation_url: string;
}

const Gallery: React.FC<GalleryProps> = ({ showAll }) => {
	const [components, setComponents] = useState<React.ReactNode[]>([]);
	const mainColors = ["#E24330", "#8C262E", "#90A9EE", "#98282B", "#E24330"];
	const accentColors = ["#FEC901", "#FF7B02", "#F0F22F", "#FE91E7", "#FE91E7"];

	useEffect(() => {
		const fetchNFTs = async () => {
			let items: React.ReactNode[] = [];

			try {
				const response = await fetch("./nfts.json");
				const nfts = await response.json();

				items = await Promise.all(
					//@ts-ignore

					nfts.map(async (nft, index) => {
						const metadataResponse = await fetch(nft.metadataUrl);
						const metadata: NFTMetadata = await metadataResponse.json();
						const colorIndex = Math.floor(Math.random() * mainColors.length);
						return (
							<NFTsmall
								key={`nft-${index}`}
								imageUrl={metadata.image}
								//@ts-ignore
								animationUrl={metadata.animation_url}
								id={index}
								mainColor={mainColors[colorIndex]}
								accentColor={accentColors[colorIndex]}
							/>
						);
					}),
				);
			} catch (e) {
				console.log("Can't load external images");
			}

			if (showAll) {
				const positions = [1, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45];

				let counter = 0;
				positions.forEach((position, i) => {
					const colorIndex = Math.floor(Math.random() * mainColors.length);
					items.splice(
						position,
						0,
						<Info
							key={`info-${i}`}
							id={counter}
							mainColor={mainColors[colorIndex]}
							accentColor={accentColors[colorIndex]}
						/>,
					);
					counter++;
				});

				items.push(<Info key={"info-420"} id={420} mainColor={mainColors[2]} accentColor={accentColors[2]} />);
			}

			setComponents(items);
		};

		fetchNFTs();
	}, []);

	return (
		<>
			<div className="flex flex-wrap justify-center gap-4 pt-10 pb-30 bg-gradient-to-b from-pink-500 via-pink-300 to-yellow-200">
				{components}
			</div>
		</>
	);
};

export default Gallery;
