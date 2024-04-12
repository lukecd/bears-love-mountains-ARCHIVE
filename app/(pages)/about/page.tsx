import React from "react";
import Hero2 from "../../components/Hero2"; // Import Hero component
import NFTView from "../../components/NFTView"; // Import NFTView component
import { Suspense } from "react";

const Page = () => {
	return (
		<div className=" bg-white">
			<Hero2 navbarMode={true} />

			<div className="flex flex-col min-h-screen mt-15 px-10 text-black">
				<br />
				<br />
				<br />
				<br />
				<div className="w-3/4 lexend-mega-300 text-xl text-end">
					<p className="">Original photographs. Shot in Patagonia. </p>
					<p className="">(The mountains, not the clothing brand.)</p>
					<p className="">
						Preserved permanently as NFTs using{" "}
						<a className="underline decoration-main" href="https://irys.xyz">
							{" "}
							Irys
						</a>
						.
					</p>
				</div>
				<div className="w-3/4 lexend-mega-300 text-xl text-end">
					<p className="">
						Minted on{" "}
						<a className="underline decoration-main" href="https://berachain.com">
							{" "}
							Berachain
						</a>
						.
					</p>
					<p className="mt-5 text-2xl">
						by
						<a className="underline decoration-accent" href="https://twitter.com/bearsmountains">
							{" "}
							Mountain Bear
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Page;
