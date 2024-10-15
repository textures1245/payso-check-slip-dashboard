<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Table from '$lib/components/ui/table';
	import { type Transaction } from '$lib/utils/external-api-type/transaction';
	import { QrCode, Slice } from 'lucide-svelte';
	import Swal from 'sweetalert2';
	export let props: Transaction[] = [];
	let form: HTMLFormElement;
</script>

<div class="relative h-11">
	<div class="form-control items-end">
		<form
			bind:this={form}
			method="POST"
			action="?/updateTransactionList"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'failure') {
						Swal.fire(
							'เกิดข้อผิดพลาด',
							result.data?.message || 'เกิดข้อผิดพลาดในการทำรายการ',
							'error'
						);
					}
					if (result.type === 'success') {
						props = result.data.transactionList;
					}
				};
			}}
		>
			<div class="flex gap-3">
				<label class="form-control  w-[160px]">
					<select
						class="select select-sm select-bordered  w-[160px]"
						name="status"
						id="status"
					>
						<option value="">สถานะ</option>
						<option value="SUCCESS">SUCCESS</option>
						<option value="PENDING">PENDING</option>
						<option value="FAILED">FAILED</option>
					</select>
				</label>
				<label class="form-control w-[180px]">
					<select
						class="select select-sm select-bordered w-full"
						name="sortOrder"
						id="sortOrder"
					>
						<option disabled selected>เรียงตามวันที่</option>
						<option value="DESC">มากไปน้อย</option>
						<option value="ASC">น้อยไปมาก</option>
					</select>
				</label>
				<label class="max-w-sm self-end">
					<button class="btn bg-primary text-primary-content btn-sm" type="submit">ค้นหา</button>
				</label>
			</div>
		</form>
	</div>
</div>



<Table.Root>
	<Table.Header>
		<Table.Row class="text-xs md:text-sm">
			<Table.Head>#</Table.Head>
			<Table.Head>วันเวลาที่ตรวจสอบ</Table.Head>
			<Table.Head>เลขที่รายการ</Table.Head>
			<Table.Head>รหัสลูกค้า</Table.Head>
			<Table.Head>ชื่อ-นามสกุล</Table.Head>
			<Table.Head>ธนาคาร</Table.Head>
			<Table.Head>สถานะ</Table.Head>
			<Table.Head>Tranfer Bank ID</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each props as t, i (i)}
			<!-- content here -->
			<Table.Row class="text-xs">
				<Table.Cell class="font-medium">{i + 1}</Table.Cell>
				<Table.Cell
					>{t.VerifiedDate ? new Date(t.VerifiedDate).toLocaleDateString('en-EN') : '-'}
				</Table.Cell>
				<Table.Cell>{t.Id}</Table.Cell>
				<Table.Cell>{t.MerchantId}</Table.Cell>
				<Table.Cell>{t.MerchantName}</Table.Cell>
				<Table.Cell>
					{t.QrCode.slice(18, 21) === '002' ? 'BBL'
						: t.QrCode.slice(18, 21) === '004' ? 'KBANK'
						: t.QrCode.slice(18, 21) === '006' ? 'KTB'
						: t.QrCode.slice(18,21) === '011' ? 'TMB'
						: t.QrCode.slice(18,21) === '014' ? 'SCB'
						: t.QrCode.slice(18,21) === '017' ? 'CITI'
						: t.QrCode.slice(18,21) === '020' ? 'SCBT'
						: t.QrCode.slice(18,21) === '022' ? 'UOBT'
						: t.QrCode.slice(18,21) === '024' ? 'UOBT'
						: t.QrCode.slice(18,21) === '025' ? 'BAY'
						: t.QrCode.slice(18,21) === '030' ? 'GOV'
						: t.QrCode.slice(18, 21) === '031' ? 'HSBC'
						: t.QrCode.slice(18, 21) === '033' ? 'GHB'
						: t.QrCode.slice(18,21) === '034' ? 'AGRI'
						: t.QrCode.slice(18,21) === '039' ? 'MHCB'
						: t.QrCode.slice(18,21) === '065' ? 'TBANK'
						: t.QrCode.slice(18,21) === '066' ? 'ISBT'
						: t.QrCode.slice(18,21) === '067' ? 'TISCO'
						: t.QrCode.slice(18,21) === '069' ? 'KK'
						: t.QrCode.slice(18,21) === '070' ? 'ACL'
						: t.QrCode.slice(18,21) === '071' ? 'TCRB'
						: t.QrCode.slice(18,21) === '073' ? 'LHBANK'
						: t.QrCode.slice(18,21) === '079' ? 'ANZ'
						: t.QrCode.slice(18,21) === '080' ? 'SMTB'
						: t.QrCode.slice(18,21) === '098' ? 'SMEB' : t.QrCode.slice(18,21)
							}
				</Table.Cell>
				<Table.Cell>
					<span
					   class:text-success-bg={t.Status.toLocaleUpperCase() === 'SUCCESS'}
					   class:text-pending-bg={t.Status.toLocaleUpperCase() === 'PENDING'}
					   class:text-respond-rejected-bg={t.Status.toLocaleUpperCase() === 'RESPOND_REJECTED'}
					   class:text-rejected-bg={t.Status.toLocaleUpperCase() === 'REJECTED' || t.Status.toLocaleUpperCase() === 'FAILED'}
					   class="badge badge-outline badge-sm uppercase text-xs flex items-center"
					>
					   {#if t.Status.toLocaleUpperCase() === 'SUCCESS'}
					   <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}>
						<path fill="#136911" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" />
					</svg>
					   {:else if t.Status.toLocaleUpperCase() === 'PENDING'}
					   <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}>
						<path fill="#f57c00" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z" />
					</svg>
					{:else if t.Status.toLocaleLowerCase() === "RESPOND_REJECTED"}
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...$$props}>
						<g fill="none" stroke="#182230" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
							<path d="M19.01 42H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v10.03m0 10.005V41a1 1 0 0 1-1 1H29.037M42 29.035H18" />
							<path d="m23 23l-6 6l6 6" />
						</g>
					</svg>
					{:else if t.Status.toLocaleUpperCase() === 'REJECTED' || t.Status.toLocaleUpperCase() === 'FAILED'}
					<svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}>
						<path fill="#d32f2f" d="M18.36 19.78L12 13.41l-6.36 6.37l-1.42-1.42L10.59 12L4.22 5.64l1.42-1.42L12 10.59l6.36-6.36l1.41 1.41L13.41 12l6.36 6.36z" />
					</svg>
					
					   {/if}

					   
					   

					   {t.Status}
					</span>
				 </Table.Cell>
				 
				
				
			
				<Table.Cell>{t.TransferRefId}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<style>
	.text-success-bg {
	background-color: #e6f4ea; /* พื้นหลังสีเขียวอ่อน */
	color: #2e7d32; /* สีตัวอักษรสีเขียวเข้ม */
}

.text-pending-bg {
	background-color: #fff9e6; /* พื้นหลังสีเหลืองอ่อน */
	color: #f57c00; /* สีตัวอักษรสีเหลืองเข้ม */
}

.text-rejected-bg {
	background-color: #fce8e8; /* พื้นหลังสีแดงอ่อน */
	color: #d32f2f; /* สีตัวอักษรสีแดงเข้ม */
}
.text-respond-rejected-bg {
		background-color: #D0D5DD; 
		color: #182230; 
	}

</style>
