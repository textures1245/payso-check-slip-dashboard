<script lang="ts">
	import type { Route } from './routes';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let isCollapsed: boolean;
	export let routes: Route[];
</script>

<div data-collapsed={isCollapsed} class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
	<nav
		class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		{#each routes as route}
			{#if isCollapsed}
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild let:builder>
						<Button
							href={route.link}
							builders={[builder]}
							size="icon"
							variant="ghost"
							class={cn(
								'size-9',
								'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
							)}
						>
							<Icon icon={route.icon} class={cn(isCollapsed ? 'ml-2' : '')} />

							<span class="sr-only">{route.title}</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="right" class="flex items-center gap-4">
						{route.title}
					</Tooltip.Content>
				</Tooltip.Root>
			{:else}
				<Button
					href={route.link}
					size="sm"
					variant="ghost"
					class={cn(
						'justify-start',
						'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white'
					)}
				>
					<Icon icon={route.icon} class="mr-2 size-4" aria-hidden="true" />

					{route.title}
				</Button>
			{/if}
		{/each}
	</nav>
</div>
