import React from "react";
import dynamic from "next/dynamic";

import { Suspense } from "react";

const Page = () => {
	return (
		<main className="flex flex-col w-full items-center justify-center">
			<h1 className={`lexend-mega-900 mt-3 text-right lg:text-4xl text-sm leading-none text-black`}>
				Nice collection!
			</h1>
		</main>
	);
};

export default Page;
