<script lang="ts">
	import { Doughnut } from 'svelte-chartjs';

	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import { packageUsage } from '../(mockdata)/graph';
	import type { GCanvasConfig } from '../(mockdata)/graph';
	import ChartDataLabels from 'chartjs-plugin-datalabels';

	export let conf: GCanvasConfig = {
		height: 260
	};

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, ChartDataLabels);
</script>

<Doughnut
	data={packageUsage}
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
					return value > count * 1.5;
				},
				font: {
					weight: 'bold'
				},
				padding: 6,
				formatter: Math.round
			}
		}
	}}
/>
