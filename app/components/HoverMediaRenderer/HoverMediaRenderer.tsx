import React, { useState } from "react";

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

	return <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></div>;
};

export default HoverMediaRenderer;
