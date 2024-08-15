<script lang="ts">
	import { onMount } from 'svelte';
	import type { Logdata } from './+page.server.ts';
	let logdata: Logdata[] = [];

	let currentPage = 1;
	let limit = 10;
	let role = 'admin'
	
	

	onMount(async () => {
		await fetchData();
	});

	async function fetchData(offset = 1, limit = 10, role = 'admin') {
    try {
        const response = await fetch(
            `http://127.0.0.1:4567/api/v1/log/get?offset=${offset}&limit=${limit}&role=${role}`
        );
        console.log('Fetching data...');  // ตรวจสอบว่าฟังก์ชันถูกเรียกใช้
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Fetched data:', data);  // ตรวจสอบว่าดึงข้อมูลมาแล้ว

        if (!data.result || !Array.isArray(data.result.data)) {
            throw new Error('Result data is not an array');
        }

        logdata = data.result.data.map((item: Logdata) => ({
            Id: item.Id,
            Timestamp: item.Timestamp,
            Action: item.Action,
            MethodName: item.MethodName,
            SqlData: item.SqlData,
            ActorName: item.ActorName
        }));
        
        console.log('Processed logdata:', logdata);  // ตรวจสอบข้อมูลที่ถูกแปลงแล้ว

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}






</script>

<div class="w-full py-4 px-2 sm:px-4" style="font-family: Ubuntu, sans-serif">
	<div
		class="mb-6 pt-8 sm:pt-6 md:pt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
	>
		<input
			type="date"
			placeholder="Merchant Id or Merchant Name"
			class="input input-bordered w-full max-w-xs bg-blue-50"
			style="background-color: aliceblue;"
			maxlength="100"
		/>

		<input
			type="date"
			placeholder="Merchant Id or Merchant Name"
			class="input input-bordered w-full max-w-xs bg-blue-50"
			style="background-color: aliceblue;"
			maxlength="100"
		/>
		<div class="flex space-x-2">
			<button class="btn bg-primary text-white btn-primary text-xs sm:text-sm">Search</button>
			<button class="btn btn-outline btn-primary text-xs sm:text-sm">Clear</button>
		</div>
	</div>
	<div class="overflow-x-hidden">
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base">
			<thead class="text-center bg-primary text-white lg:text-base">
				<tr>
					<th class="p-1 sm:p-2 w-10">ID</th>
					<th class="p-1 sm:p-2 ">ActorName</th>
					<th class="p-1 sm:p-2 ">Action</th>
					<th class="p-1 sm:p-2 ">MethodName</th>
					<th class="p-1 sm:p-2 ">SqlData</th>
					<th class="p-1 sm:p-2 ">Time</th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#each logdata as item}
					<tr>
						
						<th class="p-1 sm:p-2 lg:text-sm truncate ">{item.Id}</th>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.ActorName}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.Action}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.MethodName}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.SqlData}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.Timestamp}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="w-full flex justify-end mt-4">
			<div class="join grid grid-cols-2 w-full sm:w-auto">
				<button class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary">Previous</button>
				<button class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary">Next</button>
			</div>
		</div>
	</div>
</div>

<style>
	.badge-status {
		@apply py-1 px-2 rounded-full text-white;
		width: 60%;
	}
	.badge-success {
		@apply bg-green-600;
	}
	.badge-danger {
		@apply bg-red-600;
	}
	@media (max-width: 640px) {
		.badge-status {
			width: 100%;
		}
	}

	@import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
</style>
