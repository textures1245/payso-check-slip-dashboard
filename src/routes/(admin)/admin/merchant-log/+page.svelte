<script lang="ts">
	import { onMount } from 'svelte';
	import type { LogAdmin } from './+page.server';

	let LogAdmin: LogAdmin[] = [];
	let offset = 1;
	let limit = 10;
	let totalItems = 0;
	let loading = false;
	let currentPage = 1;
	let startDate = '';
	let endDate = '';
	let actorName = '';
	let methodName = '';
	let role = 'admin';

	$: totalPages = Math.ceil(totalItems / limit);

	function formatDateInput(date: string | number | Date) {
		return date ? new Date(date).toISOString() : '';
	}

	async function fetchData(
		start = '',
		end = '',
		offset = 1,
		limit = 5,
		actor = '',
		method = '',
		role = 'admin'
	) {
		loading = true;
		try {
			const formattedStartDate = formatDateInput(start);
			const formattedEndDate = formatDateInput(end);
			const response = await fetch(
				`http://127.0.0.1:4567/api/v1/admin/logadmin/search?startDate=${formattedStartDate}&endDate=${formattedEndDate}&offset=${offset}&limit=${limit}&actorName=${actor}&methodName=${method}&role=${role}`
			);

			if (!response.ok) {
				const contentType = response.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					const errorData = await response.json();
					throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
				} else {
					const errorText = await response.text();
					throw new Error(`Error ${response.status}: ${errorText}`);
				}
			}

			const data = await response.json();

			// Format the output dates to GMT+8
			LogAdmin = (data.result || []).map((item: LogAdmin, index: number) => ({
				index: index + (offset - 1) * limit + 1,
				Timestamp: formatDateToGMT7(item.Timestamp),
				Action: item.Action,
				MethodName: item.MethodName,
				SqlData: item.SqlData,
				ActorName: item.ActorName
			}));
			totalItems = data.total || LogAdmin.length;
			console.log('Input', startDate, endDate, offset, limit);
		} catch (error) {
			console.error('Error fetching data:', error);
			// alert(`Failed to fetch data Please try again.`);
		} finally {
			loading = false;
		}
	}

	function newIndex(index: number, currentPage: number, limit: number) {
		(currentPage - 1) * limit + index + 1;
	}

	function formatDateToGMT7(dateString: string): string {
		const date = new Date(dateString);
		const gmt7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000);
		return gmt7Date
			.toISOString()
			.replace('T', ' ')
			.replace(/\.\d+Z$/, '');
	}

	function handleSearch() {
		fetchData(startDate, endDate, offset, limit, actorName, methodName);
	}
	function handleClear() {
		startDate = '';
		endDate = '';
		actorName = '';
		methodName = '';
		fetchData('', '', offset, limit, '', '');
	}

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

	let isAdmin = true;
	let isMerchant = false;
	function updateRole() {
		if (isAdmin && isMerchant) {
			role = '';
		} else if (isAdmin) {
			role = 'admin';
		} else if (isMerchant) {
			role = 'merchant';
		} else {
			role = '';
		}
		handleSearch();
		console.log(role);
		
	}

	onMount(() => {
		console.log('Component mounted', role);
		fetchData('', '', offset, limit);
		updateRole()
	});

	function handleInputActor(event: any) {
		// Get the current value of the input
		let value = event.target.value;

		// Remove any non-letter and non-space characters
		value = value.replace(/[^A-Za-z\s]/g, '');

		// Remove leading spaces
		value = value.replace(/^\s+/, '');

		// Update the input value and bound variable
		actorName = value;
		event.target.value = value;
	}
	function handleInputMethod(event: any) {
		// Get the current value of the input
		let value = event.target.value;

		// Remove any non-letter and non-space characters
		value = value.replace(/[^A-Za-z\s]/g, '');

		// Remove leading spaces
		value = value.replace(/^\s+/, '');

		// Update the input value and bound variable
		methodName = value;
		event.target.value = value;
	}
</script>

<div class="w-full py-4 sm:px-4" style="font-family: Ubuntu, sans-serif">
	<span
		class="text-3xl font-bold text-primary flex lg:justify-start md:justify-start sm:justify-center justify-center"
		>Log</span
	>

	<div
		class="grid lg:grid-cols-6 md:grid-cols-2 sm:grid-cols-1 items-start lg:items-start mb-4 pt-8 sm:pt-6 md:pt-4"
	>
		<input
			type="date"
			bind:value={startDate}
			class="input input-bordered bg-blue-50 my-1 mx-2"
			maxlength="100"
		/>
		<input
			type="date"
			bind:value={endDate}
			class="input input-bordered bg-blue-50 my-1 mx-2"
			maxlength="100"
		/>
		<input
			type="text"
			placeholder="Method"
			bind:value={methodName}
			on:input={handleInputMethod}
			class="input input-bordered bg-blue-50 my-1 mx-2"
			maxlength="100"
		/>
		<input
			type="text"
			placeholder="Actor"
			bind:value={actorName}
			on:input={handleInputActor}
			class="input input-bordered bg-blue-50 my-1 mx-2"
			maxlength="250"
		/>

		<div class="flex flex-col sm:flex-row lg:col-span-2">
			<button
				on:click={firstPage}
				class="btn bg-primary text-white btn-primary text-xs sm:text-sm my-1 mx-2">Search</button
			>
			<button
				on:click={handleClear}
				class="btn btn-outline btn-primary text-xs sm:text-sm my-1 mx-2">Clear</button
			>
			<!--  -->
			<div class="grid grid-cols-2 sm:grid-cols-1 sm:justify-items-start justify-items-center">
				<div class="flex items-center">
					<input
						class="form-check-input"
						type="checkbox"
						id="adminCheckbox"
						bind:checked={isAdmin}
						on:change={updateRole}
					/>
					<label class="ml-2" for="adminCheckbox">Admin</label>
				</div>
				<div class="flex items-center">
					<input
						class="form-check-input"
						type="checkbox"
						id="merchantCheckbox"
						bind:checked={isMerchant}
						on:change={updateRole}
					/>
					<label class="ml-2" for="merchantCheckbox">Merchant</label>
				</div>
			</div>
		</div>
	</div>

	<div class="overflow-x-hidden">
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base">
			<thead class="text-center bg-primary text-white lg:text-base">
				<tr>
					<th class="p-1 sm:p-2 w-10">No</th>
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden">Time Stamp</div>
						<div class="lg:hidden sm:hidden block">Time</div>
					</th>
					<th class="p-1 sm:p-2">Action</th>
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden text-left">Method Name</div>
						<div class="lg:hidden sm:hidden block text-left">Method</div>
					</th>

					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden text-left">Actor Name</div>
						<div class="lg:hidden sm:hidden block text-left">Name</div>
					</th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if loading}
					<tr><td colspan="6">Loading...</td></tr>
				{:else if LogAdmin.length === 0}
					<tr><td colspan="6">No data available</td></tr>
				{:else}
					{#each LogAdmin as item}
						<tr>
							<th class="p-1 sm:p-2 lg:text-sm truncate">{item.index}</th>
							<td class="p-1 sm:p-2 lg:text-sm truncate">{item.Timestamp}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate">{item.Action}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.MethodName}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.ActorName}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<div class="grid col-2 w-full justify-end sm:w-auto">
			<div class="text-right text-sm">Page {currentPage} of {totalPages}</div>
			<div class="flex">
				<select
					class="select-sm w-full max-w-xs h-1 rounded-md bg-white"
					bind:value={limit}
					on:change={handleSearch}
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
