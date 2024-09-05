<script lang="ts">
 
    import { Bar } from 'svelte-chartjs';
    import { Chart, registerables, type ChartOptions } from 'chart.js';
    import * as Card from "$lib/components/ui/card";
	import { afterUpdate,onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import cookie from 'cookie';
  import { PUBLIC_API_ENDPOINT } from '$env/static/public';

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
let year = today.getFullYear();
let chart: { update: () => void; };
    onMount(async () => {
		try {
			const datachart = await GetdataChart();
			dataChart=datachart;

			console.log('Chart : ',datachart);
      labels = Array.from(new Set(dataChart.map(item => formatDate(item.CreatedAt))));
      successValues = labels.map(label => {
    return dataChart
        .filter(item => 
            formatDate(item.CreatedAt) === label && 
            (item.Status === 'SUCCESS' || item.Status === 'success')
        )
        .length; // Count the number of successful items
});

failedValues = labels.map(label => {
    return dataChart
        .filter(item => 
            formatDate(item.CreatedAt) === label && 
            item.Status === 'FAILED'
        )
        .length; // Count the number of failed items
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
    const [year, month] = monthToSend.split("-");
    console.log("เดือน ",year, month,typeof(monthToSend))
		const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		console.log( 'id: ', id , typeof(id));
    let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionmonthline/${myCookie.Email}/${month}/${year}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionmonth/${myCookie.Id}/${month}/${year}`;
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
          backgroundColor: 'rgba(71, 205, 137, 0.8)',  // Green background
          borderColor: 'rgba(0, 128, 0, 1)',        // Green border
          borderWidth: 1
        },
        {
          label: 'สลิปปลอม',
          data: failedValues, // ตั้งค่าให้มีค่าเท่ากันสำหรับทุกเดือน
          backgroundColor: 'rgba(240, 68, 56, 0.8)',  // Red background
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


  

  

  let monthToSend=`${year}-${month.toString().padStart(2, '0')}`;

  
let searchPerformed = false;
let dataSearch: any[] = [];
async function SearchData(param1: string) {

		const datasearch = await searchGetdata(param1);
		
    dataSearch = datasearch
    console.log("res : ",dataSearch )
		searchPerformed = true;
    newlabels = Array.from(new Set(dataSearch.map(item => formatDate(item.CreatedAt))));
    newsuccessValues = newlabels.map(label => {
            const successCount = dataSearch.filter(item => 
                formatDate(item.CreatedAt) === label && 
                (item.Status === 'SUCCESS' || item.Status === 'success')
            ).length;
            console.log(`Success count for ${label}: `, successCount);
            return successCount;
        });

        newfailedValues = newlabels.map(label => {
            const failedCount = dataSearch.filter(item => 
                formatDate(item.CreatedAt) === label && 
                item.Status === 'FAILED'
            ).length;
            console.log(`Failed count for ${label}: `, failedCount);
            return failedCount;
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
  const searchGetdata = async (param1: string) => {
        // const id = sessionStorage.getItem('merchant_id');
       
        const [year, month] = param1.split("-");
        console.log("param1",param1,year,month)
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
        console.log("search ",myCookie.Id , param1 , typeof(param1))

        let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionmonthline/${myCookie.Email}/${month}/${year}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionmonth/${myCookie.Id}/${month}/${year}`;
    } else {
        console.error('No valid merchant account cookie found.');
        return;
    }
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const result = await fetch(apiUrl, config);
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
      กราฟแสดงข้อมูลรายเดือน
    </div>
    <div class="flex justify-end  relative" >
      <input 
      type="month" 
      bind:value={monthToSend} 
      class="border-2 border-neutral-950 rounded-lg lg:px-3 mx-2 border border-stone-400 text-zinc-500"
  />
        
        <Button
  variant="outline"
  class=" flex text-center py-0 px-0  text-white hover:text-black  bg-primary "
  on:click={() => SearchData(monthToSend)}
  style="width:40%;height:30px;"
  ><div class="mx-3 content-center"  style="width:100%;height:100%" >

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


