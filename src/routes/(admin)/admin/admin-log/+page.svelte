<script lang="ts">
	import { onMount } from 'svelte';
	import type { LogAdmin } from './+page.server';
	import JsonViewer from './(component)/JsonViewer.svelte';
	import Modal from './(component)/Modal.svelte';
	import * as Table from '$lib/components/ui/table';

	let LogAdmin: LogAdmin[] = [];
	let offset = 1;
	let limit = 10;
	let totalItems = 0;
	let loading = false;
	let currentPage = 1;
	let startDate = '';
	let endDate = '';
	let actorName = '';
	let action = '';
	let role = '';

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
		action = '',
		role = ''
	) {
		loading = true;
		try {
			const formattedStartDate = formatDateInput(start);
			const formattedEndDate = formatDateInput(end);
			const response = await fetch(
				`http://127.0.0.1:4567/api/v1/admin/logadmin/search?startDate=${formattedStartDate}&endDate=${formattedEndDate}&offset=${offset}&limit=${limit}&actor=${actor}&action=${action}&actor_role=${role}`
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
				Id: item.Id,
				index: index + (offset - 1) * limit + 1,
				Timestamp: formatDateToGMT7(item.Timestamp),
				Action: item.Action,
				MethodName: item.MethodName,
				DataRequest: item.DataRequest,
				ActorName: item.ActorName
			}));
			totalItems = data.total || LogAdmin.length;
			console.log('Input', startDate, endDate, action, actorName, offset, limit, role);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}
	}

	function formatDateToGMT7(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
	}

	function handleSearch() {
		fetchData(startDate, endDate, offset, limit, actorName, action, role);
	}

	function handleClear() {
		startDate = '';
		endDate = '';
		actorName = '';
		action = '';
		role = '';
		fetchData('', '', offset, limit, '', '', '');
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

	onMount(() => {
		console.log('Component mounted');
		console.log(role);
		fetchData('', '', offset, limit);
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
	function handleInputAction(event: any) {
		// Get the current value of the input
		let value = event.target.value;

		// Remove any non-letter and non-space characters
		value = value.replace(/[^A-Za-z\s]/g, '');

		// Remove leading spaces
		value = value.replace(/^\s+/, '');

		// Update the input value and bound variable
		action = value;
		event.target.value = value;
	}

	let showModal: boolean = false;

	const openModal = () => {
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};
</script>

<div class="w-full py-4 sm:px-4 overflow-x-auto">
	<span
		class="text-3xl font-bold text-black flex lg:justify-start md:justify-start sm:justify-center justify-center"
		>บันทึก</span
	>

	<div class="flex items-center flex-wrap mb-4 pt-8 sm:pt-6 md:pt-4">
		<div class="flex items-center gap-2">
		  <input
			type="date"
			bind:value={startDate}
			class="input input-bordered bg-white my-1 mx-2"
			maxlength="100"
		  />
		  <span class="text-center self-center w-4">ถึง</span>
		  <input
			type="date"
			bind:value={endDate}
			class="input input-bordered bg-white my-1 mx-2"
			maxlength="100"
		  />
		</div>
		
		<input
		  type="text"
		  placeholder="กิจกรรม"
		  bind:value={action}
		  on:input={handleInputAction}
		  class="input input-bordered bg-white my-1 mx-2"
		  maxlength="100"
		/>
		
		<input
		  type="text"
		  placeholder="ชื่อผู้ใช้"
		  bind:value={actorName}
		  on:input={handleInputActor}
		  class="input input-bordered bg-white my-1 mx-2"
		  maxlength="250"
		/>
		
		<div class="flex flex-col sm:flex-row lg:col-span-2">
		  <button
			on:click={firstPage}
			class="btn bg-primary text-white btn-primary text-xs sm:text-sm my-1 mx-2 hover:bg-[#050680]"
		  >ค้นหา</button>
		  <button
			on:click={handleClear}
			class="btn btn-outline text-xs sm:text-sm my-1 mx-2"
		  >ล้าง</button>
		</div>
	  </div>
	  
	<div>
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base bg-white">
			<thead>
				<tr>
				  <th colspan="6" class="p-2">
					<div class="flex justify-start p-2  rounded-md text-gray-700 ">
					  <select
						class="select rounded-md  bg-white outline outline-1 outline-gray-300 px-2 py-0.5 w-[200px]" 
						bind:value={role}
						on:change={handleSearch}
					  >
					  <option value="">ทั้งหมด</option>
						<option value="ADMIN">แอดมิน</option>
						<option value="MERCHANT">ผู้ใช้งาน</option>
						
					  </select>
					</div>
				  </th>
				</tr>
			  </thead>
			<thead class="text-center text-gray-700 lg:text-base caption-bottom">
				<tr class="border-b border-gray-300 bg-gray-100">
					<th class="p-1 sm:p-2 w-10 text-left">ลำดับ</th>
					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden text-left">วันที่</div>
						<div class="lg:hidden sm:hidden block">Time</div>
					</th>
					<th class="p-1 sm:p-2 text-left">กิจกรรม</th>
					<th class="p-1 sm:p-2 text-wrap w-[30%]">
						<div class="lg:block sm:block hidden text-left">หัวข้อ</div>
						<div class="lg:hidden sm:hidden block text-left">หัวข้อ</div>
					</th>

					<th class="p-1 sm:p-2 text-wrap">
						<div class="lg:block sm:block hidden text-left">ชื่อผู้ใช้</div>
						<div class="lg:hidden sm:hidden block text-left">ชื่อผู้ใช้</div>
					</th>
					<th class="p-1 sm:p-2 text-left">รายละเอียด</th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if loading}
					<tr><td colspan="6"><span class="loading loading-spinner loading-xs"></span> </td></tr>
				{:else if LogAdmin.length === 0}
					<tr><td colspan="6">ไม่พบข้อมูล</td></tr>
				{:else}
					{#each LogAdmin as item, i (i)}
						<tr class="border-b border-gray-300">
							<td class="p-1 sm:p-2 lg:text-sm text-left ">{item.index}</td>
							<td
								class="p-1 sm:p-2 lg:text-sm text-left"
								title={new Date(item.Timestamp).toLocaleString('en-EN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: false
								})}
							>
								{new Date(item.Timestamp).toLocaleString('en-EN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: false
								})}
							</td>
							<td class="p-1 sm:p-2 lg:text-sm text-left" title="{item.Action}">{item.Action}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left" title={item.MethodName}
								>{item.MethodName}</td
							>
							<td class="p-1 sm:p-2 lg:text-sm text-left truncate" title={item.ActorName}
								>{item.ActorName}</td
							>
							<td class="p-1 sm:p-2 lg:text-sm text-center justify-start flex">
								<label for={`logDataModel-${i}`} class=" bg-white cursor-pointer"
									><svg
										class="w-6 h-6 text-gray-800 dark:text-gray-800"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="none"
										viewBox="0 0 30 30"
									>
										<path
											stroke="currentColor"
											stroke-width="2"
											d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
										/>
										<path
											stroke="currentColor"
											stroke-width="2"
											d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg></label
								>
								<Modal index={i}>
									<div class="p-4 space-y-4">
										<div class="flex">
											<span class="text-lg font-bold">รายละเอียด</span>
										</div>
										<div class="flex">
											<span class="font-bold min-w-[80px]">วันที่:</span>
											<span>{item.Timestamp}</span>
										</div>
										<div class="flex">
											<span class="font-bold min-w-[80px]">กิจกรรม:</span>
											<span>{item.Action}</span>
										</div>
										<div class="flex">
											<span class="font-bold min-w-[80px]">หัวข้อ:</span>
											<span>{item.MethodName}</span>
										</div>
										<div class="flex">
											<span class="font-bold min-w-[80px]">ชื่อผู้ใช้:</span>
											<span>{item.ActorName}</span>
										</div>

										<div class="pt-4">
											<span class="font-bold">JSON</span>
											<JsonViewer data={item.DataRequest} />
										</div>
									</div>
								</Modal>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<!-- <div class="grid col-2 w-full justify-end sm:w-auto">
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
		</div> -->
		<div class="grid w-full sm:w-auto mt-3">
			<div class="flex items-center justify-between w-full">
				<div class="text-sm ">หน้าที่ {currentPage} จากทั้งหมด {totalPages} หน้า</div>

				<div class="flex items-center space-x-2">
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
						class="btn btn-xs sm:btn-sm btn-outline"
						on:click={prevPage}
						disabled={currentPage === 1}
					>
						ย้อนกลับ
					</button>
					<button
						class="btn btn-xs sm:btn-sm btn-outline"
						on:click={nextPage}
						disabled={currentPage === totalPages}
					>
						ต่อไป
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<dialog id="edit_modal" class="modal">
	<div class="modal-box bg-white w-11/12 max-w-md">
		<div class="form-control">
			<h2 class="text-2xl font-bold mb-4">Edit</h2>
		</div>
	</div>
</dialog>
