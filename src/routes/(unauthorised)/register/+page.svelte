<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="grid grid-cols-3 h-full">
	<div class="col-span-2">

	</div>
	<div class="col-span-1 w-full h-full pl-4 place-self-center">
		<Card.Root class="h-full">
			<Card.Header>
				<Card.Title>Create project</Card.Title>
				<Card.Description>Deploy your new project in one-click.</Card.Description>
			</Card.Header>
			<Card.Content>
				<form>
					<div class="grid w-full items-center gap-4">
						<div class="flex flex-col space-y-1.5">
							<Label for="name">Name</Label>
							<Input id="name" placeholder="Name of your project" />
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="framework">Framework</Label>
						</div>
					</div>
				</form>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Deploy</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</div>

<!-- <div style="display: flex; justify-content :center">
	<div>
		<img
			style=" height:810px "
			src="https://img.freepik.com/free-photo/artistic-blurry-colorful-wallpaper-background_58702-9999.jpg"
			alt=""
		/>
	</div>
	<div style="width: 500px;">
		<form>
			<div class="space-y-12">
			
			</div>
		</form>
	</div>
</div> -->

<style>
</style>
