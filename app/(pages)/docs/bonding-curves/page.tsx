import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import LogicContainer from "@/app/components/LogicContainer";
import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

const Page = () => {
	return (
		<div className="text-white ml-[170px] mt-[100px]">
			<div className="flex flex-col mb-5 px-10 ">
				<h1 className="text-4xl text-center">Bonding Curves</h1>
				<div className="flex flex-row w-full h-screen md:w-3/4 text-xl text-end mt-4">
					<div className=" bg-bentoColor5 px-5">
						<LogicContainer />
					</div>
					<div className={`ml-5 border-5 border-white ${inter.className} text-base text-left`}>
						<p>
							A bonding curve is determines the price of a token (ERC1155 or ERC20) based on its supply. As more tokens
							are minted, the price increases along the curve. Conversely, as tokens are burnt, the price decreases.
							This creates a dynamic pricing model where the cost of each token is directly tied to the total number in
							circulation. It ensures that early buyers get lower prices, while later buyers pay more.
						</p>
						<p className="mt-5">
							To make it easier for y{"'"}all to grok, I created an interactive demo. Click the mint and burn buttons
							and watch what happens.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
