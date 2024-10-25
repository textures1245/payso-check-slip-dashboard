
<script lang="ts">
  
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card";
	import { Pie } from 'svelte-chartjs';
	import 'chart.js/auto';
    import { afterUpdate, onMount } from 'svelte';
    import cookie from 'cookie';
    import { PUBLIC_API_ENDPOINT } from '$env/static/public';
    import date from"$lib/image/calendar.png";

    import { Thai } from 'flatpickr/dist/l10n/th.js';
	import flatpickr from 'flatpickr';
    
    let dataOverview: any[] = [];
	let datatoo=0;
	let maxr=1;
    const today = new Date();
  // Extract the current year and month
    let lastMonth = today.getMonth() - 1; // คำนวณเดือนที่แล้ว (0-11)
    let lastYear = today.getFullYear();
    let searchPerformed = false;
    let loading = true;
// ตรวจสอบกรณีที่เดือนเป็นมกราคม (เดือน 0) และลดปีลง
    if (lastMonth < 0) {
    lastMonth = 11; // ตั้งค่าเป็นเดือนธันวาคม
    lastYear -= 1; // ลดปีลง 1
    }
    let startDate = new Date(lastYear, lastMonth, today.getDate());
    let endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
     let startDatePicker: Node;
    let endDatePicker: Node;
    let selectedStartDate = startDate;
    let selectedEndDate = endDate;
    let billDateOnly = "";

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
      plugins: {
        datalabels: {
          display: true,
          anchor: 'center',    // ตำแหน่งกลางของ Pie chart
          align: 'center',     // จัดข้อความให้อยู่กลาง Pie chart
          formatter: (value, context) => {
      // คำนวณเปอร์เซ็นต์
      let total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0); // ผลรวมของข้อมูลทั้งหมด
      let percentage = (value / total) * 100; // คำนวณเปอร์เซ็นต์

      // แสดงค่าเฉพาะเมื่อเปอร์เซ็นต์มากกว่า 5%
      return percentage > 9 ? value.toLocaleString() : '';
    },
          color: '#fff',        // สีของตัวอักษร
          font: {
            size: 13,           // ขนาดตัวอักษร
            weight: 'bold'      // ตัวหนา
          },
          padding: {
            bottom: 5           // ระยะห่างจากขอบล่าง
          }
        }
      }
	};

    
    function getCookies() {
  return cookie.parse(document.cookie);
}
const formatDate = (/** @type {Date} */ date: Date) => {
        const months = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.",
  "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.",
  "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()]; // ใช้เดือนในภาษาไทย
      const year = date.getFullYear(); // ใช้ปี ค.ศ.
      return `${day} ${month} ${year}`;
    };
  
    const getFormattedDate = (/** @type {Date} */ date: Date) => {
      const year = date.getFullYear(); // ใช้ปี ค.ศ.
      const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มนับจาก 0
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    onMount(async () => {
        flatpickr(startDatePicker, {
        dateFormat: 'Y-m-d', // ส่งวันที่ในรูปแบบปี-เดือน-วัน
        locale: Thai,
        defaultDate: startDate, // ตั้งค่าวันที่เริ่มต้นใน Flatpickr
        onChange: (selectedDates: Date[]) => {
          selectedStartDate = selectedDates[0]; // อัปเดตค่าวันที่เมื่อเปลี่ยน
          startDatePicker.value = formatDate(selectedStartDate); // อัปเดตค่าของ input เมื่อเปลี่ยนวัน
        },
      });
      
      flatpickr(endDatePicker, {
        dateFormat: 'Y-m-d', // ส่งวันที่ในรูปแบบปี-เดือน-วัน
        locale: Thai,
        defaultDate: endDate, // ตั้งค่าวันที่สิ้นสุดใน Flatpickr
        onChange: (selectedDates: Date[]) => {
          selectedEndDate = selectedDates[0]; // อัปเดตค่าวันที่เมื่อเปลี่ยน
          endDatePicker.value = formatDate(selectedEndDate); // อัปเดตค่าของ input เมื่อเปลี่ยนวัน
        },
      });
  
      // ตั้งค่าเริ่มต้นใน input ให้แสดงเป็น "18 ตุลาคม 2024"
      startDatePicker.value = formatDate(selectedStartDate);
      endDatePicker.value = formatDate(selectedEndDate);
		try {
			const data = await GetTransactionByid();
			// Use profileData here
			dataOverview =data;
			console.log('data : ',dataOverview , "rdata :",data);
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
		localStorage.setItem('startDate', startDate.toISOString().split('T')[0]);
        localStorage.setItem('endDate', endDate.toISOString().split('T')[0]);
        const formattedStartDate = getFormattedDate(selectedStartDate);
        const formattedEndDate = getFormattedDate(selectedEndDate);
		console.log('checking get transaction' ,startDate,endDate);

		// Create URL parameters from form data
		let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionline/${myCookie.Email}/${formattedStartDate}/${formattedEndDate}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionid/${myCookie.Id}/${formattedStartDate}/${formattedEndDate}`;
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
        console.log("datas",datas.result[0]);
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
		console.log( 'id: ', myCookie.Id , typeof(myCookie.Id),startDate,endDate);
		console.log('checking get transaction');
        const formattedStartDate = getFormattedDate(selectedStartDate);
        const formattedEndDate = getFormattedDate(selectedEndDate);
        let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/exportexcelline/${myCookie.Email}/${formattedStartDate}/${formattedEndDate}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/exportexcel/${myCookie.Id}/${formattedStartDate}/${formattedEndDate}`;
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

const SearchTransaction = async (startDate:string,endDate:string) => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		// console.log( 'id: ', id , typeof(id));
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email,startDate,endDate);
		localStorage.setItem('startDate', startDate);
        localStorage.setItem('endDate', endDate);
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
        console.log("datas",datas);

        if (datas.result) {
            return datas.result[0];
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
		

	
	};

    
    async function SearchData() {
        const formattedStartDate = getFormattedDate(selectedStartDate);
        const formattedEndDate = getFormattedDate(selectedEndDate);
        console.log("กำลังค้นหาจาก:", formattedStartDate, "ถึง:", formattedEndDate);
		const data = await SearchTransaction(formattedStartDate,formattedEndDate);
		if (data) {
        dataOverview = data; // ตรวจสอบให้แน่ใจว่านี่เป็นแบบ reactive
    } else {
        console.error("ไม่มีข้อมูลส่งคืนจาก SearchTransaction.");
    }
		console.log("Search :" ,dataOverview )
		searchPerformed = true;
	

  }


</script>

<div class="lg:flex md:flex lg:justify-between md:justify-between font-bold ">
    <div class="text-4xl content-center">
	<h1>แดชบอร์ด</h1>
</div>
<div class="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-2 my-3">
    <div class="flex items-center space-x-2 w-full md:w-auto">
        <div class="relative w-full md:w-44">
            <input
                type="text"
                bind:this={startDatePicker}
                class="px-2 py-1 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17B26A] focus:border-transparent pr-8"
                readonly
            />
            <img
                src="{date}"
                width="20"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                alt="Calendar Icon"
            />
        </div>
        <span class="whitespace-nowrap ">ถึง</span>
        <div class="relative w-full md:w-44">
            <input
                type="text"
                bind:this={endDatePicker}
                class="px-2 py-1 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17B26A] focus:border-transparent pr-8"
                readonly
            />
            <img
                src="{date}"
                width="20"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                alt="Calendar Icon"
            />
        </div>
    </div>
   
    <Button

  class=" flex text-center w-full md:w-auto px-4 py-1  text-white   bg-primary hover:bg-[#050680] "
  on:click={() => SearchData()}
  style="width:100%;height:30px;"
  ><div class="mx-3 content-center font-semibold"  style="width:100%;height:100%" >

    ค้นหา
  </div>
  </Button
  >
</div>

</div>



<div class="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 " style="width: 100%;">
    <Card.Root >
        <Card.Header
            class="flex flex-row items-center justify-center space-y-0 pb-2 "
        >
            <Card.Title class="text-xl font-semibold text-center" style="height:60px">สลิปที่ถูกต้อง</Card.Title>
            
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
        <Card.Footer class="flex justify-center  content-end lg:h-20" >
            <div class="text-lg w-100 text-stone-400 text-center" ><a class="text-black font-semibold">{#if dataOverview && dataOverview.Success_count == 0 || loading}0{:else}{(dataOverview.Success_count / dataOverview.Total_count * 100).toFixed(2)}{/if}%</a> ของสลีปทั้งหมด   </div>
        </Card.Footer>
    </Card.Root>
    <Card.Root >
        <Card.Header
            class="flex flex-row items-center justify-center space-y-0 pb-2 text-center"
        >
            <Card.Title class="text-xl font-semibold " style="height:60px">สลิปที่ผิด</Card.Title>
           
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
        <Card.Footer class="flex justify-center content-end lg:h-20 mt-auto">
            <div class="text-lg  w-100 text-stone-400 text-center" ><a class="text-black font-semibold">{#if dataOverview && dataOverview.false_count == 0 || loading}0{:else}{((dataOverview.false_count/dataOverview.Total_count)*100).toFixed(2)}{/if}%</a> ของสลีปทั้งหมด
            </div>
            
        </Card.Footer>
    </Card.Root>
    
    <Card.Root >
        <Card.Header
            class="flex flex-row items-center justify-center space-y-0 pb-2 text-center"
        >
            <Card.Title class="text-xl font-semibold " style="height:60px">สลิปรอตรวจสอบ</Card.Title>
           
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
                    {dataOverview ? dataOverview.Pending_count : 0}
                </div>
            {/if}
            </div>
        </Card.Content>
        <Card.Footer class="flex justify-center content-end lg:h-20 mt-auto">
            <div class="text-lg  w-100 text-stone-400 text-center" ><a class="text-black font-semibold">{#if dataOverview && dataOverview.Pending_count == 0 || loading}0{:else}{((dataOverview.Pending_count/dataOverview.Total_count)*100).toFixed(2)}{/if}%</a> ของสลีปทั้งหมด
            </div>
            
        </Card.Footer>
    </Card.Root>
    <Card.Root >
        <Card.Header
            class="flex flex-row items-center justify-center space-y-0 pb-2 text-center"
        >
            <Card.Title class="text-xl font-semibold " style="height:60px">สลิปปฏิเสธคำขอ</Card.Title>
           
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
                    {dataOverview ? dataOverview.Request_Rejected_Count : 0}
                </div>
            {/if}
            </div>
        </Card.Content>
        <Card.Footer class="flex justify-center content-end lg:h-20 mt-auto">
            <div class="text-lg  w-100 text-stone-400 text-center" ><a class="text-black font-semibold">{#if dataOverview && dataOverview.Request_Rejected_Count == 0 || loading}0{:else}{((dataOverview.Request_Rejected_Count/dataOverview.Total_count)*100).toFixed(2)}{/if}%</a> ของสลีปทั้งหมด
            </div>
            
        </Card.Footer>
    </Card.Root>
    <Card.Root >
        <Card.Header
            class="flex flex-row items-center justify-center space-y-0 pb-2 text-center"
        >
            <Card.Title class="text-xl font-semibold " style="height:60px">สลิปปฏิเสธตอบกลับ</Card.Title>
           
        </Card.Header>
        <Card.Content class="text-center lg:my-5 my-5">
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
                    {dataOverview ? dataOverview.Respond_Rejected_Count : 0}
                </div>
            {/if}
            </div>
        </Card.Content>
        <Card.Footer class="flex justify-center content-end lg:h-20 mt-auto">
            <div class="text-lg  w-100 text-stone-400 text-center" ><a class="text-black font-semibold">{#if dataOverview && dataOverview.Respond_Rejected_Count == 0 || loading}0{:else}{((dataOverview.Respond_Rejected_Count/dataOverview.Total_count)*100).toFixed(2)}{/if}%</a> ของสลีปทั้งหมด
            </div>
            
        </Card.Footer>
    </Card.Root>
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-center space-y-0 pb-2"
        >
            <Card.Title class="text-xl  font-semibold text-center" style="height:60px">จำนวนทั้งหมดที่ใช้งาน </Card.Title>
            
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
                <div class=" w-100 mt-2 mb-3  " ><Button  class="w-4/5 h-12 text-white  bg-primary font-semibold hover:bg-[#050680]" on:click={dowloadExportExcel} >ดาวน์โหลดไฟล์ Excel</Button></div>
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