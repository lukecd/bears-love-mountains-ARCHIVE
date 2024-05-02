"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import NFTView from "@/app/components/NFTView";
import { useRouter } from "next/navigation";

import { QueryClient, QueryClientProvider } from "react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import Footer from "@/app/components/Footer";
import Gallery from "@/app/components/Gallery";

const queryClient = new QueryClient();

type PageProps = {
	params: {
		address: string;
	};
};

const Page: React.FC<PageProps> = ({ params }) => {
	const { address } = params;
	const router = useRouter();
	return (
		<main className="w-full h-screen">
			<ThirdwebProvider>
				<QueryClientProvider client={queryClient}>
					<Navbar />
					<Gallery showAll={false} address={address[0]} />
					<Footer />
				</QueryClientProvider>
			</ThirdwebProvider>
		</main>
	);
};

export default Page;
