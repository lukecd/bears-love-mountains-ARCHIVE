import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface PriceData {
	mintBurn: number;
	price: number;
}

interface PriceGraphProps {
	data: PriceData[];
}

const PriceGraph: React.FC<PriceGraphProps> = ({ data }) => {
	const chartRef = useRef<Chart>();

	useEffect(() => {
		if (chartRef.current) {
			// Update existing chart with new data
			chartRef.current.data.labels = data.map((row) => row.mintBurn);
			chartRef.current.data.datasets[0].data = data.map((row) => row.price);
			chartRef.current.update();
		} else {
			// Create new chart
			const chartData = {
				labels: data.map((row) => row.mintBurn),
				datasets: [
					{
						label: "Price",
						backgroundColor: "#fbe134",
						borderColor: "#fbe134",
						data: data.map((row) => row.price),
					},
				],
			};

			const ctx = document.getElementById("burnMintGraph") as HTMLCanvasElement;

			if (ctx) {
				chartRef.current = new Chart(ctx, {
					type: "line",
					data: chartData,
					options: {
						scales: {
							x: {
								type: "linear",
								min: 1,
								max: 100,
							},
							y: {
								type: "linear",
								min: 0,
								max: 20,
							},
						},
						plugins: {
							legend: {
								display: true,
								labels: {
									color: "#FFFFFF", // Legend color
								},
							},
						},
						elements: {
							point: {
								backgroundColor: "#fbe134", // Point color
								borderColor: "#fbe134", // Point border color
							},
							line: {
								backgroundColor: "#fbe134", // Line fill color
								borderColor: "#fbe134", // Line border color
							},
						},
					},
				});
			}
		}
	}, [data]);

	return (
		<div id="chart-container" className="w-[400px] h-[400px]">
			<canvas width={400} height={400} id="burnMintGraph"></canvas>
		</div>
	);
};

export default PriceGraph;
