// components/BurnMintButtons.tsx

interface BurnMintButtonsProps {
	onBurn: () => void;
	onMint: () => void;
}

const BurnMintButtons: React.FC<BurnMintButtonsProps> = ({ onBurn, onMint }) => {
	return (
		<div className="flex justify-end space-x-4 mt-5">
			<div
				className="row-span-1 col-span-2 bg-bentoColor4 flex items-center justify-center text-2xl p-4 cursor-pointer hover:scale-105"
				onClick={onBurn}
			>
				Burn
			</div>
			<div
				className="row-span-1 col-span-2 bg-bentoColor4 flex items-center justify-center text-2xl p-4 cursor-pointer hover:scale-105"
				onClick={onMint}
			>
				Mint
			</div>
		</div>
	);
};

export default BurnMintButtons;
