<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Table from '$lib/components/ui/table';
	import type { MerchantPKG } from '$lib/utils/external-api-type/merchant';
	import Swal from 'sweetalert2';

	export let props: MerchantPKG[] = [];
	let form: HTMLFormElement;

	let inputValue = '';

	function preventFirstSpace(event: any) {
		if (event.target.value.startsWith(' ')) {
			event.target.value = event.target.value.trimStart();
		}
		inputValue = event.target.value;
	}
</script>

<div class="relative h-11">
	<div class="form-control items-end">
		<form
			bind:this={form}
			method="POST"
			action="?/updatetopMerchantQuotaSpendListReport"
			use:enhance={() => {
				return async ({ result }) => {
					console.log(result); // ตรวจสอบข้อมูล result ทั้งหมด
					if (result.type === 'success') {
						if (!result.data.MerchantQuotaSpendListReport) {
							Swal.fire('ไม่มีข้อมูล', 'ไม่พบรายการที่ค้นหา', 'warning');
						} else {
							props = result.data.MerchantQuotaSpendListReport;
						}
					}
				};
			}}
		>
			<div class="flex gap-4">
				<label class="form-control w-full max-w-md">
					<input
						type="text"
						placeholder=" รหัสลูกค้า ชื่อสกุล"
						class="input input-sm input-bordered w-full max-w-md"
						name="merChantIdorName"
						maxlength="100"
						bind:value={inputValue}
						on:input={preventFirstSpace}
					/>
				</label>
				<label class="form-control w-full max-w-sm">
					<select
						class="select select-sm select-bordered w-full max-w-sm"
						name="merChantRole"
					>
						<option value = "">ประเภทลูกค้า</option>
						<option value="PAYSO">Payso</option>
						<option value="NOT_PAYSO">Not_Payso</option>
					</select>
				</label>

				<label class="form-control w-full max-w-sm">
					<select class="select select-sm select-bordered w-full max-w-sm" name="sortOrder">
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
			<Table.Head>รหัสลูกค้า</Table.Head>
			<Table.Head class="w-[30px ]">ชื่อ-นามสกุล</Table.Head>
			<Table.Head>อีเมล</Table.Head>
			<Table.Head>ประเภทลูกค้า</Table.Head>
			<Table.Head>แพ็คเก็จที่สมัคร</Table.Head>
			<Table.Head>โควตาที่ใช้</Table.Head>
			<Table.Head>โควตาที่เหลือ</Table.Head>
			<Table.Head class="text-left">วันหมดอายุแพ็คเก็จ</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each props as m, i (i)}
			<!-- content here -->
			<Table.Row class="text-xs">
				<Table.Cell class="font-semibold">{i + 1}</Table.Cell>
				<Table.Cell>{m.Id}</Table.Cell>
				<Table.Cell class="w-[100px] truncate"  title="{m.MerchantName}">{m.MerchantName}</Table.Cell>
				<Table.Cell>{m.Email}</Table.Cell>
				<Table.Cell>{m.MerchantRole}</Table.Cell>
				<Table.Cell>{m.PackageName}</Table.Cell>
				<Table.Cell>{Number(m.QuotaSpending).toLocaleString()}</Table.Cell>
				<Table.Cell>{(m.QuotaUsage + m.BalanceQuotaLeft).toLocaleString()}</Table.Cell>
				<Table.Cell class="text-left">
					{m.BillDate && !isNaN(new Date(m.BillDate).getTime())
						? new Date(m.BillDate).toLocaleDateString('en-EN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})
						: '-'}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
