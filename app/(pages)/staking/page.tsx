import React from "react";
import Hero from "../../components/Hero"; // Import Hero component
import NFTView from "../../components/NFTView"; // Import NFTView component
import { Suspense } from "react";

const Page = () => {
	return (
		<div className=" bg-white">
			<Hero navbarMode={true} />

			<div className="flex flex-col min-h-screen mt-15 px-10 text-black">
				<br />
				<br />
				<br />
				<br />
				<div className="w-3/4 lexend-mega-300 text-xl text-end">
					<p className="">Stake your NFTs to earn $MOUNTAIN. </p>
				</div>
			</div>
		</div>
	);
};

export default Page;
