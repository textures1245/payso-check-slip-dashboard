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
	  import {
			auth,
			provider,
			signInWithPopup,
			// @ts-ignore
			signOut,
			providerface
			// @ts-ignore
		} from '/src/lib/image/firebase.client.js';
		import { redirect } from "@sveltejs/kit";
		
	
	
	let lineLoginUrl = 'https://access.line.me/oauth2/v2.1/authorize';
	let clientId = '2005856083';
	let redirectUri = 'http://localhost:5173/login';
	let state = 'randomState';
	let scope = 'profile%20openid%20email';
	let user = null;
	let emailgoogle = [];
	
	let username = [];
	
	let loginUrl = generateLoginUrl(lineLoginUrl, clientId, redirectUri, state, scope);
	
		function generateLoginUrl(lineLoginUrl: string, clientId: string, redirectUri: string, state: string, scope: string) {
		return `${lineLoginUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
	
		
	}
	
	const line = async () => {
				window.location.replace(loginUrl);
		
		};
	
	
	  const loginGoogle = async () => {
			try {
				var result = await signInWithPopup(auth, provider);
				console.log(result);
				emailgoogle.push(result.user.email);
				username.push(result.user.displayName);
				console.log(emailgoogle);
				console.log(username);
				document.getElementById('emailInput').value = emailgoogle[0];
				document.getElementById('nameInput').value = username[0];
				
				if (emailgoogle != null && username != null) {
					document.getElementById('myForm').submit();
				}
			} catch (error) {
				console.error('Error logging in with Google: ', error);
				return (status = 'false');
			}
		};
	
	  const facebook = async () => {
			// @ts-ignore
			let displayname = '';
			try {
				var result = await signInWithPopup(auth, providerface);
	
				console.log(result);
				emailgoogle.push(result.user.email);
				username.push(result.user.displayName);
				console.log(emailgoogle);
				console.log(username);
				document.getElementById('emailInputfacebook').value = emailgoogle[0];
				document.getElementById('nameInputfacebook').value = username[0];
				if (emailgoogle != null && username != null) {
					// @ts-ignore
					document.getElementById('myfacebookForm').submit();
					
				}
			} catch (error) {
				console.error('Error logging in with Facebook: ', error);
			}
		};
	
		export let form;
		console.log("form : ",form)
		
		onMount(() => {
		console.log("form : ", form);
		if (form) {
			sessionStorage.setItem('email', form.data.Email);  
		  if (form.data.PackageId == "0") {
		    window.location.href = "/package";
		  } else {
		    window.location.href = "/dashboard";
		  }
		}
	  });
	
		
	
	</script>
	
	
	<div
		class="bg-gradient-to-tr h-dvh from-destructive via-primary via-70% to-secondary grid lg:grid-cols-3"
	>
		<div class=" lg:col-span-2">
			<img class="hidden lg:block object-cover w-full h-full" src={bg} alt="background" />
		</div>
		<div class="col-span-1 backdrop-blur-md w-full h-full px-4 lg:px-0 place-self-center">
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
						<Card.Title class="text-center">เข้าสู่ระบบ</Card.Title>
					</Card.Header>
					<Card.Content>
						
			  <div class="flex my-3 grid gap-1 md:grid-cols-1 lg:grid-cols-1 text-white" style="width: 100%;">
				<Button variant="outline" class="my-2 flex text-center py-0 px-0  bg-sky-400 rounded-md" style="width:100%;height:60px" on:click={loginGoogle}><div class="bg-sky-700"  style="width:30%;height:100%"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 48 48">
				  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
				  </svg></div><div style="width: 100%;" class="content-center">Login With Google </div></Button>
				<Button variant="outline" class="my-2 flex text-center py-0 px-0  bg-blue-500 rounded-md" on:click={facebook} style="width:100%;height:60px"><div class="bg-blue-700" style="width:30%;height:100%"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 48 48">
				  <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
				  </svg></div><div style="width: 100%;" class="content-center"> Login With Facebook</div></Button>
				<Button variant="outline" class="my-2 flex text-center py-0 px-0 bg-green-500 rounded-md" on:click={line} style="width:100%;height:60px"><div class="bg-green-800" style="width:30%;height:100%"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 48 48">
				  <path fill="#00c300" d="M12.5,42h23c3.59,0,6.5-2.91,6.5-6.5v-23C42,8.91,39.09,6,35.5,6h-23C8.91,6,6,8.91,6,12.5v23C6,39.09,8.91,42,12.5,42z"></path><path fill="#fff" d="M37.113,22.417c0-5.865-5.88-10.637-13.107-10.637s-13.108,4.772-13.108,10.637c0,5.258,4.663,9.662,10.962,10.495c0.427,0.092,1.008,0.282,1.155,0.646c0.132,0.331,0.086,0.85,0.042,1.185c0,0-0.153,0.925-0.187,1.122c-0.057,0.331-0.263,1.296,1.135,0.707c1.399-0.589,7.548-4.445,10.298-7.611h-0.001C36.203,26.879,37.113,24.764,37.113,22.417z M18.875,25.907h-2.604c-0.379,0-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687c0.379,0,0.687,0.308,0.687,0.687v4.521h1.917c0.379,0,0.687,0.308,0.687,0.687C19.562,25.598,19.254,25.907,18.875,25.907z M21.568,25.219c0,0.379-0.308,0.688-0.687,0.688s-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687s0.687,0.308,0.687,0.687V25.219z M27.838,25.219c0,0.297-0.188,0.559-0.47,0.652c-0.071,0.024-0.145,0.036-0.218,0.036c-0.215,0-0.42-0.103-0.549-0.275l-2.669-3.635v3.222c0,0.379-0.308,0.688-0.688,0.688c-0.379,0-0.688-0.308-0.688-0.688V20.01c0-0.296,0.189-0.558,0.47-0.652c0.071-0.024,0.144-0.035,0.218-0.035c0.214,0,0.42,0.103,0.549,0.275l2.67,3.635V20.01c0-0.379,0.309-0.687,0.688-0.687c0.379,0,0.687,0.308,0.687,0.687V25.219z M32.052,21.927c0.379,0,0.688,0.308,0.688,0.688c0,0.379-0.308,0.687-0.688,0.687h-1.917v1.23h1.917c0.379,0,0.688,0.308,0.688,0.687c0,0.379-0.309,0.688-0.688,0.688h-2.604c-0.378,0-0.687-0.308-0.687-0.688v-2.603c0-0.001,0-0.001,0-0.001c0,0,0-0.001,0-0.001v-2.601c0-0.001,0-0.001,0-0.002c0-0.379,0.308-0.687,0.687-0.687h2.604c0.379,0,0.688,0.308,0.688,0.687s-0.308,0.687-0.688,0.687h-1.917v1.23H32.052z"></path>
				  </svg></div><div style="width: 100%;" class="content-center"> Login With Line</div></Button>
			  </div>
					</Card.Content>
					
				</div>
			</Card.Root>
		</div>
	</div>
	
	<form id="myForm" method="post" action="?/signInWithGoogle">
					<input type="text" hidden name="email" id="emailInput" />
					<input type="text" hidden name="name" id="nameInput" />
	</form>
	<form id="myfacebookForm" method="post" action="?/signInWithGoogle">
		<input type="text" hidden name="email" id="emailInputfacebook" />
		<input type="text" hidden name="name" id="nameInputfacebook" />
	</form>
	<form id="mylineForm" method="post" action="?/signInWithLine">
		<input type="text" hidden name="uid" id="emailInputline" />
		<input type="text" hidden name="name" id="nameInputline" />
	</form>
	<style lang="postcss">
		/* .bg-blur-radial {
			background:
				radial-gradient(black 15%, transparent 16%) 0 0,
				radial-gradient(black 15%, transparent 16%) 8px 8px,
				radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px,
				radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 8px 9px;
		} */
	</style>
	
	
	
		
	
	