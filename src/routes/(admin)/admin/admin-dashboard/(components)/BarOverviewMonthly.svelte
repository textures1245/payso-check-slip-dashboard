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
	import type {
		MerchantTransactionMonthly,
		TransactionCountRecord
	} from '$lib/utils/external-api-type/adminDashboard';
	import { enhance } from '$app/forms';
	import Swal from 'sweetalert2';

	export let conf: GCanvasConfig = {
		height: 200
	};

	export let pData: MerchantTransactionMonthly[];
	let form: HTMLFormElement;
	let chart: ChartJS;

	let opt = {
		ALL: 'ทั้งหมด',
		NEW_REGISTER: 'ลูกค้าใหม่',
		TRANSACTION_COUNT: 'จำนวนสลิปที่ตรวจสอบ',
		VALID_TRANSACTION_COUNT: 'สลิปถูกต้อง',
		INVALID_TRANSACTION_COUNT: 'สลิปถูกปฏิเสธ',
		PENDING_TRANSACTION_COUNT: 'สลิปที่ดำเนินการ'
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

	function getRandomColor(tone = 1) {
		const r = Math.floor(Math.random() * 30 * tone);
		const g = Math.floor(Math.random() * 30 * tone);
		const b = Math.floor(Math.random() * 225);
		return { r, g, b };
	}

	function generateColors(dataSize: number, tone = 1) {
		let bgColor = [];
		let brColor = [];

		for (let i = 0; i < dataSize; i++) {
			const { r, g, b } = getRandomColor(tone);
			bgColor.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
			brColor.push(`rgba(${r}, ${g}, ${b}, 1)`);
		}

		return { bgColor, brColor };
	}

	function updateDataset(args: MerchantTransactionMonthly[]) {
		let labels: string[] = [];
		let merchantRegisterData: number[] = [];
		let transTotal: number[] = [];
		let invalidTransTotal: number[] = [];
		let pendingTransTotal: number[] = [];
		let validTransTotal: number[] = [];

		args.forEach(({ Merchant, Transaction, Month, Year }) => {
			labels.push(getMonthName('th', +Month));
			merchantRegisterData.push(Merchant.RegisterTotal);
			transTotal.push(Transaction.TotalCount);
			invalidTransTotal.push(Transaction.InvalidCount);
			pendingTransTotal.push(Transaction.PendingCount);
			validTransTotal.push(Transaction.ValidCount);
		});

		const dataset = {
			labels,
			datasets: [
				{
					label: 'ลูกค้าใหม่',
					data: merchantRegisterData,
					backgroundColor: 'rgba(61, 194, 236, 0.4)',
					borderWidth: 2,
					borderColor: 'rgba(61, 194, 236, 1)',
					stack: 'Stack 0'
				},
				{
					label: 'จำนวนสลิปที่ตรวจสอบ',
					data: transTotal,
					backgroundColor: 'rgba(75, 112, 245, 0.6)',
					borderWidth: 2,
					borderColor: 'rgb(75, 112, 245)',
					stack: 'Stack 0'
				},
				{
					label: 'สลิปที่ถูกต้อง',
					data: validTransTotal,
					backgroundColor: 'rgba(65, 176, 110, 0.6)',
					borderWidth: 2,
					borderColor: 'rgb(65, 176, 110)',
					stack: 'Stack 1'
				},
				{
					label: 'สลิปที่ไม่ถูกต้อง',
					data: invalidTransTotal,
					backgroundColor: 'rgba(205, 24, 24, 0.6)',
					borderWidth: 2,
					borderColor: 'rgb(205, 24, 24)',
					stack: 'Stack 1'
				},
				{
					label: 'สลิปที่ดำเนินการ',
					data: pendingTransTotal,
					backgroundColor: 'rgba(243, 149, 13, 0.6)',
					borderWidth: 2,
					borderColor: 'rgb(243, 149, 13)',
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
			case 'INVALID_TRANSACTION_COUNT':
				return {
					...dat,
					datasets: dat.datasets.filter((d) => d.label === 'สลิปที่ไม่ถูกต้อง')
				};
			case 'NEW_REGISTER':
				return {
					...dat,
					datasets: dat.datasets.filter((d) => d.label === 'ลูกค้าใหม่')
				};

			case 'PENDING_TRANSACTION_COUNT':
				return {
					...dat,
					datasets: dat.datasets.filter((d) => d.label === 'สลิปที่ดำเนินการ')
				};

			case 'TRANSACTION_COUNT':
				return {
					...dat,
					datasets: dat.datasets.filter((d) => d.label === 'จำนวนสลิปที่ตรวจสอบ')
				};
			case 'VALID_TRANSACTION_COUNT':
				return {
					...dat,
					datasets: dat.datasets.filter((d) => d.label === 'สลิปที่ถูกต้อง')
				};
		}
	}

	let defaultDataset = updateDataset(pData);
	$: dataset = onFilterDataset(defaultDataset, optSelected);
</script>

<div class="relative h-[18rem]">
	<div class="form-control items-end">
		<form
			bind:this={form}
			method="POST"
			action="?/updateQuotaAndMerchantUsage"
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
						dataset = updateDataset(result.data.updateQuotaAndMerchantUsage);
						chart.update();
					}
				};
			}}
		>
			<select
				bind:value={optSelected}
				on:change={(v) => {
					dataset = onFilterDataset(defaultDataset, optSelected);
					chart.update();
				}}
				name="pkgIdSelected"
				class="select select-sm select-bordered w-full max-w-md"
			>
				{#each Object.keys(opt) as optKey}
					<option value={optKey} selected={optKey === optSelected}>{opt[optKey]}</option>
				{/each}
			</select>
		</form>
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
