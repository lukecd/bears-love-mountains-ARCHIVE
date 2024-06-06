import React from "react";

const NftDataLine = ({ price, ethBalance, nftBalance, reserveRatio, setReserveRatio }) => {
	return (
		<div className="flex w-full  space-x-2 ">
			<div className="w-1/3 relative text-white">
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<path
						fill="#fbe134"
						d="M62.1,-35C68.7,-24.3,54.3,-0.6,40.5,17.5C26.6,35.6,13.3,48.2,-3.9,50.5C-21.1,52.7,-42.3,44.7,-53,28.3C-63.8,12,-64.1,-12.6,-53.6,-25.6C-43,-38.6,-21.5,-39.9,3.1,-41.7C27.7,-43.5,55.4,-45.7,62.1,-35Z"
						transform="translate(100 100)"
					/>
				</svg>

				<div className="text-black font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
					<label className="">NFT Price</label>
					<div>{price} ETH</div>
				</div>
			</div>
			<div className="w-1/3 relative text-white">
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<path
						fill="#fbe134"
						d="M49.7,-66.8C64.3,-57.8,76,-43.1,80.4,-26.8C84.9,-10.4,82.2,7.7,76,24.1C69.9,40.5,60.3,55.1,47,67.4C33.8,79.7,16.9,89.6,0.1,89.5C-16.7,89.3,-33.3,79,-48.3,67.3C-63.2,55.6,-76.5,42.4,-83.9,25.8C-91.4,9.2,-93,-10.8,-86.5,-27.3C-80.1,-43.8,-65.5,-56.9,-49.7,-65.6C-33.9,-74.2,-17,-78.5,0.3,-78.9C17.6,-79.3,35.1,-75.9,49.7,-66.8Z"
						transform="translate(100 100)"
					/>
				</svg>

				<div className="text-black font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
					<label className="">NFT Balance</label>
					<div>{nftBalance}</div>
				</div>
			</div>
			<div className="w-1/3 relative text-white">
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<path
						fill="#fbe134"
						d="M47.4,-47.8C59.5,-35.3,65.9,-17.7,65.9,0C65.9,17.6,59.4,35.3,47.4,44C35.3,52.7,17.6,52.5,-0.3,52.8C-18.2,53.1,-36.5,53.9,-51.1,45.2C-65.6,36.5,-76.5,18.2,-78.6,-2.1C-80.8,-22.5,-74.1,-45,-59.6,-57.5C-45,-70,-22.5,-72.5,-2.4,-70.1C17.7,-67.7,35.3,-60.3,47.4,-47.8Z"
						transform="translate(100 100)"
					/>
				</svg>

				<div className="text-black font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
					<label className="">BERA Balance</label>
					<div>{ethBalance} ETH</div>
				</div>
			</div>
		</div>
	);
};

export default NftDataLine;
