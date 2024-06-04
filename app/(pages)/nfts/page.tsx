"use client";
import Image from "next/image";
import dynamic from "next/dynamic";

import Gallery from "../../components/Gallery";
import Hero from "../../components/Hero";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-bentoPageBg">
			<Gallery showAll={true} />
		</main>
	);
}
