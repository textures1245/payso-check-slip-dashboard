<script lang="ts">
	import { onMount } from 'svelte';
	import type { PackageData } from './+page.server.ts';
	import cookie from 'cookie';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';

	let packageData: PackageData[] = [];
	let currentPage = 1;
	let offset = 1;
	let limit = 10;
	let editingPackage: PackageData;
	let newPackage: PackageData = {
		Id: 0,
		Name: '',
		Price: 0,
		QuotaLimit: 0,
		Status: 'INACTIVE',
		TotalCount: 0,
		Visibility: false,
		AmountLimit: 100,
		Index: 0
	};
	let packagename = '';
	let searchInpage = '';
	let filteredData: PackageData[] = [];
	let alertMessage: string | null = null; // ตัวแปรสำหรับเก็บข้อความ alert
	let alertType: 'success' | 'error' = 'success'; // ตัวแปรสำหรับประเภท alert
	let showAlertModalSuccess = false;
	let showAlertModalError = false;
	let showAlertModal = false; // ตัวแปรสำหรับแสดง modal
	let showAlertModalCreateSuccess = false;
	let showAlertModalCreateError = false;
	let showAlertModalUpdateSuccess = false;
	let showAlertModalUpdateError = false;
	let totalItems = 0;
	let loadingtable = false;

	$: totalPages = Math.ceil(totalItems / limit);
	console.log('total item', totalItems);

	function getCookies() {
		return cookie.parse(document.cookie);
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

	function handleSearch() {
		searchfetchData(searchInpage, offset, limit);
	}

	onMount(async () => {
		searchfetchData(packagename, offset, limit);
	});

	async function updateVisibility(packageId: number | undefined, newVisibility: boolean): Promise<boolean> {
    if (packageId === undefined) {
        console.error('Package ID is undefined');
        return false; // Return false if packageId is undefined
    }

    const cookies = getCookies();
    const myCookie = cookies['admin_account'] ? JSON.parse(cookies['admin_account']) : null;

    try {
        const response = await fetch(
            `${PUBLIC_API_ENDPOINT}/update/visibility/${packageId}/${newVisibility}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Actor-Id': myCookie.Id,
                    'Actor-Name': myCookie.Email,
                    'Actor-Role': 'ADMIN'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to update package visibility');
        }

        // Update the package data locally
        const index = packageData.findIndex((pkg) => pkg.Id === packageId);
        if (index !== -1) {
            packageData[index].Visibility = newVisibility;
            packageData = [...packageData]; // trigger reactivity in Svelte
        }

        // Log success message to the console
        console.log('Visibility updated successfully!');
        return true; // Return true on success
    } catch (error) {
        console.error('Error updating visibility:', error);
        return false; // Return false on error
    }
}


	async function searchfetchData(packagename: string, currentOffset: number, currentLimit: number) {
    loadingtable = true;
    try {
        const response = await fetch(
            `${PUBLIC_API_ENDPOINT}/package/search/getpackage?searchpackage=${packagename}&offset=${currentOffset}&limit=${currentLimit}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Log the entire response to check its structure
        console.log("API Response:", data);

        // Check if 'data' exists and is an object
        if (!data || typeof data !== 'object') {
            console.error('Data is not an object:', data);
            throw new Error('Invalid response structure: Data is not an object');
        }

        // Check if 'result' exists and is an array, handle cases where 'result' is null or undefined
        if (!data.result) {
            console.warn('Result is null or undefined. Handling as empty array.');
            data.result = [];  // Default to an empty array
        }

        if (!Array.isArray(data.result)) {
            console.error('Result is not an array:', data.result);
            throw new Error('Invalid response structure: Missing or non-array result');
        }

        // Calculate totalCount and handle case where result is an empty array
        const totalCount = data.result.length > 0 ? data.result[0].TotalCount : 0;

        // Map the result to packageData
        packageData = data.result.map((item: PackageData, Index: number) => ({
            Id: item.Id,
            Name: item.Name,
            Price: item.Price,
            QuotaLimit: item.QuotaLimit,
            Status: item.Status,
            TotalCount: item.TotalCount,
            Visibility: item.Visibility,
            AmountLimit: item.AmountLimit,
            Index: Index + (currentOffset - 1) * currentLimit + 1
        }));

        // Calculate total pages
        totalPages = Math.ceil(totalCount / currentLimit);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loadingtable = false;
    }
}


	function clearSearch() {
		searchInpage = '';
		filteredData = [...packageData];
		searchfetchData('', offset, limit);
	}

	function showModalEdit(pkg: PackageData) {
		editingPackage = pkg;
		const modal = document.getElementById('edit_modal');
		// @ts-ignore
		modal.showModal();
	}
	function showModalCreate() {
		newPackage = {
			Id: 0,
			Name: '',
			Price: 0,
			QuotaLimit: 0,
			Status: 'INACTIVE',
			TotalCount: 0,
			Visibility: false,
			AmountLimit: 100,
			Index: 0
		};
		const modal = document.getElementById('create_modal');
		// @ts-ignore
		modal.showModal();
	}

	async function createPackage() {
		const trimmedName = newPackage.Name.trim();
		const cookies = getCookies();
		const myCookie = cookies['admin_account'] ? JSON.parse(cookies['admin_account']) : null;

		// Check if the name is empty after trimming
		if (trimmedName === '') {
			alertMessage = 'Package name cannot be empty or just spaces.';
			alertType = 'error';
			showAlertModal = true;
			return;
		}

		try {
			newPackage.Name = newPackage.Name.trim();
			const response = await fetch(`${PUBLIC_API_ENDPOINT}/package/create/packages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Actor-Id': myCookie.Id,
					'Actor-Name': myCookie.Email,
					'Actor-Role': 'ADMIN'
				},
				body: JSON.stringify({
					...newPackage,
					Visibility: newPackage.Visibility === true // ให้แน่ใจว่าค่าเป็น boolean ไม่ใช่ string
				})
			});

			if (!response.ok) {
				throw new Error('Failed to create package');
			}

			// Add the new package to the local packageData array
			packageData = [...packageData, newPackage];

			// ตั้งค่าข้อความและประเภท alert
			alertMessage = 'Package created successfully!';
			alertType = 'success';
			showAlertModal = true; // แสดง modal
			showAlertModalCreateSuccess = true;

			// Close the modal
			const createModal = document.getElementById('create_modal');
			if (createModal) {
				// @ts-ignore
				createModal.close();
			}
			newPackage = {
				Id: 0,
				Name: '',
				Price: 0,
				QuotaLimit: 0,
				Status: 'INACTIVE',
				TotalCount: 0,
				Visibility: false,
				AmountLimit: 100,
				Index: 0
			};
		} catch (error) {
			console.error('Error creating package:', error);
			alertMessage =
				'Failed to create package: ' + (error instanceof Error ? error.message : 'Unknown error');
			alertType = 'error';
			showAlertModal = true; // แสดง modal
			showAlertModalCreateError = true;
		}
		// location.reload();
	}

	async function updatePackage() {
		if (!editingPackage) return;

		const cookies = getCookies();
		const myCookie = cookies['admin_account'] ? JSON.parse(cookies['admin_account']) : null;

		const trimmedName = editingPackage.Name.trim();

		// ตรวจสอบว่าชื่อแพ็กเกจไม่เป็นค่าว่าง
		if (trimmedName === '') {
			alertMessage = 'Package name cannot be empty or just spaces.';
			alertType = 'error';
			showAlertModalUpdateSuccess = true;
			return;
		}

		try {
			// ตัดช่องว่างของชื่อแพ็กเกจ
			editingPackage.Name = trimmedName;

			const response = await fetch(`${PUBLIC_API_ENDPOINT}/update/package/${editingPackage.Id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Actor-Id': myCookie.Id,
					'Actor-Name': myCookie.Email,
					'Actor-Role': 'ADMIN'
				},
				body: JSON.stringify(editingPackage)
			});

			if (!response.ok) {
				throw new Error('Failed to update package');
			}

			// อัปเดต packageData เพื่อสะท้อนการเปลี่ยนแปลง
			const index = packageData.findIndex((pkg) => pkg.Id === editingPackage?.Id);
			if (index !== -1) {
				packageData[index] = { ...editingPackage };
				packageData = [...packageData]; // กระตุ้นการตอบสนองของ Svelte
			}

			// แสดงข้อความการอัปเดตสำเร็จ
			alertMessage = 'Package updated successfully!';
			alertType = 'success';
			showAlertModalSuccess = true;

			// ปิด modal แก้ไข
			const editModal = document.getElementById('my_modal_1');
			if (editModal) {
				// @ts-ignore
				editModal.close();
			}
		} catch (error) {
			console.error('Error updating package:', error);
			alertMessage =
				'Failed to update package: ' + (error instanceof Error ? error.message : 'Unknown error');
			alertType = 'error';
			showAlertModalUpdateError = true;
		} finally {
			// location.reload();
		}
	}

	function toggleStatus() {
		if (editingPackage) {
			editingPackage.Status = editingPackage.Status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
		}
	}

	function toggleHide(event: any) {
		if (newPackage) {
			// อ่านค่าจาก checkbox ที่ถูกส่งมาจาก event
			newPackage.Visibility = event.target.checked;
			console.log('Visibility after toggle:', newPackage.Visibility);
		}
	}

	function validateDecimalInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = input.value;

		// ใช้ Regular Expression เพื่อตรวจสอบว่าเป็นเลขทศนิยมที่ไม่เกิน 7 หลักและไม่มีค่าติดลบ
		const regex = /^(?:\d{1,7}|\d{1,7}\.\d{0,2})?$/;

		// ตรวจสอบว่าไม่เริ่มต้นด้วยเครื่องหมายลบ
		if (value.startsWith('-') || !regex.test(value)) {
			input.value = '';
		}
	}

	function validateInput(event: Event) {
		const input = event.target as HTMLInputElement;
		let value = input.value;

		// ลบจุดทศนิยมออกจากค่า
		value = value.replace(/\./g, '');

		// ใช้ Regular Expression เพื่อตรวจสอบว่าเป็นเลขจำนวนเต็มที่ไม่เกิน 4 หลัก
		const regex = /^[1-9]\d{0,3}$/;

		if (!regex.test(value)) {
			input.value = '';
		} else {
			input.value = value; // อัปเดตค่าที่แก้ไขแล้ว (ถ้าไม่มีปัญหา)
		}
	}
	function validateInputAmountlimit(event: Event) {
		const input = event.target as HTMLInputElement;
		let value = input.value;

		// ลบจุดทศนิยมออกจากค่า
		value = value.replace(/\./g, '');

		// ใช้ Regular Expression เพื่อตรวจสอบว่าเป็นเลขจำนวนเต็มที่ไม่เกิน 4 หลัก
		const regex = /^[1-9]\d{0,9}$/;

		if (!regex.test(value)) {
			input.value = '';
		} else {
			input.value = value; // อัปเดตค่าที่แก้ไขแล้ว (ถ้าไม่มีปัญหา)
		}
	}
</script>

<div class="w-full py-4 px-2 sm:px-4">
	<span
		class="text-3xl font-bold text-black flex lg:justify-start md:justify-start sm:justify-center justify-center"
		>แพ็คเก็จ</span
	>

	<div
		class="mb-6 pt-8 sm:pt-6 md:pt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
	>
		<div class="relative w-full max-w-xs">
			<input
				type="text"
				placeholder="รหัสแพ็คก็จ ชื่อแพ็คเก็จ"
				class="input input-bordered w-full pl-10 bg-white"
				style="background-color: white;"
				maxlength="100"
				bind:value={searchInpage}
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
			<button class="btn bg-primary text-white btn-primary text-xs sm:text-sm hover:bg-[#050680]" on:click={firstPage}
				>ค้นหา</button
			>
			<button class="btn btn-outline text-xs sm:text-sm" on:click={clearSearch}>ล้าง</button>
		</div>
		<div
			class="flex lg:justify-end md:justify-end sm:justify-center justify-center"
			style="width: 100%;"
		>
			<button
				class="btn bg-primary text-white btn-primary text-xs sm:text-sm hover:bg-[#050680]"
				on:click={showModalCreate}>สร้างแพ็คเก็จ</button
			>
		</div>
	</div>
	<div class="overflow-x-hidden">
		<table class="table w-full table-fixed text-[10px] xs:text-xs sm:text-sm md:text-base bg-white">
			<thead class="text-center text-gray-700 lg:text-base">
				<tr class="border-b border-gray-300">
					<th class="p-1 sm:p-2 text-sm w-12">ลำดับ</th>
					<th class="p-1 sm:p-2 text-left text-wrap text-sm">
						<div class="lg:block sm:block hidden">รหัสแพ็คเก็จ</div>
						<div class="lg:hidden sm:hidden block">รหัส</div>
					</th>
					<th class="p-1 sm:p-2 text-left text-wrap text-sm">
						<div class="lg:block sm:block hidden">ชื่อแพ็คเก็จ</div>
						<div class="lg:hidden sm:hidden block">ชื่อ</div>
					</th>
					<th class="p-1 sm:p-2 text-right text-sm">ราคา</th>
					<th class="p-1 sm:p-2 text-right text-wrap text-sm">
						<div class="lg:block sm:block hidden">จำนวนการใช้สูงสุด</div>
						<div class="lg:hidden sm:hidden block">จำนวน</div>
					</th>
					<th class="p-1 sm:p-2 text-right text-wrap text-sm">
						<div class="lg:block sm:block hidden">คงเหลือ (ที่ขายได้)</div>
						<div class="lg:hidden sm:hidden block">คงเหลือ</div>
					</th>

					<th class="p-1 sm:p-2 text-sm  ">สถานะ</th>
					<th class="p-1 sm:p-2 text-sm">การมองเห็น</th>
					<th class="p-1 sm:p-2 w-20"></th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if loadingtable}
					<tr><td colspan="7"><span class="loading loading-spinner loading-xs"></span> </td></tr>
				{:else if packageData.length === 0}
					<tr><td colspan="7">ไม่พบข้อมูล</td></tr>
				{:else}
					{#each packageData as item}
						<tr class="border-b border-gray-300">
							<td class="p-1 sm:p-2 lg:text-sm truncate ">{item.Index}</td>
							<th class="p-1 sm:p-2 lg:text-sm truncate font-normal text-left">{item.Id || '-'}</th>
							<td class="p-1 sm:p-2 lg:text-sm text-left truncate" title={item.Name}>{item.Name}</td
							>
							<td class="p-1 sm:p-2 lg:text-sm text-right truncate">{item.Price.toFixed(2)}</td>
							<td class="p-1 sm:p-2 lg:text-sm text-right truncate"
								>{(item.QuotaLimit || '-').toLocaleString()}</td
							>
							<td class="p-1 sm:p-2 lg:text-sm text-right truncate"
								>  {item.AmountLimit === 0 ? 'Unlimited' : item.AmountLimit.toLocaleString()}
								</td
							>

							<!-- <td class={item.Visibility ?' text-success' : 'text-destructive'}>{item.Visibility ? 'แสดง' : 'ซ่อน'}</td> -->

							<td class="p-1 sm:p-2 lg:text-sm truncate">
								<div class="flex justify-center">
									<div
										class="badge-status lg:text-xxs md:text-xxs sm:text-xxs text-xs {item.Status ===
										'ACTIVE'
											? 'badge-success'
											: 'badge-danger'}"
									>
									{item.Status === 'INACTIVE' ? 'DEACTIVE' : item.Status}
									</div>
								</div>
							</td>
							<td>
								<input
									type="checkbox"
									class="toggle [--tglbg:white] toggle-success lg:toggle-md md:toggle-sm sm:toggle-xs toggle-xs"
									bind:checked={item.Visibility}
									on:change={async () => {
										const success = await updateVisibility(item.Id, item.Visibility);
										if (success) {
											showAlertModalSuccess = true; // Show success modal
										} else {
											showAlertModalError = true; // Show error modal
										}
									}}
								/>
							</td>
							<td class="p-1 sm:p-2">
								<svg
									on:click={() => showModalEdit(item)}
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
		<!-- <div class="grid col-2 w-full justify-end sm:w-auto">
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
					class="join-item btn btn-xs sm:btn-sm btn-outline  mx-1"
					on:click={prevPage}
					disabled={currentPage === 1}>Previous</button
				>
				<button
					class="join-item btn btn-xs sm:btn-sm btn-outline "
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

<dialog id="alert_modal" class="modal" open={showAlertModalSuccess}>
    <div class="modal-box">
        <div class="text-lg font-bold flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 32 32" {...$$props}>
				<path fill="#17B26A" d="m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415z" />
				<path fill="#17B26A" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12" />
			</svg>
        </div>
        <p class="py-4 text-center font-bold text-4xl">สำเร็จ</p>
        <p class="text-center">Update สำเร็จ</p>
        <div class="modal-action flex justify-center">
            <button class="btn" on:click={() => {
				showAlertModalSuccess = false;
			}}>
				ปิด
			</button>
        </div>
    </div>
</dialog>

<dialog id="alert_modal_false" class="modal" open={showAlertModalError}>
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 15 15" {...$$props}>
				<path fill="#F04438" fill-rule="evenodd" d="M.877 7.5a6.623 6.623 0 1 1 13.246 0a6.623 6.623 0 0 1-13.246 0M7.5 1.827a5.673 5.673 0 1 0 0 11.346a5.673 5.673 0 0 0 0-11.346m2.354 3.32a.5.5 0 0 1 0 .707L8.207 7.5l1.647 1.646a.5.5 0 0 1-.708.708L7.5 8.207L5.854 9.854a.5.5 0 0 1-.708-.708L6.793 7.5L5.146 5.854a.5.5 0 0 1 .708-.708L7.5 6.793l1.646-1.647a.5.5 0 0 1 .708 0" clip-rule="evenodd" />
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">ล้มเหลว</p>
		<p class=" text-center">การอัปเดตไม่สำเร็จ</p>
		<div class="modal-action flex justify-center">
            <button class="btn" on:click={() => showAlertModalError = false}>
                ปิด
            </button>
        </div>
	</div>
</dialog>

<dialog id="edit_modal" class="modal">
	<div class="modal-box bg-white w-11/12 max-w-md">
		<div class="form-control">
			<h2 class="text-2xl font-bold mb-4 text-primary">แก้ไข</h2>
			{#if editingPackage}
				<!-- Package Name -->
				<label class="label">
					<span class="label-text text-black w-2/5">ชื่อแพ็คเก็จ:</span>
					<input
						type="text"
						class="input input-bordered border-black bg-white w-80"
						maxlength="250"
						bind:value={editingPackage.Name}
					/>
				</label>

				<!-- Package Price -->
				<label class="label">
					<span class="label-text text-black w-2/5">ราคา:</span>
					<input
						type="number"
						maxlength="8"
						max="9999999"
						min="1"
						class="input input-bordered border-black bg-white w-80"
						bind:value={editingPackage.Price}
						on:input={validateDecimalInput}
					/>
				</label>

				<!-- Quota Limit -->
				<label class="label">
					<span class="label-text text-black w-2/5">โค้วต้าสูงสุด:</span>
					<input
						type="number"
						maxlength="4"
						min="1"
						max="9999"
						class="input input-bordered border-black bg-white w-80"
						bind:value={editingPackage.QuotaLimit}
						on:input={validateInput}
					/>
				</label>
				<!-- Amount Limit -->
				<label class="label">
					<span class="label-text text-black w-2/5">คงเหลือ:</span>
					<input
						type="number"
						maxlength="9"
						min="1"
						max="9999"
						class="input input-bordered border-black bg-white w-80"
						bind:value={editingPackage.AmountLimit}
						on:input={validateInputAmountlimit}
					/>
				</label>

				<!-- Package Status (Active/Inactive) -->
				<label class="label cursor-pointer bg-white flex">
					<span class="label-text text-black w-2/5">สถานะ</span>
					<div class="w-80">
						<input
							type="checkbox"
							class="toggle [--tglbg:white] toggle-success"
							checked={editingPackage.Status === 'ACTIVE'}
							on:change={toggleStatus}
						/>
					</div>
				</label>

				<!-- Modal Actions -->
				<div class="modal-action">
					<form method="dialog" class="flex space-x-2">
						<!-- Close Button -->
						<button class="btn border border-gray-500 text-black">ปิด</button>

						<!-- Save/Update Button -->
						<button class="btn bg-primary text-white btn-primary hover:bg-[#050680]" on:click={updatePackage}>
							บันทึก
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</dialog>

<dialog id="create_modal" class="modal">
	<div class="modal-box bg-white w-11/12 max-w-md">
		<div class="form-control">
			<h2 class="text-2xl font-bold mb-4 text-primary">สร้างแพ็คเก็จ</h2>

			<div></div>
			<label class="label">
				<span class="label-text text-black w-2/5">ชื่อแพ็คเก็จ:</span>
				<input
					type="text"
					class="input input-bordered border-black bg-white w-80"
					bind:value={newPackage.Name}
					maxlength="250"
				/>
			</label>

			<label class="label">
				<span class="label-text text-black w-2/5">ราคา:</span>
				<input
					type="number"
					class="input input-bordered border-black bg-white w-80"
					bind:value={newPackage.Price}
					min="1"
					on:input={validateDecimalInput}
				/>
			</label>
			<label class="label">
				<span class="label-text text-black w-2/5">โค้วต้าสูงสุด:</span>
				<input
					type="number"
					class="input input-bordered border-black bg-white w-80"
					bind:value={newPackage.QuotaLimit}
					min="1"
					on:input={validateInput}
				/>
			</label>
			<label class="label cursor-pointer bg-white flex">
				<span class="label-text text-black w-2/5">สถานะ</span>
				<div class="w-80">
					<input
						type="checkbox"
						class="toggle [--tglbg:white] toggle-success"
						bind:value={newPackage.Status}
						on:change={toggleStatus}
					/>
				</div>
			</label>
			<label class="label cursor-pointer bg-white flex">
				<span class="label-text text-black w-2/5">การมองเห็น</span>
				<div class="w-80">
					<input
						type="checkbox"
						class="toggle [--tglbg:white] toggle-success"
						bind:checked={newPackage.Visibility}
						on:change={toggleHide}
					/>
				</div>
			</label>
			<label class="label">
				<span class="label-text text-black w-2/5">จำนวนการขาย:</span>
				<input
					type="number"
					class="input input-bordered border-black bg-white w-80"
					bind:value={newPackage.AmountLimit}
					min="1"
					on:input={validateInputAmountlimit}
				/>
			</label>

			<div class="modal-action">
				<form method="dialog" class="flex space-x-2">
					<button class="btn border border-gray-500 text-black">ปิด</button>
					<button class="btn bg-primary text-white btn-primary hover:bg-[#050680]" on:click={createPackage}
						>บันทึก</button
					>
				</form>
			</div>
		</div>
	</div>
</dialog>

<dialog id="create_alert_modal_success" class="modal" open={showAlertModalCreateSuccess}>
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 32 32" {...$$props}>
				<path fill="#17B26A" d="m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415z" />
				<path fill="#17B26A" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12" />
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">สำเร็จ</p>
		<p class=" text-center">สร้างแพ็คเก็จสำเร็จ</p>
		<div class="modal-action flex justify-center">
            <button class="btn" on:click={() => {
				showAlertModalCreateSuccess = false;
				location.reload()
			}}>
				ปิด
			</button>
        </div>
		
		
	</div>
</dialog>
<dialog id="create_alert_modal_error" class="modal" open={showAlertModalCreateError}>
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 15 15" {...$$props}>
				<path fill="#F04438" fill-rule="evenodd" d="M.877 7.5a6.623 6.623 0 1 1 13.246 0a6.623 6.623 0 0 1-13.246 0M7.5 1.827a5.673 5.673 0 1 0 0 11.346a5.673 5.673 0 0 0 0-11.346m2.354 3.32a.5.5 0 0 1 0 .707L8.207 7.5l1.647 1.646a.5.5 0 0 1-.708.708L7.5 8.207L5.854 9.854a.5.5 0 0 1-.708-.708L6.793 7.5L5.146 5.854a.5.5 0 0 1 .708-.708L7.5 6.793l1.646-1.647a.5.5 0 0 1 .708 0" clip-rule="evenodd" />
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">ล้มเหลว</p>
		<p class=" text-center">การสร้างแพ็จแก็จไม่สำเร็จ</p>
		<div class="modal-action flex justify-center">
            <button class="btn" on:click={() => {
				showAlertModalCreateError = false;
				location.reload()
			}}>
				ปิด
			</button>
        </div>
	</div>
</dialog>

<dialog id="update_alert_modal_success" class="modal" open={showAlertModalUpdateSuccess}>
    <div class="modal-box">
        <div class="text-lg font-bold flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 32 32" {...$$props}>
				<path fill="#17B26A" d="m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415z" />
				<path fill="#17B26A" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12" />
			</svg>
        </div>
        <p class="py-4 text-center font-bold text-4xl">สำเร็จ</p>
        <p class="text-center">Update สำเร็จ</p>
        <div class="modal-action flex justify-center">
            <button class="btn" on:click={() => {
				showAlertModalUpdateSuccess = false;
				location.reload()
			}}>
				ปิด
			</button>
        </div>
    </div>
</dialog>

<dialog id="update_alert_modal_error" class="modal" open={showAlertModalUpdateError}>
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 15 15" {...$$props}>
				<path fill="#F04438" fill-rule="evenodd" d="M.877 7.5a6.623 6.623 0 1 1 13.246 0a6.623 6.623 0 0 1-13.246 0M7.5 1.827a5.673 5.673 0 1 0 0 11.346a5.673 5.673 0 0 0 0-11.346m2.354 3.32a.5.5 0 0 1 0 .707L8.207 7.5l1.647 1.646a.5.5 0 0 1-.708.708L7.5 8.207L5.854 9.854a.5.5 0 0 1-.708-.708L6.793 7.5L5.146 5.854a.5.5 0 0 1 .708-.708L7.5 6.793l1.646-1.647a.5.5 0 0 1 .708 0" clip-rule="evenodd" />
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">ล้มเหลว</p>
		<p class=" text-center">การอัปเดตไม่สำเร็จ</p>
		<div class="modal-action flex justify-center">
            <button class="btn" on:click={() => {
				showAlertModalUpdateError = false;
				location.reload()
			}}>
				ปิด
			</button>
        </div>
	</div>
</dialog>

<style>
	.badge-status {
	@apply py-1 px-2 rounded-full;
	width: 100%;
	position: relative; /* Enable positioning for the dot */
	padding-left: 1rem; /* Add space for the text */
	color: #333; /* Default text color (will be overridden in specific classes) */
}

.badge-success {
	@apply border border-success;
	background-color: #DCFAE6; /* Light green background */
	color: #17B26A; /* Green text color */
}

.badge-danger {
	@apply border border-gray-500; /* Change border to dark gray */
	background-color: #F9FAFB; /* White background */
	color: #61646C; /* Dark gray text color */
}

.badge-success::before {
	content: '';
	display: inline-block;
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 50%;
	background-color: #17B26A; /* Dark green to match text color */
	position: absolute;
	left: 1rem; /* Adjusted position closer to the text */
	top: 50%;
	transform: translateY(-50%);
}

.badge-danger::before {
	content: '';
	display: inline-block;
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 50%;
	background-color: #61646C; /* Dark gray to match the border */
	position: absolute;
	left: 0.5rem; /* Adjusted position closer to the text */
	top: 50%;
	transform: translateY(-50%);
}
	@media (max-width: 640px) {
		.badge-status {
			width: 100%;
		}
	}

	.overflow-y-hidden {
		overflow-y: scroll;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.overflow-y-hidden::-webkit-scrollbar {
		display: none;
	}
</style>
