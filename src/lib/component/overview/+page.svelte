
<script lang="ts">
   
    import { Button } from '$lib/components/ui/button';
	import logo from"$lib/image/pack.png";
    import * as Card from "$lib/components/ui/card";
	import { Pie } from 'svelte-chartjs';
	import 'chart.js/auto';
    import { afterUpdate, onMount } from 'svelte';
    import cookie from 'cookie';

    import { PUBLIC_API_ENDPOINT } from '$env/static/public';
    let dataOverview: any[] = [];
    let max = 0;
	let datatoo=0;
	let maxr=1;
    const today = new Date();
  // Extract the current year and month
    let lastMonth = today.getMonth() - 1; // คำนวณเดือนที่แล้ว (0-11)
    let lastYear = today.getFullYear();

// ตรวจสอบกรณีที่เดือนเป็นมกราคม (เดือน 0) และลดปีลง
    if (lastMonth < 0) {
    lastMonth = 11; // ตั้งค่าเป็นเดือนธันวาคม
    lastYear -= 1; // ลดปีลง 1
    }
	let startDate = `${lastYear}-${(lastMonth + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    let endDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    console.log("rrrrr",startDate,endDate)


    let data = {
	  labels: ['จำนวนที่ใช้', 'จำนวนทั้งหมด'],
	  datasets: [{
		label: '',
		data: [datatoo,maxr],
		backgroundColor: [
            'rgb(217, 45, 32)',   // แทนที่สีแดงเข้มเดิม (Crimson) ด้วย #D92D20
            'rgb(17, 59, 212)',   // แทนที่สีน้ำเงินเข้มเดิม (Royal Blue) ด้วย #113BD4
		  
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
        finally {
      loading = false; // Set loading to false after fetching
    }

		


	});
    function updateChartData() {
        if (dataOverview.QuotaLimit === 0 && dataOverview.QuotaUsage === 0) {
    maxr = 1; // Set maxr to 1 directly if both are 0
        } else {
    datatoo = dataOverview.QuotaLimit - dataOverview.QuotaUsage;
    maxr = dataOverview.QuotaLimit - datatoo;
    
    }

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
		let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionline/${myCookie.Email}/${startDate}/${endDate}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionid/${myCookie.Id}/${startDate}/${endDate}`;
    } else {
        console.error('No valid merchant account cookie found.');
        return;
    }

    // Create configuration for the fetch request
    let config = {
        method: 'GET', // Use GET method
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        // Make the fetch request
        const result = await fetch(apiUrl, config);
        const datas = await result.json();
        console.log(datas);

        if (datas.result) {
            return datas.result[0];
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
		

	
	};

    const ExportExcel = async () => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log( 'id: ', myCookie.Id , typeof(myCookie.Id));
		
		console.log('checking get transaction');

        let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/exportexcelline/${myCookie.Email}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/exportexcel/${myCookie.Id}`;
    } else {
        console.error('No valid merchant account cookie found.');
        return;
    }

		// Create URL parameters from form data
		let config = {
			method: 'GET', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json'
            }
		};
		var result = await fetch(apiUrl, config);
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
let loading = true;
const SearchTransaction = async (startDate:String,endDate:String) => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		// console.log( 'id: ', id , typeof(id));
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
		
		console.log('checking get transaction');

		// Create URL parameters from form data
		let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionline/${myCookie.Email}/${startDate}/${endDate}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionid/${myCookie.Id}/${startDate}/${endDate}`;
    } else {
        console.error('No valid merchant account cookie found.');
        return;
    }

    // Create configuration for the fetch request
    let config = {
        method: 'GET', // Use GET method
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        // Make the fetch request
        const result = await fetch(apiUrl, config);
        const datas = await result.json();
        console.log(datas);

        if (datas.result) {
            return datas.result[0];
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
		

	
	};

    let searchPerformed = false;

    async function SearchData(startDate:String,endDate:String) {

		const data = await SearchTransaction(startDate,endDate);
		dataOverview = data
		console.log("Search :" ,dataOverview)
		searchPerformed = true;
	
	
 // Replace with your actual URL

  }

	
</script>

<div class="lg:flex md:flex lg:justify-between md:justify-between font-bold ">
    <div class="text-2xl content-center">
	<h1>Dashboard</h1>
</div>
<div class="  grid gap-1 grid-cols-5 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 text-md my-3  ">
    <div class="flex lg:justify-end md:justify-end sm:justify-end justify-center col-span-2 ">
        <input type="date" bind:value={startDate} placeholder="DD/MM/YYYY" class="lg:w-32 md:w-32 sm:w-30 w-30 rounded-lg border border-stone-400 text-zinc-500  ps-2"/>
        
        
    </div>
    <div class=" lg:mx-5 md:mx-5 sm:mx-5  flex justify-center">
        <h3 class="content-center">ถึง</h3>
    </div>
    <div class="flex col-span-2">
      
        <input type="date" bind:value={endDate} placeholder="DD/MM/YYYY" class="lg:w-32 md:w-32 sm:w-30 w-30 rounded-lg border border-stone-400  text-zinc-500 ps-2"/>
    </div>
    <div class="content-end flex justify-center lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-5">
        <Button
    variant="outline"
    class=" flex text-center py-0 px-0 mx-2   text-white hover:text-black bg-primary hover:bg-white"
    on:click={() => SearchData(startDate,endDate)}
    style="width:100%;height:30px;"
    ><div class="mx-3 content-center"  style="width:100%;height:100%" >
  
      ค้นหา
    </div>
    </Button
    >
       
    </div>
    
</div>
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

                {#if loading}
                <div class="flex justify-center">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                class="spin "
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 128 128"
            >
                <path
                    d="M14.5 39.8c-1.5-.6-3.3.1-3.9 1.6-2.4 5.8-3.9 11.9-4.4 18.1-.1 1.7 1.1 3.1 2.8 3.2.1 0 .2 0 .2 0 1.6 0 2.9-1.2 3-2.8.4-5.6 1.8-11.1 3.9-16.2C16.7 42.2 16 40.5 14.5 39.8zM113.1 39.1c-1.5.7-2.2 2.4-1.5 4 8.7 19.8 4.5 42.5-10.8 57.8C90.9 110.6 77.9 116 64 116c-11.2 0-21.9-3.5-30.8-10.1l0 0h4.9c1.7 0 3-1.3 3-3s-1.3-3-3-3h-13c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3s3-1.3 3-3v-6.3l0 0C38.6 117.8 51.3 122 64 122c14.9 0 29.7-5.7 41-17 17.1-17.1 21.8-42.3 12.1-64.4C116.4 39.1 114.6 38.4 113.1 39.1zM90.1 22.1c-1.6 0-3.1 1.2-3.2 2.8-.1 1.7 1.3 3.2 3 3.2h13c1.7 0 3-1.3 3-3V12.3c0-1.6-1.2-3.1-2.8-3.2-1.7-.1-3.2 1.3-3.2 3v6.3C78 1.1 46.3 1.9 25.3 20.8 24 22 24 24 25.2 25.2c1.1 1.1 2.9 1.2 4.1.1C38.9 16.7 51.1 12 64 12c11.2 0 21.9 3.5 30.8 10.1l0 0H90.1zM11.5 77.69999999999999A2.9 2.9 0 1 0 11.5 83.5 2.9 2.9 0 1 0 11.5 77.69999999999999z"
                ></path>
            </svg>
        </div>
            {:else}
                <div class="text-8xl font-bold w-100">
                    {dataOverview ? dataOverview.Success_count : 0}
                </div>
            {/if}
            </div>
            
			</div>
        </Card.Content>
        <Card.Footer class="flex justify-center content-end ">
            <div class="text-xs w-100 text-stone-400" >สลิปที่ถูกต้องต่อสลิปทั้งหมด   {#if dataOverview}{(dataOverview.Success_count / dataOverview.Total_count * 100).toFixed(2)}{:else}0{/if}%</div>
            
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
                {#if loading}
                <div class="flex justify-center">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="spin "
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 128 128"
                >
                    <path
                        d="M14.5 39.8c-1.5-.6-3.3.1-3.9 1.6-2.4 5.8-3.9 11.9-4.4 18.1-.1 1.7 1.1 3.1 2.8 3.2.1 0 .2 0 .2 0 1.6 0 2.9-1.2 3-2.8.4-5.6 1.8-11.1 3.9-16.2C16.7 42.2 16 40.5 14.5 39.8zM113.1 39.1c-1.5.7-2.2 2.4-1.5 4 8.7 19.8 4.5 42.5-10.8 57.8C90.9 110.6 77.9 116 64 116c-11.2 0-21.9-3.5-30.8-10.1l0 0h4.9c1.7 0 3-1.3 3-3s-1.3-3-3-3h-13c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3s3-1.3 3-3v-6.3l0 0C38.6 117.8 51.3 122 64 122c14.9 0 29.7-5.7 41-17 17.1-17.1 21.8-42.3 12.1-64.4C116.4 39.1 114.6 38.4 113.1 39.1zM90.1 22.1c-1.6 0-3.1 1.2-3.2 2.8-.1 1.7 1.3 3.2 3 3.2h13c1.7 0 3-1.3 3-3V12.3c0-1.6-1.2-3.1-2.8-3.2-1.7-.1-3.2 1.3-3.2 3v6.3C78 1.1 46.3 1.9 25.3 20.8 24 22 24 24 25.2 25.2c1.1 1.1 2.9 1.2 4.1.1C38.9 16.7 51.1 12 64 12c11.2 0 21.9 3.5 30.8 10.1l0 0H90.1zM11.5 77.69999999999999A2.9 2.9 0 1 0 11.5 83.5 2.9 2.9 0 1 0 11.5 77.69999999999999z"
                    ></path>
                </svg>
            </div>
            {:else}
                <div class="text-8xl font-bold w-100">
                    {dataOverview ? dataOverview.false_count : 0}
                </div>
            {/if}
            </div>
        </Card.Content>
        <Card.Footer class="flex justify-center content-end ">
            <div class="text-xs  w-100 text-stone-400" >สลิปที่ผิดต่อสลิปทั้งหมด {#if dataOverview}{((dataOverview.false_count/dataOverview.Total_count)*100).toFixed(2)}{:else}0{/if}%
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

                   {#if loading}
                   <div class="flex justify-center">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="spin "
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 128 128"
                >
                    <path
                        d="M14.5 39.8c-1.5-.6-3.3.1-3.9 1.6-2.4 5.8-3.9 11.9-4.4 18.1-.1 1.7 1.1 3.1 2.8 3.2.1 0 .2 0 .2 0 1.6 0 2.9-1.2 3-2.8.4-5.6 1.8-11.1 3.9-16.2C16.7 42.2 16 40.5 14.5 39.8zM113.1 39.1c-1.5.7-2.2 2.4-1.5 4 8.7 19.8 4.5 42.5-10.8 57.8C90.9 110.6 77.9 116 64 116c-11.2 0-21.9-3.5-30.8-10.1l0 0h4.9c1.7 0 3-1.3 3-3s-1.3-3-3-3h-13c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3s3-1.3 3-3v-6.3l0 0C38.6 117.8 51.3 122 64 122c14.9 0 29.7-5.7 41-17 17.1-17.1 21.8-42.3 12.1-64.4C116.4 39.1 114.6 38.4 113.1 39.1zM90.1 22.1c-1.6 0-3.1 1.2-3.2 2.8-.1 1.7 1.3 3.2 3 3.2h13c1.7 0 3-1.3 3-3V12.3c0-1.6-1.2-3.1-2.8-3.2-1.7-.1-3.2 1.3-3.2 3v6.3C78 1.1 46.3 1.9 25.3 20.8 24 22 24 24 25.2 25.2c1.1 1.1 2.9 1.2 4.1.1C38.9 16.7 51.1 12 64 12c11.2 0 21.9 3.5 30.8 10.1l0 0H90.1zM11.5 77.69999999999999A2.9 2.9 0 1 0 11.5 83.5 2.9 2.9 0 1 0 11.5 77.69999999999999z"
                    ></path>
                </svg>
            </div>
               {:else}
                   <div class="text-8xl font-bold w-100">
                       {dataOverview ? dataOverview.Total_count : 0}
                   </div>
               {/if}
                </p>
                </div>
                <div class=" w-100 mt-2 mb-3 " ><Button variant="outline" class="w-4/5 h-12 text-white hover:text-black  bg-primary" on:click={dowloadExportExcel} >Dowload Excel</Button></div>
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

<style scoped>
    .spin {
		display: inline-block;
		animation: spin 2s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>