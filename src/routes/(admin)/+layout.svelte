<script lang="ts">
	import type { Route } from './../(layouts)/routes';
	import { accounts, mails } from '../(layouts)/data';

	import LayoutResizer from '../(layouts)/LayoutResizer.svelte';
	import '../../app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';

	// let navItems: NavItem[] = [
	// 	{ id: 1, title: 'หน้าแรก',	 link: '/admin' },
	// 	{ id: 5, title: 'admin', link: '/admin' },
	// 	{ id: 6, title: 'Log', link: '/admin-log' },
	// 	{id : 7 , title: 'admindashbord' , link: '/admin-dashbord'},
	// 	{id : 8 , title : 'admin-manage-package ,' , link: '/admin-manage-package'},
	// 	{id : 9 , title: 'adminupdate' , link: '/admin-update'},
	// ];

	let subPaths: {
		[key: string]: Route[];
	} = {
		admin: [
			
			{
				title: 'แดชบอร์ด',
				link: '/admin/admin-dashboard',
				icon: 'hugeicons:home-04',
			},
			{
				title: 'รายชื่อผู้ใช้',
				link: '/admin/admin-list',
				icon: 'carbon:user-multiple',
			},
			{
				title: 'จัดการแพ็คเก็จ',
				link: '/admin/admin-manage-package',
				icon: 'fluent:box-24-regular',
			},
			{
				title: 'บันทึก',
				link: '/admin/admin-log',
				icon: 'mage:file-3',
			},
			{
				title: 'รายงานธุรกรรม',
				link: '/admin/admin-report-transection',
				icon: 'icon-park-outline:transaction',
			},
		]
	};
</script>

<div>
	<Navbar/>
	<Separator />
	<LayoutResizer {accounts} subLinks={subPaths} navCollapsedSize={3}>
		<div class="py-4 bg-primary-foreground min-h-dvh">
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
