<script context="module" lang="ts">
	export type PackageCardProp = {
		name: string;
		price: number;
		quotalimit: number;
		color: string;
		index: number;
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
		window.location.assign("/payment")
	}


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
  
  
<Card.Root class="relative w-100 rounded-xl overflow-hidden text-center  shadow-none" style="height:100%">
	
	<Card.Header class={'rounded-t-xl relative overflow-hidden '} style="height:80px;background-color:#D0D4DA">
		
		<div class="flex justify-center">
			<div class="text-3xl font-bold uppercase w-72 truncate ">{pkg.Name}</div>
		</div>
	</Card.Header>

	<Card.Content class="px-4 py-2 z-0">
		<div class="gap-1 text-3xl text-center py-4">
			<p class=" font-bold leading-none text-6xl " >{pkg.Price.toFixed(2)}</p>
			<p class="text-sm text-neutral-500">THB</p>
		</div>
		<div class="gap-1 text-3xl text-center py-4">
			<div class="font-medium leading-none">{pkg.QuotaLimit}</div>
			<p class="text-sm text-neutral-500">Requests</p>
		</div>

		<small class="justify-center text-md items-center py-4 text-neutral-500">
			Average price {(pkg.Price/pkg.QuotaLimit).toFixed(2)} baht per request
		</small>

	</Card.Content>

	<Card.Footer>
		{#if index+1 == maxIndex}
		<Button size="lg"  class="w-full  bg-primary text-white" on:click={() => sendData(pkg.Price.toFixed(2),pkg.Name,pkg.Id)} >
			<Check class="me-2 h-4 w-4" /> BUY NOW
		</Button>
		{:else}
		<Button size="lg" variant="outline " class="w-full bg-primary text-white" on:click={() => sendData(pkg.Price.toFixed(2),pkg.Name,pkg.Id)} >
			<Check class="me-2 h-4 w-4" /> BUY NOW
		</Button>
	{/if}
		
	</Card.Footer>
	{#if index+1 == maxIndex}
		<div
			class="absolute top-3 right-0 -mr-14 mt-4 transform rotate-45 text-white py-1 px-16 text-sm font-semibold" style="background-color: #FFBE00;color:
#0031E5"
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
