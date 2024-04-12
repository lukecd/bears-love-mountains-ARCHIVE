import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				mainBg: "#f2f2f2",
				navBarBg: "black",
				textColor: "black",
				sunsetDark: "#792602",
				sunsetDarker: "#FF5101",
				sunsetDarkish: "#E35000",
				sunsetLight: "#FFA301",
				sunsetLighter: "#FFDB7C",
			},
		},
	},
	plugins: [],
};
export default config;
