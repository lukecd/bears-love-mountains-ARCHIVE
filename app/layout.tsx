import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Lilita_One } from "next/font/google";

import "./globals.css";

// const pageFont = Inter({ subsets: ["latin"] });
const pageFont = Lilita_One({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
	title: "Bears Love Mountains",
	description: "In the mountain mist, Bear inhales nature's calm breeze, Peace in every puff",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={pageFont.className}>{children}</body>
		</html>
	);
}
