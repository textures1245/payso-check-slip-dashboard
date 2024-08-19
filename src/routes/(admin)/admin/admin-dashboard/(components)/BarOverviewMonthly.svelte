<script lang="ts">
	import { Bar, Line } from 'svelte-chartjs';
	import { type GCanvasConfig } from '../(mockdata)/graph';
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
		type ChartData,
		BarElement
	} from 'chart.js';
	import { onMount } from 'svelte';
	import type { TransactionCountRecord } from '$lib/utils/external-api-type/adminDashboard';

	export let conf: GCanvasConfig = {
		height: 200
	};

	const d = {
		labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
		datasets: [
			{
				label: '% of Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 134,159,0.4)',
					'rgba(98,  182, 239,0.4)',
					'rgba(255, 218, 128,0.4)',
					'rgba(113, 205, 205,0.4)',
					'rgba(170, 128, 252,0.4)',
					'rgba(255, 177, 101,0.4)'
				],
				borderWidth: 2,
				borderColor: [
					'rgba(255, 134, 159, 1)',
					'rgba(98,  182, 239, 1)',
					'rgba(255, 218, 128, 1)',
					'rgba(113, 205, 205, 1)',
					'rgba(170, 128, 252, 1)',
					'rgba(255, 177, 101, 1)'
				]
			},
			{
				label: '% of Votes',
				data: [20, 15, 7, 20, 6, 8],
				backgroundColor: [
					'rgba(255, 134,159,0.4)',
					'rgba(98,  182, 239,0.4)',
					'rgba(255, 218, 128,0.4)',
					'rgba(113, 205, 205,0.4)',
					'rgba(170, 128, 252,0.4)',
					'rgba(255, 177, 101,0.4)'
				],
				borderWidth: 2,
				borderColor: [
					'rgba(255, 134, 159, 1)',
					'rgba(98,  182, 239, 1)',
					'rgba(255, 218, 128, 1)',
					'rgba(113, 205, 205, 1)',
					'rgba(170, 128, 252, 1)',
					'rgba(255, 177, 101, 1)'
				]
			}
		]
	};

	export let pData: TransactionCountRecord[];
	let dataset: ChartData;

	ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, CategoryScale, ChartDataLabels);

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

<Bar
	data={d}
	height={conf.height}
	options={{
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			datalabels: {
				color: 'white',
				display: function (context) {
					return context.dataset.data[context.dataIndex] > 15;
				},
				font: {
					weight: 'bold'
				},
				formatter: Math.round
			},
		},
		aspectRatio: 5 / 3,
		layout: {
			padding: {
				top: 24,
				right: 16,
				bottom: 0,
				left: 8
			}
		},
		elements: {
			line: {
				fill: false
			},
			point: {
				hoverRadius: 7,
				radius: 5
			}
		},
		scales: {
			x: {
				stacked: true
			},
			y: {
				stacked: true
			}
		}
	}}
/>
