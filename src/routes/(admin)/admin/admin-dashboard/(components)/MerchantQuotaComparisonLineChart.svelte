<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import { merchantQuotaComparisonDataset, type GCanvasConfig } from '../(mockdata)/graph';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
        Filler
	} from 'chart.js';

	export let conf: GCanvasConfig = {
		height: 200
	};

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);
</script>

<Line
	data={merchantQuotaComparisonDataset}
	height={conf.height}
	options={{ maintainAspectRatio: false, responsive: true }}
/>
