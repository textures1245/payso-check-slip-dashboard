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
	let loadingtable = false;
	let alertMessage: string | null = null; // ตัวแปรสำหรับเก็บข้อความ alert
	let alertType: 'success' | 'error' = 'success'; // ตัวแปรสำหรับประเภท alert
	let showAlertModalSuccess = false;
	let showAlertModalError = false;
	let showAlertModal = false; // ตัวแปรสำหรับแสดง modal

	function getCookies() {
		return cookie.parse(document.cookie);
	}

	onMount(async () => {
		await fetchData(offset, limit, keyWord);
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
		fetchData(offset, limit, keyWord);
	}

	async function fetchData(currentOffset: number, currentLimit: number, searchMerchant: string) {
		loadingtable = true
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
			userData = data.result.map((item: UserData, index: number) => ({
				Id: item.Id,
				MerchantId: item.MerchantId,
				MerchantName: item.MerchantName,
				QuotaUsage: item.QuotaUsage,
				QuotaLimit:item.QuotaLimit,
				PackageId: item.PackageId,
				PackageName: item.PackageName,
				BalanceQuotaLeft: item.BalanceQuotaLeft,
				Status: item.Status,
				MerchantRole: item.MerchantRole,
				Email: item.Email,
				BillDate: item.BillDate,
				QuotaSpending: item.QuotaSpending,
				index: index + (offset - 1) * limit + 1
			}));
			totalPages = Math.ceil(totalCount / currentLimit);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		finally{
			loadingtable = false
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
		keyWord = '';
		filteredData = [...userData];
		fetchData(offset , limit, '')
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
			const updatePackageResponse = await fetch(`${PUBLIC_API_ENDPOINT}/merchant/updatepackage`, {
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
			});

			if (!updatePackageResponse.ok) {
				throw new Error('Failed to update package');
			}

			const updateStatusResponse = await fetch(
				`${PUBLIC_API_ENDPOINT}/merchant/updatestatus/${editingUser.Id}`,
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

			// แจ้งเตือนว่าอัปเดตสำเร็จ
			alertMessage = 'Update user successfully!';
			alertType = 'success';
			showAlertModalSuccess = true;

			const modal = document.getElementById('my_modal_1');
			// @ts-ignore
			modal.close();
			editingUser = null;
		} catch (error) {
			console.error('Error updating user:', error);
			alertMessage =
				'Failed to update package: ' + (error instanceof Error ? error.message : 'Unknown error');
			alertType = 'error';
			showAlertModalError = true;
		}
		finally{
			location.reload()
		}
	}

	$: isActive = editingUser?.Status === 'ACTIVE';

	function toggleStatus() {
		isActive = !isActive;
		if (editingUser) {
			editingUser.Status = isActive ? 'ACTIVE' : 'INACTIVE';
		}
	}
</script>

<div class="w-full py-4 px-2 sm:px-4" >
	<span
		class="text-3xl font-bold text-primary flex lg:justify-start md:justify-start sm:justify-center justify-center"
		>รายชื่อผู้ใช้</span
	>
	<div
		class="mb-6 pt-8 sm:pt-6 md:pt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
	>
		<div class="relative w-full max-w-xs">
			<input
				type="text"
				placeholder="รหัสลูกค้า ชื่อ-นามสกุล"
				class="input input-bordered w-full pl-10 bg-white"
				style="background-color: white;"
				maxlength="100"
				bind:value={keyWord}
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

		<div class="flex space-x-2">
			<button class="btn bg-primary text-white text-xs sm:text-sm" on:click={firstPage}
				>ค้นหา</button
			>
			<button class="btn btn-outline text-xs sm:text-sm" on:click={clearSearch}>ล้าง</button>
		</div>
	</div>
	<div class="overflow-x-auto">
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base bg-white">
			<thead class="text-center  text-gray-700 lg:text-base">
				<tr class="border-b border-gray-300">
					<th class="p-1  sm:p-2 w-10 text-sm">#</th>
					<th class="p-1 sm:p-2 text-wrap text-left text-sm">
						<div class="lg:block sm:block hidden">รหัสลูกค้า</div>
						<div class="lg:hidden sm:hidden block">MID</div></th
					>
					<th class="p-1 sm:p-2 text-left text-sm">อีเมล์</th>
					<th class="p-1 sm:p-2 text-wrap text-left text-sm"
					><div class="lg:block sm:block hidden">ชื่อ-นามสกุล</div>
					<div class="lg:hidden sm:hidden block">MName</div></th
				>
					<th class="p-1 sm:p-2 text-left text-sm">ประเภทลูกค้า</th>
				
					<th class="p-1 sm:p-2 text-left text-sm">แพ็คเก็จที่สมัคร</th>
					<th class="p-1 sm:p-2 text-wrap text-right text-sm">
						<div class="lg:block sm:block hidden ">จำนวนเหลือใช้</div>
						<div class="lg:hidden sm:hidden block">Quota</div></th
					>
					<th class="p-1 sm:p-2 text-right text-sm">จำนวนที่ใช้ไป</th>
					<th class="p-1 sm:p-2 text-sm">วันหมดอายุแพ็คเก็จ</th>
					<th class="p-1 sm:p-2 text-sm" >สถานะ</th>
					<th class="p-1 w-20 sm:p-2"></th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if loadingtable}
				<tr><td colspan="11"><span class="loading loading-spinner loading-xs"></span>
				</td></tr>
				{:else if userData.length === 0}
					<tr><td colspan="11">No data available</td></tr>
				{:else}
				{#each userData as item}
					<tr class="border-b border-gray-300">
						<th class="p-1 sm:p-2 lg:text-sm truncate">{item.index}</th>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.MerchantId}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-left" title="{item.Email}">{item.Email}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-left">{item.MerchantRole}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-left" title="{item.MerchantName}">{item.MerchantName}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-left" title="{item.PackageName}">{item.PackageName}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-right"
							>{ (item.QuotaUsage + item.BalanceQuotaLeft).toLocaleString()}</td
						>
						<td class="p-1 sm:p-2 lg:text-sm truncate text-right">{item.QuotaSpending.toLocaleString()}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">{item.BillDate.split(' ')[0]}</td>
						<td class="p-1 sm:p-2 lg:text-sm truncate">
							<div class="flex justify-center">
								<div
									class="badge-status lg:text-xxs md:text-xxs sm:text-xxs text-xs {item.Status ===
									'ACTIVE'
										? 'badge-success'
										: 'badge-danger'}"
								>
									{item.Status}
								</div>
							</div>
						</td>
						<td class="p-1 sm:p-2">
							<svg
								on:click={() => showModal(item)}
								class="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
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
						</td>
					</tr>
				{/each}
				{/if}
			</tbody>
		</table>
		<!-- <div class="grid w-full sm:w-auto bg-gray-100">
			<div class="text-sm flex text-left">Page {currentPage} of {totalPages}</div>
			<div class="flex justify-end">
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
					class="join-item btn btn-xs sm:btn-sm btn-outline mx-1"
					on:click={prevPage}
					disabled={currentPage === 1}
				>
					Previous
				</button>
				<button
					class="join-item btn btn-xs sm:btn-sm btn-outline"
					on:click={nextPage}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		</div> -->
		<div class="grid w-full sm:w-auto mt-3">
			<div class="flex items-center justify-between w-full">
				<div class="text-sm font-bold">หน้าที่ {currentPage} จากทั้งหมด {totalPages} หน้า</div>

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

<dialog id="my_modal_1" class="modal">
	<div class="modal-box bg-white w-11/12 max-w-md">
		<div class="form-control">
			<h2 class="text-2xl font-bold mb-4 text-primary">แก้ไข</h2>
			{#if editingUser}
				<div></div>
				<label class="label">
					<span class="label-text text-black w-2/5">ชื่อ-นามสกุล:</span>
					<input
						type="text"
						class="input input-bordered bg-white disabled:bg-white disabled:text-black w-80"
						disabled
						bind:value={editingUser.MerchantName}
					/>
				</label>
				<label class="label">
					<span class="label-text text-black w-2/5">แพ็คเก็จ:</span>

					<select
						class="select max-w-xs w-80 bg-white overflow-y-auto"
						bind:value={editingUser.PackageId}
					>
						{#each packageData as pkgdata}
							<option value={pkgdata.Id}>{pkgdata.Name}</option>
						{/each}
					</select>
				</label>

				<label class="label cursor-pointer bg-white flex">
					<span class="label-text text-black w-2/5">สถานะ</span>
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
						<button class="btn btn-outline btn-error">ปิด</button>
						<button class="btn bg-primary text-white btn-primary" on:click={updateUser}>บันทึก</button
						>
					</form>
				</div>
			{/if}
		</div>
	</div>
</dialog>
<dialog id="alert_modal" class="modal" open={showAlertModalSuccess}>
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="100"
				height="100"
				viewBox="0 0 48 48"
			>
				<linearGradient
					id="I9GV0SozQFknxHSR6DCx5a_70yRC8npwT3d_gr1"
					x1="9.858"
					x2="38.142"
					y1="9.858"
					y2="38.142"
					gradientUnits="userSpaceOnUse"
					><stop offset="0" stop-color="#21ad64"></stop><stop offset="1" stop-color="#088242"
					></stop></linearGradient
				><path
					fill="url(#I9GV0SozQFknxHSR6DCx5a_70yRC8npwT3d_gr1)"
					d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
				></path><path
					d="M32.172,16.172L22,26.344l-5.172-5.172c-0.781-0.781-2.047-0.781-2.828,0l-1.414,1.414	c-0.781,0.781-0.781,2.047,0,2.828l8,8c0.781,0.781,2.047,0.781,2.828,0l13-13c0.781-0.781,0.781-2.047,0-2.828L35,16.172	C34.219,15.391,32.953,15.391,32.172,16.172z"
					opacity=".05"
				></path><path
					d="M20.939,33.061l-8-8c-0.586-0.586-0.586-1.536,0-2.121l1.414-1.414c0.586-0.586,1.536-0.586,2.121,0	L22,27.051l10.525-10.525c0.586-0.586,1.536-0.586,2.121,0l1.414,1.414c0.586,0.586,0.586,1.536,0,2.121l-13,13	C22.475,33.646,21.525,33.646,20.939,33.061z"
					opacity=".07"
				></path><path
					fill="#fff"
					d="M21.293,32.707l-8-8c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414c0.391-0.391,1.024-0.391,1.414,0	L22,27.758l10.879-10.879c0.391-0.391,1.024-0.391,1.414,0l1.414,1.414c0.391,0.391,0.391,1.024,0,1.414l-13,13	C22.317,33.098,21.683,33.098,21.293,32.707z"
				></path>
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">สำเร็จ</p>
		<p class=" text-center">Update สำเร็จ</p>
	</div>
</dialog>
<dialog id="alert_modal_false" class="modal" open={showAlertModalError}>
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="100"
				height="100"
				viewBox="0 0 48 48"
			>
				<path
					fill="#f44336"
					d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
				></path><path
					fill="#fff"
					d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
				></path><path
					fill="#fff"
					d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
				></path>
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">ล้มเหลว</p>
		<p class=" text-center">การอัปเดตไม่สำเร็จ</p>
	</div>
</dialog>

<style>
	.badge-status {
		@apply py-1 px-2 rounded-full text-white;
		width: 10 0%;
	}
	.badge-success {
		@apply border border-success text-success bg-transparent;
	}
	.badge-danger {
		@apply border  border-destructive text-destructive bg-transparent;
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
