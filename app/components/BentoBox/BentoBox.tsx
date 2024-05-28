"use client";

import React, { useEffect, useRef } from "react";

interface ImageProps {
	src: string;
	x: number;
	y: number;
	dx: number;
	dy: number;
	rotation: number;
	dr: number;
	radius: number;
	width: number;
	height: number;
}

const BentoBox: React.FC = () => {
	return (
		<div className="w-screen h-screen bg-bentoPageBg grid grid-rows-3 grid-cols-3 gap-4 p-4 ">
			<div className="row-span-1 col-span-1 bg-bentoColor1 p-2">
				<p className="text-5xl leading-none text-center">Bears</p>
				<p className="text-8xl leading-none text-center">Love</p>
				<p className="text-4xl leading-none text-center"> Mountains</p>
			</div>
			<div
				className="row-span-2 col-span-2 bg-bentoColor3 p-2 text-bentoColor4 transform transition-transform duration-300 hover:scale-105 cursor-pointer flex items-center justify-center text-center relative"
				onClick={() => (window.location.href = "/nfts")}
			>
				<iframe
					src="https://gateway.irys.xyz/-DATSC2Lf5uF-Gr4wz1dgEdvEIOEzCZKdsjvf4e-0hY"
					className="absolute top-0 left-0 w-full h-full border-none pointer-events-none"
				></iframe>
				<div className="absolute top-0 left-0 w-full h-full bg-transparent"></div>
			</div>
			<div
				className="row-span-1 col-span-1 bg-bentoColor3 p-2 text-bentoColor4 transform transition-transform duration-300 hover:scale-105 cursor-pointer flex items-center justify-center text-center"
				onClick={() => (window.location.href = "/nfts")}
			>
				<div>
					<p className="text-5xl">Psychedelic</p>
					<p className="text-9xl"> NFTs</p>
				</div>
			</div>
			<div
				className="row-span-1 col-span-2 bg-bentoColor3 p-2 text-bentoColor4 transform transition-transform duration-300 hover:scale-105 cursor-pointer flex items-center justify-center text-center relative"
				onClick={() => (window.location.href = "/nfts")}
			>
				<iframe
					src="https://gateway.irys.xyz/xEsnXgbrRpULvTE7lHnQCUg_JhQOOOvYyCSxhaul6vg"
					className="absolute top-0 left-0 w-full h-full border-none pointer-events-none"
				></iframe>
				<div className="absolute top-0 left-0 w-full h-full bg-transparent"></div>
			</div>
			<div
				className="row-span-1 col-span-1 bg-bentoColor5 p-2 text-5xl transform transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col items-center justify-center text-center"
				onClick={() => (window.location.href = "/memecoin")}
			>
				<p className="text-5xl">And a</p>
				<p className="text-7xl">meme coin</p>
				<p className="text-4xl">from outerspace</p>
			</div>
		</div>
	);
};

export default BentoBox;
