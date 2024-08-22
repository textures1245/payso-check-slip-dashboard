<!-- <script lang="ts">
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

	export let conf: GCanvasConfig = {
		height: 260
	};

	var DATA_COUNT = 10;
	var labels = [];

	Utils.srand(4);

	for (var i = 0; i < DATA_COUNT; ++i) {
		labels.push('' + i);
	}

	const multiSeries = {
		labels: labels,
		datasets: [
			{
				backgroundColor: Utils.colors({
					color: Utils.colors(0),
					count: DATA_COUNT
				}),
				data: Utils.numbers({
					count: DATA_COUNT,
					min: 0,
					max: 100
				}),
				datalabels: {
					anchor: 'end'
				}
			},
			{
				backgroundColor: Utils.colors({
					color: Utils.colors(1),
					count: DATA_COUNT
				}),
				data: Utils.numbers({
					count: DATA_COUNT,
					min: 0,
					max: 100
				}),
				datalabels: {
					anchor: 'center',
					backgroundColor: null,
					borderWidth: 0
				}
			},
			{
				backgroundColor: Utils.colors({
					color: Utils.colors(2),
					count: DATA_COUNT
				}),
				data: Utils.numbers({
					count: DATA_COUNT,
					min: 0,
					max: 100
				}),
				datalabels: {
					anchor: 'start'
				}
			}
		]
	};

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, ChartDataLabels);
</script>

<Doughnut
	data={multiSeries}
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
		},

		// Core options
		aspectRatio: 4 / 3,
		cutoutPercentage: 32,
		layout: {
			padding: 32
		},
		elements: {
			line: {
				fill: false
			},
			point: {
				hoverRadius: 7,
				radius: 5
			}
		}
	}}
/> -->
