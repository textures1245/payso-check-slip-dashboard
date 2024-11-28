<script lang="ts">
	import '/src/app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { Dashboard } from 'svelte-radix';
	import { onMount } from 'svelte';
	import cookie from 'cookie';
	function getCookies() {
    return cookie.parse(document.cookie);
  }

  // ฟังก์ชันสำหรับกรองรายการตาม Roles
  function filterNavItems(cookies: { [s: string]: unknown; } | ArrayLike<unknown>) {
    const validItems: { id: any; title?: string; link?: string; }[] = [];
    const addItem = (item: { id: any; title?: string; link?: string; }) => {
        if (!validItems.some(existingItem => existingItem.id === item.id)) {
            validItems.push(item);
        }
    };
    if (Object.values(cookies).some(cookieValue => typeof cookieValue === 'string' && cookieValue.includes('DASHBOARD'))) {
        addItem({ id: 1, title: 'แดชบอร์ด', link: '/dashboard' });
        addItem({ id: 3, title: 'จัดการบัญชี', link: '/bank' });
        addItem({ id: 4, title: 'จัดการห้อง', link: '/detailroom' });
    }

    if (Object.values(cookies).some(cookieValue => typeof cookieValue === 'string' && cookieValue.includes('PACKAGE'))) {
        addItem({ id: 2, title: 'แพ็คเกจ', link: '/package' });
        addItem({ id: 3, title: 'จัดการบัญชี', link: '/bank' });
        addItem({ id: 4, title: 'จัดการห้อง', link: '/detailroom' });
    }

    if (Object.values(cookies).some(cookieValue => typeof cookieValue === 'string' && cookieValue.includes('-/All/-'))) {
        addItem({ id: 1, title: 'แดชบอร์ด', link: '/dashboard' });
        addItem({ id: 2, title: 'แพ็คเกจ', link: '/package' });
        addItem({ id: 3, title: 'จัดการบัญชี', link: '/bank' });
        addItem({ id: 4, title: 'จัดการห้อง', link: '/detailroom' });
    }

    return validItems.sort((a, b) => a.id - b.id); // ส่งเฉพาะรายการที่ตรงเงื่อนไข
  }
  let navItems: { id: number; title: string; link: string; }[] = [];
  onMount(() => {
    const cookies = getCookies();
    navItems = filterNavItems(cookies); // กรองรายการ navItems
    console.log('Filtered Nav Items:', navItems); // ดีบักข้อมูล
  });

	
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