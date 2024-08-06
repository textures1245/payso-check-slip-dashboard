<script lang="ts">
	import { accounts, mails } from '../(layouts)/data';

	import LayoutResizer from '../(layouts)/LayoutResizer.svelte';
	import '../../app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';

	let navItems: NavItem[] = [
		{ id: 1, title: 'หน้าแรก',	 link: '/admin' },
		{ id: 5, title: 'admin', link: '/admin' },
		{ id: 6, title: 'Log', link: '/admin-log' },
		{id : 7 , title: 'admindashbord' , link: '/admin-dashbord'},
		{id : 8 , title : 'admin-manage-package ,' , link: '/admin-manage-package'},
		{id : 9 , title: 'adminupdate' , link: '/admin-update'},
		
		

	];

	let subPaths = {
		'admin': [
			{ id: 1, title: 'หน้าแรก', link: '/admin' },
			{ id: 5, title: 'Manage-package', link: '/admin' },
			{ id: 6, title: 'Log', link: '/admin-log' },
			{ id: 7, title: 'Dashbord', link: '/admin-dashbord' },
			
			
		] ,
		'admin-dashbord':[] ,
		'admin-log':[],
		'admin-manage-package':[],
		'adminupdate':[]

		
		
	};

	let role = 'admin';
	if (role == 'admin') {
		navItems = navItems.slice(0, 5);
	} else {
		navItems = navItems.slice(2);
	}
</script>

<div>
	<Navbar {navItems} />
	<Separator />
	<LayoutResizer {accounts} subLinks={subPaths} navCollapsedSize={3}>

		<div class="*:min-h-dvh">
			<slot></slot>
		</div>
	</LayoutResizer>
</div>

<!-- <script lang="ts">
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	let navItems: NavItem[] = [
		{ id: 1, title: 'หน้าแรก',	 link: '/admin' },
		{ id: 5, title: 'admin', link: '/admin' },
		{ id: 6, title: 'Log', link: '/admin-log' },
		{id : 7 , title: 'admindashbord' , link: '/admin-dashbord'},
		{id : 8 , title : 'admin-manage-package ,' , link: '/admin-manage-package'},
		{id : 9 , title: 'adminupdate' , link: '/admin-update'},
	];

</script>
<div class=" container mx-auto">
	<div>
		<Navbar {navItems} />
		<Separator />
		<div class="min-h-dvh">
			<slot></slot>
		
		</div>
	</div>
</div> -->
