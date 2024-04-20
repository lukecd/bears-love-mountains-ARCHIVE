import React, { useState } from "react";
import { MediaRenderer } from "thirdweb/react";

type Props = {
	client: any;
	image: string;
	animation_url: string;
};

const HoverMediaRenderer: React.FC<Props> = ({ client, image, animation_url }) => {
	const [src, setSrc] = useState<string>(image);

	const handleMouseEnter = () => {
		setSrc(animation_url);
	};

	const handleMouseLeave = () => {
		setSrc(image);
	};

	return (
		<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<MediaRenderer
				className="h-auto hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md rounded-lg"
				client={client}
				src={src}
				width="100%"
				height="100%"
			/>
		</div>
	);
};

export default HoverMediaRenderer;
