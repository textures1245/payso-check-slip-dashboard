<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import {type  Transaction } from '$lib/utils/external-api-type/transaction';

	export let props: Transaction[] = [];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row class="text-xs md:text-sm">
			<Table.Head>เลขรายการ</Table.Head>
			<Table.Head>เลข MID</Table.Head>
			<Table.Head>สถานะ</Table.Head>
			<Table.Head>หมายเลยคิวอา</Table.Head>
			<Table.Head class=" text-right">เวลาที่ถูกตรวจสอบ</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each props as t}
			<!-- content here -->
			<Table.Row class="text-xs">
				<Table.Cell class="font-medium">{t.Id}</Table.Cell>
				<Table.Cell class="font-medium">{t.MerchantId}</Table.Cell>
				<Table.Cell >
					<span
						class:text-success={t.Status.toLocaleUpperCase() === 'SUCCESS'}
						class:text-warning={t.Status.toLocaleUpperCase() === 'PENDING'}
						class:text-destructive={t.Status.toLocaleUpperCase() === 'REJECT'}
						class="badge badge-outline badge-sm uppercase text-xs"
					>
						{t.Status}
					</span>
				</Table.Cell>
				<Table.Cell>{t.QrCode}</Table.Cell>
				<Table.Cell class=" text-right"
					>{t.VerifiedDate ? new Date(t.VerifiedDate).toLocaleDateString('en-EN') : '-'}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
