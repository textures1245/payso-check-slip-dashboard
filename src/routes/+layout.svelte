<script lang="ts">
	import '../app.postcss';
	import Navbar from "$lib/component/navbar.svelte"

	let navItems: { id: number, title: string, link: string }[] = [
    { id: 1, title: 'หน้าแรก', link: '/' },
    { id: 2, title: 'Dashboard', link: '/dashboard' },
    { id: 3, title: 'Package', link: '/Packagebuy' },
    { id: 4, title: 'test', link: '/testdashboard' }
  ];
  let role = "admin";
	if (role =="admin") {
		navItems = navItems.slice(0, 2);
	} else {
		navItems = navItems.slice(2);
	}

</script>

<div class="h-dvh">
	<Navbar {navItems} />
	<slot></slot>
</div>
