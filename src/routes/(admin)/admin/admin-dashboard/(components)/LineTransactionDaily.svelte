<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import { transactionDaily, type GCanvasConfig } from '../(mockdata)/graph';
	import ChartDataLabels from 'chartjs-plugin-datalabels';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		type ChartDataset,
		type ChartData
	} from 'chart.js';
	import { onMount } from 'svelte';
	import type { TransactionCountRecord } from '$lib/utils/external-api-type/adminDashboard';

	export let conf: GCanvasConfig = {
		height: 200
	};

	export let pData: TransactionCountRecord[];
	let dataset: ChartData;

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		ChartDataLabels
	);


	let labels: string[] = [];
	let data: number[] = [];

	pData.forEach((d) => {
		labels.push(new Date(d.Date).toLocaleDateString('en-EN'));
		data.push(d.RecordCount);
	});
	dataset = {
		labels,
		datasets: [
			{
				label: 'ยอดการตรวจสอบรายวัน',
				fill: true,
				lineTension: 0.1,
				backgroundColor: 'rgba(225, 204,230, .3)',
				borderColor: 'rgb(205, 130, 158)',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgb(205, 130,1 58)',
				pointBackgroundColor: 'rgb(255, 255, 255)',
				pointBorderWidth: 5,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgb(0, 0, 0)',
				pointHoverBorderColor: 'rgba(220, 220, 220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data,
				datalabels: {
					align: 'end',
					anchor: 'end'
				},
				borderRadius: 100
			} as ChartDataset
		]
	};
</script>

<Line
	data={dataset ?? { labels: [], datasets: [] }}
	height={conf.height}
	options={{
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			datalabels: {
				backgroundColor: function (context) {
					return context.dataset.borderColor;
				},
				borderRadius: 4,
				color: 'white',
				font: {
					weight: 'bold',
					size: 8
				},
				formatter: Math.round,
				padding: 3
			},
			aspectRatio: 5 / 3,
			layout: {
				padding: {
					top: 32,
					right: 16,
					bottom: 16,
					left: 8
				}
			},
			elements: {
				line: {
					fill: false,
					tension: 0.4
				}
			},
			scales: {
				y: {
					stacked: true
				}
			}
		}
	}}
/>
