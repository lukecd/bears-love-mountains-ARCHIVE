"use client";

import React, { useEffect, useState } from "react";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<>
			<div
				className={`fixed top-0 z-50 w-full px-4 py-2 bg-[url('/hero/mountains/01-background.png')] bg-cover `}
				style={{
					height: "90px",
					boxShadow: "0 4px 6px -1px rgba(255, 20, 147, 0.8), 0 2px 4px -1px rgba(255, 20, 147, 0.6)",
				}}
			>
				<div className="flex items-center justify-between h-full">
					<h1 className="text-xl lg:text-6xl text-center w-full leading-none lexend-mega-300 font-bold text-main">
						BEARS LOVE MOUNTAINS
					</h1>{" "}
					<div>
						<button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col space-y-2">
							<span className="block w-8 h-0.5 bg-white"></span>
							<span className="block w-8 h-0.5 bg-white"></span>
							<span className="block w-8 h-0.5 bg-white"></span>
						</button>
						{isMenuOpen && (
							<div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
								<a href="/" className="block px-4 py-2 text-pink-500 text-base">
									Home
								</a>
								<a href="/about" className="block px-4 py-2 text-pink-500 text-base">
									About
								</a>
								<a href="/yourNFTs" className="block px-4 py-2 text-pink-500 text-base">
									Your NFTs
								</a>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
