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
    const validItems = [];
    if (Object.values(cookies).some(cookieValue => cookieValue.includes('DASHBOARD'))) {
      validItems.push({ id: 1, title: 'แดชบอร์ด', link: '/dashboard' });
    }
    // ตรวจสอบว่าคุกกี้มีคำว่า 'PACKAGE'
    if (Object.values(cookies).some(cookieValue => cookieValue.includes('PACKAGE'))) {
      validItems.push({ id: 2, title: 'แพ็คเกจ', link: '/package' });
    }
	
	if (Object.values(cookies).some(cookieValue => cookieValue.includes('-/All/-'))) {
      validItems.push({ id: 1, title: 'แดชบอร์ด', link: '/dashboard' });
	  validItems.push({ id: 2, title: 'แพ็คเกจ', link: '/package' });
    }

    return validItems; // ส่งเฉพาะรายการที่ตรงเงื่อนไข
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