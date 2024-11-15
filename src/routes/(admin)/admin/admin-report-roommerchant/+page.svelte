<script lang="ts">
	import { onMount } from 'svelte';
	import type { RoomMerchantData } from './+page.server.ts';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { PUBLIC_BACKEND_API_KEY } from '$env/static/public';

	let roomMerchantData: RoomMerchantData[] = [];
	let filteredData: RoomMerchantData[] = [];
	let currentPage = 1;
	let offset = 1;
	let limit = 10;
	let searchkeyword = '';
	let loadingtable = false;
	let loadingPage = false;
	let totalItems = 0;

	$: totalPages = Math.ceil(totalItems / limit);

	onMount(async () => {
		fetchData( offset, limit,searchkeyword);
	});

	function handleSearch() {
		fetchData( offset, limit,searchkeyword);
	}

	function clearSearch() {
		searchkeyword = '';
		filteredData = [...roomMerchantData];
		fetchData(offset, limit, '');
	}

	async function fetchData(currentOffset : number, currentLimit: number, searchkeyword = '') {
		loadingtable = true;
		loadingPage = true;
		try {
			const response = await fetch(
				`${PUBLIC_API_ENDPOINT}/admin/getRoomMerchantReport?offset=${currentOffset}&limit=${currentLimit}&searchkeyword=${searchkeyword}`,
				{
					headers: {
						'Content-Type': 'application/json',
						'ngrok-skip-browser-warning': 'true',
						'apikey' : `${PUBLIC_BACKEND_API_KEY}`
					}
				}
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
			const totalCount = data.result.length > 0 ? data.result[0].TotalCount : 0;


			roomMerchantData = (data.result || []).map((item: RoomMerchantData, Index: number) => ({
				Id: item.Id,
				MerchantId: item.MerchantId,
				MerchantName: item.MerchantName,
				TotalQuotaUsed: item.TotalQuotaUsed,
				RegisteredAt: item.RegisteredAt,
				NotiOnValid: item.NotiOnValid,
				NotiOnInvalid: item.NotiOnInvalid,
				NotiOnInvalidReciverBankAccount: item.NotiOnInvalidReciverBankAccount,
				NotiOnInvalidUnverified: item.NotiOnInvalidUnverified,
				NotiOnInvalidMinAmount: item.NotiOnInvalidMinAmount,
				NotiOnQuotaLimitExceed: item.NotiOnQuotaLimitExceed,
				MinAmountReceive: item.MinAmountReceive,
				HideSenderDetail: item.HideSenderDetail,
				HideReciverDetail: item.HideReciverDetail,
				TransactionSummary: item.TransactionSummary,
				RoomName: item.RoomName,
				PackageName: item.PackageName,
				TotalCount : item.TotalCount,   
				Index: Index + (currentOffset - 1) * currentLimit + 1
			}));
			totalPages = Math.ceil(totalCount / limit);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loadingtable = false;
			loadingPage = false;
		
		}
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



</script>

<div class="w-full py-4 px-2 sm:px-4">
	<span
		class="text-3xl font-bold text-black flex lg:justify-start md:justify-start sm:justify-center justify-center"
	>
		รายงานห้องของลูกค้า
	</span>

	<div
		class="mb-6 pt-8 sm:pt-6 md:pt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
	>
		<div class="relative w-full max-w-xs">
			<input
				type="text"
				placeholder="ชื่อห้อง ชื่อลูกค้า"
				class="input input-bordered w-full pl-10 bg-white"
				style="background-color: white;"
				maxlength="100"
				bind:value={searchkeyword}
			/>
			<!-- Search Icon -->
			<div class="absolute inset-y-0 left-0 flex items-center pl-3">
				<svg
					class="w-5 h-5 text-gray-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-4.35-4.35m2.35-7.65a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>
		<div class="flex justify-end space-x-2">
			<button
				class="btn bg-primary text-white btn-primary text-xs sm:text-sm hover:bg-[#050680]"
				on:click={handleSearch}>ค้นหา</button
			>
			<button class="btn btn-outline text-xs sm:text-sm" on:click={clearSearch}>ล้าง</button>
		</div>
	</div>

	<div class="overflow-x-hidden">
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base bg-white">
			<thead class="text-center text-gray-700 lg:text-base">
				<tr class="border-b border-gray-300">
					<th class="p-1 sm:p-2 text-sm w-12 text-left">ลำดับ</th>
					<th class="p-1 sm:p-2 text-sm text-left">ชื่อห้อง</th>
					<th class="p-1 sm:p-2 text-sm text-left">รหัสลูกค้า</th>
					<th class="p-1 sm:p-2 text-sm text-left">ชื่อ-นามสกุล</th>
					<th class="p-1 sm:p-2 text-sm text-right">โควตาที่ใช้</th>
					<th class="p-1 sm:p-2 text-sm text-right">จำนวนเงินขั้นต่ำที่ได้รับ</th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if loadingtable}
					<tr><td colspan="7"><span class="loading loading-spinner loading-xs"></span> </td></tr>
				{:else if roomMerchantData.length === 0}
					<tr><td colspan="7">ไม่พบข้อมูล</td></tr>
				{:else}
					{#each roomMerchantData as item}
						<tr class="border-b border-gray-300">
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.Index}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left" title="{item.RoomName}">{item.RoomName}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.MerchantId}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left" title="{item.MerchantName}">{item.MerchantName}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-right">{item.TotalQuotaUsed}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-right">{item.MinAmountReceive.toFixed(2)}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<div class="grid w-full sm:w-auto mt-3">
			<div class="flex items-center justify-between w-full">
				<div class="text-sm">หน้าที่ {currentPage} จากทั้งหมด {totalPages} หน้า</div>

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
