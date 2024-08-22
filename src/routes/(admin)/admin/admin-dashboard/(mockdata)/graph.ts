import type { ChartConfiguration, ChartDataset } from 'chart.js';

export type GCanvasConfig = {
	height: number;
};

export const packageUsage: ChartConfiguration['data'] = {
	datasets: [
		{
			data: [40, 50, 80, 30, 100],
			backgroundColor: [
				'rgba(247, 70, 74, 0.9)',
				'rgba(70, 191, 189, 0.9)',
				'rgba(253, 180, 92, 0.9)',
				'rgba(148, 159, 177, 0.9)',
				'rgba(77, 83, 96, 0.9)'
			],
			label: 'My dataset' // for legend
		}
	],
	labels: ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey']
};

export const transactionDaily = {
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
			data: [65, 59, 80, 81, 56, 55, 40],
			datalabels: {
				align: 'end',
				anchor: 'end'
			},
			borderRadius: 100
		} as ChartDataset
	]
};

export const merchantQuotaComparisonDataset = {
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	datasets: [
		{
			label: 'จำนวน Merchant ที่ใช้ Quota ในแต่ละเดือน',
			fill: 'false',
			lineTension: 0.1,
			backgroundColor: 'rgb(255, 99, 132, 0.5)',
			borderColor: 'rgb(205, 130, 158)',
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: 'rgb(205, 130,1 58)',
			pointBackgroundColor: 'rgb(255, 255, 255)',
			pointBorderWidth: 3,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: 'rgb(0, 0, 0)',
			pointHoverBorderColor: 'rgba(220, 220, 220,1)',
			pointHoverBoqrderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 10,
			borderRadius: 100,
			data: [65, 59, 80, 81, 56, 55, 40],
			datalabels: {
				align: 'center',
				anchor: 'start'
			}
		} as ChartDataset,
		{
			label: 'Quota ที่ใช้ได้ในแต่ละเดือน',
			data: [90, 200, 150, 1000, 400, 500, 600],
			fill: '-1',
			borderColor: 'rgb(75, 192, 192)',
			backgroundColor: 'rgba(75, 200, 192, 0.1)',
			borderCapStyle: 'butt',
			tension: 0.1,
			borderJoinStyle: 'miter',
			pointBorderColor: 'rgb(205, 130,1 58)',
			pointBackgroundColor: 'rgb(255, 255, 255)',
			pointBorderWidth: 3,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: 'rgb(0, 0, 0)',
			pointHoverBorderColor: 'rgba(220, 220, 220,1)',
			pointHoverBorderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 10,
			borderRadius: 100,
			datalabels: {
				align: 'end',
				anchor: 'end'
			}
		} as ChartDataset
	]
};
