<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import * as Table from '$lib/components/ui/table';
	import type { QuotaAndMerchantUsage } from '$lib/utils/external-api-type/adminDashboard';
	import type { Package } from '$lib/utils/external-api-type/package';
	import Swal from 'sweetalert2';

	export let pData: QuotaAndMerchantUsage[];
	export let packageOpt: Package[];
	export let selectedPkg: number;

	let form: HTMLFormElement;
</script>

<Table.Root>
	<Table.Header>
		<div class="form-control">
			<form
				bind:this={form}
				method="POST"
				action="?/updateQuotaAndMerchantUsage"
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
							// @ts-ignore
							pData = result.data.updateQuotaAndMerchantUsage;
						}
					};
				}}
			>
				<select
					on:change={() => {
						form.requestSubmit();
					}}
					name="pkgIdSelected"
					class="select select-xs select-bordered w-full max-w-xs"
				>
					{#if packageOpt}
						{#each packageOpt as pkg}
							<option value={pkg.Id} selected={pkg.Id === selectedPkg}>{pkg.Name}</option>
						{/each}
					{/if}
				</select>
			</form>
		</div>
		<Table.Row class="text-xs md:text-sm">
			<Table.Head></Table.Head>
			<Table.Head>เลขไอดีลูกค้า</Table.Head>
			<Table.Head>ชื่อลูกค้า</Table.Head>
			<Table.Head>ประเภทลูกค้า</Table.Head>
			<Table.Head>ชื่อแพ็คเก็จที่ใช้</Table.Head>
			<Table.Head class=" text-right">แพ็คเก็จโค้วต้าลิมิต</Table.Head>
			<Table.Head class=" text-right">ยอดโค้วต้าที่ใช้ไปแล้ว</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each pData as t, i (i)}
			<!-- content here -->
			<Table.Row class={'text-xs'}>
				<Table.Cell class="font-medium">{i + 1}</Table.Cell>
				<Table.Cell>{t.MerchantId}</Table.Cell>
				<Table.Cell>{t.MerchantName}</Table.Cell>
				<Table.Cell>{t.MerchantRole}</Table.Cell>
				<Table.Cell>{t.PackageName}</Table.Cell>
				<Table.Cell class="text-right text-destructive font-semibold"
					>{t.PackageQuotaLimit}</Table.Cell
				>
				<Table.Cell class="text-right text-primary font-semibold"
					>{t.PackageQuotaLimit - t.QuotaUsage}</Table.Cell
				>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
