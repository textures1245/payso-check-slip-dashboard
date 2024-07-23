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
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import editicon from '../../../lib/image/editing.png'

	type UserData = {
		merchantId: string;
		merchantName: string;
		package: string;
		quota : number;
		amount: number;
		email: string;
		editbutton : string;
	};

	const data: UserData[] = [
		{
			merchantId: '1',
			merchantName : "Mick Magien",
			package: 'Package1',
			quota : 5,
			amount: 316,
			email: 'ken99@yahoo.com',
			editbutton : 'sss'
		},
		{
			merchantId: '2',
			merchantName : "Phark EIEI",
			package: 'Package2',
			quota : 6,
			amount: 316,
			email: 'Aeiou99@yahoo.com',
			editbutton : ''

		},
		{
			merchantId: '3',
			merchantName : "Got EIEI",
			package: 'Package3',
			quota : 9,
			amount: 316,
			email: 'poiofview@yahoo.com',
			editbutton : ''

		},
		{
			merchantId: '4',
			merchantName : "Got EIEI",
			package: 'Package3',
			quota : 9,
			amount: 316,
			email: 'poiofview@yahoo.com',
			editbutton : ''

		},
		{
			merchantId: '5',
			merchantName : "Got EIEI",
			package: 'Package3',
			quota : 9,
			amount: 316,
			email: 'poiofview@yahoo.com',
			editbutton : ''

		},
		{
			merchantId: '6',
			merchantName : "Got EIEI",
			package: 'Package3',
			quota : 9,
			amount: 316,
			email: 'poiofview@yahoo.com',
			editbutton : ''

		},
		{
			merchantId: '7',
			merchantName : "Got EIEI",
			package: 'Package3',
			quota : 9,
			amount: 316,
			email: 'poiofview@yahoo.com',
			editbutton : ''

		},
		{
			merchantId: '8',
			merchantName : "Got EIEI",
			package: 'Package3',
			quota : 9,
			amount: 316,
			email: 'poiofview@yahoo.com',
			editbutton : ''

		},
		{
			merchantId: '9',
			merchantName : "Got EIEI",
			package: 'Package3',
			quota : 9,
			amount: 316,
			email: 'poiofview@yahoo.com',
			editbutton : ''

		},
		{
			merchantId: '10',
			merchantName : "Got EIEI",
			package: 'Package3',
			quota : 9,
			amount: 316,
			email: 'poiofview@yahoo.com',
			editbutton : ''

		},
		{
			merchantId: '11',
			merchantName : "Got EIEI",
			package: 'Package3',
			quota : 9,
			amount: 316,
			email: 'poiofview@yahoo.com',
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
			header: 'MerchantID',
			accessor: 'merchantId',
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
			header: 'MerchantName',
			accessor: 'merchantName',
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
			header: 'Package',
			accessor: 'package',
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
										{:else if cell.id === 'merchantName'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<CaretSort
													class={cn(
														$sortKeys[0]?.id === cell.id && 'text-foreground',
														'ml-2 h-4 w-4'
													)}
												/>
											</Button>
											{:else if cell.id === 'package'}
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
												<Button><a href="/admin-update"><img style="width: 20px;" src={editicon} alt=""></a></Button>
											</div>
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