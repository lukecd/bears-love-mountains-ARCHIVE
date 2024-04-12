"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
const Hero2 = dynamic(() => import("./components/Hero2"), { ssr: false });

import Quote from "./components/Quote";
import Gallery from "./components/Gallery";
import "./mock-browser-objects.js";

export default function Home() {
	// const AppWithoutSSR = dynamic(() => import("./DemoGame"), { ssr: false });

	return (
		<main className="flex flex-col w-full h-full items-center justify-center bg-white">
			<Hero2 navbarMode={false} />
			<Gallery showAll={true} />
		</main>
	);
}
