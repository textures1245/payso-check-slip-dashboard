<script lang="ts">
	import MerchantPackageComparison from './(components)/MerchantPackageComparison.svelte';
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
	import BarIncomeOverview from './(components)/BarIncomeOverview.svelte';
	import DoughnutPackageOrderAmount from './(components)/DoughnutPackageOrderAmount.svelte';

	export let data: PageData;
</script>

<div class="container space-y-6 mx-auto">
	<span
		class="text-3xl font-bold text-primary flex lg:justify-start md:justify-start sm:justify-center justify-center"
		><span class="drop-shadow-md">Dashboard</span></span
	>

	<div class="grid auto-rows-fr justify-center sm:grid-cols-2 xl:grid-cols-4 gap-4">
		{#if data.receiptIncomeOverview}
			{@const currentMonth = Math.max(...data.receiptIncomeOverview.map((item) => +item.Month))}
			{@const currentIncome =
				data.receiptIncomeOverview
					.filter((d) => +d.Month == currentMonth)
					.reduce((acc, curr) => acc + curr.TotalAmountFromPackage, 0) ?? 0}
			{@const previousIncome =
				data.receiptIncomeOverview
					.filter((d) => +d.Month == currentMonth - 1)
					.reduce((acc, curr) => acc + curr.TotalAmountFromPackage, 0) ?? 0}
			<div
				class="overflow-auto stats stats-vertical justify-center flex flex-col p-4 gap-2 grid-cols-2 col-span-full shadow"
			>
				<div class="text-center place-self-center">
					<div class=" text-lg md:text-base text-secondary-foreground font-semibold">
						รายได้เดือนนี้
					</div>
					<div class="stat-value text-primary">
						{currentIncome} ฿
					</div>
				</div>
				<div class="text-xs stat text-center sm:grid-cols-2 md:text-sm gap-1 grid">
					<div class="">
						<div class=" text-secondary-foreground font-semibold">รายได้เดือนก่อนหน้านั้น</div>
						<div
							
							
							class="text-center text-warning !text-xl font-semibold"
						>
							{previousIncome} ฿
						</div>
					</div>
					<div class="">
						<div class=" text-secondary-foreground font-semibold">
							{currentIncome > previousIncome ? 'มากกว่าเดือนที่แล้ว' : 'น้อยกว่าเดือนที่แล้ว'}
						</div>
						<div
							class:text-destructive={currentIncome < previousIncome}
							class:text-success={currentIncome > previousIncome}
							class="text-center !text-xl text-destructive font-semibold"
						>
							{#if previousIncome !== 0}
								{(((currentIncome - previousIncome) / previousIncome) * 100).toFixed(2)}%
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
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
		<div class="overflow-auto stats p-4 grid gap-2 grid-cols-2 shadow">
			<div class="text-center place-self-center">
				<div class=" text-xs md:text-base text-secondary-foreground font-semibold">
					จำนวนรายการตรวจสอบ
				</div>
				<div class="stat-value text-primary">{data.statData?.TransactionStat.Total}</div>
			</div>
			<div class="text-xs place-self-center md:text-sm gap-1 ml-auto pl-4 grid">
				<div class="">
					<div class=" text-secondary-foreground font-semibold">รายการถูกต้อง</div>
					<div class=" text-success font-semibold">{data.statData?.TransactionStat.ValidTotal}</div>
				</div>
				<div class="">
					<div class=" text-secondary-foreground font-semibold">รายการถูกปฏิเสธ</div>
					<div class=" text-destructive font-semibold">
						{data.statData?.TransactionStat.InvalidTotal}
					</div>
				</div>
				<div class="">
					<div class=" text-secondary-foreground font-semibold">รายการรอดำเนินการ</div>
					<div class=" text-warning font-semibold">
						{data.statData?.TransactionStat.PendingTotal}
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
	<div id="charts-container" class="text-center *:h-[26rem] items-center gap-4 grid lg:grid-cols-2">
		<div class="card bg-base-100 col-span-full shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">ยอดการใช้งานรายวัน</h1>
			<div class="chart-container" id="line-chart-container">
				<LineTransactionDaily
					defaultOpt={data.defaultOpt?.dailyTrans}
					pData={data.transactionDailyCount ?? []}
				></LineTransactionDaily>
			</div>
		</div>
		<div class="card bg-base-100 col-span-full shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">สถิติรายได้แบบรายเดือน (บาท)</h1>
			<div class="chart-container" id="line-chart-container">
				<BarIncomeOverview
					defaultOpt={data.defaultOpt?.receiptIncome}
					pData={data.receiptIncomeOverview ?? []}
				></BarIncomeOverview>
			</div>
		</div>
		<!-- <div class="card bg-base-100 col-span-full shadow-md p-4">
			<div id="line-chart-container" class="chart-container">
				<MerchantQuotaComparisonLineChart
					selectedPkg={data.defaultOpt?.quotaAndMerchantUsagePkgSelect || 1}
					packageOpt={data.formOpt?.packages ?? []}
					pData={data.quotaAndMerchantUsage ?? []}
				></MerchantQuotaComparisonLineChart>
			</div>
		</div> -->
		<div class="card bg-base-100 col-span-full h-full shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">สถิติโดยรวมแบบรายเดือน</h1>
			<div class="chart-container h-full">
				<BarOverviewMonthly pData={data.monthlyOverview ?? []}></BarOverviewMonthly>
			</div>
		</div>
		<div class="card bg-base-100 shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">อัตราสัดส่วนแพ็คเกจที่ลูกค้าใช้งานในขณะนี้</h1>
			<div class="chart-container">
				<DoughnutPackageUsage pData={data.pkgUsageRatio ?? []}></DoughnutPackageUsage>
			</div>
		</div>
		<div class="card bg-base-100 shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">อัตราสัดส่วนแพ็คเกจที่ถูกซื้อ</h1>
			<div class="chart-container">
				<DoughnutPackageOrderAmount pData={data.pkgUsageRatio ?? []}></DoughnutPackageOrderAmount>
			</div>
		</div>
	</div>
	<div class="">
		<Card.Root class="p-4 ">
			<Card.Title class="my-2"
				>ตารางการเปรียบเทียบโควต้าที่เหลืออยู่ของลูกค้าเทียบกับโควต้าที่ใช้ไป</Card.Title
			>

			<Card.Content>
				<MerchantPackageComparison
					selectedPkg={data.defaultOpt?.quotaAndMerchantUsagePkgSelect || 1}
					packageOpt={data.formOpt?.packages ?? []}
					pData={data.quotaAndMerchantUsage ?? []}
				/>
			</Card.Content>
		</Card.Root>
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
