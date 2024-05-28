"use client";
import Image from "next/image";
import dynamic from "next/dynamic";

import Gallery from "./components/Gallery";
import Hero from "./components/Hero";

import Footer from "./components/Footer";
import BentoBox from "./components/BentoBox";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-bentoPageBg">
			<Hero />
			<BentoBox />
			<Footer />
		</main>
	);
}
