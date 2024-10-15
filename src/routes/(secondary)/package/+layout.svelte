<script lang="ts">
	import '/src/app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { Dashboard } from 'svelte-radix';

	let navItems: NavItem[] = [
		{ id: 1, title: 'แดชบอร์ด', link: '/dashboard' },
		{ id: 2, title: 'แพ็คเกจ', link: '/package' },
	];


	
</script>

<div class="bg-primary-foreground  overflow-y-hidden">
	<Navbar {navItems} />
	<Separator />


		<div >
			<slot></slot>
		</div>

</div>

<style>
	
</style>