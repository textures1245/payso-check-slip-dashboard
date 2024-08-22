<script lang="ts">
	import { type MerchantTransactionDetail } from '../(mockdata)/data';
	export let props: MerchantTransactionDetail[] = [];
</script>

<div class="space-y-2">
	{#each props as t}
		<div class="flex flex-col md:flex-row md:justify-between text-xs md:text-sm md:items-center">
			<div class="ml-2 space-y-1">
				<!-- <img
					class="h-9 w-9 rounded-full"
					src="https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?t=st=1723522890~exp=1723523490~hmac=3f2c625a3a40926c9453d6b1869af89feabf16f09b4c4121c31a987dae308428"
				/> -->
				<p class="leading-none">ลูกค้า: {t.MerchantName}</p>
				<p class="leading-none">หมายเลขรายการ: {t.TransactionId}</p>
				<p class="text-muted-foreground text-sm">{t.VerifiedDate}</p>
			</div>
			<div class="flex gap-2 items-end flex-col">
				<div
					class:text-success={t.Status.toLocaleUpperCase() === 'SUCCESS'}
					class:text-warning={t.Status.toLocaleUpperCase() === 'PENDING'}
					class:text-destructive={t.Status.toLocaleUpperCase() === 'FAILED' ||
						t.Status.toLocaleUpperCase() === 'REJECTED'}
					class="ml-auto font-medium badge badge-sm badge-ghost uppercase"
				>
					{t.Status}
				</div>
				<div class="badge badge-sm badge-ghost">
					{t.StatusCode}
				</div>
			</div>
		</div>
		<div class="divider last:hidden my-2"></div>
	{/each}
</div>
