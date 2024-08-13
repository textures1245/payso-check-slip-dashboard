<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import { transactionDaily, type GCanvasConfig } from '../(mockdata)/graph';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';

	export let conf: GCanvasConfig = {
		height: 50,
		width: 100
	};

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);
</script>

<Line
	data={transactionDaily}
	width={conf.width}
	height={conf.height}
	options={{ maintainAspectRatio: false, responsive: true }}
/>
