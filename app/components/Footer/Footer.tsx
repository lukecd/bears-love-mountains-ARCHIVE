import React from "react";
import Image from "next/image";
const Footer: React.FC = () => {
	return (
		<div className="bg-footerBg text-buttonAccent w-full relative z-500">
			<div className="container flex flex-row items-start">
				<div className="text-center md:text-left md:w-1/2 lg:w-2/3 px-10">
					<p className="text-lg lg:text-xl">In the mountain mist,</p>
					<p className="text-lg lg:text-xl">Bear inhales nature{"'"}s calm breeze,</p>
					<p className="text-lg lg:text-xl">Peace in every puff.</p>
				</div>
				<div className="mt-4 lg:mt-0 flex flex-col items-start text-sm text-bg">
					<a href="https://twitter.com/spaceagente" className="flex items-start">
						<Image src="/hero/mountains/planet-10.png" alt="Bullet" width={24} height={24} />
						@spaceagente
					</a>
					<a href="https://twitter.com/bearsmountains" className="flex items-start">
						<Image src="/hero/mountains/planet-10.png" alt="Bullet" width={24} height={24} />
						@bearsmountains
					</a>
					<a href="https://github.com/lukecd/bears-love-mountains" className="flex items-start">
						<Image src="/hero/mountains/planet-10.png" alt="Bullet" width={24} height={24} />
						lukecd/bears-love-mountains
					</a>
				</div>
			</div>
			{/* <div className="z-0 hidden md:block">
				<video
					src="/hero/video-sprites/bear1.webm"
					autoPlay
					loop
					muted
					className="absolute -bottom-12 -right-20 lg:block"
					style={{ transform: "scale(0.5)" }}
					// style={{ maxWidth: "200px", maxHeight: "100px" }} // Adjust these values as needed
				></video>
			</div> */}
		</div>
	);
};

export default Footer;
