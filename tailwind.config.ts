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
				// bg: "#020126",
				accent: "#637275",
				text: "#363638",
				headerBg: "#54D5F5",
				headerText: "#363638",
				buttonBg: "#54D5F5",
				buttonAccent: "#D94A7C",
				buttonText: "#FFFFFF",
				footerBg: "#363638",
				footerText: "#54D5F5",
				nftBorder: "#363638",
				soldTextColor: "#D94A7C",
				bentoPageBg: "#020126",
				bentoColor1: "#F27294",
				bentoColor2: "#D94E9A",
				bentoColor3: "#0A0140",
				bentoColor4: "#F2B28D",
				bentoColor5: "#35A6BB",
			},
			boxShadow: {
				heavy: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.5)",
			},
		},
	},
	plugins: [],
};
export default config;
