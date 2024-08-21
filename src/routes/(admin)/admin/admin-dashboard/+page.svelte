<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import TopMerchantQuotaSpendingReport from './(components)/TopMerchantQuotaSpendingReport.svelte';
	import DoughnutPackageUsage from './(components)/DoughnutPackageUsage.svelte';
	import LineTransactionDaily from './(components)/LineTransactionDaily.svelte';
	import MerchantQuotaComparisonLineChart from './(components)/MerchantQuotaComparisonLineChart.svelte';
	import InvalidTransactionReport from './(components)/InvalidTransactionReport.svelte';

	import TransactionListTableReport from './(components)/TransactionListTableReport.svelte';
	import MerchantTableReport from './(components)/MerchantTableReport.svelte';
	import type { PageData } from './$types';
	import BarOverviewMonthly from './(components)/BarOverviewMonthly.svelte';
	import Swal from 'sweetalert2';

	export let data: PageData;
</script>

<div class="container space-y-6 mx-auto">
	<div class="grid auto-rows-fr justify-center sm:grid-cols-2 xl:grid-cols-4 gap-4">
		<div
			class="overflow-auto stats stats-vertical justify-center flex flex-col p-4 gap-2 grid-cols-2 shadow"
		>
			<div class="text-center place-self-center">
				<div class=" text-xs md:text-base text-secondary-foreground font-semibold">
					จำนวนแพ็คเกจ
				</div>
				<div class="stat-value text-primary">{data.statData?.PackageStat.Total}</div>
			</div>
			<div class="text-xs stat text-center sm:grid-cols-2 md:text-sm gap-1 grid">
				<div class="">
					<div class=" text-secondary-foreground font-semibold">แพ็คเกจที่ใช้งานอยู่</div>
					<div class="text-center !text-xl text-success font-semibold">
						{data.statData?.PackageStat.ActiveTotal}
					</div>
				</div>
				<div class="">
					<div class=" text-secondary-foreground font-semibold">แพ็คเกจที่ถูกปิด</div>
					<div class="text-center !text-xl text-destructive font-semibold">
						{data.statData?.PackageStat.InActiveTotal}
					</div>
				</div>
			</div>
		</div>
		<div
			class="overflow-auto stats stats-vertical justify-center flex flex-col p-4 gap-2 grid-cols-2 shadow"
		>
			<div class="text-center place-self-center">
				<div class=" text-xs md:text-base text-secondary-foreground font-semibold">จำนวนลูกค้า</div>
				<div class="stat-value text-primary">{data.statData?.MerchantStat.Total}</div>
			</div>
			<div class="text-xs stat text-center sm:grid-cols-2 md:text-sm gap-1 grid">
				<div class="">
					<div class=" text-secondary-foreground font-semibold">ลูกค้า Paysolution</div>
					<div class="text-center !text-xl text-success font-semibold">
						{data.statData?.MerchantStat.PaysoTotal}
					</div>
				</div>
				<div class="">
					<div class=" text-secondary-foreground font-semibold">ลูกค้าทั่วไป</div>
					<div class="text-center !text-xl text-destructive font-semibold">
						{data.statData?.MerchantStat.NonPaysoTotal}
					</div>
				</div>
			</div>
		</div>
		<div class="overflow-auto stats p-4 grid gap-2 grid-cols-2 shadow">
			<div class="text-center place-self-center">
				<div class=" text-xs md:text-base text-secondary-foreground font-semibold">
					จำนวนรายการตรวจสอบ
				</div>
				<div class="stat-value text-primary">{data.statData?.TransactionStat.Total}</div>
			</div>
			<div class="text-xs place-self-center md:text-sm gap-1 ml-auto pl-4 grid">
				<div class="">
					<div class=" text-secondary-foreground font-semibold">รายการที่ถูกต้อง</div>
					<div class=" text-success font-semibold">{data.statData?.TransactionStat.ValidTotal}</div>
				</div>
				<div class="">
					<div class=" text-secondary-foreground font-semibold">รายการที่ถูกปฏิเสธ</div>
					<div class=" text-destructive font-semibold">
						{data.statData?.TransactionStat.InvalidTotal}
					</div>
				</div>
				<div class="">
					<div class=" text-secondary-foreground font-semibold">รายการที่รอดำเนินการ</div>
					<div class=" text-warning font-semibold">
						{data.statData?.TransactionStat.PendingTotal}
					</div>
				</div>
			</div>
		</div>
		<div class=" stats grid gap-2 grid-cols-2 shadow">
			<div class="stat text-center place-self-center">
				<div class=" text-xs md:text-base text-secondary-foreground font-semibold">
					ลูกค้าที่ใช้งานอยู่
				</div>
				<div class="stat-value text-primary">{data.statData?.MerchantStat.ActiveTotal}</div>
			</div>
			<div class="stat text-center mr-auto place-self-center">
				<div class=" text-xs md:text-base text-secondary-foreground font-semibold">
					ถูกปิดการใช้งาน
				</div>
				<div class="stat-value text-destructive">{data.statData?.MerchantStat.InActiveTotal}</div>
			</div>
		</div>
	</div>
	<div id="charts-container" class="text-center *:h-96 items-center gap-4 grid lg:grid-cols-2">
		<div class="card bg-base-100 col-span-full shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">ยอดการใช้งานรายวัน</h1>
			<p class="text-muted-foreground text-sm xl:text-base">ยอดจำนวนโอนล่าสุดภายใน {data.defaultOpt?.dateCountInterval} วัน</p>
			<div id="line-chart-container" class="chart-container">
				<LineTransactionDaily pData={data.transactionDailyCount ?? []}></LineTransactionDaily>
			</div>
		</div>
		<div class="card bg-base-100 col-span-full shadow-md p-4">
			<div class="">
				<h1 class="text-base xl:text-lg font-semibold">
					กราฟเปรียบเทียบโควต้าที่เหลืออยู่ของลูกค้าเทียบกับโควต้าที่ใช้ไป
				</h1>
			</div>
			<div id="line-chart-container" class="chart-container">
				<MerchantQuotaComparisonLineChart
					selectedPkg={data.defaultOpt?.quotaAndMerchantUsagePkgSelect || 1}
					packageOpt={data.formOpt?.packages ?? []}
					pData={data.quotaAndMerchantUsage ?? []}
				></MerchantQuotaComparisonLineChart>
			</div>
		</div>
		<div class="card bg-base-100 shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">อัตราสัดส่วนแพ็คเกจที่ลูกค้าใช้งาน</h1>
			<div class="chart-container">
				<DoughnutPackageUsage pData={data.pkgUsageRatio ?? []}></DoughnutPackageUsage>
			</div>
		</div>
		<div class="card bg-base-100 h-full shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">อัตราสัดส่วนแพ็คเกจที่ลูกค้าใช้งาน</h1>
			<div class="chart-container h-full">
				<BarOverviewMonthly pData={data.monthlyOverview ?? []}></BarOverviewMonthly>
			</div>
		</div>
	</div>
	<div class="grid gap-2 w-full grid-flow-row lg:grid-flow-col lg:grid-cols-3">
		<div class="flex flex-col gap-2 col-span-full lg:col-span-1 flex-wrap">
			<Card.Root class="p-4 ">
				<Card.Title class="my-2">ลูกค้าที่ใช้บริการตรวจสอบมากที่สุด</Card.Title>

				<Card.Content>
					<TopMerchantQuotaSpendingReport props={data.topMerchantQuotaSpendListReport} />
				</Card.Content>
			</Card.Root>
			<Card.Root class="p-4">
				<Card.Title class="my-2">รายการที่ถูกปฏิเสธล่าสุด</Card.Title>

				<Card.Content>
					<InvalidTransactionReport props={data.recentlyInvalidTransListReport} />
				</Card.Content>
			</Card.Root>
		</div>
		<div class="flex gap-2 overflow-auto col-span-full lg:col-span-2 flex-wrap">
			<Card.Root class="p-4 w-full">
				<Card.Title>รายการตรวจสอบล่าสุด</Card.Title>
				<Card.Content>
					<TransactionListTableReport props={data.recentlyTransactionListReport} />
				</Card.Content>
			</Card.Root>
			<Card.Root class="p-4 w-full">
				<Card.Title>ลูกค้าที่สมัครล่าสุด</Card.Title>
				<Card.Content>
					<MerchantTableReport props={data.merchantListReport} />
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>

<style>
	.chart-container {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>
