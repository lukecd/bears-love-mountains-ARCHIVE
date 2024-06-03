import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { Inter } from "next/font/google";
import Footer from "@/app/components/Footer";
import Rewards from "@/app/components/Rewards";
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

const Page = () => {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-bentoPageBg">
			<Navbar />
			<Rewards />
			<Footer />
		</main>
	);
};

export default Page;
