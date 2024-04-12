import React, { useEffect, useRef } from "react";

import { Monoton } from "next/font/google";
// import BearSquare from "../BearSquare";
import dynamic from "next/dynamic";
const BearSquare = dynamic(() => import("../BearSquare"), { ssr: false });
const monoton = Monoton({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

interface InfoProps {
	id: number;
	mainColor: string;
	accentColor: string;
}

const Info: React.FC<InfoProps> = ({ id, mainColor, accentColor }) => {
	const style = {
		backgroundColor: mainColor,
		color: accentColor,
		// fontFamily: "'Lexend Mega', sans-serif",
		boxShadow: `0 4px 6px ${accentColor}`,
	};

	let content;

	switch (id) {
		case 0:
			content = (
				<div style={style} className="flex flex-col w-full  md:w-1/3 lg:w-1/4 justify-center items-center p-3">
					<div className="w-full flex flex-col items-center">
						<p className={`${monoton.className} leading-none lg:text-9xl text-7xl`}>42</p>
						<p className="lexend-mega-300 lg:text-4xl text-3xl leading-none w-full text-center">Original</p>
						<p className="lexend-mega-300 lg:text-2xl text-xl leading-none w-full text-center">Photographs</p>
					</div>
				</div>
			);
			break;
		case 1:
			content = (
				<div style={style} className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3">
					<p className="lexend-mega-300 lg:text-5xl text-2xl leading-none">Minted as</p>
					<p className={`${monoton.className} leading-none lg:text-7xl text-4xl`}>NFTs</p>
					<p className="lexend-mega-300 lg:text-4xl text-xl leading-none">on Berachain</p>
				</div>
			);
			break;
		case 2:
			content = (
				<div style={style} className="flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3">
					<p className={`lexend-mega-300 leading-none lg:text-4xl text-xl`}>Original Work</p>
					<p className={`${monoton.className} leading-none lg:text-9xl text-7xl`}>By</p>
					<p className={`lexend-mega-300 leading-none lg:text-4xl text-xl`}>Mountain Bear</p>
				</div>
			);
			break;
		case 3:
			content = (
				<div
					style={style}
					className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-start p-3"
				>
					<p className="leading-none">In the mountain mist,</p>
					<p className="leading-none">Bear inhales nature{"'"}s calm breeze,</p>
					<p className="leading-none">Peace in every puff</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		case 4:
			content = (
				<BearSquare />
				// <div style={style} className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-end items-end p-3">
				// 	<p className="leading-none">Summit{"'"}s silent song,</p>
				// 	<p className="leading-none">Solitude whispers wisdom,</p>
				// 	<p className="leading-none">Soul feasts on the calm.</p>
				// 	<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				// </div>
			);
			break;
		case 5:
			content = (
				<div
					style={style}
					className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3"
				>
					<p className="leading-none">River{"'"}s gentle flow,</p>
					<p className="leading-none">
						Nature{"'"}s breath, a soul{"'"}s repose,
					</p>
					<p className="leading-none">Peace where wildflowers grow.</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		case 6:
			content = (
				<div style={style} className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-end items-end p-3">
					<p className="leading-none">Forest{"'"}s emerald heart,</p>
					<p className="leading-none">Solitude{"'"}s sanctuary,</p>
					<p className="leading-none">Nature heals, imparts.</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		case 7:
			content = (
				<div
					style={style}
					className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-start p-3"
				>
					<p className="leading-none">Dawn{"'"}s first light on peaks,</p>
					<p className="leading-none">Mountains{"'"} solitude beckons,</p>
					<p className="leading-none">In silence, soul speaks.</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		case 8:
			content = (
				<div
					style={style}
					className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3"
				>
					<p className="leading-none">Cascades{"'"} melody,</p>
					<p className="leading-none">Nature{"'"}s refreshment, pure, clear,</p>
					<p className="leading-none">Solitude{"'"}s key, free.</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		case 9:
			content = (
				<div
					style={style}
					className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3"
				>
					<p className="leading-none">Alpine twilight fades,</p>
					<p className="leading-none">Solitude in every hue,</p>
					<p className="leading-none">Nature{"'"}s beauty aids.</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		case 10:
			content = (
				<div
					style={style}
					className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3"
				>
					<p className="leading-none">Stars over stone spires,</p>
					<p className="leading-none">Only in nature{"'"}s embrace,</p>
					<p className="leading-none">Soul finds what it desires.</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		case 11:
			content = (
				<div
					style={style}
					className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3"
				>
					<p className="leading-none">Frost kisses the pine,</p>
					<p className="leading-none">Mountain{"'"}s breath, a tranquil balm,</p>
					<p className="leading-none">Solitude divine.</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		case 12:
			content = (
				<div
					style={style}
					className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3"
				>
					<p className="leading-none">Path through ancient woods,</p>
					<p className="leading-none">Solitude{"'"}s journey inward,</p>
					<p className="leading-none">Nature{"'"}s quiet goods.</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		case 13:
			content = (
				<div
					style={style}
					className="lexend-mega-300 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3"
				>
					<p className="leading-none">Moonlit valley{"'"}s call,</p>
					<p className="leading-none">In solitude, find your peace,</p>
					<p className="leading-none">Nature cradles all.</p>
					<p className={`leading-none lg:text-xl text-sm mt-3`}>-Mountain Bear</p>
				</div>
			);
			break;
		default:
			content = (
				<div
					style={style}
					className="lexend-mega-900 flex flex-col w-full md:w-1/3 lg:w-1/4 justify-center items-center p-3"
				>
					<p className="text-4xl leading-none">;-)</p>
				</div>
			);
	}

	return <>{content}</>;
};

export default Info;
