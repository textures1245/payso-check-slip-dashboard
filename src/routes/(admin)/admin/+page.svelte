<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import TableCell from '$lib/components/ui/table/table-cell.svelte';
	import { Button } from '$lib/components/ui/button';

	const invoices = [
		{
			merchantID: 'INV001',
			MerchantName: 'Name SurName',
			paymentStatus: 'ใช้งาน',
			packageName: 'Package',
		},
		{
			merchantID: 'INV001',
			MerchantName: 'Name SurName',
			paymentStatus: 'ใช้งาน',
			packageName: 'Package',
		},
		{
			merchantID: 'INV001',
			MerchantName: 'Name SurName',
			packageName: 'Package',
			paymentStatus: 'ใช้งาน',
		},
		{
			merchantID: 'INV002',
			MerchantName: 'Name SurName',
			packageName: 'Package',
			paymentStatus: 'ใช้งาน',
		},
		{
			merchantID: 'INV003',
			MerchantName: 'Name SurName',
			packageName: 'Package',

			paymentStatus: 'ใช้งาน',
		},
		{
			merchantID: 'INV004',
			MerchantName: 'Name SurName',
			packageName: 'Package',
			paymentStatus: 'ใช้งาน',
		},
		{
			merchantID: 'INV005',
			MerchantName: 'Name SurName',
			packageName: 'Package',
			paymentStatus: 'ใช้งาน',
			
		}
	];
</script>

<div style="width: max-auto; margin:30px">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Merchant ID</Table.Head>
				<Table.Head>Merchant Name</Table.Head>
				<Table.Head>Package</Table.Head>
				<Table.Head>Quota</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>Edit</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each invoices as invoice, i (i)}
				<Table.Row>
					<Table.Cell class="font-medium">{invoice.merchantID}</Table.Cell>
					<Table.Cell>{invoice.MerchantName}</Table.Cell>
					<Table.Cell>{invoice.packageName}</Table.Cell>
					<Table.Cell>data</Table.Cell>
					<Table.Cell >
						<span class={invoice.paymentStatus === "ใช้งาน" ? "green-border" : ""}>{invoice.paymentStatus}</span>
					</Table.Cell>					
					<TableCell><Button>edit</Button></TableCell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<style>
	.green-border {
		background-color: rgb(74, 192, 74);
		border: 2px solid rgb(27, 152, 27);
		padding: 7px;
		border-radius: 1rem;
	}
</style>
