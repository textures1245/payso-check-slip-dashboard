
<script lang="ts">
    import { Button } from '$lib/components/ui/button';
	import logo from"$lib/image/pack.png";
    import * as Card from "$lib/components/ui/card";
	import { Pie } from 'svelte-chartjs';
	import 'chart.js/auto';
    let max = 300;
	let datatoo=200;
	let maxr=max-datatoo
	if(max-datatoo<0){
		datatoo=max
		max=0
		
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
            <div class="text-2xl font-bold content-center w-100 h-20" >33333</div>
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
            <div class="text-2xl font-bold content-center  w-100 h-36">11111</div>
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
                <p class=" w-100 h-32 content-center text-4xl">2222</p>
                </div>
                <div class=" w-100"><Button variant="outline" class="w-4/5 h-12 bg-orange-500">Dowload Excel</Button></div>
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
            <div class="chart-container w-64">
                <Pie {data} {options} class="w-9/12"/>
              </div>
              <div>
            <p class="text-center">{datatoo}/{max}</p></div>
        </div>
        </Card.Content>
    </Card.Root>
</div>


