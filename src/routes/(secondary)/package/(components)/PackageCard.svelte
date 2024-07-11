<script context="module" lang="ts">
	export type PackageCardProp = {
		title: string;
		description: string;
		price: number;
		features: {
			include: boolean;
			detail: string;
		}[];
	};
</script>

<script lang="ts">
	import Check from 'svelte-radix/Check.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';

	export let pkg: PackageCardProp;
</script>

<Card.Root class="space-y-8 w-[380px]">
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
		<Button size="lg" class="w-full">
			<Check class="mr-2 h-4 w-4" /> PURCHASE
		</Button>
	</Card.Footer>
</Card.Root>
