<script lang="ts">
	import { onMount } from 'svelte';
	import type { UserData } from './+page.server.ts';

	let userData: UserData[] = [];
	let searchInpage = '';
	let editingUser: UserData | null = null;
	let currentPage = 1;
	let limit = 10;

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
			userData = data.result.map((item: UserData) => ({
				Id: item.Id,
				MerchantId: item.MerchantId,
				MerchantName: item.MerchantName,
				QuotaUsage: item.QuotaUsage,
				PackageId: item.PackageId,
				Status: item.Status
			}));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	function clearSearch() {
		searchInpage = '';
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

<div class="w-full py-4" style="margin: 20px;">
	<div style="margin-bottom: 30px; display: flex;">
		<input
			type="text"
			placeholder="Search"
			class="input input-bordered w-full max-w-xs"
			style="background-color: aliceblue;"
			maxlength="100"
			bind:value={searchInpage}
		/>
		<button class="btn btn-outline" style="margin-right:10px; margin-left:10px">search</button>
		<button class="btn btn-outline" on:click={clearSearch}>clear</button>
	</div>
	<div class="overflow-x-auto">
		<table class="table">
			<thead class="bg-sky-700 text-black">
				<tr>
					<th>ID</th>
					<th>Merchant Id</th>
					<th>Merchant Name</th>
					<th>Package</th>
					<th>Quota</th>
					<th>Status</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each userData as item}
					<tr>
						<th>{item.Id}</th>
						<td>{item.MerchantId}</td>
						<td>{item.MerchantName}</td>
						<td>{item.PackageId}</td>
						<td>{item.QuotaUsage}</td>
						<td>
							<span 
								class:badge-success={item.Status === 'ACTIVE'}
								class:badge-danger={item.Status !== 'ACTIVE'}
							>
								{item.Status}
							</span>
						</td>
						<td>
							<button class="btn-sm btn-outline" on:click={() => showModal(item)}>
								<svg
									class="w-6 h-6 text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
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
		<div class="w-100 flex justify-end mx-10">
		<div class="join grid grid-cols-2 w-40">
			<button class="join-item btn btn-outline" on:click={goToPreviousPage}>Previous page</button>
			<button class="join-item btn btn-outline" on:click={goToNextPage}>Next</button>
		  </div>
		</div>
	</div>
</div>

<dialog id="my_modal_1" class="modal">
	<div class="modal-box bg-white">
		<div class="form-control">
			<h5>Edit</h5>
			{#if editingUser}
				<label class="label ">
					<span class="label-text">Merchant Name:</span>
					<input type="text" class="input input-bordered bg-white" bind:value={editingUser.MerchantName} />
				</label>
				<label class="label">
					<span class="label-text">Package:</span>
					<input type="text" class="input input-bordered bg-white" bind:value={editingUser.PackageId} />
				</label>
				<label class="label">
					<span class="label-text">Quota:</span>
					<input type="number" class="input input-bordered bg-white" bind:value={editingUser.QuotaUsage} />
				</label>
				<label class="label cursor-pointer">
					<span class="label-text">Status</span>
					<input type="checkbox" class="toggle bg-white toggle-success" bind:checked={isActive} on:change={toggleStatus} />
				</label>
				<div class="modal-action">
					<form method="dialog">
						<button class="btn btn-outline">Close</button>
					</form>
					<button class="btn btn-outline" on:click={updateUser}>Save</button>
				</div>
			{/if}
		</div>
	</div>
</dialog>

<style>
	.badge-success {
		background-color: green;
		color: white; 
		border-radius: 10px;
	}
	.badge-danger {
		background-color: red;
		color: white;
		border-radius: 10px;

	}
</style>
