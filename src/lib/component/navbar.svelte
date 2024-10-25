<script context="module" lang="ts">
	export type NavItem = {
		id: number;
		title: string;
		link: string;
	};
</script>

<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import cookie from 'cookie';
	import logo from '$lib/image/paysologo.png';
	import logoAdmin from '$lib/image/user.png';
	import logoCustomer from '$lib/image/logoshop.png';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let Username ="";
	export let navItems: NavItem[] = [];
	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	let merchantName="";
	let adminName="";
	let displayName = '';
	let isAdminPath: boolean;
// ฟังก์ชันสำหรับดึงข้อมูลจากคุกกี้
function getCookies() {
  return cookie.parse(document.cookie);
}

onMount(() => {
	console.log(navItems)
    const cookies = getCookies();
	const cookieData = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
	merchantName = cookieData?.MerchantName ?? null;

	const adminData = cookies['admin_account'] ? JSON.parse(cookies['admin_account']) : null;
    adminName = adminData?.MerchantName ?? null;
	$page.url.pathname.includes('admin') 
      ? displayName = adminName 
      : displayName = merchantName;
    console.log('Merchant Name:', merchantName);
		isAdminPath = window.location.pathname.includes('/admin');
		
  });
 

  function deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  }

  // ฟังก์ชันสำหรับการลบคุกกี้
  function handleLogout() {
    deleteCookie('merchant_account');
    deleteCookie('admin_account');
	if(isAdminPath){
		window.location.assign("/login-admin")
	}else{
		window.location.assign("/")
	}
	
    // ทำการรีเฟรชหรือรีไดเร็กไปที่หน้าอื่นหลังจากลบคุกกี้
  }

  
</script>


<nav class="bg-card"  style="background-color:#1353ec;">

	<div class=" px-2">
		<div class="relative flex h-11 items-center justify-between">
			<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
				<!-- Mobile menu button-->
				<button
					type="button"
					class="relative inline-flex items-center justify-center rounded-md p-2 bg-black text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
					aria-controls="mobile-menu"
					aria-expanded="false"
					on:click={toggleMenu}
				>
					<span class="absolute -inset-0.5"></span>
					<span class="sr-only">Open main menu</span>
					<!--
              Icon when menu is closed.
  
              Menu open: "hidden", Menu closed: "block"
            -->
					<svg
						class="block h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
					<!--
              Icon when menu is open.
  
              Menu open: "block", Menu closed: "hidden"
            -->
					<svg
						class="hidden h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
				<div class="flex flex-shrink-0  items-center">
					<img class="h-10 w-auto py-2" src={logo} alt="Your Company" />
				</div>
				<div class="hidden gap-6 items-end py-2 px-5 sm:ml-6 sm:flex text-card-foreground text-white ">
					{#each navItems as item}
						<a
							class="text-xs md:text-sm  transition-colors hover:text-neutral-300 content-end "
							href={item.link}>{item.title}</a
						>
					{/each}
				</div>
			</div>
			<div class="flex  justify-end"><div class="avatar lg:block md:block sm:block hidden">
				<div class="w-12 content-center p-2">
					<div class="bg-[#DBE8FF] rounded-full content-center   min-h-8 min-w-8 flex flex-col justify-center items-center ">
						{#if !isAdminPath}<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" {...$$props}>
							<g fill="none" stroke="#1353EC">
								<path stroke-linecap="round" stroke-linejoin="round" d="M14.5 21v-5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v5" />
								<path d="M5 11v6c0 1.886 0 2.828.586 3.414S7.114 21 9 21h6c1.886 0 2.828 0 3.414-.586S19 18.886 19 17v-6M4.621 4.515c.182-.728.273-1.091.544-1.303C5.437 3 5.812 3 6.562 3h10.876c.75 0 1.125 0 1.397.212c.27.212.362.575.544 1.303l1.203 4.814c.097.388.146.581.135.739a1 1 0 0 1-.69.883c-.15.049-.354.049-.763.049c-.533 0-.8 0-1.023-.052a2 2 0 0 1-1.393-1.18c-.089-.212-.132-.47-.217-.983c-.024-.144-.036-.216-.05-.235a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489l-.018.1A2 2 0 0 1 14.352 11h-.204a2 2 0 0 1-1.936-1.726l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489l-.018.1A2 2 0 0 1 9.852 11h-.204A2 2 0 0 1 7.73 9.374l-.018-.1l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235c-.085.514-.128.77-.217.983a2 2 0 0 1-1.392 1.18C5.536 11 5.27 11 4.736 11c-.409 0-.613 0-.763-.049a1 1 0 0 1-.69-.883c-.01-.158.038-.351.135-.739z" />
							</g>
						</svg>{:else}<img src={logoAdmin} class="p-2" />{/if}</div>
				</div>
			  </div>
			  <div class="mx-3 text-white content-center">{displayName}</div>
			  <div class="relative ">
				<div class="dropdown dropdown-bottom dropdown-end lg:block md:block sm:block hidden mx-2 my-2">
				  <summary tabindex="0" class="text-sm  py-2 rounded-2xl  ">
					
				  </summary>
				  <ul tabindex="0"  class="menu dropdown-content bg-white rounded-2xl z-[1] w-32 p-2 shadow-lg text-sm border border-gray-300 mt-1 ">
					{#if !isAdminPath}<li><a class="py-2 px-4 hover:bg-gray-100 rounded" href="/profile"><button  >โปรไฟล์</button></a></li>{/if}
					<li><a class="py-2 px-4 hover:bg-gray-100 rounded  whitespace-nowrap"><button on:click={handleLogout} style="color:#F04438;">ออกจากระบบ</button></a></li>
				  </ul>
				</div>
			  </div>
			  
			</div>
			<!-- <div
				class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
			>
				<button
					type="button"
					class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
				>
					<span class="absolute -inset-1.5"></span>
					<span class="sr-only">View notifications</span>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
						/>
					</svg>
				</button>

				<div class="relative ml-3">
					<div>
						<button
							type="button"
							class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
							id="user-menu-button"
							aria-expanded="false"
							aria-haspopup="true"
						>
							<span class="absolute -inset-1.5"></span>
							<span class="sr-only">Open user menu</span>
							<img
								class="h-8 w-8 rounded-full"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
						</button>
					</div>
				</div>
			</div> -->
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	{#if isMenuOpen}
		<div class="sm:hidden" id="mobile-menu">
			<div class="space-y-1 px-2 pb-3 pt-2">
				<ul class=" text-white">
					{#each navItems as item}
						<li>
							<a  href={item.link}>{item.title}</a>
						</li>
					{/each}
					{#if !isAdminPath}<li><a class=" hover:bg-gray-100 rounded" href="/profile"><button>โปรไฟล์</button></a></li>{/if}
					<button on:click={handleLogout} style="color:#F04438;">ออกจากระบบ</button>
				</ul>
			</div>
		</div>
	{/if}
</nav>


<style scoped>
    .dropdown summary {
  list-style: none;
  outline: none;
  cursor: pointer;
  position: relative;
  padding-right: 1.5rem; /* ให้พื้นที่สำหรับลูกศร */
}

.dropdown summary::after {
  content: '\25BC'; /* Unicode สำหรับลูกศรชี้ลง */
  position: absolute;
  right: 0.5rem;
  font-size: 0.75rem; /* ขนาดของลูกศร */
  color: white; /* เปลี่ยนสีลูกศรเป็นสีขาว */
  transition: color 0.2s ease; /* เพิ่มการเปลี่ยนแปลงของสี */
}

.dropdown[open] summary::after {
  content: '\25BC'; /* ลูกศรชี้ลงคงที่ (ไม่หมุน) */
}

  </style>