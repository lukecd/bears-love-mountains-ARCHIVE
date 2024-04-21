"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<>
			<div
				className="fixed top-0 z-50 w-full px-4 py-2 bg-headerBg shadow-2xl shadow-accent"
				style={{
					height: "90px",
				}}
			>
				<div className="flex items-center justify-between h-full">
					<h1 className="text-xl lg:text-6xl md:text-5xl text-3xl text-center w-full leading-none lexend-mega-300 font-bold text-headerText">
						BEARS LOVE MOUNTAINS
					</h1>{" "}
					<div>
						<button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col space-y-2">
							<span className="block w-8 h-0.5 bg-white"></span>
							<span className="block w-8 h-0.5 bg-white"></span>
							<span className="block w-8 h-0.5 bg-white"></span>
						</button>
						{isMenuOpen && (
							<div className="absolute right-0 mt-2 py-2 w-48 bg-bg rounded-lg shadow-xl shadow-accent">
								<Link href="/" className="block px-4 py-2 text-text hover:text-soldTextColor">
									Home
								</Link>
								<Link href="/about" className="block px-4 py-2 text-text hover:text-soldTextColor">
									About
								</Link>
								<Link href="/yourNFTs" className="block px-4 py-2 text-text hover:text-soldTextColor">
									Your NFTs
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
