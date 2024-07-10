<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Icon from '@iconify/svelte';

	const items = [
		{
			title: 'Item 1',
			description: 'This is the first item',
			imageUrl: 'path/to/image1.jpg',
			price: '100',
			package: 'BASIC'
		},
		{
			title: 'Item 2',
			description: 'This is the second item',
			imageUrl: 'path/to/image2.jpg',
			price: '200',
			package: 'PRO'
		},
		{
			title: 'Item 3',
			description: 'This is the third item',
			imageUrl: 'path/to/image3.jpg',
			price: '400',
			package: 'ADVANCE'
		},
		{
			title: 'Item 4',
			description: 'This is the fourth item',
			imageUrl: 'path/to/image4.jpg',
			price: '800',
			package: 'PREMIUM'
		},
		{
			title: 'Item 5',
			description: 'This is the fifth item',
			imageUrl: 'path/to/image5.jpg',
			price: '1600',
			package: 'PLUS'
		}
	];
</script>

<div class="flex justify-center ... text-4xl font-sans ... font-bold ...">
	<h1>CHOOSE YOUR PACKAGE</h1>
</div>
<div class="flex justify-center ... pt-6">
	<div class=" bg-blue-700 w-3/5 rounded-lg ..." style="color: blue;">I</div>
</div>

<div class="flex justify-center ... pt-10">
	<div class="w-3/5">
		<Carousel.Root class="w-full max-w-6xl">
			<Carousel.Content class="-ml-1">
				{#each items as item}
					<Carousel.Item class="pl-1 md:basis-1/2 lg:basis-1/3">
						<div class="p-1">
							<Card.Root>
								<Card.Content
									class="aspect-square items-center justify-center p-6 bg-blue-300 rounded-md"
								>
									<div class="text-2xl font-semibold">{item.package} Package</div>
									<div class="text-6xl font-semibold" style="display: flex;">
										{item.price}
										<Icon icon="tabler:currency-bath" style="margin-top: 5px" />
									</div>
									<br />
									<div class="text-1xl font-semibold">{item.title}</div>
									<div class="text-1xl font-semibold">{item.description}</div>
								</Card.Content>
							</Card.Root>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</div>
</div>
