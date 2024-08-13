<script lang="ts">
	import { onMount } from 'svelte';
	import type { UserData } from './+page.server.ts';

	let userData: UserData[] = [];
	let searchInpage = '';
	let editingUser: UserData | null = null;
	let currentPage = 1;
	let limit = 10;
	let filteredData: UserData[] = [];
	let merchantname = '';
	let selectionvalue = '';

	onMount(async () => {
		await fetchData();
	});

	async function fetchData(offset = 0, limit = 10) {
		try {
			const response = await fetch(
				`http://127.0.0.1:4567/api/v1/merchant/get-merchants-with-pkg?Offset=${offset}&Limit=${limit}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			if (!Array.isArray(data.result)) {
				throw new Error('Result is not an array');
			}
			console.log(data);
			userData = data.result.map((item: UserData) => ({
				Id: item.Id,
				MerchantId: item.MerchantId,
				MerchantName: item.MerchantName,
				QuotaUsage: item.QuotaUsage,
				QuotaLimit: item.QuotaLimit,
				PackageId: item.PackageId,
				PackageName: item.PackageName,
				BalanceQuotaLeft: item.BalanceQuotaLeft,
				Status: item.Status
			}));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	async function searchfetchData(merchantname: string) {
		try {
			const response = await fetch(
				`http://127.0.0.1:4567/api/v1/searchgetmerchant?merchantname=${merchantname}`
			);
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
				PackageName: item.PackageName,
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
		location.reload();
	}

	function handleLimitChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		limit = parseInt(target.value);
		fetchData((currentPage - 1) * limit, limit);
	}

	function showModal(user: UserData) {
		editingUser = user;
		console.log(typeof editingUser.Id);
		const modal = document.getElementById('my_modal_1');
		// @ts-ignore
		modal.showModal();
	}

	async function updateUser() {
		if (!editingUser) return;

		try {
			const updatePackageResponse = await fetch(
				`http://127.0.0.1:4567/api/v1/merchant/updatepackage`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						PackageId: editingUser.PackageId,
						MerchantId: editingUser.Id
					})
				}
			);

			if (!updatePackageResponse.ok) {
				throw new Error('Failed to update package');
			}

			const updateStatusResponse = await fetch(
				`http://127.0.0.1:4567/api/v1/merchant/updatestatus/${editingUser.Id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ Status: editingUser.Status })
				}
			);

			if (!updateStatusResponse.ok) {
				throw new Error('Failed to update status');
			}

			const index = userData.findIndex((user) => user.Id === editingUser?.Id);
			if (index !== -1) {
				userData[index] = { ...editingUser };
				userData = [...userData];
			}

			const modal = document.getElementById('my_modal_1');
			// @ts-ignore
			modal.close();
			editingUser = null;
		} catch (error) {
			console.error('Error updating user:', error);
		}

		location.reload();
	}

	$: isActive = editingUser?.Status === 'ACTIVE';

	function toggleStatus() {
		isActive = !isActive;
		if (editingUser) {
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

<div class="w-full py-4 px-2 sm:px-4" style="font-family: Ubuntu, sans-serif">
	<div
		class="mb-6 pt-8 sm:pt-6 md:pt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
	>
		<input
			type="text"
			placeholder="Merchant Id or Merchant Name"
			class="input input-bordered w-full max-w-xs bg-blue-50"
			style="background-color: aliceblue;"
			maxlength="100"
			bind:value={searchInpage}
		/>
		<div class="flex space-x-2">
			<button
				class="btn bg-primary text-white btn-primary text-xs sm:text-sm"
				on:click={handleSearchClick}>Search</button
			>
			<button class="btn btn-outline btn-primary text-xs sm:text-sm" on:click={clearSearch}
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
						<div class="lg:block sm:block hidden">Merchant Id</div>
						<div class="lg:hidden sm:hidden block">M.ID</div></th
					>
					<th class="p-1 sm:p-2 text-wrap"
						><div class="lg:block sm:block hidden">Merchant Name</div>
						<div class="lg:hidden sm:hidden block">M.Name</div></th
					>
					<th class="p-1 sm:p-2">Package</th>
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden">QuotaToUse</div>
						<div class="lg:hidden sm:hidden block">Quota</div></th
					>
					<th class="p-1 sm:p-2">Status</th>
					<th class="p-1 w-20 sm:p-2"></th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#each userData as item}
					<tr>
						<th class="p-1 sm:p-2 lg:text-sm truncate">{item.Id}</th>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.MerchantId}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.MerchantName}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.PackageName}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.QuotaUsage + item.BalanceQuotaLeft}</td
						>
						<td class="p-1 sm:p-2 lg:text-sm truncate">
							<div class="flex justify-center">
								<div
									class="badge-status lg:text-sm md:text-xs sm:text-xxs text-xs {item.Status ===
									'ACTIVE'
										? 'badge-success'
										: 'badge-danger'}"
								>
									{item.Status}
								</div>
							</div>
						</td>
						<td class="p-1 sm:p-2">
							<button class="btn btn-xs sm:btn-sm bg-primary" on:click={() => showModal(item)}>
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
				<!-- <select class="select w-full max-w-xs bg-white" bind:value={limit} on:change={handleLimitChange}>
					<option value="10">10</option>
					<option value="15">15</option>
					<option value="20">20</option>
					<option value="25">25</option>
					<option value="30">30</option>
				  </select> -->
				<button
					class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary"
					on:click={goToPreviousPage}>Previous</button
				>
				<button
					class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary"
					on:click={goToNextPage}>Next</button
				>
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
					<input
						type="text"
						class="input input-bordered bg-white disabled:bg-white disabled:text-black w-80"
						disabled
						bind:value={editingUser.MerchantName}
					/>
				</label>
				<label class="label">
					<span class="label-text text-black w-2/5">Package:</span>
					<select class="select max-w-xs w-80 bg-white" bind:value={editingUser.PackageId}>
						<option value={1}>Silver</option>
						<option value={2}>Bronz</option>
						<option value={3}>pkh1</option>
					</select>
				</label>

				<label class="label cursor-pointer bg-white flex">
					<span class="label-text text-black w-2/5">Status</span>
					<div class="w-80">
						<input
							type="checkbox"
							class="toggle [--tglbg:white] toggle-success"
							bind:checked={isActive}
							on:change={toggleStatus}
						/>
					</div>
				</label>

				<div class="modal-action">
					<form method="dialog" class="flex space-x-2">
						<button class="btn btn-outline btn-error">Close</button>
						<button class="btn bg-primary text-white btn-primary" on:click={updateUser}>Save</button
						>
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

	.text-xxs {
		font-size: 0.625rem;
	}
</style>
