"use client";

import React, { useEffect, useRef } from "react";

interface ImageProps {
	src: string;
	x: number;
	y: number;
	dx: number;
	dy: number;
	rotation: number;
	dr: number;
	radius: number;
	width: number;
	height: number;
}

const BentoBox: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				canvas.width = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;

				startAnimation(ctx, canvas.width, canvas.height);
			}
		}
	}, []);

	const startAnimation = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
		const images: ImageProps[] = [
			createImage("/hero/mountains/planet-7.png"),
			createImage("/hero/mountains/planet-8.png"),
			createImage("/hero/mountains/planet-9.png"),
		];

		const loadedImages: HTMLImageElement[] = [];
		images.forEach((image, index) => {
			const img = new Image();
			img.src = image.src;
			img.onload = () => {
				image.width = img.width;
				image.height = img.height;
				image.radius = img.width / 2;
				loadedImages.push(img);
				if (loadedImages.length === images.length) {
					animate();
				}
			};
		});

		const animate = () => {
			ctx.clearRect(0, 0, width, height);
			images.forEach((image, index) => {
				const img = loadedImages[index];
				image.x += image.dx;
				image.y += image.dy;
				image.rotation += image.dr;

				// Check for collisions with canvas edges and bounce
				if (image.x - image.radius < 0 || image.x + image.radius > width) image.dx *= -1;
				if (image.y - image.radius < 0 || image.y + image.radius > height) image.dy *= -1;

				// Check for collisions with other images
				for (let i = 0; i < images.length; i++) {
					if (i !== index && isColliding(image, images[i])) {
						image.dx *= -1;
						image.dy *= -1;
					}
				}

				// Save the current context
				ctx.save();
				// Move to the center of the image
				ctx.translate(image.x, image.y);
				// Rotate the canvas
				ctx.rotate((image.rotation * Math.PI) / 180);
				// Draw the image, adjusting for the rotation
				ctx.drawImage(img, -image.radius, -image.radius, image.width, image.height);
				// Restore the context to its original state
				ctx.restore();
			});

			requestAnimationFrame(animate);
		};
	};

	const createImage = (src: string): ImageProps => {
		const randomSpeed = () => Math.random() * 4 - 2; // Random speed between -2 and 2
		const randomRotationSpeed = () => Math.random() * 2 - 1; // Random rotation speed between -1 and 1
		const randomPosition = (max: number) => Math.random() * max; // Random position within the canvas

		return {
			src,
			x: randomPosition(window.innerWidth),
			y: randomPosition(window.innerHeight),
			dx: randomSpeed(),
			dy: randomSpeed(),
			rotation: Math.random() * 360,
			dr: randomRotationSpeed(),
			radius: 0,
			width: 0,
			height: 0,
		};
	};

	const isColliding = (a: ImageProps, b: ImageProps) => {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		const distance = Math.sqrt(dx * dy + dy * dy);
		return distance < a.radius + b.radius;
	};

	return (
		<div className="w-screen h-screen bg-bentoPageBg grid grid-rows-3 grid-cols-3 gap-4 p-4 ">
			<div className="row-span-1 col-span-1 bg-bentoColor1 p-2">
				<p className="text-5xl leading-none text-center">Bears</p>
				<p className="text-8xl leading-none text-center">Love</p>
				<p className="text-4xl leading-none text-center"> Mountains</p>
			</div>
			<div className="row-span-2 col-span-2 bg-bentoColor2 p-2 relative">
				<iframe
					src="https://gateway.irys.xyz/-DATSC2Lf5uF-Gr4wz1dgEdvEIOEzCZKdsjvf4e-0hY"
					className="absolute top-0 left-0 w-full h-full border-none"
				></iframe>
			</div>
			<div
				className="row-span-1 col-span-1 bg-bentoColor3 p-2  text-bentoColor4 transform transition-transform duration-300 hover:scale-105 cursor-pointer flex items-center justify-center text-center"
				onClick={() => (window.location.href = "/nfts")}
			>
				<div>
					<p className="text-5xl">Psychedelic</p>
					<p className="text-9xl"> NFTs</p>
				</div>
			</div>
			<div className="row-span-1 col-span-2 bg-bentoColor4 p-2 relative">
				<canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
			</div>
			<div
				className="row-span-1 col-span-1 bg-bentoColor5 p-2 text-5xl transform transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col items-center justify-center text-center"
				onClick={() => (window.location.href = "/memecoins")}
			>
				<p className="text-5xl">And a</p>
				<p className="text-7xl">meme coin</p>
				<p className="text-4xl">from outerspace</p>
			</div>
		</div>
	);
};

export default BentoBox;
