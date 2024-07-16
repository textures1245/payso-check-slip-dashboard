<script lang="ts">
	import { accounts, mails } from '../(layouts)/data';

	import LayoutResizer from '../(layouts)/LayoutResizer.svelte';
	import '../../app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';

	let navItems: NavItem[] = [
		{ id: 1, title: 'หน้าแรก',	 link: '/admin' },
		{ id: 2, title: 'Dashboard', link: '/dashboard' },
		{ id: 3, title: 'Package', link: '/Packagebuy' },
		{ id: 4, title: 'test', link: '/testdashboard' },
		{ id: 5, title: 'admin', link: '/admin' },
		{ id: 6, title: 'Log', link: '/admin-log' },
		{id : 7 , title: 'adminupdate' , link: '/admin-update'}

	];

	let subPaths = {
		'admin': [
			{ id: 1, title: 'หน้าแรก', link: '/' },
			{ id: 2, title: 'Dashboard', link: '/dashboard' },
			{ id: 3, title: 'Package', link: '/Packagebuy' },
			{ id: 4, title: 'test', link: '/testdashboard' },
			
			
		]
		
	};

	let role = 'admin';
	if (role == 'admin') {
		navItems = navItems.slice(0, 6);
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
		<div class="*:min-h-dvh">
			<slot></slot>
		</div>
	</LayoutResizer>
</div>