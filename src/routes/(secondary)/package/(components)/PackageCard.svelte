<script context="module" lang="ts">
	export type PackageCardProp = {
		Name: string;
		Price: number;
		QuotaLimit: number;
		color: string;
		index: number;
		AmountLimit: number;
		OrderAmount: number;
		Id:number;
	};
</script>

<script lang="ts">
	import Check from 'svelte-radix/Check.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';

	export let pkg: PackageCardProp, maxIndex: number ,index:number;
	
	function sendData(packagePrice: any,packageName:string,packageId:any) {
		// console.log(param1); // Replace with your actual URL
		sessionStorage.setItem('packageprice', packagePrice);
		sessionStorage.setItem('packagename', packageName);
		sessionStorage.setItem('packageId', packageId);
		localStorage.removeItem('timerCleared');
		window.location.assign("/payment")
	}
	

	// let progressClass = ((pkg.AmountLimit-pkg.OrderAmount)/pkg.AmountLimit)*100 <10 ? 'progress-dark-red' : 'progress-success';
	// let bgClass = ((pkg.AmountLimit-pkg.OrderAmount)/pkg.AmountLimit)*100 <10 ? 'bg-[#FEF3F2]' : 'bg-green-200';
	let textClass = ((pkg.AmountLimit-pkg.OrderAmount)/pkg.AmountLimit)*100 <10 ? 'text-red-600' : 'text-white';
</script>

<!-- <div class="relative max-w-sm rounded overflow-hidden shadow-lg">
	
	<div class="absolute top-0 right-0 -mr-14 mt-4 transform rotate-45 bg-red-500 text-white py-1 px-16 text-sm font-semibold">
	  Best Seller
	</div>
	
	<img class="w-full h-48 object-cover" src="/api/placeholder/400/320" alt="Product image" />
	<div class="px-6 py-4">
	  <div class="font-bold text-xl mb-2">{pkg.name}</div>
	  <p class="text-gray-700 text-base">
		{pkg.price}
	  </p>
	</div>
	<div class="px-6 pt-4 pb-2">
	  <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{pkg.price}</span>
	</div>
  </div> -->
  
  
<Card.Root class="relative w-100 rounded-xl overflow-hidden text-center  shadow-none " style="height:100%">
	
	<Card.Header class={'rounded-t-xl relative overflow-hidden '} style="height:170px;background-color:rgba(234, 236, 240, 0.3);">
		
		<div class="flex justify-center">
			<div class="text-xl font-bold uppercase truncate bg-[#F0F4FF] border-[#CCDEFF] border-2 rounded-3xl px-2" style="color:#113BD4;" title="{pkg.Name}">{pkg.Name}</div>
		</div>
		<div class="gap-1 text-3xl text-center py-4">
			<p class="  font-semibold leading-none text-4xl " >{pkg.Price.toFixed(2).toLocaleString()}</p>
			<p class="text-sm text-black mt-2">บาท / แพ็คเกจ</p>
		</div>
	</Card.Header>

	<Card.Content class="px-4 py-2 z-0">
	
		<div class="gap-1 flex text-3xl text-left py-4">
			<div><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
				<g fill="#146dec" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M12,2c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c5.511,0 10,-4.489 10,-10c0,-5.511 -4.489,-10 -10,-10zM12,4c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8zM16.29297,8.29297l-6.29297,6.29297l-2.29297,-2.29297l-1.41406,1.41406l3.70703,3.70703l7.70703,-7.70703z"></path></g></g>
				</svg></div>
			<div class="text-sm leading-none content-center ml-1">{(pkg.QuotaLimit).toLocaleString()}  สลิป</div>
		</div>
		
		<div class="justify-start flex text-sm  text-start   ">
			<div class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
				<g fill="#146dec" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M12,2c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c5.511,0 10,-4.489 10,-10c0,-5.511 -4.489,-10 -10,-10zM12,4c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8zM16.29297,8.29297l-6.29297,6.29297l-2.29297,-2.29297l-1.41406,1.41406l3.70703,3.70703l7.70703,-7.70703z"></path></g></g>
				</svg></div>
			ราคาเฉลี่ย {(pkg.Price/pkg.QuotaLimit).toFixed(2)} บาท / สลิป
		</div>

	</Card.Content>

	<Card.Footer class="flex-col mt-3 font-semibold " >
		<Button size="lg" variant="outline" class="w-full bg-primary text-white" style="height:50px" on:click={() => sendData(pkg.Price.toFixed(2),pkg.Name,pkg.Id)} >
			ซื้อเลย 
		</Button>

		{#if pkg.AmountLimit != 0 && ((pkg.AmountLimit-pkg.OrderAmount)/pkg.AmountLimit)*100 < 10}
		
		<div class="relative w-full mt-3">
			<!-- Progress bar container -->
			<div class="w-full rounded-full overflow-hidden h-4">
			  <!-- Progress bar fill -->
			  <progress class="progress w-full  " value="{pkg.AmountLimit-pkg.OrderAmount}" max="{pkg.AmountLimit}" style="height: 18px;"></progress>
			  <!-- Progress bar text -->
			  <div class="absolute inset-0 flex items-center justify-center {textClass} font-bold text-xs">
				เหลือเพียง {pkg.AmountLimit-pkg.OrderAmount} แพ็คเกจ
			  </div>
			</div>
		  </div>
		  

		{/if}
		
	
		
	</Card.Footer>
	
	{#if pkg.OrderAmount == maxIndex }
		<div
			class="absolute top-3 right-0 -mr-14 mt-4 transform rotate-45 text-white py-1 px-16 text-xl font-semibold " style="background-color: #F04438;color:
#fffff"
		>
			Popular
		</div>
		
	{/if}
	
	
</Card.Root>



<!-- <Card.Root class="space-y-8 w-[380px] px-4">
	<Card.Header>
		<div class="flex justify-between">
			<div class="">
				<Card.Title class="text-lg md:text-xl">{pkg.title}</Card.Title>
				<Card.Description>{pkg.description}</Card.Description>
			</div>
			<div class="flex gap-1 text-3xl items-center">
				<Icon icon="carbon:currency-baht" class=" text-primary" />
				<div class="flex-1 space-y-1">
					<p class=" font-medium leading-none">{pkg.price}/mo</p>
				</div>
			</div>
		</div>
	</Card.Header>
	<Card.Content class="grid gap-4">
		<div class="divide-y divide-dashed">
			{#each pkg['features'] as feat, idx (idx)}
				<div class=" grid grid-cols-[25px_1fr] items-start py-4 last:mb-0 last:pb-0">
					<Icon
						icon={feat.include
							? 'material-symbols-light:check-circle'
							: 'material-symbols-light:do-not-disturb-off'}
						class={feat.include ? 'text-primary' : 'text-destructive'}
					/>
					<div class="space-y-1">
						<p class="text-sm font-medium leading-none">
							{feat.detail}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</Card.Content>
	<Card.Footer>
		<Button size="lg" class="w-full" on:click={() => sendData(pkg.title)}>
			<Check class="me-2 h-4 w-4"/> PURCHASE
		</Button>
	</Card.Footer>
</Card.Root> -->
<style scoped>
    progress[value] {
        /* ปรับแต่งลักษณะของ progress bar */
        -webkit-appearance: none; /* สำหรับ Safari */
        appearance: none;
        width: 100%;
        height: 18px; /* ความสูง */
    }

    progress[value]::-webkit-progress-bar {
        background-color: #FEF3F2; /* สีพื้นหลัง */
        border-radius: 10px;
    }

    progress[value]::-webkit-progress-value {
        background-color: #FF5733; /* สีของ progress */
        border-radius: 10px;
    }

    progress[value]::-moz-progress-bar {
        background-color: #FF5733; /* สีของ progress สำหรับ Firefox */
    }
</style>