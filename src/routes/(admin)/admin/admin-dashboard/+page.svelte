<!-- <script>
	import Card from './../../../../lib/components/ui/card/card.svelte';
	import DoughnutPackageUsage from './(components)/DoughnutPackageUsage.svelte';

    import CardGropAdminDashbord from "$lib/component/card-grop-admin-dashbord/+page.svelte";
    // @ts-ignore
    import ChartGropAdminDashbord from "$lib/component/chart-grop-admin-dashbord/+page.svelte";
    import TableGropAdminDashbord from "$lib/component/table-grop-admin-dashbord/+page.svelte"

    

</script>


<div >
    <div class="m-3"><CardGropAdminDashbord/> </div>
   <div class="m-5"><ChartGropAdminDashbord/></div>
   <div ><TableGropAdminDashbord/></div>
   
   

</div>
 -->

<script lang="ts">
	import DoughnutPackageUsage from './(components)/DoughnutPackageUsage.svelte';
	import LineTransactionDaily from './(components)/LineTransactionDaily.svelte';
</script>

<div class="container space-y-4 mx-auto">
	<div class="grid justify-center md:grid-cols-2 lg:grid-cols-4 gap-4">
		{#each new Array(8) as ii}
			<div class="stats shadow">
				<div class="stat place-items-center">
					<div class="stat-title text-secondary-foreground font-semibold">Total Page Views</div>
					<div class="stat-value text-primary">89,400</div>
					<div class="stat-desc">21% more than last month</div>
				</div>
			</div>
		{/each}
	</div>
	<div id="charts-container" class=" items-center grid lg:grid-cols-2">
		<div id="doughnut-chart-container  chart-container">
			<DoughnutPackageUsage></DoughnutPackageUsage>
		</div>
		<div id="line-chart-container chart-container">
			<LineTransactionDaily></LineTransactionDaily>
		</div>
	</div>
</div>

<style>
	.chart-container {
		position: relative;
		width: 100%;
		height: 400px; /* Adjust this height as needed */
	}
</style>
