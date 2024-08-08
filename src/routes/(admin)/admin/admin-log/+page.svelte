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

	type LogData = {
	    logId: string;
		role: string;
		datetime: string;
		action: string;
		remark : string;
	};

	const data: LogData[] = [
		{
			logId: '1',
			role : "Admin",
			datetime: '2024-07-16',
			action : 'action',
			remark : 'remark'
		},
        {
			logId: '2',
			role : "Admin",
			datetime: '2024-07-16',
			action : 'action',
			remark : 'remark'

		},
        {
			logId: '3',
			role : "Admin",
			datetime: '2024-07-16',
			action : 'action',
			remark : 'remark'

		},
        {
			logId: '4',
			role : "Admin",
			datetime: '2024-07-16',
			action : 'action',
			remark : 'remark'

		},
        {
			logId: '5',
			role : "Admin",
			datetime: '2024-07-16',
			action : 'action',
			remark : 'remark'

		},
        {
			logId: '6',
			role : "Admin",
			datetime: '2024-07-16',
			action : 'action',
			remark : 'remark'

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
			header: 'LogId',
			accessor: 'logId',
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
			header: 'Actor name',
			accessor: 'role',
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
			header: 'action',
			accessor: 'action',
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
			header: 'date',
			accessor: 'datetime',
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
			header: 'remark',
			accessor: 'remark',
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