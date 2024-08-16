<script lang="ts">
	import { onMount } from 'svelte';
	import type { LogAdmin } from './+page.server';

	let LogAdmin: LogAdmin[] = [];
	let offset = 1;
	let limit = 5;
	let totalItems = 0;
	let loading = false;
	let currentPage = 1;

	$: totalPages = Math.ceil(totalItems / limit);

	async function fetchData(currentOffset: number, currentLimit: number) {
		loading = true;
		try {
			const response = await fetch(
				`http://127.0.0.1:4567/api/v1/admin/logadmin?offset=${currentOffset}&limit=${currentLimit}&role=admin`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			if (!Array.isArray(data.result.data)) {
				throw new Error('Result is not an array');
			}
			LogAdmin = data.result.data.map((item: LogAdmin) => ({
				Id: item.Id,
				Timestamp: formatStringDateToMT8(item.Timestamp),
				Action: item.Action,
				MethodName: item.MethodName,
				SqlData: item.SqlData,
				ActorName: item.ActorName
			}));
			totalItems = data.result.total || LogAdmin.length;
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}
	}

	function formatStringDateToMT8(dateString: string): string {
		const date = new Date(dateString);
		const mt8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
		return mt8Date
			.toISOString()
			.replace('T', ' ')
			.replace(/\.\d+Z$/, '');
	}

	function nextPage() {
		if (currentPage < totalPages) {
			offset++;
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			offset--;
			currentPage--;
		}
	}

	$: {
		console.log(`Page changed: currentPage=${currentPage}, offset=${offset}, limit=${limit}`);
		fetchData(offset, limit);
	}

	onMount(() => {
		console.log('Component mounted');
		fetchData(offset, limit);
	});
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
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden">Time Stamp</div>
						<div class="lg:hidden sm:hidden block">Time</div></th
					>
					<th class="p-1 sm:p-2">Action</th>
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden">Method Name</div>
						<div class="lg:hidden sm:hidden block">Method</div></th
					>
					<th class="p-1 sm:p-2">Sql Data</th>
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden">Actor Name</div>
						<div class="lg:hidden sm:hidden block">Name</div></th
					>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if loading}
					<p>Loading...</p>
				{:else}
					{#each LogAdmin as item}
						<tr>
							<th class="p-1 sm:p-2 lg:text-sm truncate">{item.Id}</th>
							<td class="p-1 sm:p-2 lg:text-sm truncate">{item.Timestamp}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate">{item.Action}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate">{item.MethodName}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate">{item.SqlData}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate">{item.ActorName}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<div class="grid col-2 w-full justify-end sm:w-auto">
			<div class="text-right text-sm">Page {currentPage} of {totalPages}</div>
			<div class="flex">
				<select class="select-sm w-full max-w-xs h-1 rounded-md bg-white " bind:value={limit} on:change={prevPage}>
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="15">15</option>
					<option value="20">20</option>
					<option value="30">30</option>
				</select>
				<button
					class="join-item btn btn-xs sm:btn-sm btn-outline btn-primary"
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
