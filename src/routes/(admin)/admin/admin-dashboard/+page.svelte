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

<div class="container space-y-5 px-8 mx-auto">
	<span
		class="text-3xl font-bold text-primary flex lg:justify-start md:justify-start sm:justify-center justify-center"
		><span class="drop-shadow-md">Dashboard</span></span
	>

	<div class="grid auto-rows-fr  justify-center sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

			<div class="stats stats-vertical justify-center flex flex-col p-6 gap-2 shadow">
				<div class="flex justify-between items-center w-full place-self-center px-4">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						รายได้เดือนนี้
					</div>
					<div class="stat-value text-2xl text-right">
						{currentIncome?.toFixed(2)} ฿
					</div>
				</div>
			</div>

			<div class="stats stats-vertical justify-center flex flex-col p-2 gap-2 shadow">
				<div class="flex justify-between items-center w-full place-self-center px-4">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						รายได้เดือนก่อนหน้านั้น
					</div>
					<div class="stat-value text-2xl text-right">
						{previousIncome?.toFixed(2)} ฿
					</div>
				</div>
			</div>

			<div class="stats stats-vertical justify-center flex flex-col p-2 gap-2 shadow">
				<div class="flex justify-between items-center w-full place-self-center px-4">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">รายได้</div>
					<div class="flex items-center gap-2">
						<div
							class="text-xs md:text-base font-semibold"
							class:text-destructive={currentIncome < previousIncome}
							class:text-success={currentIncome > previousIncome}
						>
							{currentIncome > previousIncome ? 'มากกว่าเดือนที่แล้ว' : 'น้อยกว่าเดือนที่แล้ว'}
						</div>
						<div
							class:text-destructive={currentIncome < previousIncome}
							class:text-success={currentIncome > previousIncome}
							class="stat-value text-2xl text-right font-semibold"
						>
							{#if previousIncome !== 0}
								{(((currentIncome - previousIncome) / previousIncome) * 100).toFixed(2)}%
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- <div
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
			</div> -->
		{/if}
		<!-- <div
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
		</div> -->
		<!-- <div
			class="overflow-auto stats stats-vertical justify-center flex flex-col p-4 gap-2 grid-cols-2 shadow "
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
		</div> -->
		<!-- <div class="stats flex gap-4 shadow items-center justify-center w-auto">
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex items-center justify-center mr-4">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-primary">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 14c3.866 0 7-3.134 7-7S15.866 0 12 0 5 3.134 5 7s3.134 7 7 7zm0 2c-5.523 0-10 4.477-10 10h20c0-5.523-4.477-10-10-10z" />
					</svg>
				</div>
				<div class="flex items-center justify-center mr-4">
					<div class=" text-xs md:text-base text-secondary-foreground font-semibold">จำนวนลูกค้า</div>
					<div class="stat-value text-primary">{data.statData?.MerchantStat.Total}</div>
					
				</div>
				<div class="flex items-center">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold mr-4">
						ลูกค้าที่ใช้งานอยู่
					</div>
					<div class="stat-value text-primary text-lg">
						{data.statData?.MerchantStat.ActiveTotal}
					</div>
				</div>
			</div>
		
			<div class="stat text-center flex items-center w-full px-4">
				<div>
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						ถูกปิดการใช้งาน
					</div>
					<div class="stat-value text-destructive text-lg">
						{data.statData?.MerchantStat.InActiveTotal}
					</div>
				</div>
			</div>
		
			<div class="stat text-center flex items-center w-full px-4">
				<div>
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						ถูกปิดการใช้งาน
					</div>
					<div class="stat-value text-destructive text-lg">
						{data.statData?.MerchantStat.InActiveTotal}
					</div>
				</div>
			</div>
		</div>
		<div class="stats flex gap-4 shadow items-center justify-center w-auto">
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex items-center justify-center mr-4">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-primary">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 14c3.866 0 7-3.134 7-7S15.866 0 12 0 5 3.134 5 7s3.134 7 7 7zm0 2c-5.523 0-10 4.477-10 10h20c0-5.523-4.477-10-10-10z" />
					</svg>
				</div>
				<div class="flex items-center">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold mr-4">
						ลูกค้าที่ใช้งานอยู่
					</div>
					<div class="stat-value text-primary text-lg">
						{data.statData?.MerchantStat.ActiveTotal}
					</div>
				</div>
			</div>
		
			<div class="stat text-center flex items-center w-full px-4">
				<div>
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						ถูกปิดการใช้งาน
					</div>
					<div class="stat-value text-destructive text-lg">
						{data.statData?.MerchantStat.InActiveTotal}
					</div>
				</div>
			</div>
		
			<div class="stat text-center flex items-center w-full px-4">
				<div>
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						ถูกปิดการใช้งาน
					</div>
					<div class="stat-value text-destructive text-lg">
						{data.statData?.MerchantStat.InActiveTotal}
					</div>
				</div>
			</div>
		</div> -->
	</div>
	<div class="grid auto-rows-fr justify-center sm:grid-cols-2 xl:grid-cols-2 gap-4">
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
		{/if}

		<div class="stats flex gap-4 shadow items-center justify-center w-auto">
			<div class="stat text-center flex items-center w-full px-4">
				
				<div class="w-12 h-12 rounded-full bg-warning flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 256 256" {...$$props}>
						<path fill="white" d="M232 56v120a8 8 0 0 1-2.76 6c-15.28 13.23-29.89 18-43.82 18c-18.91 0-36.57-8.74-53-16.85C105.87 170 82.79 158.61 56 179.77V224a8 8 0 0 1-16 0V56a8 8 0 0 1 2.77-6c36-31.18 68.31-15.21 96.79-1.12C167 62.46 190.79 74.2 218.76 50A8 8 0 0 1 232 56" />
					</svg>
				</div>
				
				<div class="flex items-center">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold mr-4">
						จำนวนแพ็คเกจ
					</div>
					<div class="stat-value  text-2xl">
						{data.statData?.PackageStat.Total}
					</div>
				</div>
			</div>

			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center justify-center space-x-2">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						ใช้งาน
					</div>
					<div class="stat-value text-success text-2xl">
						{data.statData?.PackageStat.ActiveTotal}
					</div>
				</div> 
				
			</div>
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center space-x-2">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						ไม่ใช้งาน
					</div>
					<div class="stat-value text-destructive text-2xl">
						{data.statData?.PackageStat.InActiveTotal}
					</div>
				</div>
			</div>
		</div>
		<div class="stats flex gap-4 shadow items-center justify-center w-auto">
			<div class="stat text-center flex items-center w-full px-4">
				
				<div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.2rem" viewBox="0 0 640 512" {...$$props}>
						<path fill="white" d="M96 128a128 128 0 1 1 256 0a128 128 0 1 1-256 0M0 482.3C0 383.8 79.8 304 178.3 304h91.4c98.5 0 178.3 79.8 178.3 178.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3M609.3 512H471.5c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4c89 0 161.2 72.2 161.2 161.3c0 17-13.8 30.7-30.7 30.7M432 256c-31 0-59-12.6-79.3-32.9c19.7-26.6 31.3-59.5 31.3-95.1c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112" />
					</svg>
				</div>
				
				<div class="flex items-center">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold mr-4">
						จำนวนลูกค้า
					</div>
					<div class="stat-value  text-2xl">
						{data.statData?.MerchantStat.Total}
					</div>
				</div>
			</div>

			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center justify-center space-x-2">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						ใช้งาน
					</div>
					<div class="stat-value text-success text-2xl">
						{data.statData?.MerchantStat.ActiveTotal}
					</div>
				</div> 
				
			</div>
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center space-x-2">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">
						ไม่ใช้งาน
					</div>
					<div class="stat-value text-destructive text-2xl">
						{data.statData?.MerchantStat.InActiveTotal}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="grid auto-rows-fr justify-center sm:grid-cols-2 xl:grid-cols-1 gap-4">
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
		{/if}

		<div class="stats flex gap-4 shadow items-center justify-center w-auto">
			<div class="stat text-center flex items-center w-full px-4">
				<div class="w-12 h-12 rounded-full bg-success flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" {...$$props}>
						<path fill="white" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z" />
						<path fill="none" d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585z" />
					</svg>
				</div>
				
				<div class="flex items-center">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold mr-4">
						รายการตรวจสอบ
					</div>
					<div class="stat-value  text-2xl">
						{data.statData?.TransactionStat.Total}
					</div>
				</div>
			</div>

			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center justify-center space-x-2">
					<div class="text-xs md:text-base  text-success font-semibold">
						ถูกต้อง
					</div>
					<div class="stat-value text-success text-2xl">
						{data.statData?.TransactionStat.ValidTotal}
					</div>
				</div> 
				
			</div>
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center space-x-2">
					<div class="text-xs md:text-base  text-warning font-semibold">
						รอดำเนินการ
					</div>
					<div class="stat-value  text-warning text-2xl">
						{data.statData?.TransactionStat.PendingTotal}
					</div>
				</div>
			</div>
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center space-x-2">
					<div class="text-xs md:text-base  text-destructive font-semibold">
						ถูกปฏิเสธ
					</div>
					<div class="stat-value text-destructive text-2xl">
						{data.statData?.TransactionStat.InvalidTotal}
					</div>
				</div>
			</div>
			
		</div>
		
	</div>
	<!-- chatgrop -->
	<div id="charts-container" class="text-center *:h-[26rem] items-center gap-4 grid lg:grid-cols-2">
		<div class="card bg-base-100  shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold text-left">ยอดการใช้งานรายวัน</h1>
			<div class="chart-container" id="line-chart-container">
				<LineTransactionDaily
					defaultOpt={data.defaultOpt?.dailyTrans}
					pData={data.transactionDailyCount ?? []}
				></LineTransactionDaily>
			</div>
		</div>
		<div class="card bg-base-100 shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold text-left">สถิติรายได้แบบรายเดือน (บาท)</h1>
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
			<h1 class="text-base xl:text-lg font-semibold text-left">สถิติโดยรวมแบบรายเดือน</h1>
			<div class="chart-container h-full">
				<BarOverviewMonthly pData={data.monthlyOverview ?? []}></BarOverviewMonthly>
			</div>
		</div>
		<!-- <div class="card bg-base-100 shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">อัตราสัดส่วนแพ็คเกจที่ลูกค้าใช้งานในขณะนี้</h1>
			<div class="chart-container">
				<DoughnutPackageUsage pData={data.pkgUsageRatio ?? []}></DoughnutPackageUsage>
			</div>
		</div> -->
		<!-- <div class="card bg-base-100 shadow-md p-4">
			<h1 class="text-base xl:text-lg font-semibold">อัตราสัดส่วนแพ็คเกจที่ถูกซื้อ</h1>
			<div class="chart-container">
				<DoughnutPackageOrderAmount pData={data.pkgUsageRatio ?? []}></DoughnutPackageOrderAmount>
			</div>
		</div> -->
	</div>
	<!-- <div class="">
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
	</div> -->
	<div class="grid gap-2 w-full grid-flow-row lg:grid-flow-col lg:grid-cols-1">
		<!-- <div class="flex flex-col gap-2 col-span-full lg:col-span-1 flex-wrap">
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
		</div> -->
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
