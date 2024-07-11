<script lang="ts">
	import PackageCard from './(components)/PackageCard.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Icon from '@iconify/svelte';

	const packages = [
		{
			title: 'Starter',
			description: 'For small teams',
			price: 19,
			features: [
				{ include: true, detail: 'Unlimited projects' },
				{ include: true, detail: 'Unlimited storage' },
				{ include: false, detail: 'Unlimited users' },
				{ include: false, detail: 'Unlimited bandwidth' }
			]
		},
		{
			title: 'Pro',
			description: 'For medium teams',
			price: 49,
			features: [
				{ include: true, detail: 'Unlimited projects' },
				{ include: true, detail: 'Unlimited storage' },
				{ include: true, detail: 'Unlimited users' },
				{ include: false, detail: 'Unlimited bandwidth' }
			]
		},
		{
			title: 'Enterprise',
			description: 'For large teams',
			price: 99,
			features: [
				{ include: true, detail: 'Unlimited projects' },
				{ include: true, detail: 'Unlimited storage' },
				{ include: true, detail: 'Unlimited users' },
				{ include: true, detail: 'Unlimited bandwidth' }
			]
		}
	];
</script>

<div class="h-dvh bg-primary-foreground space-y-8 grid place-items-center">
	<div class="flex justify-center text-4xl mt-8 font-sans font-bold">
		<h1 class="drop-shadow-lg text-pretty text-primary">CHOOSE YOUR PACKAGE</h1>
	</div>
	<div class="flex bg-primary-foreground gap-4 flex-wrap justify-center">
		{#each packages as pkg}
			<div class="p-1 transition-transform hover:scale-105 drop-shadow-lg">
				<PackageCard {pkg} />
			</div>
		{/each}
		<!-- <Carousel.Root class="w-full">
				<Carousel.Content class="-ml-1">
					{#each packages as pkg}
						<Carousel.Item class="pl-1 basis-0 lg:basis-1/3">
							<div class="p-1">
								<PackageCard {pkg} />
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root> -->
	</div>
</div>
