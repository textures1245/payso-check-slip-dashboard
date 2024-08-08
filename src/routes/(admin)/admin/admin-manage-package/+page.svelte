<script>
	function showModalEdit() {
		
		const modal = document.getElementById('edit_modal');
		// @ts-ignore
		modal.showModal();
	}
	function showModalCreate() {
		
		const modal = document.getElementById('create_modal');
		// @ts-ignore
		modal.showModal();
	}


</script>




<div
	class="w-full py-4"
	style="margin: 20px; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;"
>
	<div style="margin-bottom: 30px; display: flex;">
		<input
			type="text"
			placeholder="Package Id or Package Name"
			class="input input-bordered w-full max-w-xs"
			style="background-color: aliceblue;"
			maxlength="100"
		/>
		<button class="btn btn-outline btn-primary" style="margin-left: 20px;">Search</button>
		<button class="btn btn-outline btn-primary" style="margin-left: 20px;">Clear</button>
		<div><button class="btn btn-outline btn-primary flex justify-items-end" on:click={showModalCreate}>Create Package</button></div>
		
		
	</div>
	<div></div>
	<div class="overflow-x-auto">
		<table class="table font-sans">
			<thead
				class="  text-center bg-primary text-white"
				style="font-size:medium; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;"
			>
				<tr>
					<th>Id</th>
					<th >Name</th>
					<th >Price</th>
					<th >QuotaLimit</th>
					<th >Status</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody
				class=" text-center"
				style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size:medium; width:40px"
			>
				<tr>
					<th>1</th>
					<td>Silver</td>
					<td>500.0000</td>
					<td>100</td>
					<td>
						<div class="flex justify-center">
							<div
								style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;"
							>
								active
							</div>
						</div>
					</td>
					<td>
						<button class="btn-sm btn-outline" on:click={showModalEdit}>
							<svg
								class="w-6 h-6 text-gray-800 dark:text-white"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
								/>
							</svg>
						</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="w-100 flex justify-end mx-10">
			<div class="join grid grid-cols-2 w-40">
				<button class="join-item btn btn-outline btn-primary">Previous page</button>
				<button class="join-item btn btn-outline btn-primary">Next</button>
			</div>
		</div>
	</div>
</div>

<dialog id="edit_modal" class="modal">
	<div class="modal-box bg-white">
		<div class="form-control">
			<div
				style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size:30px"
			>
				Edit
			</div>

			<label class="label">
				<span class="label-text text-black">Package Name:</span>
				<input
					type="text"
					class="input input-bordered bg-white "
					
				/>
			</label>
			<label class="label">
				<span class="label-text text-black">Price:</span>
				<input type="text" class="input input-bordered bg-white" />
			</label>
			<label class="label">
				<span class="label-text text-black">QuotaLimit:</span>
				<input type="number" class="input input-bordered bg-white" />
			</label>
			<label class="label cursor-pointer bg-white flex justify-start gap-8">
				<span class="label-text text-black mr-2">Status</span>
				<input type="checkbox" class="toggle [--tglbg:white] toggle-success" />
			</label>

			<div class="modal-action">
				<form method="dialog">
					<button class="btn btn-outline btn-primary">Close</button>
				</form>
				<button class="btn btn-outline btn-primary">Save</button>
			</div>
		</div>
	</div>
</dialog> 


<dialog id="create_modal" class="modal">
	<div class="modal-box bg-white">
		<div class="form-control">
			<div
				style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size:30px"
			>
				Create
			</div>

			<label class="label">
				<span class="label-text text-black">Package Name:</span>
				<input
					type="text"
					class="input input-bordered bg-white "
					
				/>
			</label>
			<label class="label">
				<span class="label-text text-black">Price:</span>
				<input type="text" class="input input-bordered bg-white" />
			</label>
			<label class="label">
				<span class="label-text text-black">QuotaLimit:</span>
				<input type="number" class="input input-bordered bg-white" />
			</label>
			<label class="label cursor-pointer bg-white flex justify-start gap-8">
				<span class="label-text text-black mr-2">Status</span>
				<input type="checkbox" class="toggle [--tglbg:white] toggle-success" />
			</label>

			<div class="modal-action">
				<form method="dialog">
					<button class="btn btn-outline btn-primary">Close</button>
				</form>
				<button class="btn btn-outline btn-primary">Save</button>
			</div>
		</div>
	</div>
</dialog>

<style>
	.badge-success {
		background-color: green;
		color: white;
		border-radius: 10px;
		width: 60%;
	}
	.badge-danger {
		background-color: red;
		color: white;
		border-radius: 10px;
		width: 60%;
	}
</style>
