<script lang="ts">
	import { Bar } from 'svelte-chartjs';
	import { type GCanvasConfig } from '../(mockdata)/graph';
	import ChartDataLabels from 'chartjs-plugin-datalabels';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LinearScale,
		CategoryScale,
		type ChartData,
		BarElement
	} from 'chart.js';
	import type { ReceiptStat } from '$lib/utils/external-api-type/adminDashboard';
	import { enhance } from '$app/forms';
	import Swal from 'sweetalert2';

	export let conf: GCanvasConfig = {
		height: 200
	};

	export let pData: ReceiptStat[];
	export let defaultOpt: {
		startDate: string;
		endDate: string;
	};

	let form: HTMLFormElement;
	let chart: ChartJS;

	let opt = {
		ALL: 'ทั้งหมด',
		PACKAGE_INCOME: 'รายได้จากแพ็คเก็จ'
	};
	let optSelected: keyof typeof opt = 'ALL';

	ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, CategoryScale, ChartDataLabels);

	function getMonthName(monthLang: 'en' | 'th', monthNumber: number) {
		const m = {
			en: [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			],
			th: [
				'มกราคม', // January
				'กุมภาพันธ์', // February
				'มีนาคม', // March
				'เมษายน', // April
				'พฤษภาคม', // May
				'มิถุนายน', // June
				'กรกฎาคม', // July
				'สิงหาคม', // August
				'กันยายน', // September
				'ตุลาคม', // October
				'พฤศจิกายน', // November
				'ธันวาคม' // December
			]
		};
		return m[monthLang][monthNumber - 1];
	}

	function updateDataset(args: ReceiptStat[]) {
		let labels: string[] = [];
		let pkgIncomeTotal: number[] = [];

		args.forEach(({ TotalCount, TotalAmountFromPackage, Month, Year }) => {
			labels.push(getMonthName('th', +Month));
			pkgIncomeTotal.push(TotalAmountFromPackage);
		});

		const dataset = {
			labels,
			datasets: [
				{
					label: 'รายได้จากแพ็คเก็จ',
					data: pkgIncomeTotal,
					backgroundColor: 'rgba(75, 112, 245, 0.6)',
					borderWidth: 2,
					borderColor: 'rgb(75, 112, 245)',
					stack: 'Stack 1'
				}
			]
		};
		return dataset;
	}

	function onFilterDataset(dat: ChartData, filterBy: keyof typeof opt): ChartData {
		switch (filterBy) {
			case 'ALL':
				return dat;
			case 'PACKAGE_INCOME':
				return {
					...dat,
					datasets: dat.datasets.filter((d) => d.label === 'รายได้จากแพ็คเก็จ')
				};
		}
	}

	let defaultDataset = updateDataset(pData);
	$: dataset = onFilterDataset(defaultDataset, optSelected);

</script>

<div class="relative h-64">
	<div class="flex flex-col lg:flex-row items-center lg:items-end justify-between">
		<!-- <label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text-alt">ตัวเลือก</span>
			</div>
			<select
				bind:value={optSelected}
				on:change={(v) => {
					dataset = onFilterDataset(defaultDataset, optSelected);
					chart.update();
				}}
				class="select select-xs select-bordered w-full max-w-xs"
			>
				{#each Object.keys(opt) as optKey}
					<option value={optKey} selected={optKey === optSelected}>{opt[optKey]}</option>
				{/each}
			</select>
		</label> -->
		<div class="form-control items-end">
			<form
				bind:this={form}
				method="POST"
				action="?/updateReceiptIncomeOverview"
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
							dataset = updateDataset(result.data.updateReceiptIncomeOverview);
							chart.update();
						}
					};
				}}
			>
				<div class="flex gap-4">
					<label class="form-control w-full max-w-xs">
						<div class="label">
							<span class="label-text-alt">เดือนเริ่มต้น</span>
						</div>
						<input
							value={defaultOpt.startDate}
							required
							name="startDate"
							type="month"
							class="input input-xs input-bordered w-full max-w-xs"
						/>
					</label>
					<label class="form-control w-full max-w-xs">
						<div class="label">
							<span class="label-text-alt">เดือนสิ้นสุด</span>
						</div>
						<input
							value={defaultOpt.endDate}
							required
							name="endDate"
							type="month"
							class="input input-xs input-bordered w-full max-w-xs"
						/>
					</label>
					<label class="max-w-xs self-end">
						<button class="btn bg-primary text-primary-content btn-xs hover:bg-[#050680]" type="submit">ค้นหา</button>
					</label>
				</div>
			</form>
		</div>
	</div>
	<Bar
		bind:chart
		data={dataset}
		height={conf.height}
		options={{
			maintainAspectRatio: false,
			responsive: true,
			plugins: {
				datalabels: {
					color: 'white',
					display: function (context) {
						return context.dataset.data[context.dataIndex] > 0;
					},
					font: {
						weight: 'bold'
					},
					formatter: Math.round
				}
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
</div>
