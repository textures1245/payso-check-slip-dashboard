
<script lang="ts">
   
    import { Button } from '$lib/components/ui/button';
	import logo from"$lib/image/pack.png";
    import * as Card from "$lib/components/ui/card";
	import { Pie } from 'svelte-chartjs';
	import 'chart.js/auto';
    import { afterUpdate, onMount } from 'svelte';
    import cookie from 'cookie';


    let dataOverview: any[] = [];
    let max = 0;
	let datatoo=0;
	let maxr=1;
	
    let data = {
	  labels: ['จำนวนที่ใช้', 'จำนวนทั้งหมด'],
	  datasets: [{
		label: '',
		data: [datatoo,maxr],
		backgroundColor: [
		 'rgb(220, 20, 60)',   // สีแดงเข้ม (Crimson)
  'rgb(0, 123, 255)',   // สีน้ำเงินเข้ม (Royal Blue)
		  
		],
		hoverOffset: 4
	  }]
	};
  
	let options = {
	  responsive: true,
	  maintainAspectRatio: false,
	};
    function getCookies() {
  return cookie.parse(document.cookie);
}
    onMount(async () => {
		try {
			const data = await GetTransactionByid();
			// Use profileData here
			dataOverview =data;
			console.log('data : ',dataOverview);
            if(dataOverview){
                updateChartData();
            }else{
                
            }
            
		} catch (error) {
			console.error('Error fetching profile:', error);
		}

		


	});
    function updateChartData() {
        datatoo = dataOverview.QuotaLimit - dataOverview.QuotaUsage;
        maxr = dataOverview.QuotaLimit - datatoo;

        if (maxr < 0) {
            datatoo = dataOverview.QuotaLimit;
            maxr = 0;
        }

        data.datasets[0].data = [datatoo, maxr];
    }
    let chart: { update: () => void; };
    
    afterUpdate(() => {
    if (chart) {
        chart.update(); // Ensure chart is updated with new data
     }
    });

	const GetTransactionByid = async () => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		// console.log( 'id: ', id , typeof(id));
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
		
		console.log('checking get transaction');

		// Create URL parameters from form data
		let config = {
			method: 'GET', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json'
            }
		};
		var result = await fetch(`http://127.0.0.1:4567/api/v1/trasactionid/${myCookie.Id}`, config);
		const datas = await result.json();
        console.log(datas)
        if(datas.result){
            return datas.result[0] 
        }
		

	
	};

    const ExportExcel = async () => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log( 'id: ', myCookie.Id , typeof(myCookie.Id));
		
		console.log('checking get transaction');

		// Create URL parameters from form data
		let config = {
			method: 'GET', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json'
            }
		};
		var result = await fetch(`http://127.0.0.1:4567/api/v1/trasaction/exportexcel/${myCookie.Id}`, config);
        console.log("rrrrr",result)
        if (result.ok) {
        // รับข้อมูลเป็น blob (binary data)
        const blob = await result.blob();

        // สร้าง URL object สำหรับดาวน์โหลด
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.xlsx'); // ตั้งชื่อไฟล์ที่ต้องการดาวน์โหลด
        document.body.appendChild(link);
        link.click();
    } else {
        console.error('Failed to download Excel file.');
    }

	
	};

    async function dowloadExportExcel() {

        const datasearch = await ExportExcel();

        return datasearch
// Replace with your actual URL

}

</script>
<div class="flex justify-start ... text-2xl font-sans ... font-bold ...">
	<h1>Dashboard</h1>
</div>



<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-4" style="width: 100%;">
    <Card.Root >
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-lg font-medium" style="height:40px">จำนวนรายการที่เป็นของจริงทั้งหมด</Card.Title>
            
        </Card.Header>
        <Card.Content class="text-center lg:my-5 ">
			<div class="content-center ">
            <div class=" content-center w-100 h-30" >
                {#if dataOverview}
                <div class="text-8xl font-bold w-100">{dataOverview.Success_count}</div>
                {:else}
                <div class="text-8xl font-bold w-100">0</div>
                {/if}
            </div>
            
			</div>
        </Card.Content>
        <Card.Footer class="flex justify-center content-end ">
            <div class="text-xs w-100 text-stone-400" >สลิปที่ถูกต้องต่อสลิปทั้งหมด   {#if dataOverview}{(dataOverview.pending_count/dataOverview.Total_count)*100}{:else}0{/if}%</div>
            
        </Card.Footer>
    </Card.Root>
    <Card.Root >
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-lg font-medium " style="height:40px">จำนวนรายการที่เป็นของปลอมทั้งหมด</Card.Title>
           
        </Card.Header>
        <Card.Content class="text-center lg:my-5">
            <div class=" content-center  w-100 h-30">
                {#if dataOverview}
                <div class="text-8xl font-bold w-100">
                    {dataOverview.false_count}</div>
                {:else}
                <div class="text-8xl font-bold w-100">
                    0</div>
               {/if}
            </div>
        </Card.Content>
        <Card.Footer class="flex justify-center content-end ">
            <div class="text-xs  w-100 text-stone-400" >สลิปที่ผิดต่อสลิปทั้งหมด {#if dataOverview}{(dataOverview.false_count/dataOverview.Total_count)*100}{:else}0{/if}%
            </div>
            
        </Card.Footer>
    </Card.Root>
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-lg font-medium" style="height:40px">จำนวนทั้งหมดที่ใช้งาน</Card.Title>
            
        </Card.Header>
        <Card.Content class="text-center ">
            <div>
                <p class=" w-100 h-32 content-center text-8xl">
                    {#if dataOverview}
                    <div class="text-8xl font-bold w-100 ">
                        {dataOverview.Total_count}</div>
                    {:else}
                    <div class="text-8xl font-bold w-100 ">
                        0</div>
                   {/if}
                </p>
                </div>
                <div class=" w-100 mt-2 mb-3 "><Button variant="outline" class="w-4/5 h-12 bg-blue-500 text-white" on:click={dowloadExportExcel}>Dowload Excel</Button></div>
        </Card.Content>
    </Card.Root>
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
            <Card.Title class="text-lg font-medium">การใช้งาน</Card.Title>
            
        </Card.Header>
        <Card.Content class="flex justify-center w-100 h-100" >
            <div>
            <div class="chart-container lg:w-60">
                <Pie {data} {options} class="w-9/12"/>
              </div>
              {#if dataOverview}
              <div class="my-3">
                <p class="text-center">{dataOverview.QuotaLimit -dataOverview.QuotaUsage} / {dataOverview.QuotaLimit}</p></div>
              {:else}
              <div class="my-3">
                <p class="text-center text-lg">0 / 0</p></div>
             {/if} 
             
        </div>
        </Card.Content>
    </Card.Root>
</div>
