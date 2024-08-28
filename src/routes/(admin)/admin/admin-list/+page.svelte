<script lang="ts">
	import { onMount } from 'svelte';
	import type { UserData } from './+page.server.ts';
	import type { PackageData } from './+page.server.ts';
	import cookie from 'cookie';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';

	let userData: UserData[] = [];
	let searchInpage = '';
	let editingUser: UserData | null = null;
	let currentPage = 1;
	let offset = 1;
	let limit = 10;
	let filteredData: UserData[] = [];
	let merchantname = '';
	let keyWord = '';
	let packageData: PackageData[] = [];
	let totalItems = 0;

	function getCookies() {
		return cookie.parse(document.cookie);
	}

	onMount(async () => {
		await fetchData(offset,limit,keyWord);

	});

	
	$: totalPages = Math.ceil(totalItems / limit); 


	function nextPage() {
		if (currentPage < totalPages) {
			offset++;
			currentPage++;
		}
		handleSearch();
	}

	function prevPage() {
		if (currentPage > 1) {
			offset--;
			currentPage--;
		}
		handleSearch();
	}
	function firstPage() {
		if (currentPage > 1) {
			offset = 1;
			currentPage = 1;
		}
		handleSearch();
	}

	function handleSearch() {
		fetchData(offset,limit,keyWord);
	}


	async function fetchData(currentOffset :number, currentLimit :number,searchMerchant:string) {
		try {
			const response = await fetch(
				`${PUBLIC_API_ENDPOINT}/merchant/get-merchants-with-pkg?offset=${offset}&limit=${limit}&searchMerchant=${keyWord}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			if (!Array.isArray(data.result)) {
				throw new Error('Result is not an array');
			}
			console.log(data);
			const totalCount = data.result.length > 0 ? data.result[0].TotalCount : 0;
			userData = data.result.map((item: UserData) => ({
				Id: parseInt(item.Id, 10),
				MerchantId: parseInt(item.MerchantId, 10),
				MerchantName: item.MerchantName,
				QuotaUsage: parseInt(item.QuotaUsage, 10),
				QuotaLimit: parseInt(item.QuotaLimit, 10),
				PackageId: parseInt(item.PackageId, 10),
				PackageName: item.PackageName,
				BalanceQuotaLeft: parseInt(item.BalanceQuotaLeft, 10),
				Status: item.Status
			}));
			totalPages = Math.ceil(totalCount / currentLimit);

		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	

	async function fetchDataPkg() {
		try {
			const response = await fetch(`${PUBLIC_API_ENDPOINT}/merchant/packages`);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			if (!Array.isArray(data.result)) {
				throw new Error('Result is not an array');
			}

			packageData = data.result.map((item: PackageData) => ({
				Id: item.Id,
				Name: item.Name,
				Price: item.Price,
				QuotaLimit: item.QuotaLimit,
				Status: item.Status
			}));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	
	fetchDataPkg();
	
	

	function clearSearch() {
		searchInpage = '';
		filteredData = [...userData];
		location.reload();
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
		const cookies = getCookies();
		const myCookie = cookies['admin_account'] ? JSON.parse(cookies['admin_account']) : null;

		try {
			const updatePackageResponse = await fetch(
				`http://127.0.0.1:4567/api/v1/merchant/updatepackage`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Actor-Id': myCookie.Id,
						'Actor-Name': myCookie.Email,
						'Actor-Role': 'ADMIN'
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

	
</script>

<div class="w-full py-4 px-2 sm:px-4" style="font-family: Ubuntu, sans-serif">
	<span
		class="text-3xl font-bold text-primary flex lg:justify-start md:justify-start sm:justify-center justify-center"
		>Merchant</span
	>
	<div
		class="mb-6 pt-8 sm:pt-6 md:pt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
	>
		<input
			type="text"
			placeholder="Merchant Id or Merchant Name"
			class="input input-bordered w-full max-w-xs bg-blue-50"
			style="background-color: aliceblue;"
			maxlength="100"
			bind:value={keyWord}
		/>
		<div class="flex space-x-2">
			<button
				class="btn bg-primary text-white btn-primary text-xs sm:text-sm"
				on:click={firstPage}>Search</button
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
					<th class="p-1 sm:p-2 text-wrap text-left">
						<div class="lg:block sm:block hidden">Merchant Id</div>
						<div class="lg:hidden sm:hidden block">M.ID</div></th
					>
					<th class="p-1 sm:p-2 text-wrap text-left"
						><div class="lg:block sm:block hidden">Merchant Name</div>
						<div class="lg:hidden sm:hidden block">M.Name</div></th
					>
					<th class="p-1 sm:p-2 text-left">Package</th>
					<th class="p-1 sm:p-2 text-wrap text-right">
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
						<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.MerchantId}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.MerchantName}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.PackageName}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-right"
							>{item.QuotaUsage + item.BalanceQuotaLeft}</td
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
		<div class="grid col-2 w-full justify-end sm:w-auto">
			<div class="text-right text-sm">Page {currentPage} of {totalPages}</div>
			<div class="flex">
				<select
					class="select-sm w-full max-w-xs h-1 rounded-md bg-white"
					bind:value={limit}
					on:change={firstPage}
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={15}>15</option>
					<option value={20}>20</option>
					<option value={25}>25</option>
					<option value={30}>30</option>
				</select>
				<button
					class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary mx-1"
					on:click={prevPage}
					disabled={currentPage === 1}>Previous</button
				>
				<button
					class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary"
					on:click={nextPage}
					disabled={currentPage === totalPages}>Next</button
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

					<select class="select max-w-xs w-80 bg-white overflow-y-auto" bind:value={editingUser.PackageId}>
						{#each packageData as pkgdata}
							<option value={pkgdata.Id}>{pkgdata.Name}</option>
						{/each}
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
