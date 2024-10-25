<script lang="ts">
	import spinner from "$lib/image/spinner.gif"
	import { onMount } from 'svelte';
	
	import * as Card from '$lib/components/ui/card';
		import { Label } from '$lib/components/ui/label/index';
		import { Input } from '$lib/components/ui/input/index';
		import { Button } from '$lib/components/ui/button';
		import bg from '$lib/image/bg-register.jpg';
		import paysoLogo from '$lib/image/paysologo.jpg';
		import * as Select from '$lib/components/ui/select';
		import * as Avatar from '$lib/components/ui/avatar';
		import bglogin from '$lib/image/bg-login-admin.jpg';

	  
	
	  
	
		export let form;
		
		onMount(async() => {
		console.log("form admin : ", form);
		if(form){
			if(form.Status == false){
				const modal = document.getElementById('my_modal_2');
				if (modal) {
					modal.showModal();
				}
			}else{
				window.location.assign("/admin/admin-dashboard")
			}
		}
		
    }
);
		
		

		let showPassword = false;
	let password = '';
	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
	function handlePasswordInput(event: { target: { value: string } }) {
		// Remove spaces from the input value
		password = event.target.value.replace(/\s+/g, '');
		event.target.value = password;
	}
	
	</script>
	
	
	<div
		class="h-lvh bg-[url({bg})] bg-cover bg-center  lg:p-0 md:p-0   bg-opacity-1 grid lg:grid-cols-3  overflow-y-hidden"
	>
	<div class=" hidden bg-[url({bglogin})] bg-cover  content-center  lg:block lg:h-lvn md:col-span-1 lg:col-span-2  bg-zinc-300 relative text-white"  style="hight:50px">
			<div class="absolute inset-0 bg-black bg-opacity-70 p-6 z-10"></div>
		<div class="flex justify-start  w-5/5   ">
			<div class="  rounded-2xl  p-6 flex flex-col   text-sm  z-20">
				<div class="px-10">
					<div class="pt-2 text-start">
						<h2 class="font-semibold xl:text-3xl lg:text-2xl text-[#ffffff]">ยินดีต้อนรับ</h2>
					</div>
					<div class="pt-2 text-start">
						<h1 class="font-semibold xl:text-5xl lg:text-5xl text-[#ffffff]">แดชบอร์ดตรวจสอบสลิป [การควบคุม]</h1>
					</div>
					<div class="pt-2 text-start">
						<h2 class="  font-medium xl:text-lg lg:text-md text-[#ffffff]">กรอก "ชื่อผู้ใช้" และ "รหัสผ่าน" จากนั้นคลิก "เข้าสู่ระบบ"</h2>
					</div>
					
				</div>
			</div>
		
		</div>
		
	</div>
		<div class="col-span-1  w-full h-full py-10 lg:py-0 px-10 lg:px-0 place-self-center">
			<Card.Root
				class="h-full grid place-items-center shadow-2xl bg-primary-foreground lg:rounded-none rounded-b-none"
			>
				<div class="container space-y-2">
					<Card.Header class="space-y-2 w-100 ">
						<div class="flex justify-center">
						<Avatar.Root class="w-14 h-14 ">
							<Avatar.Image src={paysoLogo} alt="@shadcn" />
							<Avatar.Fallback>PS</Avatar.Fallback>
						</Avatar.Root>
					</div>
						<Card.Title class="text-center">เข้าสู่ระบบ Admin</Card.Title>
					</Card.Header>
					<Card.Content>
						
			  <div class="flex my-3 grid gap-1 md:grid-cols-1 lg:grid-cols-1 sm:px-20 md:px-32 lg:px-0 text-black" style="width: 100%;">
				<form id="loginadmin" method="post" action="?/signInAdmin">
					<div class="flex justify-center">
					<input type="text" name="username" placeholder="Username" id="uernameAdmin" style="width: 90%;height:40px" class="border border-spacing-10 px-5 rounded-md" />
					</div>
					<div class="flex justify-center">
						<div style="position: relative; width: 90%;">
							<label style="display: block; position: relative;">
								<input
									type={showPassword ? 'text' : 'password'}
									on:input={handlePasswordInput}
									maxlength="150"
									name="password"
									placeholder="Password"
									id="password"
									style="width: 100%; height: 40px;"
									class="my-3 border border-spacing-10 ps-5 pe-10 rounded-md"
								/>
								<!-- <input type="checkbox" on:change={togglePasswordVisibility} style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%);" /> -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<svg
									class="eye-icon"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									width="24"
									height="24"
									on:click={togglePasswordVisibility}
									style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%);"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d={showPassword
											? 'M12 4.5C7.305 4.5 3.12 7.59 1.68 12c1.44 4.41 5.625 7.5 10.32 7.5 5.67 0 10.8-3.09 12.24-7.5C22.5 7.59 17.36 4.5 12 4.5zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z'
											: 'M12 4.5C7.305 4.5 3.12 7.59 1.68 12c1.44 4.41 5.625 7.5 10.32 7.5 5.67 0 10.8-3.09 12.24-7.5C22.5 7.59 17.36 4.5 12 4.5zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM3 3l18 18'}
									/>
								</svg>
							</label>
						</div>
					</div>
					<div class="flex justify-center">
						<Button type="submit" class="my-2 flex text-center py-0 px-0  rounded-md text-white bg-primary hover:bg-[#050680]" style="width:90%;height:40px;"  >Sign In</Button>
					</div>
				</form>
			  </div>
					</Card.Content>
					
				</div>
			</Card.Root>
		</div>
	</div>
	<dialog id="my_modal_2" class="modal">
		<div class="modal-box lg:ml-20">
			<div class="text-lg font-bold flex justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					x="0px"
					y="0px"
					width="100"
					height="100"
					viewBox="0 0 48 48"
				>
					<path
						fill="#f44336"
						d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
					></path><path
						fill="#fff"
						d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
					></path><path
						fill="#fff"
						d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
					></path>
				</svg>
			</div>
			<p class="py-4 text-center font-bold text-4xl">ล้มเหลว</p>
			<p class=" text-center">Username / Password ไม่ถูกต้อง</p>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
	

	
	<style lang="postcss">
		/* .bg-blur-radial {
			background:
				radial-gradient(black 15%, transparent 16%) 0 0,
				radial-gradient(black 15%, transparent 16%) 8px 8px,
				radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px,
				radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 8px 9px;
		} */
	</style>
	
	
	
		
	
	