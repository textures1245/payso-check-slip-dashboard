<script lang="ts">
	import { accounts, mails } from '../(layouts)/data';

	import LayoutResizer from '../(layouts)/LayoutResizer.svelte';
	import '../../app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { Dashboard } from 'svelte-radix';

	let navItems: NavItem[] = [
		{ id: 1, title: 'หน้าแรก',	 link: '/admin' },
		{ id: 2, title: 'Dashboard', link: '/dashboard' },
		{ id: 3, title: 'Package', link: '/Packagebuy' },
		{ id: 4, title: 'profile', link: '/profile' },
		{ id: 5, title: 'test', link: '/admin' },
		{ id: 6, title: 'logintest', link: '/loginline' }
	];

	let subPaths = {
		dashboard: [
			{ id: 1, title: 'หน้าแรก', link: '/' },
			{ id: 2, title: 'Dashboard', link: '/dashboard' },
			{ id: 3, title: 'profile', link: '/profile' }
		],
        testdashboard: [
			{ id: 1, title: 'หน้าแรก', link: '/' },
			{ id: 2, title: 'Dashboard', link: '/dashboard' },
			{ id: 3, title: 'test', link: '/testdashboard' }
		]
		
	};

	let role = 'admin';
	if (role == 'admin') {
		navItems = navItems.slice(0, 8);
	} else {
		navItems = navItems.slice(2);
	}
</script>

<div>
	<Navbar {navItems} />
	<Separator />
	<LayoutResizer {accounts} subLinks={subPaths} navCollapsedSize={3}>
		<!-- <div slot="navbar">
		</div> -->
		<div>
			<slot></slot>
		</div>
	</LayoutResizer>
</div>