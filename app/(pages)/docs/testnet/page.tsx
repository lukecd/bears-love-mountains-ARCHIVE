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
				<div className="w-full h-screen md:w-3/4 text-xl text-end mt-10">Testnet</div>
			</div>
		</div>
	);
};

export default Page;
