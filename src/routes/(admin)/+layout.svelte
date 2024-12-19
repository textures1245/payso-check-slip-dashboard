<script lang="ts">
	import type { Route } from './../(layouts)/routes';
	import { accounts, mails } from '../(layouts)/data';

	import LayoutResizer from '../(layouts)/LayoutResizer.svelte';
	import '../../app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';

	let navItems: NavItem[] = [
		{ id: 1, title: 'แดชบอร์ด',	 link: '/admin/admin-dashboard' },
		{ id: 5, title: 'รายชื่อผู้ใช้', link: '/admin/admin-list' },
		{ id: 6, title: 'จัดการแพ็คเก็จ', link: '/admin/admin-manage-package' },
		{id : 7 , title: 'บันทึก' , link: '/admin/admin-log'},
		{id : 8 , title : 'รายงานธุรกรรม' , link: '/admin/admin-report-transection'},
		{id : 9 , title: 'รายงานห้องของลูกค้า' , link: '/admin/admin-report-roommerchant'},
	];

	

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
			{
				title: 'รายงานห้องของลูกค้า',
				link: '/admin/admin-report-roommerchant',
				icon: 'streamline:group-meeting-call',
			},
		]
	};
</script>

<div>
	<div class ="block lg:hidden md:hidden xl:hidden sm:hidden">
		<Navbar {navItems} />
	</div>
	<div  class="hidden lg:block md:block sm:block xl:block">
		<Navbar />
	</div>
	

	<Separator />
	<LayoutResizer {accounts} subLinks={subPaths} navCollapsedSize={3}>
		<div class="py-4 bg-primary-foreground min-h-dvh">
			<slot></slot>
		</div>
	</LayoutResizer>
</div>

