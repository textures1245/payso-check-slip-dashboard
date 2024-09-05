<script lang="ts">
	import { accounts, mails } from '../(layouts)/data';

	import LayoutResizer from '../(layouts)/LayoutResizer.svelte';
	import '../../app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { Dashboard } from 'svelte-radix';

	let navItems: NavItem[] = [
		{ id: 1, title: 'Dashboard', link: '/dashboard' },
		{ id: 2, title: 'Package', link: '/package' },
	];

	let subPaths = {
		dashboard: [
			{ id: 3, title: 'profile', link: '/profile' },
			{ id: 4, title: 'logintest', link: '/login' }
		],
		login: [] ,
		package : [],
		profile: [],
		
	};

	
</script>

<div class="bg-primary-foreground">
	<Navbar {navItems}/>
	<Separator  />

		<div >
			<slot></slot>
		</div>

</div>

