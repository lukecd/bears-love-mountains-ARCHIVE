"use client";
import Image from "next/image";
import dynamic from "next/dynamic";

import Gallery from "./components/Gallery";
import Hero from "./components/Hero";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<ThirdwebProvider>
				<QueryClientProvider client={queryClient}>
					<Hero />
					<Gallery showAll={true} />
					<Footer />
				</QueryClientProvider>
			</ThirdwebProvider>
		</main>
	);
}
