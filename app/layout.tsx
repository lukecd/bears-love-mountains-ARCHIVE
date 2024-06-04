import type { Metadata } from "next";
import { Lilita_One } from "next/font/google";
import Body from "./components/Body";
import "./globals.css";
import Sidebar from "@/app/components/Sidebar";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
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
			<body className={pageFont.className}>
				<Navbar />
				<Sidebar />
				<Body>{children}</Body>
				<Footer />
			</body>
		</html>
	);
}
