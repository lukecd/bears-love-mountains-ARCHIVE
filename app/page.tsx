"use client";
import Image from "next/image";
import Hero2 from "./components/Hero2/";
import Quote from "./components/Quote";
import Gallery from "./components/Gallery";
import dynamic from "next/dynamic";

export default function Home() {
	// const AppWithoutSSR = dynamic(() => import("./DemoGame"), { ssr: false });

	return (
		<main className="flex flex-col w-full h-full items-center justify-center bg-white">
			<Hero2 navbarMode={false} />
			<Gallery showAll={true} />
		</main>
	);
}
