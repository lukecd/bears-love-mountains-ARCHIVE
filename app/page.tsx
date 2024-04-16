"use client";
import Image from "next/image";
import dynamic from "next/dynamic";

import Quote from "./components/Quote";
import Gallery from "./components/Gallery";
import Hero3 from "./components/Hero3";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";

const queryClient = new QueryClient();

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center bg-white min-h-screen">
			<ThirdwebProvider>
				<QueryClientProvider client={queryClient}>
					<Hero3 navbarMode={false} />
					<Gallery showAll={true} />
				</QueryClientProvider>
			</ThirdwebProvider>
		</main>
	);
}
