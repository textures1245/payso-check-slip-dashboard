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
			<div class="flex gap-4">
				<label class="form-control w-full max-w-xs">
					<select
						class="select select-xs select-bordered w-full max-w-xs"
						name="status"
						id="status"
					>
						<option value="">สถานะ</option>
						<option value="SUCCESS">SUCCESS</option>
						<option value="PENDING">PENDING</option>
						<option value="FAILED">FAILED</option>
					</select>
				</label>

				<label class="form-control w-full max-w-xs">
					<select
						class="select select-xs select-bordered w-full max-w-xs"
						name="sortOrder"
						id="sortOrder"
					>
						<option disabled selected>เรียงตาม</option>
						<option value="DESC">มากไปน้อย</option>
						<option value="ASC">น้อยไปมาก</option>
					</select>
				</label>
				<label class="max-w-xs self-end">
					<button class="btn bg-primary text-primary-content btn-xs" type="submit">ค้นหา</button>
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
						class:text-success={t.Status.toLocaleUpperCase() === 'SUCCESS'}
						class:text-warning={t.Status.toLocaleUpperCase() === 'PENDING'}
						class:text-destructive={t.Status.toLocaleUpperCase() === 'REJECTED' ||
							t.Status.toLocaleUpperCase() === 'FAILED'}
						class="badge badge-outline badge-sm uppercase text-xs"
					>
						{t.Status}
					</span>
				</Table.Cell>
				
			
				<Table.Cell>{t.TransferRefId}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
