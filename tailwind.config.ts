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
				bg: "#F6F6F6",
				accent: "#54D5F5",
				text: "#363638",
				headerBg: "#54D5F5",
				headerText: "#363638",
				buttonBg: "#408696",
				buttonAccent: "#54D5F5",
				buttonText: "#FFFFFF",
				footerBg: "#363638",
				footerText: "#54D5F5",
				nftBorder: "#363638",
			},
			boxShadow: {
				heavy: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.5)",
			},
		},
	},
	plugins: [],
};
export default config;
