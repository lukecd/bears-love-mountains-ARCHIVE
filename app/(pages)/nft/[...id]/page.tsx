"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Hero from "@/app/components/Hero";
import NFTView from "@/app/components/NFTView";
import { useRouter } from "next/navigation";

type PageProps = {
	params: {
		id: string;
	};
};

const Page: React.FC<PageProps> = ({ params }) => {
	const { id } = params;
	const router = useRouter();

	return (
		<main className="w-full h-screen ">
			<NFTView id={id} />
		</main>
	);
};

export default Page;
