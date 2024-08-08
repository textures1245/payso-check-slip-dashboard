<script lang="ts">
	import { onMount } from 'svelte';
	import type { PackageData } from './+page.server.ts';

	let packageData: PackageData[] = [];
	let currentPage = 1;
	let limit = 10;
	let editingPackage: PackageData | null = null;
	let newPackage: PackageData = { Id: 0, Name: '', Price: 0, QuotaLimit: 0, Status: 'INACTIVE' };
	let packagename = '';
	let searchInpage = '';
	let filteredData: PackageData[] = [];

	onMount(async () => {
		await fetchData();
	});

	async function fetchData(offset = 0, limit = 10) {
		try {
			const response = await fetch(
				`http://127.0.0.1:4567/api/v1/package/getpackage?offset=${offset}&limit=${limit}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			if (!Array.isArray(data.result)) {
				throw new Error('Result is not an array');
			}
			console.log(data);
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

	async function searchfetchData(packagename: string) {
		try {
			const response = await fetch(
				`http://127.0.0.1:4567/api/v1/package/search/getpackage?searchpackage=${packagename}`
			);
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

	function handleSearchClick() {
		searchfetchData(searchInpage);
	}

	function clearSearch() {
		searchInpage = '';
		filteredData = [...packageData];
		location.reload();
	}

	function showModalEdit(pkg: PackageData) {
		editingPackage = pkg;
		const modal = document.getElementById('edit_modal');
		// @ts-ignore
		modal.showModal();
	}
	function showModalCreate() {
		newPackage = { Id: 0, Name: '', Price: 0, QuotaLimit: 0, Status: 'INACTIVE' };
		const modal = document.getElementById('create_modal');
		// @ts-ignore
		modal.showModal();
	}

	async function createPackage() {
		try {
			const response = await fetch(`http://127.0.0.1:4567/api/v1/package/create/packages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newPackage)
			});

			if (!response.ok) {
				throw new Error('Failed to create package');
			}

			// Add the new package to the local packageData array
			packageData = [...packageData, newPackage];

			// Close the modal
			const modal = document.getElementById('create_modal');
			// @ts-ignore
			modal.close();
			newPackage = { Id: 0, Name: '', Price: 0, QuotaLimit: 0, Status: 'INACTIVE' };
		} catch (error) {
			console.error('Error creating package:', error);
		}
		location.reload();
	}

	async function updatePackage() {
		if (!editingPackage) return;

		try {
			const response = await fetch(
				`http://127.0.0.1:4567/api/update/package/${editingPackage.Id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(editingPackage)
				}
			);

			if (!response.ok) {
				throw new Error('Failed to update user');
			}

			const index = packageData.findIndex((pkg) => pkg.Id === editingPackage?.Id);
			if (index !== -1) {
				packageData[index] = { ...editingPackage };
				packageData = [...packageData]; // Trigger Svelte reactivity
			}

			// Close the modal
			const modal = document.getElementById('my_modal_1');
			// @ts-ignore
			modal.close();
			editingPackage = null;
		} catch (error) {
			console.error('Error updating user:', error);
		}
	}
	$: isActive = editingPackage?.Status === 'ACTIVE';

	function toggleStatus() {
		isActive = !isActive;
		if (editingPackage) {
			editingPackage.Status = isActive ? 'ACTIVE' : 'INACTIVE';
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
			placeholder="Package Id or Package Name"
			class="input input-bordered w-full max-w-xs bg-blue-50"
			style="background-color: aliceblue;"
			maxlength="100"
			bind:value={searchInpage}
		/>
		<div class="flex justify-end space-x-2">
			<button class="btn btn-outline btn-primary text-xs sm:text-sm" on:click={handleSearchClick}
				>Search</button
			>
			<button class="btn btn-outline btn-warning text-xs sm:text-sm" on:click={clearSearch}
				>Clear</button
			>
			<button class="btn btn-outline btn-primary text-xs sm:text-sm" on:click={showModalCreate}
				>Create</button
			>
		</div>
	</div>
	<div class="overflow-x-hidden">
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base">
			<thead class="text-center bg-primary text-white lg:text-base">
				<tr>
					<th class="p-1 sm:p-2">ID</th>
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
					<th class="p-1 sm:p-2"></th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#each packageData as item}
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
						<td class="p-1 sm:p-2">
							<button class="btn btn-xs sm:btn-sm btn-outline" on:click={() => showModalEdit(item)}>
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

<dialog id="edit_modal" class="modal">
	<div class="modal-box bg-white w-11/12 max-w-md">
		<div class="form-control">
			<h2 class="text-2xl font-bold mb-4">Edit</h2>
			{#if editingPackage}
				<div></div>
				<label class="label">
					<span class="label-text text-black w-2/5">Package Name:</span>
					<input
						type="text"
						class="input input-bordered bg-white w-80"
						bind:value={editingPackage.Name}
					/>
				</label>

				<label class="label">
					<span class="label-text text-black w-2/5">Price:</span>
					<input
						type="number"
						class="input input-bordered bg-white w-80"
						bind:value={editingPackage.Price}
					/>
				</label>
				<label class="label">
					<span class="label-text text-black w-2/5">QuotaLimit:</span>
					<input
						type="number"
						class="input input-bordered bg-white w-80"
						bind:value={editingPackage.QuotaLimit}
					/>
				</label>
				<label class="label cursor-pointer bg-white flex">
					<span class="label-text text-black w-2/5">Status</span>
					<div class="w-80">
						<input
							type="checkbox"
							class="toggle [--tglbg:white] toggle-success"
							bind:value={editingPackage.Status}
							on:change={toggleStatus}
						/>
					</div>
				</label>

				<div class="modal-action">
					<form method="dialog" class="flex space-x-2">
						<button class="btn btn-outline btn-error">Close</button>
						<button class="btn btn-outline btn-primary" on:click={updatePackage}>Save</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</dialog>

<dialog id="create_modal" class="modal">
	<div class="modal-box bg-white w-11/12 max-w-md">
		<div class="form-control">
			<h2 class="text-2xl font-bold mb-4">Create</h2>

			<div></div>
			<label class="label">
				<span class="label-text text-black w-2/5">Package Name:</span>
				<input
					type="text"
					class="input input-bordered bg-white w-80"
					bind:value={newPackage.Name}
				/>
			</label>

			<label class="label">
				<span class="label-text text-black w-2/5">Price:</span>
				<input
					type="number"
					class="input input-bordered bg-white w-80"
					bind:value={newPackage.Price}
				/>
			</label>
			<label class="label">
				<span class="label-text text-black w-2/5">QuotaLimit:</span>
				<input
					type="number"
					class="input input-bordered bg-white w-80"
					bind:value={newPackage.QuotaLimit}
				/>
			</label>
			<label class="label cursor-pointer bg-white flex">
				<span class="label-text text-black w-2/5">Status</span>
				<div class="w-80">
					<input
						type="checkbox"
						class="toggle [--tglbg:white] toggle-success"
						bind:value={newPackage.Status}
						on:change={toggleStatus}
					/>
				</div>
			</label>

			<div class="modal-action">
				<form method="dialog" class="flex space-x-2">
					<button class="btn btn-outline btn-error">Close</button>
					<button class="btn btn-outline btn-primary" on:click={createPackage}>Save</button>
				</form>
			</div>
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
