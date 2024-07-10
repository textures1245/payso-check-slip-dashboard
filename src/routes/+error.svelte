<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.error?.message}
	<div class="">
		<div class="h-screen flex flex-col justify-center items-center">
			<h1 class="text-8xl font-bold text-gray-800">{505}</h1>
			<p class="text-4xl font-medium text-gray-800">Internal Server Error</p>
			<a href="/" class="mt-4 text-xl text-blue-600 hover:underline">{$page.error.message}</a>
		</div>
	</div>
{/if}
