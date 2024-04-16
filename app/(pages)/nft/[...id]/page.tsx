"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Hero3 from "@/app/components/Hero3";
import Navbar from "@/app/components/Navbar";
import NFTView from "@/app/components/NFTView";
import { useRouter } from "next/navigation";

import { QueryClient, QueryClientProvider } from "react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";

const queryClient = new QueryClient();

type PageProps = {
	params: {
		id: string;
	};
};

const Page: React.FC<PageProps> = ({ params }) => {
	const { id } = params;
	const router = useRouter();
	console.log(id);
	return (
		<main className="bg-gradient-to-b from-pink-500 via-pink-300 to-yellow-200">
			<ThirdwebProvider>
				<QueryClientProvider client={queryClient}>
					<Navbar /> <NFTView id={id} />{" "}
				</QueryClientProvider>
			</ThirdwebProvider>
		</main>
	);
};

export default Page;
