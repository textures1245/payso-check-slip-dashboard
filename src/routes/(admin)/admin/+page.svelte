<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import TableCell from '$lib/components/ui/table/table-cell.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import editicon from '../../../lib/image/editing.png';

	const invoices = [
		{
			merchantID: 'INV001',
			MerchantName: 'Name SurName',
			paymentStatus: 'ใช้งาน',
			packageName: 'Package'
		},
		{
			merchantID: 'INV001',
			MerchantName: 'Name SurName',
			paymentStatus: 'ใช้งาน',
			packageName: 'Package'
		},
		{
			merchantID: 'INV001',
			MerchantName: 'Name SurName',
			packageName: 'Package',
			paymentStatus: 'ใช้งาน'
		},
		{
			merchantID: 'INV002',
			MerchantName: 'Name SurName',
			packageName: 'Package',
			paymentStatus: 'ใช้งาน'
		},
		{
			merchantID: 'INV003',
			MerchantName: 'Name SurName',
			packageName: 'Package',

			paymentStatus: 'ใช้งาน'
		},
		{
			merchantID: 'INV004',
			MerchantName: 'Name SurName',
			packageName: 'Package',
			paymentStatus: 'ใช้งาน'
		},
		{
			merchantID: 'INV005',
			MerchantName: 'Name SurName',
			packageName: 'Package',
			paymentStatus: 'ไม่ใช้งาน'
		}
	];
</script>

<div style="width: max-auto; margin:30px">
	<div class="mb-4 flex items-center gap-4"><Input
		class="max-w-sm"
		placeholder="Search"
		type="text"
		
	  />
	  <Button>Submit</Button>
	  <Button class='outline outline-offset-2 outline-blue-500'>Clear</Button>
	</div> 
	  
	<Table.Root>
		<Table.Header class="bg-sky-700 ">
			<Table.Row>
				<Table.Head class="text-slate-950">Merchant ID</Table.Head>
				<Table.Head class="text-slate-950">Merchant Name</Table.Head>
				<Table.Head class="text-slate-950">Package</Table.Head>
				<Table.Head class="text-slate-950">Quota</Table.Head>
				<Table.Head class="text-slate-950">Status</Table.Head>
				<Table.Head class="text-slate-950">Edit</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each invoices as invoice, i (i)}
				<Table.Row>
					<Table.Cell class="font-medium">{invoice.merchantID}</Table.Cell>
					<Table.Cell>{invoice.MerchantName}</Table.Cell>
					<Table.Cell>{invoice.packageName}</Table.Cell>
					<Table.Cell>data</Table.Cell>
					<Table.Cell>
						<span
							class={invoice.paymentStatus === 'ใช้งาน'
								? 'green-border'
								: invoice.paymentStatus === 'ไม่ใช้งาน'
									? 'red-border'
									: ''}>{invoice.paymentStatus}</span
						>
					</Table.Cell>
					<TableCell
						><Dialog.Root>
							<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
								><img src={editicon} alt="" style="width:15px;" /></Dialog.Trigger
							>
							<Dialog.Content class="sm:max-w-[425px]">
								<Dialog.Header>
									<Dialog.Title>Edit profile</Dialog.Title>
									<Dialog.Description>
										Make changes to your profile here. Click save when you're done.
									</Dialog.Description>
								</Dialog.Header>
								<div class="grid gap-4 py-4">
									<div class="grid grid-cols-4 items-center gap-4">
										<Label for="name" class="text-right">Name</Label>
										<Input id="name" value="Pedro Duarte" class="col-span-3" />
									</div>
									<div class="grid grid-cols-4 items-center gap-4">
										<Label for="username" class="text-right">Username</Label>
										<Input id="username" value="@peduarte" class="col-span-3" />
									</div>
								</div>
								<Dialog.Footer>
									<Button type="submit">Save changes</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root></TableCell
					>
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
	.red-border {
		background-color: rgb(255, 102, 102);
		border: 2px solid rgb(204, 0, 0);
		padding: 7px;
		border-radius: 1rem;
	}
</style> 


