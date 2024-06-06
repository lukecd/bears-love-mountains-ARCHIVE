"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	console.log({ pathname });
	if (pathname === "/") {
		return null;
	}
	return (
		<>
			<div
				className="fixed top-0 z-50 w-full px-4 py-2 bg-headerBg "
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
								<Link
									href="/"
									className="block px-4 py-2 text-text hover:text-soldTextColor"
									onClick={() => setIsMenuOpen(false)}
								>
									Home
								</Link>
								<Link
									href="/nfts"
									className="block px-4 py-2 text-text hover:text-soldTextColor"
									onClick={() => setIsMenuOpen(false)}
								>
									$BMTN NFTs
								</Link>
								<Link
									href="/memecoin"
									className="block px-4 py-2 text-text hover:text-soldTextColor"
									onClick={() => setIsMenuOpen(false)}
								>
									$BMEME ERC20s
								</Link>
								<Link
									href="/rewards"
									className="block px-4 py-2 text-text hover:text-soldTextColor"
									onClick={() => setIsMenuOpen(false)}
								>
									Rewards
								</Link>
								<Link
									href="/portfolio"
									className="block px-4 py-2 text-text hover:text-soldTextColor"
									onClick={() => setIsMenuOpen(false)}
								>
									Portfolio
								</Link>
								<Link
									href="/docs/overview"
									className="block px-4 py-2 text-text hover:text-soldTextColor"
									onClick={() => setIsMenuOpen(false)}
								>
									Docs
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
