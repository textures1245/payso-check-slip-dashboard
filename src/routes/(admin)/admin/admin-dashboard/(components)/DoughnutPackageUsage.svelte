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
	import { packageUsage } from '../(mockdata)/graph';
	import type { GCanvasConfig } from '../(mockdata)/graph';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import type { PackageUsage } from '$lib/utils/external-api-type/adminDashboard';
	import { onMount } from 'svelte';
	import type { Package } from '$lib/utils/external-api-type/package';
	import { enhance } from '$app/forms';
	import Swal from 'sweetalert2';

	export let conf: GCanvasConfig = {
		height: 260
	};
	export let pData: PackageUsage[];

	let dataset: ChartData;

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, ChartDataLabels);

	const maxCountUsed = Math.max(...pData.map((d) => d.CountUsed));

	let labels: string[] = [];
	let data: number[] = [];

	let backgroundColor: string[] = [];

	const baseColor = { r: 36, g: 99, b: 225 }; // Base color (blue)

	pData.forEach(({ PackageName, CountUsed }) => {
		labels.push(PackageName);
		data.push(CountUsed);

		const intensity = Math.floor((CountUsed / maxCountUsed) * 255);
		const color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${intensity / 255}`;
		backgroundColor.push(color);
	});
	dataset = {
		labels,
		datasets: [
			{
				data,
				backgroundColor
			}
		]
	};
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
					return true;
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
