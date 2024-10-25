<script lang="ts">
	import type {TransactionandBankResponse} from './+page.server';

	let transactionandBankResponseData : TransactionandBankResponse[] = [];
	import cookie from 'cookie';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { onMount } from 'svelte';
	import { Item } from '$lib/components/ui/breadcrumb';

	let offset = 1;
	let limit = 10;
	let totalItems = 0;
	let loading = false;
	let currentPage = 1;
	let startDate = '';
	let endDate = '';
	let merchantName = '';
	let transectionStatus = ''; 

	$: totalPages = Math.ceil(totalItems / limit);

	function formatDateInput(date: string | number | Date) {
		return date ? new Date(date).toISOString() : '';
	}

	function formatDateToGMT7(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
	}

	function handleSearch() {
		fetchData(startDate, endDate, offset, limit, merchantName, transectionStatus);
	}

	function handleClear() {
		startDate = '';
		endDate = '';
		merchantName = '';
		transectionStatus = '';
		
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

	onMount(() => {
		console.log('Component mounted');
		fetchData('', '', offset, limit);
	});





	async function fetchData(
		start = '',
		end = '',
		offset = 1,
		limit = 5,
		mName = '',
		tranStatus = '',
		
	) {
		loading = true;
		try {
			const formattedStartDate = formatDateInput(start);
			const formattedEndDate = formatDateInput(end);
			const response = await fetch(
				`${PUBLIC_API_ENDPOINT}/admin/getbankresandtransection?startDate=${formattedStartDate}&endDate=${formattedEndDate}&offset=${offset}&limit=${limit}&merchantname=${mName}&transectionStatus=${tranStatus}`
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
			transactionandBankResponseData = (data.result || []).map((item: TransactionandBankResponse, index: number) => ({
				TransectionId : item.TransectionId,
				index: index + (offset - 1) * limit + 1,
				VerifiedDate: formatDateToGMT7(item.VerifiedDate),
				MerchantId : item.MerchantId,
				MerchantName: item.MerchantName,
				QrCode : item.QrCode,
				TransectionStatus : item.TransectionStatus,
				TransferRefId : item.TransferRefId,
				BankStatusCode : item.BankStatusCode,
				ErrorMsg : item.ErrorMsg
				
			}));
			totalItems = data.total || transactionandBankResponseData.length;
			console.log('Input', startDate, endDate, mName, tranStatus, offset, limit);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}
	}



</script>

<div class="w-full py-4 px-2 sm:px-4">
    <span class="text-3xl font-bold text-black flex lg:justify-start md:justify-start sm:justify-center justify-center">
        รายงานธุรกรรม
    </span>

    <div class="flex items-center flex-wrap mb-4 pt-8 sm:pt-6 md:pt-4">
		<div class="flex items-center gap-2">
		  <input
			type="date"
			class="input input-bordered bg-white my-1 mx-2"
			maxlength="100"
			bind:value={startDate}
		  />
		  <span class="text-center self-center w-4">ถึง</span>
		  <input
			type="date"
			class="input input-bordered bg-white my-1 mx-2"
			maxlength="100"
			bind:value={endDate}
		  />
		</div>
		
		<input
		  type="text"
		  placeholder="ชื่อลูกค้า"
		  class="input input-bordered bg-white my-1 mx-2"
		  maxlength="100"
		  bind:value={merchantName}
		/>
		
        <select
        class="select rounded-md  bg-white outline outline-1 outline-gray-300 px-2 py-0.5 w-[200px]" 
		bind:value={transectionStatus}
      >
      <option value="">ทั้งหมด</option>
        <option value="SUCCESS">SUCCESS</option>
		<option value="PENDING">PENDING</option>
        <option value="FAILED">FAILED</option>
		<option value="RESPOND_REJECTED">RESPOND REJECTED</option>
		<option value="REQUEST_REJECTED">REQUEST REJECTED</option>
		<option value="BANK_ACC_NOT_MATCH">BANK_ACC_NOT_MATCH</option>

		
        
      </select>

        
		
		<div class="flex flex-col sm:flex-row lg:col-span-2">
		  <button
			class="btn bg-primary text-white btn-primary text-xs sm:text-sm my-1 mx-2 hover:bg-[#050680]"
			on:click={handleSearch}
		  >ค้นหา</button>
		  <button
			class="btn btn-outline text-xs sm:text-sm my-1 mx-2"
			on:click={handleClear}
		  >ล้าง</button>
		</div>
	  </div>

      <div>
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base bg-white">

			<thead class="text-center text-gray-700 lg:text-sm caption-bottom">
				<tr class="border-b border-gray-300 bg-gray-100">
					<th class="p-1 sm:p-2 w-10 text-left">ลำดับ</th>
					<th class="p-1 sm:p-2 text-left">วันเวลาที่ตรวจสอบ</th>
					<th class="p-1 sm:p-2 text-left">เลขที่รายการ</th>
					<th class="p-1 sm:p-2 text-left">รหัสลูกค้า</th>
					<th class="p-1 sm:p-2 text-left">ชื่อ-นามสกุล</th>
					<th class="p-1 sm:p-2 text-left">ธนาคาร</th>
					<th class="p-1 sm:p-2 text-left">สถานะ</th>
					<th class="p-1 sm:p-2 text-left">BankStatusCode</th>
					<th class="p-1 sm:p-2 text-left">ErrorMsg</th>
					<th class="p-1 sm:p-2 text-left">Tranfer Bank ID</th>


				</tr>
			</thead>
			<tbody class="text-center">
				{#if loading}
					<tr><td colspan="10"><span class="loading loading-spinner loading-xs"></span> </td></tr>
				{:else if transactionandBankResponseData.length === 0}
					<tr><td colspan="10">ไม่พบข้อมูล</td></tr>
				{:else}
					{#each transactionandBankResponseData as item, i (i)}
						<tr class="border-b border-gray-300 ">
							<td class="p-1 sm:p-2 lg:text-sm text-left">{item.index}</td>
							<td class="p-1 sm:p-2 lg:text-sm text-left" title="{item.VerifiedDate}">{item.VerifiedDate ? new Date(item.VerifiedDate).toLocaleDateString('en-EN') : '-'}</td>
							<td class="p-1 sm:p-2 lg:text-sm text-left" >{item.TransectionId}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.MerchantId}</td>
							<td class="p-1 sm:p-2 lg:text-sm text-left truncate" title="{item.MerchantName}">{item.MerchantName}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.QrCode.slice(18, 21) === '002' ? 'BBL'
								: item.QrCode.slice(18, 21) === '004' ? 'KBANK'
								: item.QrCode.slice(18, 21) === '006' ? 'KTB'
								: item.QrCode.slice(18,21) === '011' ? 'TMB'
								: item.QrCode.slice(18,21) === '014' ? 'SCB'
								: item.QrCode.slice(18,21) === '017' ? 'CITI'
								: item.QrCode.slice(18,21) === '020' ? 'SCBT'
								: item.QrCode.slice(18,21) === '022' ? 'UOBT'
								: item.QrCode.slice(18,21) === '024' ? 'UOBT'
								: item.QrCode.slice(18,21) === '025' ? 'BAY'
								: item.QrCode.slice(18,21) === '030' ? 'GOV'
								: item.QrCode.slice(18, 21) === '031' ? 'HSBC'
								: item.QrCode.slice(18, 21) === '033' ? 'GHB'
								: item.QrCode.slice(18,21) === '034' ? 'AGRI'
								: item.QrCode.slice(18,21) === '039' ? 'MHCB'
								: item.QrCode.slice(18,21) === '065' ? 'TBANK'
								: item.QrCode.slice(18,21) === '066' ? 'ISBT'
								: item.QrCode.slice(18,21) === '067' ? 'TISCO'
								: item.QrCode.slice(18,21) === '069' ? 'KK'
								: item.QrCode.slice(18,21) === '070' ? 'ACL'
								: item.QrCode.slice(18,21) === '071' ? 'TCRB'
								: item.QrCode.slice(18,21) === '073' ? 'LHBANK'
								: item.QrCode.slice(18,21) === '079' ? 'ANZ'
								: item.QrCode.slice(18,21) === '080' ? 'SMTB'
								: item.QrCode.slice(18,21) === '098' ? 'SMEB' : item.QrCode.slice(18,21)
									}</td>
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left " title="{item.TransectionStatus}">
								<span
								class:text-success-bg={item.TransectionStatus.toLocaleUpperCase() === 'SUCCESS'}
								class:text-pending-bg={item.TransectionStatus.toLocaleUpperCase() === 'PENDING'}
								class:text-respond-rejected-bg={item.TransectionStatus.toLocaleUpperCase() === 'RESPOND_REJECTED'}
								class:text-request-rejected-bg={item.TransectionStatus.toLocaleUpperCase() === 'REQUEST_REJECTED'}
								class:text-bank-acc-not-match-bg={item.TransectionStatus.toLocaleUpperCase() === 'BANK_ACC_NOT_MATCH'}
								class:text-rejected-bg={item.TransectionStatus.toLocaleUpperCase() === 'REJECTED' || item.TransectionStatus.toLocaleUpperCase() === 'FAILED'}
								class="badge badge-outline badge-sm uppercase text-xs flex items-center"
							 >
							 {item.TransectionStatus.toLocaleUpperCase() === 'RESPOND_REJECTED' 
							 ? 'RSP RJECTED'
							 : item.TransectionStatus.toLocaleUpperCase() === 'REQUEST_REJECTED'
							 ? 'REQ RJECTED'
							 : item.TransectionStatus.toLocaleUpperCase() === 'BANK_ACC_NOT_MATCH'
							 ? 'BA_NM'
							:item.TransectionStatus}
							 </span>
							</td>
							
							<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.BankStatusCode}</td>
							<td class="p-1 sm:p-2 lg:text-xs truncate text-left" title="{item.ErrorMsg}">{item.ErrorMsg}</td>
							<td class="p-1 sm:p-2 lg:text-xs truncate text-left" title="{item.TransferRefId}">{item.TransferRefId}</td>


						</tr>
						{/each}
						{/if}
			</tbody>
		</table>

		
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


<style>
	.text-success-bg {
	background-color: #DCFAE6; /* พื้นหลังสีเขียวอ่อน */
	color: #17B26A; /* สีตัวอักษรสีเขียวเข้ม */
}

.text-pending-bg {
	background-color: #FEF0C7; /* พื้นหลังสีเหลืองอ่อน */
	color: #F79009; /* สีตัวอักษรสีเหลืองเข้ม */
}

.text-rejected-bg {
	background-color: #FEE4E2; /* พื้นหลังสีแดงอ่อน */
	color: #F04438; /* สีตัวอักษรสีแดงเข้ม */
}
.text-respond-rejected-bg {
		background-color: #F9FAFB; 
		color: #61646C; 
	}
	.text-request-rejected-bg {
		background-color: #F9FAFB; 
		color: #61646C; 
	}

	.text-bank-acc-not-match-bg {
		background-color: #F9FAFB; 
		color: #61646C; 
	}
</style>