import React from "react";

const Footer: React.FC = () => {
	return (
		<div className="bg-footerBg text-buttonAccent w-full mt-15 z-20">
			<div className="container flex flex-row items-start">
				<div className="text-center md:text-left md:w-1/2 lg:w-2/3 px-10">
					<p className="text-lg lg:text-xl">In the mountain mist,</p>
					<p className="text-lg lg:text-xl">Bear inhales nature{"'"}s calm breeze,</p>
					<p className="text-lg lg:text-xl">Peace in every puff.</p>
				</div>
				<div className="mt-4 lg:mt-0 flex flex-col items-start text-sm text-bg">
					<a href="https://twitter.com/spaceagente" className="flex items-start">
						<img src="/hero/mountains/planet-10.png" alt="Bullet" className="w-6 h-6" />
						@spaceagente
					</a>
					<a href="https://twitter.com/bearsmountains" className="flex items-start">
						<img src="/hero/mountains/planet-10.png" alt="Bullet" className="w-6 h-6" />
						@bearsmountains
					</a>
					<a href="https://github.com/lukecd/bears-love-mountains" className="flex items-start">
						<img src="/hero/mountains/planet-10.png" alt="Bullet" className="w-6 h-6" />
						lukecd/bears-love-mountains
					</a>
				</div>
			</div>
		</div>
	);
};

export default Footer;
