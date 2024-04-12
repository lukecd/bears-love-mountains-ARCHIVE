import React from "react";
import Hero from "../../components/Hero"; // Import Hero component
import NFTView from "../../components/NFTView"; // Import NFTView component
import { Suspense } from "react";
import Gallery from "@/app/components/Gallery";
const Page = () => {
	return (
		<main className="flex flex-col w-full items-center justify-center bg-white">
			<Hero navbarMode={false} />
			<h1 className={`lexend-mega-900 mt-3 text-right lg:text-4xl text-sm leading-none text-black`}>
				Nice collection!
			</h1>
			<Gallery showAll={false} />
		</main>
	);
};

export default Page;
