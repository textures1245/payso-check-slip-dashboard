<script lang="ts">
	import { onMount } from 'svelte';
	import type { Packageactive } from './+page.server.ts';

	let packageactive: Packageactive[] = [];
	let searchInpage = '';
	let editingPackageactive: Packageactive | null = null;
	let currentPage = 1;
	let limit = 10;
	let filteredData: Packageactive[] = [];
	let merchantname = '';
	let selectionvalue = '';

	onMount(async () => {
		await fetchData();
	});

	async function fetchData(offset = 0, limit = 10) {
		try {
			const response = await fetch(
				`http://127.0.0.1:4567/api/v1/package/packageactive`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			if (!Array.isArray(data.result)) {
				throw new Error('Result is not an array');
			}
			console.log(data);
			packageactive = data.result.map((item: Packageactive) => ({
				Id: item.Id,
				Name : item.Name,
    			Price : item.Price,
   				QuotaLimit : item.QuotaLimit,
    			CreatedAt : item.CreatedAt,
    			UpdatedAt : item.UpdatedAt,
    			Status : item.Status
			}));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	// async function searchfetchData(merchantname: string) {
	// 	try {
	// 		const response = await fetch(
	// 			`http://127.0.0.1:4567/api/v1/searchgetmerchant?merchantname=${merchantname}`
	// 		);
	// 		if (!response.ok) {
	// 			throw new Error('Failed to fetch data');
	// 		}
	// 		const data = await response.json();
	// 		if (!Array.isArray(data.result)) {
	// 			throw new Error('Result is not an array');
	// 		}
	// 		userData = data.result.map((item: UserData) => ({
	// 			Id: item.Id,
	// 			MerchantId: item.MerchantId,
	// 			MerchantName: item.MerchantName,
	// 			QuotaUsage: item.QuotaUsage,
	// 			PackageName: item.PackageName,
	// 			Status: item.Status
	// 		}));
	// 	} catch (error) {
	// 		console.error('Error fetching data:', error);
	// 	}
	// }
	// function handleSearchClick() {
	// 	searchfetchData(searchInpage);
	// }

	// function clearSearch() {
	// 	searchInpage = '';
	// 	filteredData = [...userData];
	// 	location.reload();
	// }

	// function handleLimitChange(event: Event) {
	// 	const target = event.target as HTMLSelectElement;
	// 	limit = parseInt(target.value);
	// 	fetchData((currentPage - 1) * limit, limit);
	// }

	// function showModal(user: UserData) {
	// 	editingUser = user;
	// 	const modal = document.getElementById('my_modal_1');
	// 	// @ts-ignore
	// 	modal.showModal();
	// }

	
	// $: isActive = editingUser?.Status === 'ACTIVE';

	// function toggleStatus() {
	// 	isActive = !isActive;
	// 	if (editingUser) {
	// 		editingUser.Status = isActive ? 'ACTIVE' : 'INACTIVE';
	// 	}
	// }

	// function goToPreviousPage() {
	// 	if (currentPage > 1) {
	// 		currentPage -= 1;
	// 		fetchData((currentPage - 1) * limit, limit);
	// 	}
	// }

	// function goToNextPage() {
	// 	currentPage += 1;
	// 	fetchData((currentPage - 1) * limit, limit);
	// }
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
			<button class="btn  bg-primary text-white btn-primary text-xs sm:text-sm" 
				>Search</button
			>
			<button class="btn btn-outline btn-primary text-xs sm:text-sm" 
				>Clear</button
			>
		</div>
	</div>
	<div class="overflow-x-hidden">
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base">
			<thead class="text-center bg-primary text-white lg:text-base">
				<tr>
					<th class="p-1 sm:p-2 w-10">ID</th>
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden">Package Name</div>
						<div class="lg:hidden sm:hidden block">P.Name</div></th
					>
					<th class="p-1 sm:p-2">Price</th>
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden">Quota Limit</div>
						<div class="lg:hidden sm:hidden block">Q.Limit</div></th
					>
					<th class="p-1 sm:p-2">Status</th>
					<th class="p-1 sm:p-2">CreateAt</th>
					<th class="p-1 sm:p-2">UpdatedAt</th>

				</tr>
			</thead>
			<tbody class="text-center">
				{#each packageactive as item}
					<tr>
						<th class="p-1 sm:p-2 lg:text-sm truncate">{item.Id}</th>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.Name}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.Price}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.QuotaLimit}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">
							<div class="flex justify-center">
								<div
									class="badge-status text-xs sm:text-sm {item.Status === 'ACTIVE'
										? 'badge-success'
										: 'badge-danger'}"
								>
									{item.Status}
								</div>
							</div>
						</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.CreatedAt}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.UpdatedAt}</td>


						
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="w-full flex justify-end mt-4">
			<div class="join grid grid-cols-2 w-full sm:w-auto">
				<!-- <select class="select w-full max-w-xs bg-white" bind:value={limit} on:change={handleLimitChange}>
					<option value="10">10</option>
					<option value="15">15</option>
					<option value="20">20</option>
					<option value="25">25</option>
					<option value="30">30</option>
				  </select> -->
				<button
					class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary"
					>Previous</button
				>
				<button
					class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary"
					>Next</button
				>
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
