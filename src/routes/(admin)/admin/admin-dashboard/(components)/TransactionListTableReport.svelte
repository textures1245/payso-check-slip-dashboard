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
						<option value="RESPOND_REJECTED">RESPOND REJECTED</option>
						<option value="REQUEST_REJECTED">REQUEST REJECTED</option>
						<option value="BANK_ACC_NOT_MATCH">BANK ACC NOT MATCH</option>
					</select>
				</label>
				<label class="form-control w-[180px]">
					<select
						class="select select-sm select-bordered w-full"
						name="sortOrder"
						id="sortOrder"
					>
						<option value="DESC">เรียงตามวันที่</option>
						<option value="DESC">มากไปน้อย</option>
						<option value="ASC">น้อยไปมาก</option>
					</select>
				</label>
				<label class="max-w-sm self-end">
					<button class="btn bg-primary text-primary-content btn-sm hover:bg-[#050680]" type="submit">ค้นหา</button>
				</label>
			</div>
		</form>
	</div>
</div>



<Table.Root>
	<Table.Header>
		<Table.Row class="text-xs md:text-sm bg-gray-100 text-gray-700">
			<Table.Head>ลำดับ</Table.Head>
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
					   class:text-request-rejected-bg={t.Status.toLocaleUpperCase() === 'REQUEST_REJECTED'}
					   class:text-bank-acc-not-match-bg={t.Status.toLocaleUpperCase() === 'BANK_ACC_NOT_MATCH'}
					   class:text-rejected-bg={t.Status.toLocaleUpperCase() === 'REJECTED' || t.Status.toLocaleUpperCase() === 'FAILED'}
					   class="badge badge-outline badge-sm uppercase text-xs flex items-center"
					>
					
					   
					   

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
