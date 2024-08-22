<script lang="ts">
 
    import { Bar } from 'svelte-chartjs';
    import { Chart, registerables, type ChartOptions } from 'chart.js';
    import * as Card from "$lib/components/ui/card";
	import { afterUpdate,onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import cookie from 'cookie';

    // Register Chart.js components
    Chart.register(...registerables);
let dataChart: any[] = [];
let labels: string[] = [];
let successValues: number[] = [];
let failedValues: number[] = [];

let newlabels: string[] = [];
let newsuccessValues: number[] = [];
let newfailedValues: number[] = [];
let today = new Date();
let month = today.getMonth() + 1;
let chart: { update: () => void; };
    onMount(async () => {
		try {
			const datachart = await GetdataChart();
			dataChart=datachart;

			console.log('Chart : ',datachart);
      labels = Array.from(new Set(dataChart.map(item => formatDate(item.CreatedAt))));
      successValues = labels.map(label => {
        return dataChart
          .filter(item => formatDate(item.CreatedAt) === label && item.Status === 'SUCCESS' || item.Status === 'success')
          .length; // นับจำนวนรายการที่สำเร็จ
      });
      failedValues = labels.map(label => {
        return dataChart
          .filter(item => formatDate(item.CreatedAt) === label && item.Status === 'FAILED')
          .length; // นับจำนวนรายการที่ล้มเหลว
      });


      data.labels = labels;
      data.datasets[0].data = successValues;
      data.datasets[1].data = failedValues;
    console.log("ข้อมูล",labels,successValues,failedValues)
 
    if (chart) {
               chart.update(); // Ensure chart is updated with new data
           }


		} catch (error) {
			console.error('Error fetching profile:', error);
		}


	});

  const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-US', options); // ใช้รูปแบบที่ต้องการ
};
    const GetdataChart = async () => {
      const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
    console.log("เดือน ",monthToSend,typeof(monthToSend))
		const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		console.log( 'id: ', id , typeof(id));

		// Create URL parameters from form data
		let config = {
			method: 'GET', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json'
            }
		};
		var result = await fetch(`http://127.0.0.1:4567/api/v1/trasaction/transactionmonth/${myCookie.Id}/${month}`, config);
		const datas = await result.json();
    console.log('Fetched data:', datas.result); 
    if(datas){
      return datas.result
    }
		

	};

  
    // Sample data for the bar chart

    const data = {
     labels: Array.from({ length: 30 }, (_, i) => `Jul ${i + 1}`),
      
      datasets: [
        {
          label: 'สลิปจริง',
          data: successValues,
          backgroundColor: 'rgba(0, 128, 0, 0.2)',  // Green background
          borderColor: 'rgba(0, 128, 0, 1)',        // Green border
          borderWidth: 1
        },
        {
          label: 'สลิปปลอม',
          data: failedValues, // ตั้งค่าให้มีค่าเท่ากันสำหรับทุกเดือน
          backgroundColor: 'rgba(255, 0, 0, 0.2)',  // Red background
          borderColor: 'rgba(255, 0, 0, 1)',        // Red border
          borderWidth: 1
        }
      ]
    };


    
    // Chart options
    const options = {
    responsive: true,
    plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true
        },
        mode: 'xy',
      },
      pan: {
        enabled: true,
        mode: 'xy',
      }
    },
  },
    animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  scales: {
    x: {
      ticks: {
        color: 'black', // ตั้งค่าสีของอักษรบนแกน x
        font: {
          size: 10, // ตั้งค่าขนาดตัวอักษร
          weight: 'normal' // ตั้งค่าความหนาของตัวอักษร
        }
      },
      grid: {
        display: false, // ไม่แสดง grid lines บนแกน x
      }
    },
    y: {
      ticks: {
        color: 'black', // ตั้งค่าสีของอักษรบนแกน y
        font: {
          size: 10, // ตั้งค่าขนาดตัวอักษร
          weight: 'normal' // ตั้งค่าความหนาของตัวอักษร
        }
      },
      grid: {
        display: false, // ไม่แสดง grid lines บนแกน y
      }
    }
  }
  };


  

  

  let monthToSend=month;

  const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];
let searchPerformed = false;
let dataSearch: any[] = [];
async function SearchData(param1: number) {

		const datasearch = await searchGetdata(param1);
		
    dataSearch = datasearch
    console.log("res : ",dataSearch)
		searchPerformed = true;
    newlabels = Array.from(new Set(dataSearch.map(item => formatDate(item.CreatedAt))));
    newsuccessValues = labels.map(label => {
        return dataSearch
          .filter(item => formatDate(item.CreatedAt) === label && item.Status === 'SUCCESS' || item.Status === 'success')
          .length; // นับจำนวนรายการที่สำเร็จ
      });

    newfailedValues = labels.map(label => {
        return dataSearch
          .filter(item => formatDate(item.CreatedAt) === label && item.Status === 'FAILED')
          .length; // นับจำนวนรายการที่ล้มเหลว
      });
      data.labels = newlabels;
      data.datasets[0].data = newsuccessValues;
      data.datasets[1].data = newfailedValues;
    console.log("ข้อมูล res :",newlabels,newsuccessValues,newfailedValues)
   
    if (chart) {
           chart.update(); // Ensure chart is updated with new data
       }
	

  }
  function getCookies() {
  return cookie.parse(document.cookie);
}
  const searchGetdata = async (param1: number) => {
        // const id = sessionStorage.getItem('merchant_id');
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
        console.log("search ",myCookie.Id , param1 , typeof(param1))
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const result = await fetch(`http://127.0.0.1:4567/api/v1/trasaction/transactionmonth/${myCookie.Id}/${param1}`, config);
        const datas = await result.json();
        console.log("data res : ",datas.result)
        return datas.result;
    };

    
    
//     afterUpdate(() => {
//     if (chart) {
//         chart.update(); // Ensure chart is updated with new data
//     }
// });

  
  </script>





<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-1 " style="height: 100%;">
  <div class="flex justify-between my-2 " style="height: 30px;width:96%">
    <div>
      กราฟแสดงข้อมูลรายวัน
    </div>
    <div class="flex justify-end" >
      <select bind:value={monthToSend} class="border-2 border-neutral-950 mx-2 rounded-lg">
        <option value="" disabled selected >Select a status</option>
        {#each months as month}
          <option value="{month.value}">{month.label}</option>
        {/each}
        </select>
        <Button
  variant="outline"
  class=" flex text-center py-0 px-0 bg-blue-500 rounded-full text-white"
  on:click={() => SearchData(monthToSend)}
  style="width:40%;height:30px"
  ><div class="mx-3 content-center"  style="width:100%;height:100%">

    ค้นหา
  </div>
  </Button
  >
    </div>
  </div>
<div style="height:100%;width:96%" class="content-center">
  {#if searchPerformed == true}
  
      <Bar {data} {options}  />
  {:else}
  
      <Bar {data} {options}  />
  {/if}
 
</div>
</div>
