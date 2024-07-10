<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import logo from"$lib/image/pack.png";
	import { Pie } from 'svelte-chartjs';
	import 'chart.js/auto'; // This import is crucial to make sure chart.js works
	const items = [
		{
			title: 'Item 1',
			description: 'This is the first item',
			imageUrl: logo,
			package: '1'
		},
		{
			title: 'Item 2',
			description: 'This is the second item',
			imageUrl: logo,
			package: '2'
		},
		{
			title: 'Item 3',
			description: 'This is the third item',
			imageUrl: logo,
			package: '3'
		},
		{
			title: 'Item 4',
			description: 'This is the fourth item',
			imageUrl: logo,
			package: '4'
		},
		{
			title: 'Item 5',
			description: 'This is the fifth item',
			imageUrl: logo,
			package: '5'
		}
	];

	let max = 300;
	let datatoo=200;
	let maxr=max-datatoo
	if(max-datatoo<0){
		datatoo=max
		max=0
		
	}
	let loading = false;
	
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




{#if loading}
  <div class="spinner">
    <!-- ตัวอย่าง spinner -->
    <div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
		<div class="animate-pulse flex space-x-4">
		  <div class="rounded-full bg-slate-200 h-10 w-10"></div>
		  <div class="flex-1 space-y-6 py-1">
			<div class="h-2 bg-slate-200 rounded"></div>
			<div class="space-y-3">
			  <div class="grid grid-cols-3 gap-4">
				<div class="h-2 bg-slate-200 rounded col-span-2"></div>
				<div class="h-2 bg-slate-200 rounded col-span-1"></div>
			  </div>
			  <div class="h-2 bg-slate-200 rounded"></div>
			</div>
		  </div>
		</div>
	  </div>
  </div>
{:else}
<div class="flex justify-start ... text-2xl font-sans ... font-bold ...">
	<h1>Data</h1>
</div>
<div class=" flex justify-evenly ... text-lg font-sans ... h-60 ">
	<div class="w-2/6 text-center ms-10 ">
		<div class="rounded-lg border-2 border-black w-full max-w-96 h-full max-h-32  bg-red-700">
			<p>หัวข้อ</p>
			<p>359 bath</p>
		</div>
		<div class="rounded-lg border-2 border-black w-full max-w-96 h-full max-h-32 mt-3 bg-red-700">
			<p>หัวข้อ</p>
			<p>359 bath</p>
		</div>
	</div>
	<div
		class=" text-center mt-7 rounded-lg border-2 border-black w-2/6 max-w-96 h-full max-h-70 mx-3"
	>
	<div class=" h-full max-h-70 content">
		<div>
		<p >asdasd</p>
		</div>
		<div>
		<p class=" w-100 h-32 content-center">359 bath</p>
		</div>
		<div class=" w-100"><Button variant="outline" class="w-4/5 h-12 bg-orange-500">Dowload Excel</Button></div>
	</div>
	</div>
	<div class="w-2/6 text-center">
		<div class="rounded-lg border-2 border-black w-full max-w-96 h-full max-h-32 bg-red-700">
			
			<div class="flex justify-evenly w-full h-full">
			<div class="my-5"><img src={logo} class="w-100 h-100 max-h-16"></div>
			<div>
				<p>หัวข้อ</p>
				<p>359 bath</p>
			</div>
			
			</div>
		</div>
		<div class="rounded-lg border-2 border-black w-full max-w-96 h-full max-h-32 mt-3 bg-red-700">
			<div class="flex justify-evenly ">
				<div class="my-5"><img src={logo} class="w-100 h-100 max-h-16"></div>
				<div>
					<p>หัวข้อ</p>
					<p>359 bath</p>
				</div>
				
				</div>
		</div>
	</div>
	<div
		class=" text-center mt-7 rounded-lg border-2 border-black w-2/6 max-w-96 h-full max-h-70 mx-3"
	>
		<p>การใช้งาน</p>
		<div class="chart-container">
			<Pie {data} {options} />
		  </div>
		<p>{datatoo}/{max}</p>
	</div>
</div>

<div class="flex justify-start ... text-2xl font-sans ... font-bold ... mt-10">
	<h1>ธนาคาร</h1>
</div>
<div class="rounded-lg border-2 border-black w-100 h-52 max-h-72 mx-8 my-8">
	<div class="w-100 flex justify-center mt-3">
		<Carousel.Root class="w-full max-w-7xl ">
			<Carousel.Content class="-ml-1">
				{#each items as item}
					<Carousel.Item class="pl-1 md:basis-1/2 lg:basis-1/4">
						<div class="p-1">
							<Card.Root>
								<Card.Content
									class="aspect-square items-center justify-center p-6 h-40 max-h-72 w-full"
								>
									<div class="flex">
										<div class="text-2xl font-semibold"><img src={logo} class="w-24 h-100"></div>
										<div class="mx-3">
											<div class="text-2xl font-semibold">{item.title}</div>
											<div class="text-2xl font-semibold">{item.description}</div>
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</div>
</div>
<div class="flex justify-start ... text-2xl font-sans ... font-bold ...">
	<h1>รายการย้อนหลัง</h1>
</div>
<div class="rounded-lg border-2 border-black w-100 h-full mx-8 my-8 flex justify-center">
	<div class="w-full">
	{#each items as item}
		<div class="bg-slate-300 my-5 mx-5 rounded-xl ">
			<div class="flex justify-around  h-full">
				<div class="my-5"><img src={logo} class="w-full h-full max-h-40 content-center"></div>
				<div class="content-end">ผู้ส่ง : {item.title}</div>
				<div class="content-end">จาก: XXX-X-XX... , MR....</div>
				<div class="content-center">จำนวนเงิน : {item.package}</div>

				<AlertDialog.Root >
					<AlertDialog.Trigger><Button variant="outline" class="bg-orange-500 w-full h-100">ดูรายการ</Button></AlertDialog.Trigger>
					<AlertDialog.Content class="bg-slate-300 rounded-lg p-4 w-full my-10 h-full max-w-3/5 " style="width:auto;height:auto">
						<AlertDialog.Header >
							<AlertDialog.Title >
                                <div class="flex" >
                                    <div> IMG</div>
                                    <div class="mx-2">
                                        <div>ประเภทการชำระ</div>
                                        <div> Merchant Name</div>
                                    </div>
                                    <div>เลขบัญชี</div>
                                    <div class="ms-44"><AlertDialog.Action
                                        class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700 absolute top-0 right-0"
                                    >
                                        x
                                    </AlertDialog.Action></div>
                                </div>
                            </AlertDialog.Title>
							<AlertDialog.Description>
								<div class="flex justify-around">
                                    <div class="content-center w-full max-w-3/5 h-full max-h-4/5"><div class="flex justify-center content-center"><img src={logo} style="width:250px; height:auto"></div></div>
                                    <div class="h-100 bg-black mx-5" >.</div>
                                    <div class="text-start " style="width: 400px;">

                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                       
                                        
                                    </div>
                                </div>
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer class="mt-4 flex justify-end space-x-2">
							
							
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</div>
	{/each}
</div>
</div>
{/if}

<style>
	.chart-container {
	  position: relative;
	  width: 100%;
	  height: 150px;
	}
	.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* หรือความสูงที่คุณต้องการ */
  }
  </style>