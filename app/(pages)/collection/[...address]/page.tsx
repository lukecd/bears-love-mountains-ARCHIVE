"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import NFTView from "@/app/components/NFTView";
import { useRouter } from "next/navigation";

import Footer from "@/app/components/Footer";
import Gallery from "@/app/components/Gallery";

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
			<Navbar />
			<Gallery showAll={false} address={address[0]} />
			<Footer />
		</main>
	);
};

export default Page;
