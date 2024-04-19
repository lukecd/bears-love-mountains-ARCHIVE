import React from "react";

const Footer: React.FC = () => {
	return (
		<div
			className="bg-purple-900 text-white px-4 py-2 w-full"
			style={{ boxShadow: "0 -4px 6px -1px rgba(255, 20, 147, 0.8), 0 -2px 4px -1px rgba(255, 20, 147, 0.6)" }}
		>
			<div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
				<div className="text-center lg:text-left lg:w-2/3">
					<p className="text-lg lg:text-3xl">In the mountain mist,</p>
					<p className="text-lg lg:text-3xl">Bear inhales nature's calm breeze,</p>
					<p className="text-lg lg:text-3xl">Peace in every puff.</p>
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
