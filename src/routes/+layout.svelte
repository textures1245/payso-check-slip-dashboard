<script lang="ts">
	import '../app.postcss';

	import { beforeNavigate, afterNavigate } from '$app/navigation';

	let loading = false;

	beforeNavigate((nav) => {
		loading = true;
	});
	afterNavigate(() => {
		loading = false;
	});
</script>



<div>
	{#if !loading}
						<slot></slot>
					{:else}
					<div class="absolute inset-0 flex items-center justify-center z-50">
						<div class="loading loading-spinner loading-lg text-black"></div>
					</div>
					
					
					{/if}

</div>
