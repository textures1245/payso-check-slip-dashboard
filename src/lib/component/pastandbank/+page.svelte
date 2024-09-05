<script lang="ts">
	type Transaction = {
		BankResponded: string;
		CreatedAt: string;
		Id: number;
		Status: string;
		TransferRefId: string;
	};
    import { Bar } from 'svelte-chartjs';
    import logo from"$lib/image/pack.png";
    import { Button } from '$lib/components/ui/button';
	import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card";
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
    // Register Chart.js components
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { onMount } from 'svelte';
	import cookie from 'cookie';
	export let firstItem: Transaction;
    console.log(firstItem)
  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  ); 

  let statusToSend="all";

  

	let dataChart: any[] = [];
	onMount(async () => {
		try {
			const datachart = await Getdata();
			dataChart=datachart;

			console.log('Chart : ',datachart);

		} catch (error) {
			console.error('Error fetching profile:', error);
		}

		


	});
	function getCookies() {
  return cookie.parse(document.cookie);
}
	const Getdata = async () => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		// console.log( 'id: ', id , typeof(id));
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
		
		console.log('checking transaction month');
		let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatusallline/${myCookie.Email}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatusall/${myCookie.Id}`;
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
		return datas.result

	};

	const searchGetdata = async (param1: string) => {
		// const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		// console.log( 'id: ', id , typeof(id));
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log("++++++++++",myCookie.Id , myCookie.Email);
		
		console.log('checking transaction month');
		let apiUrl;
    if (myCookie && myCookie.Type === "Line") {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatusline/${myCookie.Email}/${param1}`;
    } else if (myCookie) {
        apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionstatus/${myCookie.Id}/${param1}`;
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

  const statuses = [
	{ value: 'all', label: 'All' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' }
];
  </script>
<div class="flex justify-between mx-5 my-2">
	<div class="content-center">
		รายการย้อนหลัง
	</div>
	<div class="flex " style="height: 30px;">
		<select bind:value={statusToSend} class="border-2  mx-2 rounded-lg border  border-stone-400 text-zinc-500 text-center">
			<option value="" disabled selected >Select a status</option>
			{#each statuses as month}
			  <option value="{month.value}">{month.label}</option>
			{/each}
		  </select>
		  <Button
variant="outline"
class=" flex text-center py-0 px-0  text-white hover:text-black border border-gray-400  bg-primary"
on:click={() => SearchData(statusToSend)}
style="width:40%;height:30px;"
><div class="mx-3 content-center" style="width:100%;height:100%">
	ค้นหา
</div>
</Button
>
	</div>
</div>

<ScrollArea class="h-96 mx-2 rounded-md border border-gray-400" style="width:100%;">
    <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-1  ">
    <div class="rounded-lg snap-y " style="width:100%">
		{#if searchPerformed }
		<Table.Root>
		<Table.Header>
			<Table.Row>
			  <Table.Head class="w-[100px] text-black font-bold">วันที่ทำการ</Table.Head>
			  <Table.Head class="text-center text-black font-bold">เวลาทำการ</Table.Head>
			  <Table.Head class="text-center text-black font-bold">Transfer ID</Table.Head>
			  <Table.Head class="text-center text-black font-bold">Status</Table.Head>
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
			<Table.Cell class="font-medium">{item.CreatedAt.split('T')[0]}</Table.Cell>
			<Table.Cell class="text-center">{item.CreatedAt.split('T')[1].split('.')[0].split('Z')[0]}</Table.Cell>
			<Table.Cell class="sm:text-pretty text-center"> <div class="sm:hidden">
				{item.TransferRefId.substring(0, item.TransferRefId.length / 2)}<br>
				{item.TransferRefId.substring(item.TransferRefId.length / 2)}
			  </div>
			  <div class="hidden sm:block">
				{item.TransferRefId}
			  </div></Table.Cell>
			<Table.Cell class=" flex justify-center">{#if item.Status === 'SUCCESS'}
				<span class=" flex  items-center" style="color:#17B26A;"><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 120 120">
					<circle cx="60" cy="64" r="48" opacity=".35"></circle><circle cx="60" cy="60" r="48" fill="#44bf00"></circle><polygon points="53.303,89 26.139,61.838 33.582,54.395 53.303,74.116 86.418,41 93.861,48.443" opacity=".35"></polygon><polygon fill="#fff" points="53.303,84 26.139,56.838 33.582,49.395 53.303,69.116 86.418,36 93.861,43.443"></polygon>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm pb-5 ">SUCCESS</div></span>
			  {:else if item.Status === 'PENDING'}
				<span class="text-black flex  items-center"><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
					<path d="M25,2C12.318,2,2,12.317,2,25s10.318,23,23,23s23-10.317,23-23S37.682,2,25,2z M37.735,12.679L27.644,23.61 C27.864,24.027,28,24.496,28,25c0,0.76-0.292,1.447-0.758,1.976l3.632,6.539c0.269,0.482,0.094,1.091-0.388,1.359 C30.332,34.96,30.165,35,30.001,35c-0.352,0-0.692-0.186-0.875-0.515l-3.631-6.535C25.333,27.977,25.17,28,25,28 c-1.657,0-3-1.343-3-3s1.343-3,3-3c0.42,0,0.82,0.088,1.183,0.244l10.082-10.923c0.375-0.404,1.007-0.431,1.413-0.056 C38.084,11.64,38.109,12.272,37.735,12.679z"></path>
				</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm pb-5 ">PENDING</div></span>
			  {:else if item.Status === 'FAILED'}
				<span class="flex items-center" style="color:#F04438;"><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
					<path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm pb-5 " >FAILED</div></span>
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
				<Table.Row>
				  <Table.Head class="w-[100px] text-black font-bold">วันที่ทำการ</Table.Head>
				  <Table.Head class="text-center text-black font-bold">เวลาทำการ</Table.Head>
				  <Table.Head class="text-center text-black font-bold">Transfer ID</Table.Head>
				  <Table.Head class="text-center text-black font-bold">Status</Table.Head>
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
			<Table.Cell class="font-medium">{item.CreatedAt.split('T')[0]}</Table.Cell>
			<Table.Cell class="text-center">{item.CreatedAt.split('T')[1].split('.')[0].split('Z')[0]}</Table.Cell>
			<Table.Cell class="sm:text-pretty text-center"> <div class="sm:hidden">
				{item.TransferRefId.substring(0, item.TransferRefId.length / 2)}<br>
				{item.TransferRefId.substring(item.TransferRefId.length / 2)}
			  </div>
			  <div class="hidden sm:block">
				{item.TransferRefId}
			  </div></Table.Cell>
			  <Table.Cell class=" flex justify-center">{#if item.Status === 'SUCCESS'}
				<span class=" flex  items-center" style="color:#17B26A;"><svg class="lg:hidden  md:hidden sm:block block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 120 120">
					<circle cx="60" cy="64" r="48" opacity=".35"></circle><circle cx="60" cy="60" r="48" fill="#44bf00"></circle><polygon points="53.303,89 26.139,61.838 33.582,54.395 53.303,74.116 86.418,41 93.861,48.443" opacity=".35"></polygon><polygon fill="#fff" points="53.303,84 26.139,56.838 33.582,49.395 53.303,69.116 86.418,36 93.861,43.443"></polygon>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm pb-5">SUCCESS</div></span>
			  {:else if item.Status === 'PENDING'}
				<span class="text-black flex  items-center "><svg xmlns="http://www.w3.org/2000/svg" class="lg:hidden  md:hidden sm:block block" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
					<path d="M25,2C12.318,2,2,12.317,2,25s10.318,23,23,23s23-10.317,23-23S37.682,2,25,2z M37.735,12.679L27.644,23.61 C27.864,24.027,28,24.496,28,25c0,0.76-0.292,1.447-0.758,1.976l3.632,6.539c0.269,0.482,0.094,1.091-0.388,1.359 C30.332,34.96,30.165,35,30.001,35c-0.352,0-0.692-0.186-0.875-0.515l-3.631-6.535C25.333,27.977,25.17,28,25,28 c-1.657,0-3-1.343-3-3s1.343-3,3-3c0.42,0,0.82,0.088,1.183,0.244l10.082-10.923c0.375-0.404,1.007-0.431,1.413-0.056 C38.084,11.64,38.109,12.272,37.735,12.679z"></path>
				</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm pb-5">PENDING</div></span>
			  {:else if item.Status === 'FAILED'}
				<span class=" flex items-center " style="color:#F04438;"><svg xmlns="http://www.w3.org/2000/svg" class="lg:hidden  md:hidden sm:block block" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
					<path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
					</svg><div class="lg:block md:block sm:hidden hidden badge badge-outline badge-sm uppercase text-sm pb-5 ">FAILED</div></span>
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


	