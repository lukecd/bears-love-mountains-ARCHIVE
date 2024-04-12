import Phaser from "phaser";

interface StationaryPlanetData {
	key: string;
	x: number;
	y: number;
}
interface StationaryPlanet extends StationaryPlanetData {
	planet: Phaser.GameObjects.Image;
}
interface OrbitingPlanetData {
	key: string;
	distance: number;
	speed: number;
}
interface OrbitingPlanet extends OrbitingPlanetData {
	planet: Phaser.GameObjects.Image;
}

export default class Boot extends Phaser.Scene {
	private orbitingPlanets: OrbitingPlanet[] = [];
	private width: number = 0;
	private height: number = 0;

	constructor() {
		super("BootScene");
	}

	preload(): void {
		const { width, height } = this.sys.game.canvas;
		this.width = width;
		this.height = height;
		this.load.image("background", "/hero/mountains/01-background.png");
		this.load.image("mountains", "/hero/mountains/02-mountains.png");
		this.load.image("foreground-back", "/hero/mountains/03-foreground-back.png");
		this.load.image("foreground-front", "/hero/mountains/04-foreground-front.png");

		this.load.video("bear1", "/hero/video-sprites/bear1.webm", true);
		this.load.video("bear2", "/hero/video-sprites/bear2.webm", true);
		this.load.video("bear3", "/hero/video-sprites/bear3.webm", true);
		this.load.atlas("yellow-poof", "/hero/sprites/yellow-poof.png", "/hero/sprites/yellow-poof.json");

		// Load planets
		for (let i = 1; i <= 10; i++) {
			this.load.image(`planet${i}`, `/hero/mountains/planet-${i}.png`);
		}

		this.load.image("flare", "/hero/misc/white-flare.png");
		this.load.image("flares", "/hero/misc/flares.png");

		// planet trains
		this.load.image("planet-trail", "/hero/particles/yellow/flash00.png");
	}

	create(): void {
		const scale = this.width / 1920;

		this.add.image(0, 0, "background").setOrigin(0, 0).setScale(scale).setDepth(0);
		this.add.image(0, 0, "mountains").setOrigin(0, 0).setScale(scale).setDepth(1);
		this.add.image(0, 0, "foreground-back").setOrigin(0, 0).setScale(scale).setDepth(2);
		this.add.image(0, 0, "foreground-front").setOrigin(0, 0).setScale(scale).setDepth(4);
		// this.addScenes();

		// World bounds and physics adjustments
		this.physics.world.setBounds(0, 0, this.width, this.height);
		this.physics.world.setBoundsCollision(true, true, true, true);
		this.physics.world.gravity.y = 50;

		// Keep planet 1 stationary
		const planet1 = this.add
			.image(this.width / 2, this.height / 3 - 100, "planet1")
			.setOrigin(0.5, 0.5)
			.setScale(0.6)
			.setDepth(3);
		this.tweens.add({
			targets: planet1,
			angle: "+=360", // Increment the angle by 360 degrees for a full rotation
			duration: 10000, // Duration of the rotation in milliseconds, adjust for speed
			repeat: -1, // Repeat indefinitely for continuous spinning
		});
		// planet1.setBlendMode(Phaser.BlendModes.ADD);

		// Physics group for planets
		const planets = this.physics.add.group({
			collideWorldBounds: true,
			bounceX: 1,
			bounceY: 1,
		});

		// Position of planet1, the central body
		const planet1X = this.width / 2;
		const planet1Y = this.height / 3 - 100;

		// Base vertical position for the stationary planets
		const baseVerticalPosition = this.height / 3.7;

		// Compute horizontal positions with an offset for the central planet
		const totalPlanets = 5; // Total number of stationary planets
		const horizontalSpacing = this.width / (totalPlanets + 1); // Dividing the width into equal parts

		// Function to adjust vertical position slightly for variation
		const getVerticalVariation = (index: number, basePosition: number): number => {
			// Simple variation: adjust based on even/odd index for a wave-like arrangement
			const offset = 20; // Maximum vertical offset for variation
			return basePosition + (index % 2 === 0 ? offset : -offset);
		};

		const stationaryPlanetsData: StationaryPlanetData[] = [
			{ key: "planet2", x: horizontalSpacing * 1, y: getVerticalVariation(1, baseVerticalPosition) },
			{ key: "planet3", x: horizontalSpacing * 2, y: getVerticalVariation(2, baseVerticalPosition) },
			{ key: "planet6", x: horizontalSpacing * 5, y: getVerticalVariation(5, baseVerticalPosition) },
			{ key: "planet7", x: horizontalSpacing * 6, y: getVerticalVariation(6, baseVerticalPosition) },
		];
		// Array to store the orbiting planets data
		const baseDistance = 125;
		const orbitingPlanetsData: OrbitingPlanetData[] = [
			{ key: "planet6", distance: baseDistance, speed: 0.0004 },
			{ key: "planet7", distance: baseDistance + 50, speed: 0.0004 },
			{ key: "planet8", distance: baseDistance + 100, speed: 0.0003 },
			{ key: "planet9", distance: baseDistance + 200, speed: 0.0002 },
			{ key: "planet10", distance: baseDistance + 300, speed: 0.0001 },
		];

		orbitingPlanetsData.forEach((planetData) => {
			const planet = this.physics.add
				.image(planet1X + planetData.distance, planet1Y, planetData.key)
				.setOrigin(0.5, 0.5)
				.setScale(0.5)
				.setDepth(1);

			planets.add(planet);
			// this.tweens.add({
			// 	targets: planet,
			// 	angle: "+=360", // Increment the angle by 360 degrees for a full rotation
			// 	duration: 10000, // Duration of the rotation in milliseconds, adjust for speed
			// 	repeat: -1, // Repeat indefinitely for continuous spinning
			// });
			this.orbitingPlanets.push({ planet, ...planetData });

			// Create the trails
			const particles = this.add
				.particles(0, 0, "planet-trail", {
					speed: 2,
					lifespan: { min: 1000, max: 3000 },
					quantity: 10,
					scale: { start: planet.width * 0.0005, end: (planet.width * 0.0005) / 2 },
					// blendMode: "ADD",
					follow: planet,
					// followOffset: { x: 0, y: planet.height / 3 },
				})
				.setDepth(0);
		});

		// Create the stationary planets
		// const stationaryPlanets: StationaryPlanet[] = stationaryPlanetsData.map((planetData) => {
		// 	const planet = this.add.image(planetData.x, planetData.y, planetData.key).setScale(0.5).setDepth(3);
		// 	this.tweens.add({
		// 		targets: planet,
		// 		angle: "+=360", // Increment the angle by 360 degrees for a full rotation
		// 		duration: 10000, // Duration of the rotation in milliseconds, adjust for speed
		// 		repeat: -1, // Repeat indefinitely for continuous spinning
		// 	});
		// 	planet.setDepth(0);
		// 	return { planet, ...planetData };
		// });

		// i like this

		// Adding floating planets (4 and 5)
		// const floatingPlanetsData: StationaryPlanetData[] = [
		// 	{ key: "planet4", x: horizontalSpacing * 3, y: getVerticalVariation(3, baseVerticalPosition) },
		// 	{ key: "planet5", x: horizontalSpacing * 4, y: getVerticalVariation(4, baseVerticalPosition) },
		// ];

		// floatingPlanetsData.forEach((planetData, index) => {
		// 	const planet = this.add.image(planetData.x, planetData.y, planetData.key).setScale(0.5).setDepth(3);
		// });

		// Enable collisions between planets
		this.physics.add.collider(planets, planets);

		const buttonText = this.add
			.text(this.width / 2, this.height - 50, " Wanna see some NFTs? ", {
				fontSize: "64px",
				color: "#FFFFFF",
				backgroundColor: "#000000",
			})
			.setInteractive()
			.setOrigin(0.5)
			.setDepth(10)
			.on("pointerdown", () => this.scrollPage());

		// Apply a gradient to the text
		const colors = ["#ff00ff", "#ffff00", "#00ffff", "#ff0000"];
		buttonText.setTint(
			Phaser.Display.Color.GetColor(...colors[0].match(/\w\w/g).map((c) => parseInt(c, 16))),
			Phaser.Display.Color.GetColor(...colors[1].match(/\w\w/g).map((c) => parseInt(c, 16))),
			Phaser.Display.Color.GetColor(...colors[2].match(/\w\w/g).map((c) => parseInt(c, 16))),
			Phaser.Display.Color.GetColor(...colors[3].match(/\w\w/g).map((c) => parseInt(c, 16))),
		);

		this.addBears();
	}

	// addScenes() {
	// 	const scale = this.width / 1920;

	// 	// Mountains
	// 	const mountains = this.add.image(0, this.height, "mountains").setOrigin(0, 0).setScale(scale).setDepth(1);
	// 	this.tweens.add({
	// 		targets: mountains,
	// 		y: 0,
	// 		duration: 1000,
	// 		ease: "Sine.easeInOut",
	// 	});

	// }

	addBears() {
		// load the sprites with key orange-poof
		// const frames = this.anims.create({
		// 	key: "yellow-poof",
		// 	frames: this.anims.generateFrameNames("yellow-poof", {
		// 		prefix: "yellow_smoke_puff_",
		// 		suffix: ".png",
		// 		zeroPad: 2,
		// 		start: 1,
		// 		end: 8,
		// 	}),
		// 	frameRate: 12,
		// 	repeat: 0,
		// });
		// // play the sprite one time above bear1
		// const poof = this.add
		// 	.sprite((this.width / 3) * 2, this.height - 120, "yellow-poof")
		// 	.setDepth(10)
		// 	.play("yellow-poof");

		const bear1 = this.add
			.video((this.width / 3) * 2, this.height - 120, "bear1")
			.setDepth(4)
			.setScale(0.009)
			.play(true);

		this.tweens.add({
			targets: bear1,
			scaleX: 0.5,
			scaleY: 0.5,
			ease: "Linear", // 'Cubic', 'Elastic', 'Bounce', 'Back'
			duration: 500,
			yoyo: false,
			repeat: 0,
		});

		const leftBear = this.add
			.video(0, this.height / 3 - 10, "bear2")
			.setDepth(0)
			.setScale(0.5)
			.play(true);

		this.tweens.add({
			targets: leftBear,
			x: this.width / 4 - 30,
			duration: 1500,
			ease: "Sine.easeInOut",
		});

		const topBear = (this.add
			.video((this.width / 4) * 3, 90, "bear3")
			.setDepth(0)
			.setScale(0.9)
			.play(true).rotation = Math.PI);

		// 	this.tweens.add({
		// 		targets: mountains,
		// 		y: 0,
		// 		duration: 1000,
		// 		ease: "Sine.easeInOut",
		// 	});
	}

	scrollPage() {
		// JavaScript to scroll the page
		window.parent.scroll({
			top: 90,
			behavior: "smooth",
		});
	}

	update(time: number, delta: number): void {
		this.orbitingPlanets.forEach(({ planet, distance, speed }) => {
			const timeFactor = time * speed;
			const x = this.width / 2 + distance * Math.cos(timeFactor);
			const y = this.height / 3 - 100 + distance * Math.sin(timeFactor);
			planet.setPosition(x, y);
		});
	}
}
