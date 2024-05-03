import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { Inter } from "next/font/google";
import Footer from "@/app/components/Footer";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

const Page = () => {
	return (
		<div className="">
			<Navbar />
			<div className="flex flex-col  mt-[100px]  mb-5 px-10 text-black">
				<div className="w-full md:w-3/4 text-xl text-end mt-10">
					<p className={inter.className}>Original photographs. Shot in Patagonia. </p>
					<p className={inter.className}>(The mountains, not the clothing brand.)</p>
					<p className={inter.className}>
						Preserved permanently as NFTs using{" "}
						<a className="underline decoration-main" href="https://irys.xyz">
							{" "}
							Irys
						</a>
						.
					</p>
				</div>
				<div className="w-full md:w-3/4 text-xl text-end">
					<p className={inter.className}>
						Minted on{" "}
						<a className="underline decoration-main" href="https://berachain.com">
							{" "}
							Berachain
						</a>
						.
					</p>
					<p className="mt-5 text-2xl">
						by
						<a className="underline decoration-accent" href="https://twitter.com/bearsmountains">
							{" "}
							Mountain Bear
						</a>
					</p>
				</div>
				<div className="w-full md:w-3/4 text-start">
					<h2 className="mt-5">Inspiration</h2>
					<p className={inter.className}>
						I grew up in the mountains of Vermont, a small state in the northeastern United States. Then, I spent close
						to 30 years living in San Francisco, Los Angeles and Bangkok. I was definitely attracted by the energy and
						excitement of the city, and of course that{"'"}s where the jobs were.
					</p>
					<br />
					<p className={inter.className}>
						But, something changed for me during the Covid lockdowns of 2020, and I found myself pulling away from the
						noise and people. I found myself wanting to be somewhere quiet. I{"'"}ve been on a mission since then to
						find the perfect place to live, which is how I found myself spending the beginning of 2024 in the Patagonia
						mountains of Chile and Argentina.
					</p>
					<br />
					<p className={inter.className}>
						I spent my time working during the week, and {'"'}touching grass{'"'} on the weekends. The mountains have a
						calming, psychedelic effect on me. When I sit and look at them, I almost feel I{"'"}m high. I feel like the
						doors of perception open up and a new world invites me in. These NFTs are my attempt to capture that
						feeling, they are both a static image and an psychedelic animation rendered realtime using glsl shaders.
					</p>
					<p className={inter.className}>
						As I was photographing the mountains we were working on adding support for the $BERA token at{" "}
						<Link className="underline decoration-buttonAccent" href="https://www.irys.xyz/">
							Irys
						</Link>{" "}
						... and you know, bears live in mountains, Berachain, mountains, it all felt like meme ... or maybe I was
						just stoned. But, here we are.
					</p>
					<br />
					<p className={inter.className}>
						I designed this website to feel like an art gallery and not a trading platform. The design is sparse and the
						big white walls create room to look at the artwork. I hope you enjoy it.
					</p>
					<h2 className="mt-5">Technology</h2>
					<p className={inter.className}>
						The NFTs, the website UI and all code are fully opensource. For more information:
					</p>
					<div className="ml-5">
						<ul className={inter.className}>
							<li className="list-disc">
								<Link className="underline decoration-buttonAccent" href="https://goto-grok.hashnode.dev/">
									Technical blog
								</Link>
							</li>
							<li className="list-disc">
								<Link
									className="underline decoration-buttonAccent"
									href="https://github.com/lukecd/bears-love-mountains"
								>
									Website Github
								</Link>
							</li>
							<li className="list-disc">
								<Link className="underline decoration-buttonAccent" href="https://github.com/lukecd/irys-nft-toolkit/">
									NFT CLI
								</Link>
							</li>
						</ul>
					</div>
					<h2 className="mt-5">Testnet</h2>
					<p className={inter.className}>
						These NFTs live on the{" "}
						<Link className="underline decoration-buttonAccent" href="https://berachain.com/">
							Berachain testnet,
						</Link>{" "}
						and can be bought using $BERA available for free from the{" "}
						<Link className="underline decoration-buttonAccent" href="https://artio.faucet.berachain.com/">
							Berachain faucet
						</Link>
						{". "}
						Anyone who buys or sells an NFT during the testnet phase will be whitelisted for the mainnet presale.
					</p>
					<h2 className="mt-5">Contract</h2>
					<p className={inter.className}>Contract address: {process.env.NEXT_PUBLIC_NFT_CONTRACT}</p>
				</div>{" "}
			</div>
			<Footer />
		</div>
	);
};

export default Page;
