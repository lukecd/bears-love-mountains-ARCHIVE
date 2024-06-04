"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Hero from "@/app/components/Hero";
import NFTView from "@/app/components/NFTView";
import { useRouter } from "next/navigation";

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
			<Gallery showAll={false} address={address[0]} />
		</main>
	);
};

export default Page;
