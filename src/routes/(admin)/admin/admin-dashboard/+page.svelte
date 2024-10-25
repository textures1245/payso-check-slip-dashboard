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
		class="text-3xl font-bold text-black flex lg:justify-start md:justify-start sm:justify-center justify-center"
		><span>แดชบอร์ด</span></span
	>

	<div class="grid auto-rows-fr justify-center sm:grid-cols-1 xl:grid-cols-4 gap-4">
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

			<div class="p-6 pb-5 shadow bg-white rounded-xl">
				<div class="flex gap-4 items-center">
					<div class="flex">
						<span class="border  p-3 rounded-lg" style="background-color: #477DFF;">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="35px"
								height="35px"
								viewBox="0 0 24 24"
								{...$$props}
							>
								<path
									fill="white"
									d="M19 7h-1V6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3M5 5h10a1 1 0 0 1 1 1v1H5a1 1 0 0 1 0-2m15 10h-1a1 1 0 0 1 0-2h1Zm0-4h-1a3 3 0 0 0 0 6h1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8.83A3 3 0 0 0 5 9h14a1 1 0 0 1 1 1Z"
								/>
							</svg>
						</span>
					</div>
					<div class="flex flex-col gap-2">
						<div class="text-sm font-medium">รายได้เดือนนี้</div>
						<div class="text-xl lg:text-2xl md:text-lg font-bold">
							{currentIncome?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ฿
						</div>
					</div>
				</div>

				<div class="flex justify-between border-none mt-6 mb-3">
					<div class="text-sm">รายได้เดือนที่แล้ว</div>
					<div class=" font-semibold text-right">
						{previousIncome?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ฿
					</div>
				</div>
				<div class="flex justify-between border-none">
					<div class="text-sm">
						{currentIncome > previousIncome ? 'มากกว่าเดือนที่แล้ว' : 'น้อยกว่าเดือนที่แล้ว'}
					</div>
					<span
						class:text-success-bg={currentIncome > previousIncome}
						class:text-rejected-bg={currentIncome < previousIncome}
						class="badge badge-outline badge-sm uppercase text-xs flex items-center p-1 rounded-lg"
					>
						{#if currentIncome > previousIncome}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
								{...$$props}
							>
								<path
									fill="none"
									stroke="#106511"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m12 5l6 6m-6-6l-6 6m6-6v14"
								/>
							</svg>
							{(((currentIncome - previousIncome) / previousIncome) * 100).toFixed(2)}%
						{:else if currentIncome < previousIncome}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
								{...$$props}
							>
								<path
									fill="#d32f2f"
									d="M11 4.5v11.586l-4.5-4.5L5.086 13L12 19.914L18.914 13L17.5 11.586l-4.5 4.5V4.5z"
								/>
							</svg>
							{`${Math.abs(((currentIncome - previousIncome) / previousIncome) * 100).toFixed(2)}%`}
						{/if}
					</span>
				</div>
			</div>
		{/if}

		<div class="p-6 pb-5 shadow bg-white rounded-xl">
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

			<div class="flex gap-4 items-center">
				<div class="flex">
					<span class="border  p-3 rounded-lg" style="background-color: #1353EC;">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="35px"
							height="35px"
							viewBox="0 0 24 24"
							{...$$props}
						>
							<g
								fill="none"
								stroke="white"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
							>
								<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
								<path d="M14 2v4a2 2 0 0 0 2 2h4M9 15l2 2l4-4" />
							</g>
						</svg>
					</span>
				</div>
				<div class="flex flex-col gap-2">
					<div class="text-sm font-medium">รายการตรวจสอบ</div>
					<div class="text-xl lg:text-2xl md:text-lg font-bold">
						{data.statData?.TransactionStat.Total?.toLocaleString()}
					</div>
				</div>
			</div>

			<div class="flex justify-between border-none mt-6">
				<div class="flex gap-2">
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
							{...$$props}
						>
							<path
								fill="none"
								stroke="#666060"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="m5 13l4 4L19 7"
							/>
						</svg></span
					>
					<div class="text-sm">ถูกต้อง</div>
				</div>
				<div class=" font-semibold text-right text-success">
					{data.statData?.TransactionStat.ValidTotal}
				</div>
			</div>
			<div class="flex justify-between border-none mt-2">
				<div class="flex gap-2">
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
							{...$$props}
						>
							<path
								fill="#666060"
								d="M12.75 7a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 .352.636l3 1.875a.75.75 0 1 0 .796-1.272l-2.648-1.655z"
							/>
							<path
								fill="#666060"
								fill-rule="evenodd"
								d="M12 3.25a8.75 8.75 0 1 0 0 17.5a8.75 8.75 0 0 0 0-17.5M4.75 12a7.25 7.25 0 1 1 14.5 0a7.25 7.25 0 0 1-14.5 0"
								clip-rule="evenodd"
							/>
						</svg></span
					>
					<div class="text-sm">รอดำเนินการ</div>
				</div>
				<div class=" font-semibold text-right text-warning">
					{data.statData?.TransactionStat.PendingTotal}
				</div>
			</div>

			<div class="flex justify-between border-none mt-2">
				<div class="flex gap-2">
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 21 21"
							{...$$props}
						>
							<path
								fill="none"
								stroke="#666060"
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m15.5 15.5l-10-10zm0-10l-10 10"
							/>
						</svg></span
					>
					<div class="text-sm">ถูกปฏิเสธ</div>
				</div>
				<div class=" font-semibold text-right text-destructive">
					{data.statData?.TransactionStat.InvalidTotal}
				</div>
			</div>
		</div>

		<div class="p-6 pb-5 shadow bg-white rounded-xl">
			<div class="flex gap-4 items-center">
				<div class="flex">
					<span class="border  p-3 rounded-lg" style="background-color: #113BD4;">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="35px"
							height="35px"
							viewBox="0 0 32 32"
							{...$$props}
						>
							<path
								fill="white"
								d="M30 30h-2v-5a5.006 5.006 0 0 0-5-5v-2a7.01 7.01 0 0 1 7 7zm-8 0h-2v-5a5.006 5.006 0 0 0-5-5H9a5.006 5.006 0 0 0-5 5v5H2v-5a7.01 7.01 0 0 1 7-7h6a7.01 7.01 0 0 1 7 7zM20 2v2a5 5 0 0 1 0 10v2a7 7 0 0 0 0-14m-8 2a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7"
							/>
						</svg>
					</span>
				</div>
				<div class="flex flex-col gap-2">
					<div class="text-sm font-medium">ลูกค้า</div>
					<div class="text-xl lg:text-2xl md:text-lg font-bold">
						{data.statData?.MerchantStat.Total}
					</div>
				</div>
			</div>

			<div class="flex justify-between border-none mt-6">
				<div class="text-sm">กำลังใช้งาน</div>
				<div class=" font-semibold text-right text-success">
					{data.statData?.MerchantStat.ActiveTotal}
				</div>
			</div>

			<div class="flex justify-between border-none mt-2">
				<div class="text-sm">ไม่ใช้งาน</div>
				<div class=" font-semibold text-right text-destructive">
					{data.statData?.MerchantStat.InActiveTotal}
				</div>
			</div>
		</div>
		<div class="p-6 pb-5 shadow bg-white rounded-xl">
			<div class="flex gap-4 items-center">
				<div class="flex">
					<span class="border  p-3 rounded-lg" style="background-color: #182BBA;">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="34px"
							height="34px"
							viewBox="0 0 24 24"
							{...$$props}
						>
							<path
								fill="white"
								d="M10.591 2.513a3.75 3.75 0 0 1 2.818 0l7.498 3.04A1.75 1.75 0 0 1 22 7.175v9.653a1.75 1.75 0 0 1-1.093 1.621l-7.498 3.04a3.75 3.75 0 0 1-2.818 0l-7.498-3.04A1.75 1.75 0 0 1 2 16.827V7.176a1.75 1.75 0 0 1 1.093-1.622zm2.254 1.39a2.25 2.25 0 0 0-1.69 0L9.24 4.68l7.527 2.927l2.669-1.03zm1.846 4.505L7.215 5.5L4.59 6.564l7.411 2.882zM3.5 16.828a.25.25 0 0 0 .156.231l7.499 3.04q.047.02.095.036v-9.371L3.5 7.75zm9.345 3.271l7.499-3.04a.25.25 0 0 0 .156-.232V7.774l-7.75 2.992v9.37z"
							/>
						</svg>
					</span>
				</div>
				<div class="flex flex-col gap-2">
					<div class="text-sm font-medium">แพ็คเกจ</div>
					<div class="text-xl lg:text-2xl md:text-lg font-bold">
						{data.statData?.PackageStat.Total}
					</div>
				</div>
			</div>

			<div class="flex justify-between border-none mt-6">
				<div class="text-sm">กำลังใช้งาน</div>
				<div class=" font-semibold text-right text-success">
					{data.statData?.PackageStat.ActiveTotal}
				</div>
			</div>

			<div class="flex justify-between border-none mt-2">
				<div class="text-sm">ไม่ใช้งาน</div>
				<div class=" font-semibold text-right text-destructive">
					{data.statData?.PackageStat.InActiveTotal}
				</div>
			</div>
		</div>
	</div>

	<!-- <div class="grid auto-rows-fr justify-center sm:grid-cols-1 xl:grid-cols-2 gap-4">
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

		<div class="stats flex gap-4 shadow items-center justify-center w-auto long-card">
			<div class="stat text-center flex items-center w-full px-4">
				<div class="w-12 h-12 rounded-full bg-warning flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.2rem"
						height="1.2rem"
						viewBox="0 0 256 256"
						{...$$props}
					>
						<path
							fill="white"
							d="M232 56v120a8 8 0 0 1-2.76 6c-15.28 13.23-29.89 18-43.82 18c-18.91 0-36.57-8.74-53-16.85C105.87 170 82.79 158.61 56 179.77V224a8 8 0 0 1-16 0V56a8 8 0 0 1 2.77-6c36-31.18 68.31-15.21 96.79-1.12C167 62.46 190.79 74.2 218.76 50A8 8 0 0 1 232 56"
						/>
					</svg>
				</div>

				<div class="flex items-center">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold mr-4">
						จำนวนแพ็คเกจ
					</div>
					<div class="stat-value text-2xl">
						{data.statData?.PackageStat.Total}
					</div>
				</div>
			</div>

			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center justify-center space-x-2">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">ใช้งาน</div>
					<div class="stat-value text-success text-2xl">
						{data.statData?.PackageStat.ActiveTotal}
					</div>
				</div>
			</div>
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center space-x-2">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">ไม่ใช้งาน</div>
					<div class="stat-value text-destructive text-2xl">
						{data.statData?.PackageStat.InActiveTotal}
					</div>
				</div>
			</div>
		</div>
		<div class="stats flex gap-4 shadow items-center justify-center w-auto long-card">
			<div class="stat text-center flex items-center w-full px-4">
				<div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.5rem"
						height="1.2rem"
						viewBox="0 0 640 512"
						{...$$props}
					>
						<path
							fill="white"
							d="M96 128a128 128 0 1 1 256 0a128 128 0 1 1-256 0M0 482.3C0 383.8 79.8 304 178.3 304h91.4c98.5 0 178.3 79.8 178.3 178.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3M609.3 512H471.5c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4c89 0 161.2 72.2 161.2 161.3c0 17-13.8 30.7-30.7 30.7M432 256c-31 0-59-12.6-79.3-32.9c19.7-26.6 31.3-59.5 31.3-95.1c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112"
						/>
					</svg>
				</div>

				<div class="flex items-center justify-center">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold mr-4">
						จำนวนลูกค้า
					</div>
					<div class="stat-value text-2xl">
						{data.statData?.MerchantStat.Total}
					</div>
				</div>
			</div>

			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center justify-center space-x-2">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">ใช้งาน</div>
					<div class="stat-value text-success text-2xl">
						{data.statData?.MerchantStat.ActiveTotal}
					</div>
				</div>
			</div>
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center space-x-2">
					<div class="text-xs md:text-base text-secondary-foreground font-semibold">ไม่ใช้งาน</div>
					<div class="stat-value text-destructive text-2xl">
						{data.statData?.MerchantStat.InActiveTotal}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="grid auto-rows-fr justify-center sm:grid-cols-1 xl:grid-cols-1 gap-4">
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

		<div
			class="stats lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-1 lg:grid-rows-1 sm:grid-rows-1 grid-rows-2 gap-4 shadow items-center justify-center w-auto"
		>
			<div class="stat text-center items-center w-full px-4 grid grid-cols-3">
				<div class="lg:block md:hidden sm:hidden hidden">
					<div class="w-12 h-12 rounded-full bg-success flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 32 32"
							{...$$props}
						>
							<path
								fill="white"
								d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"
							/>
							<path fill="none" d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585z" />
						</svg>
					</div>
				</div>

				<div class="items-center col-span-2">
					<div class="flex items-center">
						<div class="text-xs md:text-base text-secondary-foreground font-semibold mr-4">
							รายการตรวจสอบ
						</div>
						<div class="text-2xl font-bold">
							{data.statData?.TransactionStat.Total}
						</div>
					</div>
				</div>
			</div>

			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center justify-center space-x-2">
					<div class="text-xs md:text-base text-success font-semibold">ถูกต้อง</div>
					<div class="stat-value text-success text-2xl">
						{data.statData?.TransactionStat.ValidTotal}
					</div>
				</div>
			</div>
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center space-x-2">
					<div class="text-xs md:text-base text-warning font-semibold">รอดำเนินการ</div>
					<div class="stat-value text-warning text-2xl">
						{data.statData?.TransactionStat.PendingTotal}
					</div>
				</div>
			</div>
			<div class="stat text-center flex items-center w-full px-4">
				<div class="flex flex-row items-center space-x-2">
					<div class="text-xs md:text-base text-destructive font-semibold">ถูกปฏิเสธ</div>
					<div class="stat-value text-destructive text-2xl">
						{data.statData?.TransactionStat.InvalidTotal}
					</div>
				</div>
			</div>
		</div>
	</div> -->
	<!-- chatgrop -->
	<div id="charts-container" class="text-center *:h-[26rem] items-center gap-4 grid lg:grid-cols-2">
		<div class="card bg-base-100 shadow-md p-4">
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
				<Card.Title>ลูกค้าที่เปลี่ยนแพ็คเก็จล่าสุด</Card.Title>
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
	@media (max-width: 390px) {
		.stats {
			flex-direction: column; /* Stack items vertically */
			gap: 2rem; /* Reduce the gap */
		}

		.stat {
			flex-direction: column; /* Stack each stat item */
			text-align: center; /* Center align text */
			padding: 1rem; /* Adjust padding for smaller screens */
		}

		.stat-value {
			font-size: 1.5rem; /* Scale down the font size */
		}

		.text-xs {
			font-size: 0.75rem; /* Smaller text for the labels */
		}

		.w-12.h-12 {
			width: 2.5rem;
			height: 2.5rem; /* Adjust icon container size */
		}
		.long-card {
			width: 90vw; /* 90% of the viewport width */
		}
	}
	.text-success-bg {
		background-color: #e6f4ea; /* พื้นหลังสีเขียวอ่อน */
		color: #2e7d32; /* สีตัวอักษรสีเขียวเข้ม */
	}

	.text-pending-bg {
		background-color: #fff9e6; /* พื้นหลังสีเหลืองอ่อน */
		color: #f57c00; /* สีตัวอักษรสีเหลืองเข้ม */
	}

	.text-rejected-bg {
		background-color: #fce8e8; /* พื้นหลังสีแดงอ่อน */
		color: #d32f2f; /* สีตัวอักษรสีแดงเข้ม */
	}

	
</style>
