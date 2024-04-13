"use client";
import Image from "next/image";
import dynamic from "next/dynamic";

import Quote from "./components/Quote";
import Gallery from "./components/Gallery";
import Hero3 from "./components/Hero3";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center bg-white min-h-screen">
			<Hero3 navbarMode={false} /> <Gallery showAll={true} />
		</main>
	);
}
