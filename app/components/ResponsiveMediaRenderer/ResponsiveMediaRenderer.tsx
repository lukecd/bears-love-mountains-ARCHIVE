import React, { useState, useEffect } from "react";

type ResponsiveProps = {
	id: string;
	url: string;
};

const ResponsiveMediaRenderer: React.FC<ResponsiveProps> = ({ id, url }) => {
	const [size, setSize] = useState("500px");

	useEffect(() => {
		const handleResize = () => {
			// const currentWidth = window.innerWidth;
			const div = document.getElementById(id)!;
			let currentWidth = div.getBoundingClientRect().width;
			currentWidth *= 0.95;
			if (currentWidth >= 500) {
				setSize("500px");
			} else if (currentWidth < 500) {
				setSize(`${currentWidth}px`);
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize(); // Initial check on component mount

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return <iframe src={url} className="w-full h-full rounded-2xl" style={{ width: size, height: size }} />;
};

export default ResponsiveMediaRenderer;
