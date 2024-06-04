"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
	const router = useRouter();
	const pathname = usePathname();

	if (!pathname.startsWith("/docs")) {
		return null;
	}

	const menuItems = [
		{ name: "Overview", href: "/docs/overview" },
		{ name: "Backstory", href: "/docs/backstory" },
		{ name: "Bonding Curves", href: "/docs/bonding-curves" },
		{ name: "$BMNTN NFTs", href: "/docs/bmntn-nfts" },
		{ name: "$BMEME ERC20s", href: "/docs/bmeme-erc20s" },
		{ name: "Testnet", href: "/docs/testnet" },
	];

	return (
		<div className="fixed top-0 left-0 z-40  bg-bentoColor1 shadow-lg mt-[100px]">
			<div className="flex flex-col items-start justify-center h-full p-4 space-y-4">
				{menuItems.map((item) => (
					<Link className="hover:text-bentoColor3" key={item.href} href={item.href}>
						<p className="block px-4 py-2 text-text hover:text-bentoColor3">{item.name}</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
