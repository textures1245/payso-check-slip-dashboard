
<script>
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



<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mx-5">
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-sm font-medium">หัวข้อ</Card.Title>
            
        </Card.Header>
        <Card.Content>
            <div class="text-2xl font-bold">$45,231.89</div>
            <p class="text-xs text-muted-foreground">+20.1% from last month</p>
        </Card.Content>
    </Card.Root>
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-sm font-medium">หัวข้อ</Card.Title>
           
        </Card.Header>
        <Card.Content>
            <div class="text-2xl font-bold">+2350</div>
            <p class="text-xs text-muted-foreground">+180.1% from last month</p>
        </Card.Content>
    </Card.Root>
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-sm font-medium">จำนวนทั้งหมด</Card.Title>
            
        </Card.Header>
        <Card.Content>
            <div>
                <p class=" w-100 h-32 content-center">359 bath</p>
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
        <Card.Content class="flex justify-center" >
            <div>
            <div class="chart-container">
                <Pie {data} {options}  style="width:70%"/>
              </div>
              <div>
            <p class="text-center">{datatoo}/{max}</p></div>
        </div>
        </Card.Content>
    </Card.Root>
</div>
