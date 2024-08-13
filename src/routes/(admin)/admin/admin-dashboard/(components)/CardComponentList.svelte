<script lang="ts">
</script>

<div class="space-y-2">
	{#each new Array(6) as item}
		<div class="flex flex-col md:flex-row md:justify-between text-sm md:text-base md:items-center">
			<div class="ml-2 space-y-1">
				<img
					class="h-9 w-9 rounded-full"
					src="https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?t=st=1723522890~exp=1723523490~hmac=3f2c625a3a40926c9453d6b1869af89feabf16f09b4c4121c31a987dae308428"
				/>
				<p class="leading-none">Olivia Martin</p>
				<p class="text-muted-foreground text-sm">olivia.martin@email.com</p>
			</div>
			<div class="ml-auto font-medium">+$1,999.00</div>
		</div>
	{/each}
</div>
