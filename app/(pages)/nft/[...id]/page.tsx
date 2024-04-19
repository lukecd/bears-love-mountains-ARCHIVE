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
import Footer from "@/app/components/Footer";

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
		<main className="w-full h-screen">
			<ThirdwebProvider>
				<QueryClientProvider client={queryClient}>
					<Navbar />
					<NFTView id={id} />
					<Footer />
				</QueryClientProvider>
			</ThirdwebProvider>
		</main>
	);
};

export default Page;
