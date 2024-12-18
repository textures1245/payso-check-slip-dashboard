
<script lang="ts">
  
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card";
	import { Pie } from 'svelte-chartjs';
    import * as Carousel from "$lib/components/ui/carousel";
	import 'chart.js/auto';
    import { afterUpdate, onMount } from 'svelte';
    import cookie from 'cookie';
    import { PUBLIC_API_ENDPOINT } from '$env/static/public';
    import date from"$lib/image/calendar.png";

    import { Thai } from 'flatpickr/dist/l10n/th.js';
	import flatpickr from 'flatpickr';
    
    let dataOverview: any[] = [];
    let dataAmountview: any[] = [];
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
    let totalAmount:Number;
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
        legend: {
      display: false // ปิดการแสดงแถบสี (legend)
    },
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
        disableMobile: true,
        allowInput: false,
        defaultDate: startDate, // ตั้งค่าวันที่เริ่มต้นใน Flatpickr
        onChange: (selectedDates: Date[]) => {
          selectedStartDate = selectedDates[0]; // อัปเดตค่าวันที่เมื่อเปลี่ยน
          startDatePicker.value = formatDate(selectedStartDate); // อัปเดตค่าของ input เมื่อเปลี่ยนวัน
        },
      });
      
      flatpickr(endDatePicker, {
        dateFormat: 'Y-m-d', // ส่งวันที่ในรูปแบบปี-เดือน-วัน
        locale: Thai,
        disableMobile: true,
        allowInput: false,
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
            const dataAmount = await GetAmountByid();
            localStorage.setItem('branchId', 'All');
			// Use profileData here
            totalAmount = dataAmount.reduce((acc: number, curr: { TotalAmount: any; }) => {
  const amount = Number(curr.TotalAmount);
  return acc + (isNaN(amount) ? 0 : amount);
}, 0);
			dataOverview =data;
            dataAmountview = dataAmount
			console.log('data : ',dataAmount , "rdata :", totalAmount);
            if(dataOverview){
                updateChartData();
            }else{
                
            }
            

            handleResize();
    window.addEventListener('resize', handleResize);
    
    // Clean up the event listener when component is destroyed
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
        console.log('กำลังค้นหาจากวันที่' ,startDate,endDate);
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
		localStorage.setItem('startDate', startDate.toLocaleDateString('en-CA').split('T')[0]);
        localStorage.setItem('endDate', endDate.toLocaleDateString('en-CA').split('T')[0]);
        const formattedStartDate = getFormattedDate(selectedStartDate);
        const formattedEndDate = getFormattedDate(selectedEndDate);

		// Create URL parameters from form data
		let apiUrl;
    // if (myCookie && myCookie.Type === "Line1") {
    //     apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionline/${myCookie.Email}/${formattedStartDate}/${formattedEndDate}`;
    // } else 
    if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionid/13/${formattedStartDate}/${formattedEndDate}/-`;
    } else {
        console.error('No valid merchant account cookie found.');
        return;
    }
    

    // Create configuration for the fetch request
    let config = {
        method: 'GET', // Use GET method
        headers: {
            'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
        }
    };

    try {
        // Make the fetch request
        const result = await fetch(apiUrl, config);
        const datas = await result.json();
        console.log("datas+++++++++++++++",datas.result[0]);
        if (datas.result) {
            return datas.result[0];
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
		

	
	};

    const GetAmountByid = async () => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		// console.log( 'id: ', id , typeof(id));
        console.log('กำลังค้นหาจากวันที่' ,startDate,endDate);
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
		localStorage.setItem('startDate', startDate.toLocaleDateString('en-CA').split('T')[0]);
        localStorage.setItem('endDate', endDate.toLocaleDateString('en-CA').split('T')[0]);
        const formattedStartDate = getFormattedDate(selectedStartDate);
        const formattedEndDate = getFormattedDate(selectedEndDate);
		

		// Create URL parameters from form data
		let apiUrl;
    // if (myCookie && myCookie.Type === "Line1") {
    //     apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionline/${myCookie.Email}/${formattedStartDate}/${formattedEndDate}`;
    // } else 
    if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/amount/13/${formattedStartDate}/${formattedEndDate}/-`;
    } else {
        console.error('No valid merchant account cookie found.');
        return;
    }
    

    // Create configuration for the fetch request
    let config = {
        method: 'GET', // Use GET method
        headers: {
            'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
        }
    };

    try {
        // Make the fetch request
        const result = await fetch(apiUrl, config);
        const datas = await result.json();
        console.log("datas",datas.result);
        if (datas.result) {
            return datas.result;
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
    // if (myCookie && myCookie.Type === "Line1") {
    //     apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/exportexcelline/${myCookie.Email}/${formattedStartDate}/${formattedEndDate}`;
    // } else 
    if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/exportexcel/${myCookie.Id}/${formattedStartDate}/${formattedEndDate}`;
    } else {
        console.error('No valid merchant account cookie found.');
        return;
    }

		// Create URL parameters from form data
		let config = {
			method: 'GET', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
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

const SearchTransaction = async (startDate:string,endDate:string,branchId:string) => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		// console.log( 'id: ', id , typeof(id));
        const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",branchId);
		localStorage.setItem('startDate', startDate);
        localStorage.setItem('endDate', endDate);
		console.log('checking get transaction');
		// Create URL parameters from form data
		let apiUrl;
    // if (myCookie && myCookie.Type === "Line") {
    //     apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionline/${myCookie.Email}/${startDate}/${endDate}`;
    // } else 
    if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionid/13/${startDate}/${endDate}/${branchId}`;
    } else {
        console.error('No valid merchant account cookie found.');
        return;
    }
    // Create configuration for the fetch request
    let config = {
        method: 'GET', // Use GET method
        headers: {
            'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
        }
    };

    try {
        // Make the fetch request
        const result = await fetch(apiUrl, config);
        const datas = await result.json();
        console.log("datas-------------",datas);

        if (datas.result) {
            return datas.result[0];
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
		

	
	};
    const SearchTransactionAmountByid = async (startDate:string,endDate:string,branchId:string) => {
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
    // if (myCookie && myCookie.Type === "Line1") {
    //     apiUrl = `${PUBLIC_API_ENDPOINT}/trasactionline/${myCookie.Email}/${formattedStartDate}/${formattedEndDate}`;
    // } else 
    if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/amount/13/${startDate}/${endDate}/${branchId}`;
    } else {
        console.error('No valid merchant account cookie found.');
        return;
    }
    

    // Create configuration for the fetch request
    let config = {
        method: 'GET', // Use GET method
        headers: {
            'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
        }
    };

    try {
        // Make the fetch request
        const result = await fetch(apiUrl, config);
        const datas = await result.json();
        console.log("datas",datas.result);
        
        if (datas.result) {
            return datas.result;
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
		

	
	};


interface TransactionData {
    Id: string;
    RoomName: string;
    TotalAmount: number;
    branch?: string;
    // Add other fields as needed
}


async function SearchData(view: 'all' | 'branch' = 'all', branchId?: string) {
    try {
        const formattedStartDate = getFormattedDate(selectedStartDate);
        const formattedEndDate = getFormattedDate(selectedEndDate);
        console.log("กำลังค้นหาจาก:", formattedStartDate, "ถึง:", formattedEndDate);
        let branchParam = localStorage.getItem('branchId');
		branchParam = branchParam === 'All' ? '-' : branchParam;

      
        // สร้าง default data structure
        const defaultData = {
            Total_count: 0,
            Success_count: 0,
            false_count: 0,
            BANK_ACC_NOT_MATCH_Count: 0,
            QuotaLimit: 0,
            QuotaUsage: 0,
            BillDate: "-",
            // เพิ่ม fields อื่นๆ ที่จำเป็น
        };
        
        const defaultDataAmount = {
            TotalAmount: 0,
            // เพิ่ม fields อื่นๆ ที่จำเป็น
        };

        // รีเซ็ตค่าเริ่มต้น
        dataOverview = defaultData;
        totalAmount = 0;
        searchPerformed = true;
        
        const data = await SearchTransaction(formattedStartDate, formattedEndDate, branchParam);
        const dataAmount = await SearchTransactionAmountByid(formattedStartDate, formattedEndDate, "-");

        // ถ้ามีข้อมูล
        if (data && Object.keys(data).length > 0) {
            dataOverview = data;
            dataAmountview=dataAmount
            console.log("-++5+5+5+5+5+5+5+5+",dataAmount)
            // คำนวณยอดรวม
            totalAmount = dataAmount.reduce((acc: number, curr: TransactionData) => {
                const amount = Number(curr.TotalAmount);
                const branchParamInt = branchParam === '-' ? '-' : parseInt(branchParam);
                console.log(curr.Id,branchParam ,amount )
                if (branchParam === '-' || curr.Id === branchParamInt) {
                    console.log(curr.Id ,branchId )
                    return acc + (isNaN(amount) ? 0 : amount);
                }
                return acc;
            }, 0);
            
            return { success: true, data, dataAmountview };
        } else {
            // กรณีไม่พบข้อมูล ส่งค่า default กลับไป
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการค้นหา:", error);
        // กรณีเกิด error ก็ส่งค่า default กลับไป
        return { 
            success: false, 
            data: {
                Total_count: 0,
                Success_count: 0,
                false_count: 0,
                BANK_ACC_NOT_MATCH_Count: 0,
            },
            dataAmount: [{
                TotalAmount: 0
            }],
            error: "เกิดข้อผิดพลาดในการค้นหา" 
        };
    }
}
  let selectedView: 'all' | 'branch' = 'all';
    let selectedBranch: string | null = null;

    // Extract unique branches
    async  function handleViewChange(view: 'all' | 'branch') {
    selectedView = view;
    if (view === 'all') {
        // รีเซ็ตการเลือกสาขา
        selectedBranch = null;
        localStorage.setItem('branchId', 'All');
        // ค้นหาข้อมูลทั้งหมดใหม่
        SearchData('all');
    }else if (view === 'branch' && dataAmountview && dataAmountview.length > 0) {
        // เลือก Id ตัวแรกจาก dataAmountview
        selectedBranch = dataAmountview[0].Id;
        localStorage.setItem('branchId', selectedBranch);
        // ค้นหาข้อมูลตามสาขาที่เลือก
        await SearchData('branch', selectedBranch);
    }
}

// อัปเดต handler สำหรับการเลือกสาขา
async function handleBranchSelect(branchId: string) {
    console.log("555555",branchId)
    localStorage.setItem('branchId', branchId);
    selectedView = 'branch';
    selectedBranch = branchId;
    await SearchData('branch', branchId);
}

   
let currentPage = 0;

let windowWidth;

  function handleResize() {
    windowWidth = window.innerWidth;
  }
  $: roomsPerPage = windowWidth < 768 ? 1 : 3;

  // Reactive statement to calculate total pages
  $: totalPages = Math.ceil(dataAmountview.length / roomsPerPage);

  // Reactive statement to get visible rooms for current page
  $: visibleRooms = dataAmountview.slice(
    currentPage * roomsPerPage, 
    (currentPage * roomsPerPage) + roomsPerPage
  );


  let touchStartX = 0;
  let touchEndX = 0;
  let mouseStartX = 0;
  let isMouseDown = false;


  // Touch Event Handlers
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const diffX = touchStartX - touchEndX;
    
    // Minimum swipe distance
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentPage < totalPages - 1) {
        // Swipe left, go to next page
        currentPage++;
      } else if (diffX < 0 && currentPage > 0) {
        // Swipe right, go to previous page
        currentPage--;
      }
    }
  }

  // Mouse Event Handlers
  function handleMouseDown(e) {
    isMouseDown = true;
    mouseStartX = e.clientX;
  }

  function handleMouseMove(e) {
    if (!isMouseDown) return;
  }

  function handleMouseUp(e) {
    if (!isMouseDown) return;
    
    const diffX = mouseStartX - e.clientX;
    
    // Minimum swipe distance
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentPage < totalPages - 1) {
        // Swipe left, go to next page
        currentPage++;
      } else if (diffX < 0 && currentPage > 0) {
        // Swipe right, go to previous page
        currentPage--;
      }
    }
    
    isMouseDown = false;
  }

  function handleMouseLeave() {
    isMouseDown = false;
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
                class="px-2 py-1 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17B26A] focus:border-transparent pr-8 text-base appearance-none"
                autocomplete="off"
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
                class="px-2 py-1 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17B26A] focus:border-transparent pr-8 text-base appearance-none"
                autocomplete="off"
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
{#if dataAmountview }
    <div class="flex space-x-2 mb-4">
        <Button 
    on:click={() => handleViewChange('all')}
    class={`... ${selectedView === 'all' ? 'bg-primary' : 'bg-gray-400'}`}
>
    แสดงทั้งหมด
</Button>

<Button 
    on:click={() => handleViewChange('branch')}
    class={`... ${selectedView === 'branch' ? 'bg-primary' : 'bg-gray-400'}`}
>
    ดูสาขา
</Button>
    </div>

    {#if selectedView === 'branch'}
   
            <!-- {#each dataAmountview as branch}
                <Button 
                    class={`flex text-center px-4 py-1 text-white ${selectedBranch === branch ? 'bg-primary hover:bg-[#050680]' : 'bg-gray-400 hover:bg-gray-500'}`}
                    on:click={() => handleBranchSelect(branch)}
                >
                    <div class="mx-3 content-center font-semibold">
                        {branch.RoomName}
                    </div>
                </Button>
            {/each} -->

            {#if selectedView === 'branch' && dataAmountview && dataAmountview.length > 0}
    <!-- <Carousel.Root class="mt-5">
        <Carousel.Content>
            {#each dataAmountview as branch}
                <Carousel.Item class="md:basis-1/1 lg:basis-1/3">
                   
                  
                    <div 
                        class="p-4 my-2 bg-white border border-gray-200 rounded-lg shadow-md" 
                        on:click={() => handleBranchSelect(branch?.Id)}
                    >
                        <div class="flex">
                            <div class="avatar">
                                <div class="w-full flex justify-center min-w-20 bg-green-800 p-5 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                                        <path fill="white" d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="mx-2">
                                <div class="text-slate-400">Line Group</div>
                                <div class="font-semibold text-xl max-w-28 sm:max-w-full truncate">
                                    {branch?.RoomName || 'ไม่มีชื่อกลุ่ม'}
                                </div>
                                <div>
                                    ยอดรวมทั้งหมด {(branch?.TotalAmount || 0).toLocaleString()} บาท
                                </div>
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
            {/each}
        </Carousel.Content>
    </Carousel.Root>  -->

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
      class="relative w-full overflow-hidden touch-pan-y select-none" 
      on:touchstart={handleTouchStart}
      on:touchmove={handleTouchMove}
      on:touchend={handleTouchEnd}
      on:mousedown={handleMouseDown}
      on:mousemove={handleMouseMove}
      on:mouseup={handleMouseUp}
      on:mouseleave={handleMouseLeave}
    >
      <div 
        class="flex transition-transform duration-300 cursor-grab active:cursor-grabbing" 
        style="transform: translateX(-{currentPage * 100}%);"
      >
        {#each Array(totalPages) as _, pageIndex}
          <div class="w-full flex-shrink-0">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              {#each visibleRooms as branch}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="w-full">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div 
                    class="w-full p-4 bg-white border border-gray-200 shadow-md cursor-pointer"
                    on:click={() => handleBranchSelect(branch?.Id)}
                  >
                    <div class="flex">
                      <div class="avatar">
                        <div class="w-full flex justify-center min-w-20 bg-green-800 p-5 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <path fill="white" d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z" />
                          </svg>
                        </div>
                      </div>
                      <div class="mx-2 flex-1">
                        <div class="text-slate-400">LINE GROUP</div>
                        <div class="font-semibold text-xl max-w-28 sm:max-w-full truncate">
                            {branch?.RoomName || 'ไม่มีชื่อกลุ่ม'}
                        </div>
                        <div>ยอดรวมทั้งหมด {(branch?.TotalAmount || 0).toLocaleString()} บาท</div>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    
      <!-- Navigation Dots -->
      <div class="flex flex-wrap justify-center mt-4">
        {#each Array(totalPages) as _, index}
          <button 
            class="w-3 h-3 rounded-full mx-2 my-2 {currentPage === index ? 'bg-blue-500' : 'bg-gray-300'}"
            on:click={() => currentPage = index}
          ></button>
        {/each}
      </div>
    </div>
        
    {/if}


    {/if}
{/if}

<div class="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 " style="width: 100%;">
    <Card.Root class="col-span-2">
        <Card.Header
            class="flex flex-row items-center justify-center space-y-0 pb-2"
        >
            <Card.Title class="text-xl  font-semibold text-center" style="height:60px">ยอดเงินรวม </Card.Title>
            
        </Card.Header>
        <Card.Content class="text-center ">
            <div>
                <p class=" w-100 lg:h-32 content-center text-8xl">
    
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
                   <div class="text-6xl sm:text-6xl md:text-8xl lg:text-8xl font-bold w-100">
                       {dataAmountview ? totalAmount.toLocaleString() : 0}
                       
                   </div>
               {/if}
                </p>
                </div>
        </Card.Content>
    </Card.Root>
    <Card.Root class="col-span-2 md:col-span-2 lg:col-span-2">
        <Card.Header
            class="flex flex-row items-center justify-center space-y-0 pb-2 text-center"
        >
            <Card.Title class="text-xl font-semibold " style="height:40px">จำนวนการใช้งาน</Card.Title>
           
        </Card.Header>
        <Card.Content class="text-center lg:my-1 py-2">
            <div>
            <Pie {data} {options} class="w-[180px] sm:w-[180px] md:w-[180px] lg:w-[120px] xl:w-[160px]"/>
        </div>
        <div class="mt-2 font-semibold">{dataOverview ? (dataOverview.QuotaLimit-dataOverview.QuotaUsage) : 1} / {dataOverview ? dataOverview.QuotaLimit : 1}</div>
        
        
        </Card.Content>
        <div class=" flex  justify-end text-center text-sm px-2 text-red-600 font-semibold">
            <div>วันหมดอายุ : 
                {#if (dataOverview) && (dataOverview.BillDate != "-")} {new Date(dataOverview.BillDate).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
              {:else}
                -
              {/if}</div>
        </div>
    </Card.Root>
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-center space-y-0 pb-2"
        >
            <Card.Title class="text-xl  font-semibold text-center" style="height:60px">สลิปที่ตรวจสอบทั้งหมด </Card.Title>
            
        </Card.Header>
        <Card.Content class="text-center ">
            <div>
                <p class=" w-100 lg:h-32 content-center text-8xl">

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
                   <div class="text-6xl sm:text-6xl md:text-8xl lg:text-8xl font-bold w-100">
                       {dataOverview ? dataOverview.Total_count : 0} 
                       
                   </div>
               {/if}
                </p>
                </div>
                <div class=" w-100 mt-2 mb-3  " ><Button  class="w-4/5 h-12 text-white  bg-primary font-semibold hover:bg-[#050680]" on:click={dowloadExportExcel} >ดาวน์โหลดไฟล์ Excel</Button></div>
        </Card.Content>
    </Card.Root>
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
                <div class="text-6xl sm:text-6xl md:text-8xl lg:text-8xl font-bold w-100">
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
                <div class="text-6xl sm:text-6xl md:text-8xl lg:text-8xl font-bold w-100">
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
            <Card.Title class="text-xl font-semibold " style="height:60px">สลิปที่ชื่อบัญชีไม่ตรง</Card.Title>
           
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
                <div class="text-6xl sm:text-6xl md:text-8xl lg:text-8xl font-bold w-100">
                    {dataOverview ? dataOverview.BANK_ACC_NOT_MATCH_Count : 0}
                </div>
            {/if}
            </div>
        </Card.Content>
        <Card.Footer class="flex justify-center content-end lg:h-20 mt-auto">
            <div class="text-lg  w-100 text-stone-400 text-center" ><a class="text-black font-semibold">{#if dataOverview && dataOverview.BANK_ACC_NOT_MATCH_Count == 0 || loading}0{:else}{((dataOverview.BANK_ACC_NOT_MATCH_Count/dataOverview.Total_count)*100).toFixed(2)}{/if}%</a> ของสลีปทั้งหมด
            </div>
            
        </Card.Footer>
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
    .date-picker-input {
    font-size: 16px; /* ป้องกัน iOS zoom */
    padding: 8px 12px;
    width: 100%;
    -webkit-appearance: none; /* ป้องกันสไตล์เริ่มต้นของ iOS */
    -moz-appearance: none;
    appearance: none;
}
</style>