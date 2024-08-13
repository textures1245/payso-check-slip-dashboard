<!-- <script>
	import TableData from './(components)/TableData.svelte';
	import CardComponentList from './(components)/CardComponentList.svelte';
	import Card from './../../../../lib/components/ui/card/card.svelte';
	import DoughnutPackageUsage from './(components)/DoughnutPackageUsage.svelte';

    import CardGropAdminDashbord from "$lib/component/card-grop-admin-dashbord/+page.svelte";
    // @ts-ignore
    import ChartGropAdminDashbord from "$lib/component/chart-grop-admin-dashbord/+page.svelte";
    import TableGropAdminDashbord from "$lib/component/table-grop-admin-dashbord/+page.svelte"

    

</script>


<div >z
    <div class="m-3"><CardGropAdminDashbord/> </div>
   <div class="m-5"><ChartGropAdminDashbord/></div>
   <div ><TableGropAdminDashbord/></div>
   
   

</div>
 -->

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import CardComponentList from './(components)/CardComponentList.svelte';
	import DoughnutPackageUsage from './(components)/DoughnutPackageUsage.svelte';
	import LineTransactionDaily from './(components)/LineTransactionDaily.svelte';
	import MerchantQuotaComparisonLineChart from './(components)/MerchantQuotaComparisonLineChart.svelte';
	import TableData from './(components)/TableData.svelte';
</script>

<div class="container space-y-4 mx-auto">
	<div class="grid justify-center sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<div class="stats shadow">
			<div class="stat place-items-center">
				<div class="stat-title text-secondary-foreground font-semibold">จำนวนยอดแพคเกจ</div>
				<div class="stat-value text-primary">5</div>
				<div class="stat-desc">21% more than last month</div>
			</div>
		</div>
		<div class="overflow-auto stats p-4 grid gap-2 grid-cols-2 shadow">
			<div class="text-center place-self-center">
				<div class=" text-xs md:text-base text-secondary-foreground font-semibold">จำนวนที่ลูกค้าใช้งาน</div>
				<div class="stat-value text-primary">500</div>
			</div>
			<div class="text-xs md:text-sm gap-1 ml-auto pl-4 grid">
				<div class="">
					<div class=" text-secondary-foreground font-semibold">ลูกค้า Paysolution</div>
					<div class=" text-primary">500</div>
				</div>
				<div class="">
					<div class=" text-secondary-foreground font-semibold">ลูกค้าทั่วไป</div>
					<div class=" text-primary">500</div>
				</div>
			</div>
		</div>
		<div class="stats shadow">
			<div class="stat place-items-center">
				<div class="stat-title text-secondary-foreground font-semibold">จำนวนที่ลูกค้าใช้งาน</div>
				<div class="stat-value text-primary">500</div>
				<div class="stat-desc">21% more than last month</div>
			</div>
		</div>
	</div>
	<div id="charts-container" class="items-center grid lg:grid-cols-2">
		<div id="line-chart-container" class="chart-container">
			<LineTransactionDaily></LineTransactionDaily>
		</div>
		<div id="line-chart-container" class="chart-container">
			<MerchantQuotaComparisonLineChart></MerchantQuotaComparisonLineChart>
		</div>
		<div id="doughnut-chart-container" class="gap-6 grid md:grid-cols-2">
			<div class="chart-container">
				<DoughnutPackageUsage></DoughnutPackageUsage>
			</div>
			<div class="chart-container">
				<DoughnutPackageUsage></DoughnutPackageUsage>
			</div>
		</div>
	</div>
	<div class="grid gap-2 w-full grid-flow-row md:grid-flow-col">
		<Card.Root class="p-4">
			<Card.Title>Recent Sales</Card.Title>
			<Card.Header>
				<Card.Description>You made 265 sales this month.</Card.Description>
			</Card.Header>
			<Card.Content>
				<CardComponentList />
			</Card.Content>
		</Card.Root>
		<div class="flex gap-2 flex-wrap">
			<Card.Root class="p-4 w-full">
				<Card.Title>Recent Sales 2</Card.Title>
				<Card.Header>
					<Card.Description>You made 265 sales this month.</Card.Description>
				</Card.Header>
				<Card.Content>
					<TableData />
				</Card.Content>
			</Card.Root>
			<Card.Root class="p-4 w-full">
				<Card.Title>Recent Sales 2</Card.Title>
				<Card.Header>
					<Card.Description>You made 265 sales this month.</Card.Description>
				</Card.Header>
				<Card.Content>
					<TableData />
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>

<style>
	.chart-container {
		position: relative;
		width: 100%;
	}
</style>
