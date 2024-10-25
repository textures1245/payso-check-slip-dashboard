<script lang="ts">
	import { type Route } from './routes';
	// import { mailStore } from '../store.js';
	import type { Account, Mail } from './data';
	import { cn } from '$lib/utils.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Resizable from '$lib/components/ui/resizable';
	import AccountSwitcher from './(components)/AccountSwitcher.svelte';
	import Sidebar from './Sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let accounts: Account[];
	// export let mails: Mail[];
	export let defaultLayout = [265, 300, 655];
	export let defaultCollapsed = false;
	export let navCollapsedSize: number;

	export let subLinks: {
		[key: string]: Route[];
	};

	let isCollapsed = defaultCollapsed;
	let currentSubPath = $page.url.pathname.split('/').slice(1).join('/');

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

	function onCollapse() {
		isCollapsed = true;
		document.cookie = `PaneForge:collapsed=${true}`;
	}

	function onExpand() {
		isCollapsed = false;
		document.cookie = `PaneForge:collapsed=${false}`;
	}

	function getRootPath(currP: string) {
		return currP.split('/')[0];
	}
</script>

<!-- <Navbar {navItems} /> -->
<Resizable.PaneGroup direction="horizontal" {onLayoutChange} class="h-full  items-stretch">
	<!-- <slot name="navbar"></slot> -->

	<Resizable.Pane
		defaultSize={defaultLayout[0]}
		collapsedSize={navCollapsedSize}
		collapsible
		minSize={15}
		maxSize={20}
		{onCollapse}
		class="hidden md:block"
		{onExpand}
	>
		<!-- <div class={cn('flex h-[52px] items-center justify-center', isCollapsed ? 'h-[52px] hidden' : 'px-2 ')}>
			
		</div> -->
		<Separator />
		<Sidebar {isCollapsed} routes={subLinks[getRootPath(currentSubPath)]} />
	</Resizable.Pane>
	<Resizable.Handle class="invisible md:visible" withHandle />
	<Resizable.Pane defaultSize={defaultLayout[1]} minSize={30}>
		<!-- <div class=" relative mx-4 md:hidden">
			<div
				class="absolute z-10 mx-2 min-h-10 bg-card/40 shadow-lg ring-1 ring-black/5 mt-1 backdrop-blur-xl w-full rounded-lg"
			>
				<div class="flex items-center px-4 gap-4 py-2">
					<div class="w-42 bg-card/80 rounded-md"></div>

					<div class="flex gap-4 overflow-x-auto">
						{#each subLinks[currentSubPath] as l}
							<a class="text-xs inline text-zinc-600 dark:text-zinc-200" href={l.link}>{l.title}</a>
						{/each}
					</div>
				</div>
			</div>
		</div> -->

		<Tabs.Root class="" value="all">
			<!-- <div class="hidden md:flex items-center px-4 py-2">
				<h1 class="text-xl font-bold">Inbox</h1>
				<Tabs.List class="ml-auto">
					<Tabs.Trigger value="all" class="text-zinc-600 dark:text-zinc-200">All mail</Tabs.Trigger>
					<Tabs.Trigger value="unread" class="text-zinc-600 dark:text-zinc-200">
						Unread
					</Tabs.Trigger>
				</Tabs.List>
			</div> -->
			
			<Separator />

			<Tabs.Content value="all" class=" m-0">

				<slot></slot>
			</Tabs.Content>
		</Tabs.Root>
	</Resizable.Pane>
</Resizable.PaneGroup>
