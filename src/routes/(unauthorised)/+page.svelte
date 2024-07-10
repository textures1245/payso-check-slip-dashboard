<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button';
	import bg from '$lib/image/bg-register.jpg';
	import paysoLogo from '$lib/image/paysologo.jpg';
	import * as Select from '$lib/components/ui/select';
	import * as Avatar from '$lib/components/ui/avatar';

	const loginOptions = [
		{ label: 'MerchantID', value: 'merchantID' },
		{ label: 'Taxplayer', value: 'taxplayer' }
	];
	let optSelected: any = 'merchantID';
</script>

<div
	class="bg-gradient-to-tr from-destructive via-primary via-70% to-secondary i grid lg:grid-cols-3 h-full"
>
	<div class=" lg:col-span-2">
		<img class="hidden lg:block object-cover w-full h-full" src={bg} alt="background" />
	</div>
	<div class="col-span-1 backdrop-blur-md w-full h-full px-4 lg:px-0 place-self-center">
		<Card.Root
			class="h-full grid place-items-center shadow-2xl bg-primary-foreground lg:rounded-none rounded-b-none"
		>
			<div class="container space-y-2">
				<Card.Header class="space-y-2">
					<Avatar.Root class="w-14 h-14">
						<Avatar.Image src={paysoLogo} alt="@shadcn" />
						<Avatar.Fallback>PS</Avatar.Fallback>
					</Avatar.Root>
					<Card.Title>เข้าสู่ระบบ</Card.Title>
					<Card.Description>เข้าใช้งานระบบจากบัญชีที่คุณเชื่อมไว้จาก Paysolution</Card.Description>
				</Card.Header>
				<Card.Content>
					<form>
						<div class="grid w-full items-center gap-4">
							<Select.Root
								onSelectedChange={(v) => {
									v && (optSelected = v.value);
								}}
							>
								<Label>เข้าสู่ระบบทาง</Label>
								<Select.Trigger class="w-[180px]">
									<Select.Value placeholder="โปรดเลือก" />
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each loginOptions as l}
											<Select.Item value={l.value} label={l.label}>{l.label}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
								<Select.Input bind:value={optSelected} />
							</Select.Root>
							{#if optSelected === 'merchantID'}
								<div class="flex flex-col space-y-1.5">
									<Label for="merchantID">MerchantID</Label>
									<Input id="merchantID" placeholder="หมายเลข MerchantID" />
								</div>
							{:else}
								<div class="flex flex-col space-y-1.5">
									<Label for="taxplayer">Taxplayer</Label>
									<Input id="taxplayer" placeholder="หมายเลข Taxplayer" />
								</div>
							{/if}
						</div>
					</form>
				</Card.Content>
				<Card.Footer class="flex justify-end">
					<Button>เข้าสู่ระบบ</Button>
				</Card.Footer>
			</div>
		</Card.Root>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}

	.bg-blur-radial {
		background:
			radial-gradient(black 15%, transparent 16%) 0 0,
			radial-gradient(black 15%, transparent 16%) 8px 8px,
			radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px,
			radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 8px 9px;
	}
</style>
