<script lang="ts">
	import { Doughnut } from 'svelte-chartjs';

	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import { packageUsage } from '../(mockdata)/graph';
	import type { GCanvasConfig } from '../(mockdata)/graph';

	export let conf: GCanvasConfig = {
		height: 275,
		width: 100
	};

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>

<Doughnut
	data={packageUsage}
	width={conf.width}
	height={conf.height}
    options={{ maintainAspectRatio: false }}
/>
