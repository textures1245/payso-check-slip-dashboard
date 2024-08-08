
<script lang="ts">
    type Transaction = {
		Email: string;
		MerchantName: string;
		QuotaLimit: number;
		QuotaUsage: number;
		Total_count: string;
        false_count:string;
        pending_count:string;

	};
    import { Button } from '$lib/components/ui/button';
	import logo from"$lib/image/pack.png";
    import * as Card from "$lib/components/ui/card";
	import { Pie } from 'svelte-chartjs';
	import 'chart.js/auto';


    export let dataOverview: Transaction;
    console.log("overview :",dataOverview)
    let max = dataOverview.QuotaLimit;
	let datatoo=dataOverview.QuotaUsage;
	let maxr=max-datatoo
	if(max-datatoo<0){
		datatoo=max
		maxr=0
		

	}
    let data = {
	  labels: ['จำนวนที่ใช้', 'จำนวนทั้งหมด'],
	  datasets: [{
		label: '',
		data: [datatoo,maxr],
		backgroundColor: [
		  'rgb(255, 99, 132)',
		  'rgb(54, 162, 235)',
		  
		],
		hoverOffset: 4
	  }]
	};
  
	let options = {
	  responsive: true,
	  maintainAspectRatio: false,
	};

</script>
<div class="flex justify-start ... text-2xl font-sans ... font-bold ...">
	<h1>Data</h1>
</div>



<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-4" style="width: 100%;">
    <Card.Root >
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-lg font-medium">จำนวนรายการที่เป็นของจริงทั้งหมด</Card.Title>
            
        </Card.Header>
        <Card.Content class="text-center ">
			<div class="content-center ">
            <div class=" content-center w-100 h-24" >
                <div class="text-2xl font-bold w-100">{dataOverview.pending_count}</div>
                <div class="text-xs w-100 text-stone-400" >สลิปที่ถูกต้องต่อสลิปทั้งหมด {(dataOverview.pending_count/dataOverview.Total_count)*100}%</div>
            </div>
            
			</div>
        </Card.Content>
    </Card.Root>
    <Card.Root >
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-sm font-medium">จำนวนรายการที่เป็นของปลอมทั้งหมด</Card.Title>
           
        </Card.Header>
        <Card.Content class="text-center ">
            <div class=" content-center  w-100 h-40">
                <div class="text-2xl font-bold w-100">{dataOverview.false_count}</div>
                <div class="text-xs  w-100 text-stone-400" >สลิปที่ผิดต่อสลิปทั้งหมด {(dataOverview.false_count/dataOverview.Total_count)*100}%</div>
            </div>
        </Card.Content>
    </Card.Root>
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-sm font-medium">จำนวนทั้งหมดที่ใช้งาน</Card.Title>
            
        </Card.Header>
        <Card.Content class="text-center ">
            <div>
                <p class=" w-100 h-32 content-center text-4xl">{dataOverview.Total_count}</p>
                </div>
                <div class=" w-100 my-2"><Button variant="outline" class="w-4/5 h-12 bg-orange-500">Dowload Excel</Button></div>
        </Card.Content>
    </Card.Root>
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-sm font-medium">การใช้งาน</Card.Title>
            
        </Card.Header>
        <Card.Content class="flex justify-center w-100 h-100" >
            <div>
            <div class="chart-container lg:w-60">
                <Pie {data} {options} class="w-9/12"/>
              </div>
              <div>
            <p class="text-center">{datatoo}/{max}</p></div>
        </div>
        </Card.Content>
    </Card.Root>
</div>


