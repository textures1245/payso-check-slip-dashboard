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
	
	  
	
	  
	
		export let form;
		
		onMount(async() => {
		console.log("form admin : ", form);
		console.log("form admin : ",form)
		if(form){
			if(form.message != "Non Admin"){
				window.location.assign("/admin")
			}else{
				alert("username และ  password ไม่ถูกต้อง")
			}
		}
		
    }
);
		
		
		const Login = async () => {
			// @ts-ignore
			
		};

		
	
	</script>
	
	
	<div
		class="bg-gradient-to-tr h-lvh from-destructive via-primary via-70% to-secondary grid lg:grid-cols-3 "
	>
		<div class=" hidden lg:block lg:h-lvn md:col-span-1 lg:col-span-2 " style="hight:50px">
			<img class=" hidden lg:block object-cover w-full h-full " src={bg} alt="background" />
		</div>
		<div class="col-span-1 backdrop-blur-md w-full h-full py-20 lg:py-0 px-20 lg:px-0 place-self-center">
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
					<input type="text" name="username" placeholder="Username" id="uernameAdmin" style="width: 90%;height:40px" class="border border-spacing-10 px-5 rounded-2xl" />
					</div>
					<div class="flex justify-center">
					<input type="text" name="password" placeholder="Password" id="passwordAdmin" style="width: 90%;height:40px" class="my-3 border border-spacing-10 px-5 rounded-2xl"/>
					</div>
					<div class="flex justify-center">
						<Button type="submit" variant="outline" class="my-2 flex text-center py-0 px-0  bg-sky-400 rounded-2xl" style="width:90%;height:40px"  >Sign In</Button>
					</div>
				</form>
			  </div>
					</Card.Content>
					
				</div>
			</Card.Root>
		</div>
	</div>
	
	

	
	<style lang="postcss">
		/* .bg-blur-radial {
			background:
				radial-gradient(black 15%, transparent 16%) 0 0,
				radial-gradient(black 15%, transparent 16%) 8px 8px,
				radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px,
				radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 8px 9px;
		} */
	</style>
	
	
	
		
	
	