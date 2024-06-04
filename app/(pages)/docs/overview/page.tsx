import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";

import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

const Page = () => {
	return (
		<div className="text-white ml-[170px] mt-[100px]">
			<div className="flex flex-col  mb-5 px-10 ">
				<div className="w-full h-screen md:w-3/4 text-xl text-end mt-10">
					<p className={inter.className}>Original photographs. Shot in Patagonia. </p>
					<p className={inter.className}>(The mountains, not the clothing brand.)</p>
					<p className={inter.className}>
						Preserved permanently as NFTs using{" "}
						<a className="underline decoration-main" href="https://irys.xyz">
							{" "}
							Irys
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Page;
