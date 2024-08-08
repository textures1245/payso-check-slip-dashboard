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
	
	function sendData(param1: string) {
		console.log(param1); // Replace with your actual URL
		sessionStorage.setItem('package', param1);
	}

	const colors = [
    { color: 'bg-gradient-to-r from-red-600 via-red-200 to-red-500' },
    { color: 'bg-gradient-to-r from-green-600 via-green-200 to-green-500' },
    { color: 'bg-gradient-to-r from-blue-600 via-blue-200 to-blue-500' },
    { color: 'bg-gradient-to-r from-purple-600 via-purple-200 to-purple-500' },
    { color: 'bg-gradient-to-r from-pink-600 via-pink-200 to-pink-500' },
    { color: 'bg-gradient-to-r from-indigo-600 via-indigo-200 to-indigo-500' },
    { color: 'bg-gradient-to-r from-teal-600 via-teal-200 to-teal-500' },
    { color: 'bg-gradient-to-r from-orange-600 via-orange-200 to-orange-500' },
    { color: 'bg-gradient-to-r from-cyan-600 via-cyan-200 to-cyan-500' },
    { color: 'bg-gradient-to-r from-gray-600 via-gray-200 to-gray-500' },
    { color: 'bg-gradient-to-r from-lime-600 via-lime-200 to-lime-500' },
    { color: 'bg-gradient-to-r from-amber-600 via-amber-200 to-amber-500' },
    { color: 'bg-gradient-to-r from-teal-800 via-teal-400 to-teal-600' }
];
function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex].color;
}


let randomColor = getRandomColor();
console.log("color",randomColor);
console.log("pkg",maxIndex );

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
  
  
<Card.Root class="relative w-100 rounded-xl overflow-hidden text-center " style="height:100%">
	{#if pkg.Name == 'Silver'}
	<Card.Header class={'rounded-t-xl relative overflow-hidden bg-gradient-to-r from-zinc-500 via-zinc-100 to-zinc-400'}>
		
		<div class="flex justify-center">
			<div class="text-3xl font-bold uppercase">{pkg.Name}</div>
		</div>
	</Card.Header>
	{:else if pkg.Name == 'Bronz'}
	<Card.Header class={'rounded-t-xl relative overflow-hidden bg-gradient-to-r from-amber-800 via-amber-400 to-amber-600' }>
		
		<div class="flex justify-center">
			<div class="text-3xl font-bold uppercase">{pkg.Name}</div>
		</div>
	</Card.Header>
	{:else if pkg.Name == 'Gold'}
	<Card.Header class={'rounded-t-xl relative overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-500' }>
		
		<div class="flex justify-center">
			<div class="text-3xl font-bold uppercase">{pkg.Name}</div>
		</div>
	</Card.Header>
	{:else}
	<Card.Header class={'rounded-t-xl relative overflow-hidden ' + randomColor}>
		
		<div class="flex justify-center">
			<div class="text-3xl font-bold uppercase">{pkg.Name}</div>
		</div>
	</Card.Header>
	{/if}
	<Card.Content class="px-4 py-2 z-0">
		<div class="gap-1 text-3xl text-center py-4">
			<p class="font-medium leading-none text-6xl">{pkg.Price}</p>
			<p class="text-sm">THB/month</p>
		</div>
		<div class="gap-1 text-3xl text-center py-4">
			<div class="font-medium leading-none">{pkg.QuotaLimit}</div>
			<p class="text-sm">Requests</p>
		</div>

		<small class="justify-center text-md items-center py-4">
			This package can send request {pkg.QuotaLimit} times/month
		</small>
	</Card.Content>

	<Card.Footer>
		{#if index+1 == maxIndex}
		<Button size="lg" class="w-full" on:click={() => sendData(pkg.Name)}>
			<Check class="me-2 h-4 w-4" /> PURCHASE
		</Button>
		{:else}
		<Button size="lg" variant="outline" class="w-full" on:click={() => sendData(pkg.Name)}>
			<Check class="me-2 h-4 w-4" /> PURCHASE
		</Button>
	{/if}
		
	</Card.Footer>
	{#if index+1 == maxIndex}
		<div
			class="absolute top-3 right-0 -mr-14 mt-4 transform rotate-45 bg-red-500 text-white py-1 px-16 text-sm font-semibold"
		>
			Best Seller
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
