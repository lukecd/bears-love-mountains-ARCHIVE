// Hero2.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import Boot from "@/game/scenes/Boot";
// import { useRouter } from "next/router"; // Corrected from next/navigation

interface Hero2Props {
	navbarMode: boolean;
}

const Hero2: React.FC<Hero2Props> = ({ navbarMode }) => {
	const gameRef = useRef<HTMLDivElement>(null);
	const [isSticky, setIsSticky] = useState<boolean>(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	// const router = useRouter();

	useEffect(() => {
		setIsSticky(navbarMode);
		let game: Phaser.Game | null = null;

		if (gameRef.current) {
			const config: Phaser.Types.Core.GameConfig = {
				type: Phaser.WEBGL,
				parent: gameRef.current,
				width: window.innerWidth,
				height: window.innerHeight,
				physics: {
					default: "arcade",
					arcade: {
						gravity: { x: 0, y: 600 },
						debug: false,
					},
				},
				render: {
					pixelArt: false,
					antialias: true,
				},
				scene: [Boot],
			};

			game = new Phaser.Game(config);
		}

		const handleScroll = () => {
			const position = 150;
			setIsSticky(position > 0);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			if (game) {
				game.destroy(true);
			}
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	const goHome = () => {
		window.location.href = "/";
	};

	return (
		<>
			<div className={`${isSticky ? "hidden" : "bg-white  overflow-hidden"}`} ref={gameRef} />
			{isSticky && (
				<div
					className={`text-xl lg:text-6xl flex items-center justify-between w-full px-4 py-2 ${
						isSticky ? "fixed top-0 z-50" : "relative"
					} bg-[url('/hero/mountains/01-background.png')] bg-cover transition-all duration-500 ease-in-out shadow shadow-main rounded-b-xl`}
				>
					<div className="text-center w-full leading-none">
						<h1 className="lexend-mega-300 font-bold text-main">
							<a className="cursor-pointer" onClick={() => setIsSticky(!isSticky)}>
								BEARS LOVE MOUNTAINS
							</a>
						</h1>
					</div>
					<div>
						<button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col space-y-2">
							<span className="block w-8 h-0.5 bg-main"></span>
							<span className="block w-8 h-0.5 bg-main"></span>
							<span className="block w-8 h-0.5 bg-main"></span>
						</button>
						{isMenuOpen && (
							<div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
								<a href="/" className="block px-4 py-2 text-main text-base">
									Home
								</a>
								<a href="/about" className="block px-4 py-2 text-main text-base">
									About
								</a>
								<a href="/yourNFTs" className="block px-4 py-2 text-main text-base">
									Your NFTs
								</a>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default Hero2;
