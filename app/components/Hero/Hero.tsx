"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";

interface HeroProps {
	navbarMode: boolean;
}

const Hero: React.FC<HeroProps> = ({ navbarMode }) => {
	const refContainer = useRef<HTMLDivElement>(null);
	const [isSticky, setIsSticky] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		const updateSize = () => {
			if (!refContainer.current) return;
			refContainer.current.style.width = "100%";
			refContainer.current.style.height = "90vh";
		};

		window.addEventListener("resize", updateSize);
		updateSize();

		return () => window.removeEventListener("resize", updateSize);
	}, []);

	const handleScroll = () => {
		if (refContainer.current) {
			if (window.scrollY > refContainer.current.clientHeight - 90) {
				setIsSticky(true);
			} else {
				setIsSticky(false);
			}
		}
	};

	useEffect(() => {
		setIsSticky(navbarMode);
		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<div
				ref={refContainer}
				className={`relative overflow-hidden shadow-2xl ${isSticky ? "fixed top-0 z-50" : ""}`}
				style={{
					height: isSticky ? "90px" : "90vh",
					transition: "height 0.3s",
				}}
			>
				<div ref={refContainer} className="relative overflow-hidden shadow-2xl" style={{ height: "90vh" }}>
					<img
						src="/hero/mountains/01-background.png"
						alt="Background"
						className="absolute top-0 left-0 w-full h-full object-cover z-10 shadow-heavy"
					/>
					<img
						src="/hero/mountains/02-mountains.png"
						alt="Mountains"
						className="absolute top-0 left-0 w-full h-full object-cover z-20 shadow-heavy"
					/>
					<img
						src="/hero/mountains/03-foreground-back.png"
						alt="Foreground Back"
						className="absolute top-0 left-0 w-full h-full object-cover z-30 shadow-heavy"
					/>
					<img
						src="/hero/mountains/04-foreground-front.png"
						alt="Foreground Front"
						className="absolute top-0 left-0 w-full h-full object-cover z-40 shadow-heavy "
					/>
					<video
						src="/hero/video-sprites/bear1.webm"
						autoPlay
						loop
						muted
						className="hidden md:block absolute z-50"
						style={{
							top: "calc(60vh - 120px)",
							left: "66%",
							scale: "0.5",
						}}
					/>
					<video
						src="/hero/video-sprites/bear2.webm"
						autoPlay
						loop
						muted
						className="hidden lg:block absolute z-30"
						style={{ top: "40%", left: "3%", scale: "0.5" }}
					/>
					<video
						src="/hero/video-sprites/bear3.webm"
						autoPlay
						loop
						muted
						className="hidden md:block absolute z-20 "
						style={{ top: "-40px", left: "65%", transform: "scale(0.9) rotate(180deg)" }}
					/>
					<div
						style={{
							position: "absolute",
							top: "10%",
							left: 0,
							right: 0,
							display: "flex",
							justifyContent: "center",
							zIndex: 15,
							scale: "0.8",
						}}
					>
						<img
							src="/hero/mountains/planet-1.png"
							alt="Stationary Planet"
							className="rotate-forever"
							style={{
								filter: "drop-shadow(0 0 40px rgba(0,0,0,1))",
								zIndex: 15,
								position: "absolute",
							}}
						/>
					</div>
					<img
						src="/hero/mountains/planet-4.png"
						alt="Stationary Planet"
						className="hidden md:block rotate-forever"
						style={{
							filter: "drop-shadow(0 0 40px rgba(0,0,0,1))",
							left: "20%",
							top: "20%",
							zIndex: 25,
							position: "absolute",
						}}
					/>
					<img
						src="/hero/mountains/planet-6.png"
						alt="Stationary Planet"
						className="hidden md:block rotate-forever"
						style={{
							filter: "drop-shadow(0 0 40px rgba(0,0,0,1))",
							left: "30%",
							top: "25%",
							zIndex: 15,
							position: "absolute",
						}}
					/>
					<img
						src="/hero/mountains/planet-8.png"
						alt="Stationary Planet"
						className="hidden md:block rotate-forever"
						style={{
							filter: "drop-shadow(0 0 40px rgba(0,0,0,1))",
							left: "5%",
							top: "5%",
							zIndex: 15,
							position: "absolute",
						}}
					/>
					<img
						src="/hero/mountains/planet-9.png"
						alt="Stationary Planet"
						className="hidden md:block rotate-forever"
						style={{
							filter: "drop-shadow(0 0 40px rgba(0,0,0,1))",
							left: "15%",
							top: "5%",
							zIndex: 15,
							position: "absolute",
						}}
					/>
				</div>
			</div>
			{isSticky && <Navbar />}
		</>
	);
};

export default Hero;
