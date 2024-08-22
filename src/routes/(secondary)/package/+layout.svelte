<script lang="ts">
	import '/src/app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { Dashboard } from 'svelte-radix';

	let navItems: NavItem[] = [
		{ id: 1, title: 'HOME',	 link: '/' },
		{ id: 2, title: 'Dashboard', link: '/dashboard' },
		{ id: 3, title: 'Package', link: '/package' },
		{ id: 4, title: 'Profile', link: '/profile' },
	];


	
</script>

<div >
	<Navbar {navItems} />
	<Separator />


		<div >
			<slot></slot>
		</div>

</div>