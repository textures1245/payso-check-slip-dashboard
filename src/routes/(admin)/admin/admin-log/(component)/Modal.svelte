<!-- Modal.svelte -->
<script lang="ts">
  export let index: number;
</script>

<input type="checkbox" id={`logDataModel-${index}`} class="modal-toggle" />
<div class="modal" role="dialog">
	<div class="modal-box text-start">
		<slot/>
		
	</div>
	<label class="modal-backdrop" for={`logDataModel-${index}`}></label>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.modal-content {
		background: white;
		padding: 1em;
		border-radius: 5px;
		position: relative;
	}
</style>
