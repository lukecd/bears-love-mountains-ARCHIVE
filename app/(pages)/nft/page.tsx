import React from "react";
import Hero2 from "../../components/Hero2"; // Import Hero component
import NFTView from "../../components/NFTView"; // Import NFTView component
import { Suspense } from "react";

const Page = () => {
	return (
		<div className="bg-gradient-to-b from-pink-500 via-pink-300 to-yellow-200">
			<Hero2 navbarMode={true} />{" "}
			<Suspense>
				<NFTView />
			</Suspense>
		</div>
	);
};

export default Page;
