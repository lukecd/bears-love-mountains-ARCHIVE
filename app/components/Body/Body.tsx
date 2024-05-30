"use client";
import React, { ReactNode } from "react";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { berachainTestnet, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Lilita_One } from "next/font/google";

const queryClient = new QueryClient();
const config = getDefaultConfig({
	appName: "Bears Love Mountains",
	projectId: "75ee70d786d384e63ed51b8fe1778249",
	chains: [sepolia],
	ssr: true, // If your dApp uses server side rendering (SSR)
});
const pageFont = Lilita_One({ subsets: ["latin"], weight: "400" });

type BodyProps = {
	children: ReactNode;
};

const Body: React.FC<BodyProps> = ({ children }) => {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<div className={pageFont.className}>{children}</div>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

export default Body;
