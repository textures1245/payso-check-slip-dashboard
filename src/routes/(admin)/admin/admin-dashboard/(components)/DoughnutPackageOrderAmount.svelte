<script lang="ts">
	import { Doughnut } from 'svelte-chartjs';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		type ChartData
	} from 'chart.js';
	import type { GCanvasConfig } from '../(mockdata)/graph';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import type { PackageUsage } from '$lib/utils/external-api-type/adminDashboard';

	export let conf: GCanvasConfig = {
		height: 260
	};
	export let pData: PackageUsage[];

	let dataset: ChartData;

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, ChartDataLabels);

	function getRandomColor() {
		const r = Math.floor(Math.random() * 200);
		const g = Math.floor(Math.random() * 200);
		const b = Math.floor(Math.random() * 200);
		return { r, g, b };
	}

	function updateDataset<T extends PackageUsage>(pData: T[]): any {
		const maxCountUsed = Math.max(...pData.map((d) => d.CountUsed));

		let labels: string[] = [];
		let data: number[] = [];

		let backgroundColor: string[] = [];

		const baseColor = { r: 36, g: 99, b: 225 }; // Base color (blue)
		pData.forEach(({ PackageName, OrderAmount }) => {
			labels.push(PackageName);
			data.push(OrderAmount);

			const { r, g, b } = getRandomColor();

			const intensity = Math.floor((OrderAmount / maxCountUsed) * 255) + 80;
			const color = `rgba(${r}, ${g}, ${b}, ${intensity / 255}`;
			backgroundColor.push(color);
		});
		return {
			labels,
			datasets: [
				{
					data,
					backgroundColor
				}
			]
		};
	}

	dataset = updateDataset(pData.filter((d) => d.CountUsed > 0));
</script>

<Doughnut
	data={dataset}
	height={conf.height}
	options={{
		maintainAspectRatio: false,
		plugins: {
			datalabels: {
				backgroundColor: function (context) {
					return context.dataset.backgroundColor;
				},
				borderColor: 'white',
				borderRadius: 25,
				borderWidth: 2,
				color: 'white',
				display: function (context) {
					var dataset = context.dataset;
					var count = dataset.data.length;
					var value = dataset.data[context.dataIndex];
					return value;
				},
				font: {
					weight: 'bold'
				},
				padding: 4,
				formatter: Math.round
			}
		}
	}}
/>
