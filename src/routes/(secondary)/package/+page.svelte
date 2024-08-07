<script lang="ts">
	import PackageCard from './(components)/PackageCard.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Icon from '@iconify/svelte';
	import { Colors } from 'chart.js';

	const packages = [
		{
			name: 'bronz',
			price: 45,
			quotalimit: 100,
			color: 'bg-gradient-to-r from-amber-800 via-amber-400 to-amber-600',
			index: 5
		},
		{
			name: 'silver',
			price: 80,
			quotalimit: 200,
			color: 'bg-gradient-to-r from-zinc-500 via-zinc-100 to-zinc-400',
			index: 6
		},
		{
			name: 'gold',
			price: 150,
			quotalimit: 400,
			color: 'bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-500',
			index: 4
		}
	];

	let maxIndex = Math.max(...packages.map(pkg => pkg.index));
	
</script>

<div class="h-dvh lg:overflow-y-hidden">
	<div class="sm:text-center flex justify-center text-4xl my-8 font-sans font-bold">
		<h1 class="drop-shadow-lg text-wrap text-primary text-center">CHOOSE YOUR PACKAGE</h1>
	</div>
	<div class="flex bg-primary-foreground gap-4 flex-wrap justify-center">
		{#each packages as pkg}
			<div class="p-1 transition-transform hover:scale-105 drop-shadow-lg">
				<PackageCard pkg={pkg} maxIndex={maxIndex} />
			</div>
		{/each}
	</div>
</div>
