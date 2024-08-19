<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { MerchantPKG } from '$lib/utils/external-api-type/merchant';

	export let props: MerchantPKG[] = [];
</script>

<Table.Root>
	<Table.Caption>A list of your recent invoices.</Table.Caption>
	<Table.Header>
		<Table.Row class="text-xs md:text-sm">
			<Table.Head>หมายเลข</Table.Head>
			<Table.Head>ชื่อ</Table.Head>
			<Table.Head>อีเมล์</Table.Head>
			<Table.Head>ชื่อแพ็คเก็จ</Table.Head>
			<Table.Head class="text-right">วันที่สมัคร</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each props as m}
			<!-- content here -->
			<Table.Row class="text-xs">
				<Table.Cell class="font-medium">{m.Id}</Table.Cell>
				<Table.Cell>{m.MerchantName}</Table.Cell>
				<Table.Cell>{m.Email}</Table.Cell>
				<Table.Cell>{m.PackageName}</Table.Cell>
				<Table.Cell class="text-right">
					{m.RegisterDate ? new Date(m.RegisterDate).toLocaleDateString('en-EN') : '-'}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
