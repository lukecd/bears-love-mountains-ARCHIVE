import React from "react";

const Quote = () => {
	return (
		<div className="flex items-center justify-center bg-sunsetLight w-full p-5">
			<blockquote className="text-end leading-none">
				<p className="mb-4 text-3xl leading-none">In the mountain mist,</p>
				<p className="mb-4 text-3xl leading-none">Bear inhales nature{"'"}s calm breeze,</p>
				<p className="mb-4 text-3xl leading-none">Peace in every puff</p>
				<footer>
					-{" "}
					<a
						href="https://twitter.com/bearsmountains"
						className="text-black hover:text-blue-700 underline leading-none"
					>
						Mountain Bear
					</a>
				</footer>
			</blockquote>
		</div>
	);
};

export default Quote;
