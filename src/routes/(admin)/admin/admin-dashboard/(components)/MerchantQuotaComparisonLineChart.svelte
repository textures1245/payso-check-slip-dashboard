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
		Filler,
		type ChartDataset
	} from 'chart.js';
	import type { QuotaAndMerchantUsage } from '$lib/utils/external-api-type/adminDashboard';
	import { enhance } from '$app/forms';
	import Swal from 'sweetalert2';
	import type { Package } from '$lib/utils/external-api-type/package';

	export let conf: GCanvasConfig = {
		height: 200
	};

	export let pData: QuotaAndMerchantUsage[];
	export let packageOpt: Package[];
	export let selectedPkg: number;

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
		Filler
	);

	function updateDataset(pd: QuotaAndMerchantUsage[]) {
		let mLabels: string[] = [];
		let mData: number[] = [];
		let pkgLabels: string[] = [];
		let pkgData: number[] = [];

		pd.forEach(
			({
				MerchantId,
				MerchantName,
				MerchantRole,
				QuotaUsage,
				PackageName,
				PackagePrice,
				PackageQuotaLimit
			}) => {
				let calcMerchantQuotaUsageCount =  PackageQuotaLimit - QuotaUsage;

				mLabels.push(`${MerchantId} - ${MerchantName}`);
				mData.push(calcMerchantQuotaUsageCount);
				pkgLabels.push(`${PackageName} - ฿${PackagePrice}`);
				pkgData.push(PackageQuotaLimit);
			}
		);

		const dataset = {
			labels: mLabels,
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
					data: mData,
					datalabels: {
						align: 'center',
						anchor: 'start'
					}
				} as ChartDataset,
				{
					label: 'Quota ที่ใช้ได้ในแต่ละเดือน',
					data: pkgData,
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
		return dataset;
	}

	$: dataset = updateDataset(pData);
</script>

<div class="relative">
	<div class="form-control items-center">
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
				on:change={() => {
					form.requestSubmit();
				}}
				name="pkgIdSelected"
				class="select select-xs select-bordered w-full max-w-xs"
			>
				{#if packageOpt}
					{#each packageOpt as pkg}
						<option value={pkg.Id} selected={pkg.Id === selectedPkg}>{pkg.Name}</option>
					{/each}
				{/if}
			</select>
		</form>
	</div>

	<div class="relative h-[18.5rem] md:h-[19rem]">
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
