import Phaser from "phaser";

export default class BearSquare extends Phaser.Scene {
	constructor() {
		super("BearSquare");
		//@ts-ignore
	}

	preload(): void {
		this.load.image("background", "/hero/mountains/01-background.png");

		this.load.video("bear1", "/hero/video-sprites/bear1.webm", true);
		this.load.video("bear2", "/hero/video-sprites/bear2.webm", true);
		this.load.video("bear3", "/hero/video-sprites/bear3.webm", true);
		// Load planets

		for (let i = 1; i <= 10; i++) {
			this.load.image(`planet${i}`, `/hero/mountains/planet-${i}.png`);
		}
	}

	create() {
		const { width, height } = this.sys.game.canvas;
		const scale = width / 1920;

		const background = this.add.image(0, 0, "background").setOrigin(0, 0).setDepth(0);
		// background.setBlendMode(Phaser.BlendModes.ADD);
		// World bounds and physics adjustments
		this.physics.world.setBounds(0, 0, width, height);
		this.physics.world.setBoundsCollision(true, true, true, true);
		// Slow down gravity for the scene
		this.physics.world.gravity.y = 50;

		// Create and adjust bears with proper depth

		const bear1 = this.add
			.video(width / 3, height - 90, "bear1")
			.setDepth(4)
			.setScale(0.4)
			.play(true)
			.setFlipX(true);

		bear1.setBlendMode(Phaser.BlendModes.ADD);

		const planet1: Phaser.GameObjects.Image = this.add
			.image(width / 2, height / 3 - 40, "planet1")
			.setOrigin(0.5, 0.5)
			.setScale(0.5)
			.setDepth(3);
		this.tweens.add({
			targets: planet1,
			angle: "+=360", // Increment the angle by 360 degrees for a full rotation
			duration: 10000, // Duration of the rotation in milliseconds, adjust for speed
			repeat: -1, // Repeat indefinitely for continuous spinning
		});

		const planet2: Phaser.GameObjects.Image = this.add
			.image(width / 2 + 90, height / 3 + 70, "planet2")
			.setOrigin(0.5, 0.5)
			.setScale(0.5)
			.setDepth(3);
		this.tweens.add({
			targets: planet2,
			angle: "+=360", // Increment the angle by 360 degrees for a full rotation
			duration: 10000, // Duration of the rotation in milliseconds, adjust for speed
			repeat: -1, // Repeat indefinitely for continuous spinning
		});
		// planet1.setBlendMode(Phaser.BlendModes.ADD);
		this.physics.add.collider(planet1, planet2);
	}
}
