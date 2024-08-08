<script lang="ts">
	import { onMount } from 'svelte';
	import type { UserData } from './+page.server.ts';

	let userData: UserData[] = [];
	let searchInpage = '';
	let editingUser: UserData | null = null;
	let currentPage = 1;
	let limit = 10; 
	let filteredData: UserData[] = [];
	let merchantname = ''

	onMount(async () => {
		await fetchData();
	});

	async function fetchData(offset = 0 , limit = 10) {
		try {
			const response = await fetch(`http://127.0.0.1:4567/api/v1/getmerchant?offset=${offset}&limit=${limit}`);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			if (!Array.isArray(data.result)) {
				throw new Error('Result is not an array');
			}
			console.log(data)
			userData = data.result.map((item: UserData) => ({
				Id: item.Id,
				MerchantId: item.MerchantId,
				MerchantName: item.MerchantName,
				QuotaUsage: item.QuotaUsage,
				Name: item.Name,
				Status: item.Status
			}));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	} 


	async function searchfetchData(merchantname : string) {
		try {
			const response = await fetch(`http://127.0.0.1:4567/api/v1/searchgetmerchant?merchantname=${merchantname}`);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			if (!Array.isArray(data.result)) {
				throw new Error('Result is not an array');
			}
			userData = data.result.map((item: UserData) => ({
				Id: item.Id,
				MerchantId: item.MerchantId,
				MerchantName: item.MerchantName,
				QuotaUsage: item.QuotaUsage,
				Name: item.Name,
				Status: item.Status
			}));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	function handleSearchClick() {
    searchfetchData(searchInpage);
  }

	function clearSearch() {
		searchInpage = '';
		filteredData = [...userData];
		location.reload()
	}

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchInpage = target.value;
		filteredData = userData.filter((user) =>
			user.MerchantName.toLowerCase().includes(searchInpage.toLowerCase())
		);
	}




	function showModal(user: UserData) {
		editingUser = { ...user };
		const modal = document.getElementById('my_modal_1');
		// @ts-ignore
		modal.showModal();
	}

	async function updateUser() {
		if (!editingUser) return;

		try {
			const response = await fetch(
				`http://127.0.0.1:4567/api/update/merchant/${editingUser.Id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(editingUser)
				}
			);

			if (!response.ok) {
				throw new Error('Failed to update user');
			}

			const index = userData.findIndex((user) => user.Id === editingUser?.Id);
			if (index !== -1) {
				userData[index] = { ...editingUser };
				userData = [...userData]; // Trigger Svelte reactivity
			}

			// Close the modal
			const modal = document.getElementById('my_modal_1');
			// @ts-ignore
			modal.close();
			editingUser = null;
		} catch (error) {
			console.error('Error updating user:', error);
		}
	} 
	$: isActive = editingUser?.Status === 'ACTIVE';

    function toggleStatus() {
		
			isActive =!isActive
			if(editingUser){
            editingUser.Status = isActive ? 'ACTIVE' : 'INACTIVE';
		}
    } 

	function goToPreviousPage() {
		if (currentPage > 1) {
			currentPage -= 1;
			fetchData((currentPage - 1) * limit, limit);
		}
	} 

	function goToNextPage() {
		currentPage += 1;
		fetchData((currentPage - 1) * limit, limit);
	}
</script>

<div class="w-full py-4  px-2 sm:px-4" style= "font-family: Ubuntu, sans-serif">
	<div class="mb-6 pt-8 sm:pt-6 md:pt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
		<input
			type="text"
			placeholder="Merchant Id or Merchant Name"
			class="input input-bordered w-full max-w-xs bg-blue-50"
			style="background-color: aliceblue;"
			maxlength="100"
			bind:value={searchInpage}
		/>
		<div class="flex space-x-2">
			<button class="btn btn-outline btn-primary text-xs sm:text-sm" on:click={handleSearchClick}>Search</button>
			<button class="btn btn-outline btn-warning text-xs sm:text-sm" on:click={clearSearch}>Clear</button>
		</div>
	</div>
	<div class="overflow-x-hidden">
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base">
			<thead class="text-center bg-primary text-white lg:text-base">
				<tr>
					<th class="p-1 sm:p-2 ">ID</th>
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden">
							Merchant Id
						</div>
						<div class="lg:hidden sm:hidden block" >
							M.ID
						</div></th>
					<th class="p-1 sm:p-2 text-wrap "><div class="lg:block sm:block hidden">
						Merchant Name
					</div>
					<div class="lg:hidden sm:hidden block" >
						M.Name
					</div></th>
					<th class="p-1 sm:p-2">Package</th>
					<th class="p-1 sm:p-2">Quota</th>
					<th class="p-1 sm:p-2">Status</th>
					<th class="p-1 sm:p-2"></th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#each userData as item}
					<tr>
						<th class="p-1 sm:p-2 truncate">{item.Id}</th>
						<td class="p-1 sm:p-2 truncate">{item.MerchantId}</td>
						<td class="p-1 sm:p-2 truncate">{item.MerchantName}</td>
						<td class="p-1 sm:p-2 truncate">{item.Name}</td>
						<td class="p-1 sm:p-2 truncate">{item.QuotaUsage}</td>
						<td class="p-1 sm:p-2 truncate">
							<div class="flex justify-center">
								<div class="badge-status text-xs sm:text-sm {item.Status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">
									{item.Status}
								</div>
							</div>
						</td>
						<td class="p-1 sm:p-2">
							<button class="btn btn-xs sm:btn-sm btn-outline" on:click={() => showModal(item)}>
								<svg
									class="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
									/>
								</svg>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="w-full flex justify-end mt-4">
			<div class="join grid grid-cols-2 w-full sm:w-auto">
				<button class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary" on:click={goToPreviousPage}>Previous</button>
				<button class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary" on:click={goToNextPage}>Next</button>
			</div>
		</div>
	</div>
</div>

<dialog id="my_modal_1" class="modal">
	<div class="modal-box bg-white w-11/12 max-w-md">
		<div class="form-control">
			<h2 class="text-2xl font-bold mb-4">Edit</h2>
			{#if editingUser}
			<div></div>
				<label class="label">
					<span class="label-text text-black w-2/5">Merchant Name:</span>
					<input type="text" class="input input-bordered bg-white disabled:bg-white disabled:text-black w-80" disabled bind:value={editingUser.MerchantName} />
				</label>
				<label class="label">
					<span class="label-text text-black w-2/5">Package:</span>
					<input type="text" class="input input-bordered bg-white w-80" bind:value={editingUser.PackageId} />
				</label>
				<label class="label">
					<span class="label-text text-black w-2/5">Quota:</span>
					<input type="number" class="input input-bordered bg-white w-80" bind:value={editingUser.QuotaUsage} />
				</label>
				<label class="label cursor-pointer bg-white flex  ">
					<span class="label-text text-black w-2/5">Status</span>
					<div class="w-80">
						<input type="checkbox" class="toggle [--tglbg:white] toggle-success " bind:checked={isActive} on:change={toggleStatus}  />

					</div>
				</label>
			
				<div class="modal-action">
					<form method="dialog" class="flex space-x-2">
						<button class="btn btn-outline btn-error">Close</button>
						<button class="btn btn-outline btn-primary" on:click={updateUser}>Save</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</dialog>

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
