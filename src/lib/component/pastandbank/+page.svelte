<script lang="ts">
    import { Button } from '$lib/components/ui/button';
	import * as Table from "$lib/components/ui/table";
    // Register Chart.js components
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { onDestroy, onMount } from 'svelte';
	import cookie from 'cookie';
	import failed  from '$lib/image/failed.png';
	import success  from '$lib/image/success.png';

  let statusToSend="all";
  let previousStartDate: string | null = null;
  let previousEndDate: string | null = null;
  

	let dataChart: any[] = [];
	onMount(async () => {
		previousStartDate = localStorage.getItem('startDate');
    	previousEndDate = localStorage.getItem('endDate');
		try {
			const datachart = await Getdata();
			dataChart=datachart;

			console.log('Chart : ',datachart);

		} catch (error) {
			console.error('Error fetching profile:', error);
		}
		checkLocalStorageChanges();
    
    // ตั้งเวลาให้ตรวจสอบการเปลี่ยนแปลงในบางช่วงเวลา (เช่นทุก 1 วินาที)
    const intervalId = setInterval(checkLocalStorageChanges, 100);

    // ลบ interval เมื่อ component ถูกทำลาย
    onDestroy(() => {
        clearInterval(intervalId);
    });
		


	});
	function getCookies() {
  return cookie.parse(document.cookie);
}
	 const Getdata = async () => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		// console.log( 'id: ', id , typeof(id));
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		const startDate = localStorage.getItem('startDate');
		const endDate = localStorage.getItem('endDate');

		let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatusline/${myCookie.Email}/-/${startDate}/${endDate}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatus/${myCookie.Id}/-/${startDate}/${endDate}`;
		// apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatus/13/pending/${startDate}/${endDate}`;
		// apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatusall/5/2024-08-01/2024-09-10`;
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
const result = await fetch(apiUrl, config);
const datas = await result.json();
		if (datas.result) {
            return datas.result;
        }

	};

	const searchGetdata = async (param1: string) => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		// console.log( 'id: ', id , typeof(id));
		const startDate = localStorage.getItem('startDate');
		const endDate = localStorage.getItem('endDate');
		console.log("Date" , startDate,endDate)
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
		
		console.log('checking transaction month');
		let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatusline/${myCookie.Email}/${param1}/${startDate}/${endDate}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatus/${myCookie.Id}/${param1}/${startDate}/${endDate}`;
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
		console.time('Fetch Only Getdata');
		var result = await fetch(apiUrl, config);
		const datas = await result.json();
		console.timeEnd('Fetch Only Getdata');
		return datas.result

	};
	let searchPerformed = false;
	let dataSearch: any[] = [];
    async function SearchData(param1: string) {
	if(param1=="all"){
		const data = await Getdata();
		dataSearch = data
		console.log("Search" ,dataSearch)
	}else{
		const data = await searchGetdata(param1);
		dataSearch = data
		console.log("Search" ,dataSearch)
	}
		searchPerformed = true;
	
	
 // Replace with your actual URL

  }

  async function checkLocalStorageChanges() {
    const currentStartDate = localStorage.getItem('startDate');
    const currentEndDate = localStorage.getItem('endDate');

    if (currentStartDate !== previousStartDate || currentEndDate !== previousEndDate) {
        previousStartDate = currentStartDate;
        previousEndDate = currentEndDate;
        // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลใหม่
		const datachart = await Getdata();
		dataChart=datachart
		dataSearch = datachart
		statusToSend="all"
    }
}
  const statuses = [
	{ value: 'all', label: 'ทั้งหมด' },
  { value: 'success', label: 'ถูกต้อง' },
  { value: 'failed', label: 'ผิด' },
  { value: 'pending', label: 'กำลังดำเนินการ' },
  { value: 'REQUEST_REJECTED', label: 'คำขอถูกปฏิเสธ' },
  { value: 'RESPOND_REJECTED', label: 'ปฏิเสธการตอบ' },
  { value: 'BANK_ACC_NOT_MATCH', label: 'ชื่อบัญชีไม่ตรง' }
];

function formatDate(dateString:any) {
    const date = new Date(dateString);
    
    // ตรวจสอบว่ามีวันที่ถูกต้องหรือไม่
    if (isNaN(date.getTime())) {
        return "Invalid date"; // คืนค่าข้อความหากวันที่ไม่ถูกต้อง
    }

    // แปลงวันที่เป็นรูปแบบ "18 ก.ย. 2024"
    const day = date.getDate();
    const month = date.toLocaleString('th-TH', { month: 'short' });
    const year = date.getFullYear(); // ปี ค.ศ.

    return `${day} ${month} ${year}`; // คืนค่าในรูปแบบ "18 ก.ย. 2024"
}

function formatTime(dateString: string) {
        // ลบช่องว่างระหว่างวันที่และเวลา (สำหรับกรณี "2024-08-24 12:23:36")
        const normalizedDateString = dateString.replace(' ', 'T');

        // แปลงเป็น Date object
        const date = new Date(normalizedDateString);
        
        // ดึงชั่วโมงและนาที
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        // คืนค่ารูปแบบ HH:MM
        return `${hours}:${minutes}`;
    }
  </script>
<div class="flex justify-between mx-2 my-2">
	<div class="content-center font-semibold">
		รายการย้อนหลัง
	</div>
	<div class="flex " style="height: 30px;">
		<select bind:value={statusToSend} class="border-2  mx-2 rounded-lg border  border-stone-400 text-black text-start pl-2">
			<option value="" disabled selected >Select a status</option>
			{#each statuses as month}
			  <option value="{month.value}">{month.label}</option>
			{/each}
		  </select>
		  <Button
class=" flex text-center py-0 px-0  text-white  border border-gray-400  bg-primary hover:bg-[#050680]"
on:click={() => SearchData(statusToSend)}
style="width:40%;height:30px;"
><div class="mx-3 content-center font-semibold" style="width:100%;height:100%">
	ค้นหา
</div>
</Button
>
	</div>
</div>

<ScrollArea class="h-96 mx-2 rounded-md" style="width:100%;">
    <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-1  ">
    <div class="rounded-lg snap-y " style="width:100%">
		{#if searchPerformed }
		<Table.Root>
		<Table.Header>
			<Table.Row  style=" background-color:#F9FAFB">
			  <Table.Head class="w-[100px] text-black font-bold">วันที่ทำการ</Table.Head>
			  <Table.Head class="text-center text-black font-bold">เวลาทำการ</Table.Head>
			  <Table.Head class="text-center text-black font-bold">Transfer ID</Table.Head>
			  <Table.Head class="text-center text-black font-bold">สถานะ</Table.Head>
			</Table.Row>
		  </Table.Header>
		  <Table.Body>
			
			
		{#each dataSearch as item}

		<!-- <div class=" my-5 mx-5 rounded-xl snap-start text-sm">
			<div class="flex justify-around h-full">
				
				<div>
				<div class="content-end">วันที่ : {item.CreatedAt.split('T')[0]} เวลา :{item.CreatedAt.split('T')[1].split('.')[0].split('Z')[0]}</div>

				<div class="content-end">จาก: {item.TransferRefId}</div>
			</div>
				<div class="content-center">{item.Status}</div>
				
			
			
			</div>
			
		</div> -->
		<Table.Row>
			<Table.Cell class="font-medium">{formatDate(item.CreatedAt.split('T')[0])}</Table.Cell>
			<Table.Cell class="text-center">{formatTime(item.CreatedAt)}</Table.Cell>
			<Table.Cell class="sm:text-pretty text-center"> <div class="sm:hidden lg:block xl:hidden">
				{item.TransferRefId.substring(0, item.TransferRefId.length / 2)}<br>
				{item.TransferRefId.substring(item.TransferRefId.length / 2)}
			  </div>
			  <div class="hidden sm:block lg:hidden xl:block">
				{item.TransferRefId}
			  </div></Table.Cell>
			<Table.Cell class=" flex justify-center font-semibold">{#if item.Status === 'SUCCESS'}
				<span class=" flex  items-center" style="color:#17B26A;"><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 120 120">
					<circle cx="60" cy="64" r="48" opacity=".35"></circle><circle cx="60" cy="60" r="48" fill="#44bf00"></circle><polygon points="53.303,89 26.139,61.838 33.582,54.395 53.303,74.116 86.418,41 93.861,48.443" opacity=".35"></polygon><polygon fill="#fff" points="53.303,84 26.139,56.838 33.582,49.395 53.303,69.116 86.418,36 93.861,43.443"></polygon>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm lg:flex md:flex p-3" style="background-color: #DCFAE6 ;color:#17B26A; border-color:#17B26A">SUCCESS</div></span>
			  {:else if item.Status === 'PENDING'}
				<span class=" text-warning flex  items-center "><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
					<g fill="#facd15" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M25,2c-12.683,0 -23,10.317 -23,23c0,12.683 10.317,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.683 -10.317,-23 -23,-23zM25,28c-0.462,0 -0.895,-0.113 -1.286,-0.3l-6.007,6.007c-0.195,0.195 -0.451,0.293 -0.707,0.293c-0.256,0 -0.512,-0.098 -0.707,-0.293c-0.391,-0.391 -0.391,-1.023 0,-1.414l6.007,-6.007c-0.187,-0.391 -0.3,-0.824 -0.3,-1.286c0,-1.304 0.837,-2.403 2,-2.816v-14.184c0,-0.553 0.447,-1 1,-1c0.553,0 1,0.447 1,1v14.184c1.163,0.413 2,1.512 2,2.816c0,1.657 -1.343,3 -3,3z"></path></g></g>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm lg:flex md:flex p-3" style="background-color: #FEF0C7;color:#F79009;border-color:#F79009">PENDING</div></span>
				{:else if item.Status === 'RESPOND_REJECTED'}
				<span class=" text-warning flex  items-center "><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
					<g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M44,24c0,11.045 -8.955,20 -20,20c-11.045,0 -20,-8.955 -20,-20c0,-11.045 8.955,-20 20,-20c11.045,0 20,8.955 20,20z" fill="#767676"></path><path d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828,-2.828z" fill="#ffffff"></path><path d="M32.484,29.656l-2.828,2.828l-14.14,-14.14l2.828,-2.828z" fill="#ffffff"></path></g></g>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-xs lg:flex md:flex p-3 whitespace-nowrap" style="background-color: #F9FAFB ; color: #61646C; border-color: #61646C;">Response Rejected</div></span>
					{:else if item.Status === 'REQUEST_REJECTED'}
				<span class=" text-warning flex  items-center  " style="min-height: 50px;"><svg class="lg:hidden  md:hidden sm:block block " xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
					<g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M44,24c0,11.045 -8.955,20 -20,20c-11.045,0 -20,-8.955 -20,-20c0,-11.045 8.955,-20 20,-20c11.045,0 20,8.955 20,20z" fill="#000000"></path><path d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828,-2.828z" fill="#ffffff"></path><path d="M32.484,29.656l-2.828,2.828l-14.14,-14.14l2.828,-2.828z" fill="#ffffff"></path></g></g>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-xs lg:flex md:flex p-3 whitespace-nowrap" style="background-color: #F9FAFB ; color: #61646C; border-color: #61646C;">Request Rejected</div></span>
			  {:else if item.Status === 'FAILED'}
				<span class=" flex items-center " style="color:#F04438;"><svg xmlns="http://www.w3.org/2000/svg" class="lg:hidden  md:hidden sm:block block" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
					<path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm lg:flex md:flex p-3 " style="background-color: #FEE4E2;color:#F04438;border-color:#F04438">FAILED</div></span>
					{:else if item.Status === 'BANK_ACC_NOT_MATCH'}
					<span class=" text-warning flex  items-center  " style="min-height: 50px;"><svg class="lg:hidden  md:hidden sm:block block " xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
						<g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M44,24c0,11.045 -8.955,20 -20,20c-11.045,0 -20,-8.955 -20,-20c0,-11.045 8.955,-20 20,-20c11.045,0 20,8.955 20,20z" fill="#000000"></path><path d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828,-2.828z" fill="#ffffff"></path><path d="M32.484,29.656l-2.828,2.828l-14.14,-14.14l2.828,-2.828z" fill="#ffffff"></path></g></g>
						</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-xs lg:flex md:flex p-3 whitespace-nowrap" style="background-color: #F9FAFB ; color: #61646C; border-color: #61646C;">Bank Name NOT MATCH</div></span>
			  {:else}
				<span class="text-gray-500">Unknown Status</span>
			  {/if}</Table.Cell>
		  </Table.Row>
	
	{/each}
</Table.Body>
</Table.Root>
{#if dataSearch.length === 0}
                    <div class="text-center">No data found</div>
            {/if}
		{:else if (statusToSend="all")}
		<Table.Root>
			<Table.Header>
				<Table.Row style=" background-color:#F9FAFB">
				  <Table.Head class="w-[100px] text-black font-bold">วันที่ทำการ</Table.Head>
				  <Table.Head class="text-center text-black font-bold">เวลาทำการ</Table.Head>
				  <Table.Head class="text-center text-black font-bold">Transfer ID</Table.Head>
				  <Table.Head class="text-start text-black font-bold">สถานะ</Table.Head>
				</Table.Row>
			  </Table.Header>
			  <Table.Body>
		{#each dataChart as item}

		<!-- <div class=" my-5 mx-5 rounded-xl snap-start text-sm">
			<div class="flex  justify-around h-full">
				<div>
				<div class="content-end">วันที่ : {item.CreatedAt.split('T')[0]} เวลา :{item.CreatedAt.split('T')[1].split('.')[0].split('Z')[0]}</div>
				<div class="content-end">จาก: {item.TransferRefId}</div>
			</div>
				<div class="content-center">{item.Status}</div>
				
				
			</div>
		</div> -->
		<Table.Row>
			<Table.Cell class="font-medium">{formatDate(item.CreatedAt.split('T')[0])}</Table.Cell>
			<Table.Cell class="font-medium  text-center">{formatTime(item.CreatedAt)}</Table.Cell>
			<!-- <Table.Cell class="text-center">{item.CreatedAt.split('T')[1].split('.')[0].split('Z')[0].split(':').slice(0, 2).join(':')}</Table.Cell> -->
			<Table.Cell class="sm:text-pretty text-center"> <div class="sm:hidden lg:block xl:hidden">
				{item.TransferRefId.substring(0, item.TransferRefId.length / 2)}<br>
				{item.TransferRefId.substring(item.TransferRefId.length / 2)}
			  </div>
			  <div class="hidden sm:block lg:hidden xl:block">
				{item.TransferRefId}
			  </div></Table.Cell>
			  <Table.Cell class=" flex justify-start font-semibold">{#if item.Status === 'SUCCESS'}
				<span class=" flex  items-center" style="color:#17B26A;"><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 120 120">
					<circle cx="60" cy="64" r="48" opacity=".35"></circle><circle cx="60" cy="60" r="48" fill="#44bf00"></circle><polygon points="53.303,89 26.139,61.838 33.582,54.395 53.303,74.116 86.418,41 93.861,48.443" opacity=".35"></polygon><polygon fill="#fff" points="53.303,84 26.139,56.838 33.582,49.395 53.303,69.116 86.418,36 93.861,43.443"></polygon>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm lg:flex md:flex p-3" style="background-color: #DCFAE6 ;color:#17B26A; border-color:#17B26A">SUCCESS</div></span>
			  {:else if item.Status === 'PENDING'}
				<span class=" text-warning flex  items-center "><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
					<g fill="#facd15" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M25,2c-12.683,0 -23,10.317 -23,23c0,12.683 10.317,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.683 -10.317,-23 -23,-23zM25,28c-0.462,0 -0.895,-0.113 -1.286,-0.3l-6.007,6.007c-0.195,0.195 -0.451,0.293 -0.707,0.293c-0.256,0 -0.512,-0.098 -0.707,-0.293c-0.391,-0.391 -0.391,-1.023 0,-1.414l6.007,-6.007c-0.187,-0.391 -0.3,-0.824 -0.3,-1.286c0,-1.304 0.837,-2.403 2,-2.816v-14.184c0,-0.553 0.447,-1 1,-1c0.553,0 1,0.447 1,1v14.184c1.163,0.413 2,1.512 2,2.816c0,1.657 -1.343,3 -3,3z"></path></g></g>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm lg:flex md:flex p-3" style="background-color: #FEF0C7;color:#F79009;border-color:#F79009">PENDING</div></span>
				{:else if item.Status === 'RESPOND_REJECTED'}
				<span class=" text-warning flex  items-center "><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
					<g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M44,24c0,11.045 -8.955,20 -20,20c-11.045,0 -20,-8.955 -20,-20c0,-11.045 8.955,-20 20,-20c11.045,0 20,8.955 20,20z" fill="#767676"></path><path d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828,-2.828z" fill="#ffffff"></path><path d="M32.484,29.656l-2.828,2.828l-14.14,-14.14l2.828,-2.828z" fill="#ffffff"></path></g></g>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-xs lg:flex md:flex p-3 whitespace-nowrap" style="background-color: #F9FAFB ; color: #61646C; border-color: #61646C;">Response Rejected</div></span>
					{:else if item.Status === 'REQUEST_REJECTED'}
				<span class=" text-warning flex  items-center  " style="min-height: 50px;"><svg class="lg:hidden  md:hidden sm:block block " xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
					<g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M44,24c0,11.045 -8.955,20 -20,20c-11.045,0 -20,-8.955 -20,-20c0,-11.045 8.955,-20 20,-20c11.045,0 20,8.955 20,20z" fill="#000000"></path><path d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828,-2.828z" fill="#ffffff"></path><path d="M32.484,29.656l-2.828,2.828l-14.14,-14.14l2.828,-2.828z" fill="#ffffff"></path></g></g>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-xs lg:flex md:flex p-3 whitespace-nowrap" style="background-color: #F9FAFB ; color: #61646C; border-color: #61646C;">Request Rejected</div></span>
			  {:else if item.Status === 'FAILED'}
				<span class=" flex items-center " style="color:#F04438;"><svg xmlns="http://www.w3.org/2000/svg" class="lg:hidden  md:hidden sm:block block" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
					<path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm lg:flex md:flex p-3 " style="background-color: #FEE4E2;color:#F04438;border-color:#F04438">FAILED</div></span>
					{:else if item.Status === 'BANK_ACC_NOT_MATCH'}
					<span class=" text-warning flex  items-center  " style="min-height: 50px;"><svg class="lg:hidden  md:hidden sm:block block " xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
						<g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M44,24c0,11.045 -8.955,20 -20,20c-11.045,0 -20,-8.955 -20,-20c0,-11.045 8.955,-20 20,-20c11.045,0 20,8.955 20,20z" fill="#000000"></path><path d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828,-2.828z" fill="#ffffff"></path><path d="M32.484,29.656l-2.828,2.828l-14.14,-14.14l2.828,-2.828z" fill="#ffffff"></path></g></g>
						</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-xs lg:flex md:flex p-3 whitespace-nowrap" style="background-color: #F9FAFB ; color: #61646C; border-color: #61646C;">Bank Name NOT MATCH</div></span>
			  {:else}
				<span class="text-gray-500">Unknown Status</span>
			  {/if}</Table.Cell>
		  </Table.Row>
	
		
	{/each}
</Table.Body>
</Table.Root>
{#if dataChart.length === 0}
                    <div class="text-center">No data found</div>
            {/if}
		{/if}
       
    </div>
    </div>
    </ScrollArea>


	