// Hero2.tsx
"use client";
import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import BearSquare from "@/game/scenes/BearSquare";

const Hero2: React.FC = () => {
	const gameRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		var game: Phaser.Game | null = null;

		if (gameRef.current) {
			const config: Phaser.Types.Core.GameConfig = {
				type: Phaser.WEBGL,
				parent: gameRef.current,
				width: 350,
				height: 400,
				physics: {
					default: "arcade",
					arcade: {
						gravity: { x: 100, y: 600 },
						debug: false,
					},
				},
				render: {
					pixelArt: false,
					antialias: true,
				},
				scene: [BearSquare], // Load the scene from Boot.ts
			};

			game = new Phaser.Game(config);
		}

		return () => {
			if (game) {
				game.destroy(true);
			}
		};
	}, []);

	return <div className="bg-white rounded-xl overflow-hidden" ref={gameRef} />;
};

export default Hero2;
