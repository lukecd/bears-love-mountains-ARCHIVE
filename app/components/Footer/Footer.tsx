import React from "react";

const Footer: React.FC = () => {
	return (
		<div className="bg-footerBg text-footerText w-full mt-15 z-20">
			<div className="container flex flex-col lg:flex-row  items-center">
				<div className="text-center lg:text-left lg:w-2/3 px-10">
					<p className="text-lg lg:text-2xl">In the mountain mist,</p>
					<p className="text-lg lg:text-2xl">Bear inhales nature{"'"}s calm breeze,</p>
					<p className="text-lg lg:text-2xl">Peace in every puff.</p>
				</div>
				<div className="w-full lg:w-1/3 mt-4 lg:mt-0 flex flex-col items-center lg:items-start">
					<a href="https://twitter.com/spaceagente" className="flex items-center mb-2">
						<img src="/hero/mountains/planet-10.png" alt="Bullet" className="w-6 h-6 mr-2" />
						@spaceagente
					</a>
					<a href="https://twitter.com/bearsmountains" className="flex items-center mb-2">
						<img src="/hero/mountains/planet-10.png" alt="Bullet" className="w-6 h-6 mr-2" />
						@bearsmountains
					</a>
					<a href="https://github.com/lukecd/bears-love-mountains" className="flex items-center">
						<img src="/hero/mountains/planet-10.png" alt="Bullet" className="w-6 h-6 mr-2" />
						lukecd/bears-love-mountains
					</a>
				</div>
			</div>
		</div>
	);
};

export default Footer;
