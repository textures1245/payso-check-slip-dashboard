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
	import type { TransactionCountRecord } from '$lib/utils/external-api-type/adminDashboard';
	import { enhance } from '$app/forms';
	import Swal from 'sweetalert2';

	export let conf: GCanvasConfig = {
		height: 200
	};

	export let pData: TransactionCountRecord[];
	export let defaultOpt: {
		startDate: string;
		endDate: string;
	};

	let form: HTMLFormElement;
	let chart: ChartJS;

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

	function updateDataset(pd: TransactionCountRecord[]) {
		let labels: string[] = [];
		let data: number[] = [];

		pd.forEach((d) => {
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
		return dataset;
	}

	$: dataset = updateDataset(pData);
</script>

<div class="relative h-64">
	<div class="form-control items-start">
		<form
			bind:this={form}
			method="POST"
			action="?/updateTransactionDailyCount"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'failure') {
						Swal.fire(
							'เกิดข้อผิดพลาด',
							result.data?.message || 'เกิดข้อผิดพลาดในการทำรายการ',
							'error'
						);
					}

					if (result.type === 'success') {
						// @ts-ignore
						dataset = updateDataset(result.data.updateTransactionDailyCount);
						chart.update();
					}
				};
			}}
		>
			<div class="flex gap-4">
				<label class="form-control w-full max-w-xs  ">
					<div class="label">
						<span class="label-text-alt">วันที่เริ่ม</span>
					</div>
					<input
						value={defaultOpt.startDate}
						required
						name="startDate"
						type="date"
						class="input input-xs input-bordered w-full max-w-xs"
					/>
				</label>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text-alt">วันที่จบ</span>
					</div>
					<input
						value={defaultOpt.endDate}
						required
						name="endDate"
						type="date"
						class="input input-xs input-bordered w-full max-w-xs"
					/>
				</label>
				<label class="max-w-xs self-end">
					<button class="btn bg-primary text-primary-content btn-xs hover:bg-[#050680]" type="submit">ค้นหา</button>
				</label>
			</div>
		</form>
	</div>
	<div class="relative h-full w-full">
		<Line
			bind:chart
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
	</div>
</div>
