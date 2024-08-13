export type GCanvasConfig = {
	height: number;
	width: number;
};

export const packageUsage = {
	labels: ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'],
	datasets: [
		{
			data: [300, 50, 100, 40, 120],
			backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
			hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774']
		}
	]
};

export const transactionDaily = {
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	datasets: [
		{
			label: 'My First dataset',
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
			data: [65, 59, 80, 81, 56, 55, 40]
		}
	]
};
