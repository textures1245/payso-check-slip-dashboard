<script lang="ts">
	import { CaretSort } from 'svelte-radix';
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import {
		addHiddenColumns,
		addPagination,
		addSelectedRows,
		addSortBy,
		addTableFilter
	} from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import editicon from '../../../lib/image/editing.png'
    import { Badge } from "$lib/components/ui/badge/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";





	type UserData = {
		packageId: string;
		packageName: string;
		status: string;
		quota : number;
        price: number;
		editbutton : string;
	};

	const data: UserData[] = [
		{
			packageId: '1',
			packageName : "Package1",
			status: 'ใช้งาน',
			quota : 5,
            price : 100 ,
			editbutton : 'sss'
		},
		{
			packageId: '2',
			packageName : "Package2",
			status: 'ไม่ใช้งาน',
			quota : 6,
            price : 200 ,
			editbutton : ''

		},
		{
			packageId: '3',
			packageName : "Package3",
			status: 'ไม่ใช้งาน',
			quota : 60,
            price : 500 ,
			editbutton : ''

		},
		{
			packageId: '4',
			packageName : "Package4",
			status: 'ใช้งาน',
			quota : 62,
            price : 300 ,
			editbutton : ''

		},
		
		
	];

	const table = createTable(readable(data), {
		sort: addSortBy({ disableMultiSort: true }),
		page: addPagination(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.includes(filterValue)
		}),
		select: addSelectedRows(),
		hide: addHiddenColumns()
	});

	const columns = table.createColumns([
		table.column({
			header: 'PackageID',
			accessor: 'packageId',
			cell: ({ value }) => value.toLowerCase(),
			plugins: {
				filter: {
					getFilterValue(value) {
						return value.toLowerCase();
					}
				}
			}
		}),
		
		table.column({
			header: 'PackageName',
			accessor: 'packageName',
			cell: ({ value }) => value.toLowerCase(),
			plugins: {
				filter: {
					getFilterValue(value) {
						return value.toLowerCase();
					}
				}
			}
		}),
		
		table.column({
			header: 'Quota',
			accessor: 'quota',
			cell: ({ value }) => {
				return value;
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
        table.column({
			header: 'Price',
			accessor: 'price',
		}),
		table.column({
			header: 'Status',
			accessor: 'status',
			cell: ({ value }) => value.toLowerCase(),
			plugins: {
				filter: {
					getFilterValue(value) {
						return value.toLowerCase();
					}
				}
			}
		}),
       
	
		table.column({
			header: '',
			accessor: 'editbutton',
			cell: ({ value }) => {
				
				return value;
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		
		
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, flatColumns, pluginStates, rows } =
		table.createViewModel(columns);

	const { sortKeys } = pluginStates.sort;

	const { hiddenColumnIds } = pluginStates.hide;
	const ids = flatColumns.map((c) => c.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;

	const { selectedDataIds } = pluginStates.select;

</script>

<div class="w-full py-4" style="margin: 20px;">
	<div class="mb-4 flex items-center gap-4">
		<Input class="max-w-sm" placeholder="Search" type="text" bind:value={$filterValue} />
		<Button>Search</Button>
		<Button>Clear</Button>
      
        <Dialog.Root>
            
            <Dialog.Trigger class={buttonVariants()}
              >Create Package</Dialog.Trigger
            >
            <Dialog.Content class="sm:max-w-[425px]">
              <Dialog.Header>
                <Dialog.Title>Create Package</Dialog.Title>
                <Dialog.Description>
                  คุณสามารถเลือกสร้างเพจเกจใหม่ได้.
                </Dialog.Description>
              </Dialog.Header>
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="Package Name" class="text-right">Package Name</Label>
                  <Input id="name" placeholder="Packagename" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="username" class="text-right">Quota</Label>
                    <Input id="username" type="number" placeholder="100" class="col-span-3" />
                  </div>
                  <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="username" class="text-right">Price</Label>
                    <Input id="username" type="number" placeholder="200" class="col-span-3" />
                  </div>
                  <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="username" class="text-right">Status</Label>
                    <Switch/>
                  </div>
              </div>
              <Dialog.Footer>
                <Button type="submit">Save changes</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
		
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header class='bg-primary'>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head class='text-zinc-950' {...attrs} >
										{#if cell.id === 'merchantId'}
										<Button variant="ghost" on:click={props.sort.toggle}>
											<Render of={cell.render()} />
											<CaretSort
												class={cn(
													$sortKeys[0]?.id === cell.id && 'text-foreground',
													'ml-2 h-4 w-4'
												)}
											/>
										</Button>
										{:else if cell.id === 'packageName'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<CaretSort
													class={cn(
														$sortKeys[0]?.id === cell.id && 'text-foreground',
														'ml-2 h-4 w-4'
													)}
												/>
											</Button>
                                            {:else if cell.id === 'quota'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<CaretSort
													class={cn(
														$sortKeys[0]?.id === cell.id && 'text-foreground',
														'ml-2 h-4 w-4'
													)}
												/>
											</Button>
											{:else if cell.id === 'packageId'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<CaretSort
													class={cn(
														$sortKeys[0]?.id === cell.id && 'text-foreground',
														'ml-2 h-4 w-4'
													)}
												/>
											</Button>
										
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === 'editbutton'}
											<div>
												<Dialog.Root>
            
													<Dialog.Trigger class={buttonVariants({variant: "outline"})}
													  >Edit</Dialog.Trigger
													>
													<Dialog.Content class="sm:max-w-[425px]">
													  <Dialog.Header>
														<Dialog.Title>Edit Package</Dialog.Title>
														<Dialog.Description>
														  คุณสามารถเปลี่ยนเพจเกจใหม่ได้.
														</Dialog.Description>
													  </Dialog.Header>
													  <div class="grid gap-4 py-4">
														<div class="grid grid-cols-4 items-center gap-4">
														  <Label for="Package Name" class="text-right">Package Name</Label>
														  <Input id="name" placeholder="Packagename" class="col-span-3" />
														</div>
														<div class="grid grid-cols-4 items-center gap-4">
															<Label for="username" class="text-right">Quota</Label>
															<Input id="username" type="number" placeholder="100" class="col-span-3" />
														  </div>
														  <div class="grid grid-cols-4 items-center gap-4">
															<Label for="username" class="text-right">Price</Label>
															<Input id="username" type="number" placeholder="200" class="col-span-3" />
														  </div>
														  <div class="grid grid-cols-4 items-center gap-4">
															<Label for="username" class="text-right">Status</Label>
															<Switch/>
														  </div>
													  </div>
													  <Dialog.Footer>
														<Button type="submit">Save changes</Button>
													  </Dialog.Footer>
													</Dialog.Content>
												  </Dialog.Root>
											</div>
                                            {:else if cell.id === 'status'}
                                            {#if cell.render() === 'ใช้งาน'}
                                                <Badge style="background-color: green;">ใช้งาน</Badge>
                                            {:else}
                                                <Badge style="background-color: red;">{cell.render()}</Badge>
                                            {/if}
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
	
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div> 




