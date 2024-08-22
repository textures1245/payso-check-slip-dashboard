<script lang="ts">
	import type { MerchantPKG } from '$lib/utils/external-api-type/merchant';

	export let props: MerchantPKG[] = [];
</script>

<div>
	{#each props as t}
		<div class="flex flex-col md:flex-row md:justify-between text-xs md:text-sm md:items-center">
			<div class="ml-2">
				<img
					class="h-9 w-9 rounded-full"
					src="https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?t=st=1723522890~exp=1723523490~hmac=3f2c625a3a40926c9453d6b1869af89feabf16f09b4c4121c31a987dae308428"
				/>
				
				<p class="leading-none">{t.MerchantName}</p>
				<p class="text-muted-foreground badge badge-outline badge-sm text-xs">{t.PackageName}</p>
			</div>
			<div class="ml-auto badge badge-ghost text-primary font-medium">{t.QuotaSpending}</div>
		</div>
		<div class="divider last:hidden my-2"></div>
	{/each}
</div>
