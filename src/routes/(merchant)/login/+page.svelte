<svelte:head>
  <script src="../src/lib/callbackup.js"></script>
</svelte:head>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import logo from '$lib/image/merchant.png';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import bakcground from '$lib/image/bakcground.jpg'

	let profiles: any[] = [];
	let id:any[]=[];
	console.log(id)
	onMount(async () => {
		deleteCookie("Status");
		try {
			const data = await GetProfile();
			// Use profileData here
			profiles = data;
			id.push(data.Id)
			console.log('profile : ', profiles,id);
			
			
		} catch (error) {
			console.error('Error fetching profile:', error);
		}


	});

	const GetProfile = async () => {
		const email = sessionStorage.getItem('email');
		const id = sessionStorage.getItem('id'); // Waiting for id from another page
		console.log('email: ', email, 'id: ', id);
		console.log('checking register');

		// Create URL parameters from form data
		let config = {
			method: 'GET', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json'
			}
		};

		let url;
		if (email) {
			console.log('Get by Email');
			url = `http://127.0.0.1:4567/api/v1/profileemail/${email}`;
		} else if (id) {
			console.log('Get by Merchant Id');
			url = `http://127.0.0.1:4567/api/v1/profileid/${id}`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}
		
		const result = await fetch(url, config);
		const data = await result.json();
		console.log(data);
		return data.result;
	};

	// $: list = merchantList.data;
	let lineLoginUrl = 'https://access.line.me/oauth2/v2.1/authorize';
let clientId = '2006015671';
let redirectUri = 'http://localhost:5173/profile';
let state = id;
let scope = 'profile%20openid%20email';
let user = null;
let emailgoogle = [];


function deleteCookie(name: string) {
   			 document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function setCookie(name: string, value: string, days: number) {
    let d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

const line = async () => {
	let loginUrl =  `${lineLoginUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
			window.location.replace(loginUrl);
			setCookie("Status", "update", 1);
	
	};

	
</script>

<form id="updateline" method="post" action="?/UpdateLine">
	<input type="text" hidden name="uid" id="inputuid" />
	<input type="text" hidden name="id" id="inputid" />
</form>



<div class="grid gap-10 h-100 lg:h-dvh from-destructive  md:grid-cols-1 lg:grid-cols-3  bg-slate-500" style="width: 100%;">
	<div>
    <div>
		<div >
			<Card.Content class="flex justify-center ">
				<div
					class="bg-sky-500/40 filter blur-md rounded-full flex justify-center lg:w-40 md:w-40 sm:w-0 "
					style="height:30%"
				>
					<div class="chart-container content-center flex justify-center" style="height: 130px;">
						.
					</div>
	
					<div></div>
				</div>
				<img src={logo} alt="" class="w-32 h-32 absolute bottom-50 left-50" />
			</Card.Content>
		</div>
	</div>
	<div class="w-4/5 lg:ml-10 sm:ml-10 ml-7" >
		<Card.Root class="shadow-inner bg-slate-200 text-black">
			<Card.Content class="mx-3 my-3 flex" >
				<div>
					<div class="chart-container"></div>
					<div class="text-xl">Merchant Name : {profiles.MerchantName}</div>
					<div class="text-lg">Merchant ID : {#if profiles.MerchantId != 0}{profiles.MerchantId}{:else}-{/if}</div>
					<div class="text-lg">Merchant UID : {profiles.MerchantUID}</div>
				</div></Card.Content
			>
		</Card.Root>
	</div>
	<hr class="w-4/5  lg:ml-10 sm:ml-10 ml-7 bg-slate-200 " style="height: 3px;">
	<div class="lg:mx-10 md:mx-14 sm:mx-15 mx-9  flex justify-center w-4/5">
		<Button
			variant="outline"
			class="my-2 flex text-center py-0 px-0 bg-green-500 rounded-full"
			on:click={line}
			style="width:40%;height:30px"
			><div  style="width:100%;height:100%">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					x="0px"
					y="0px"
					width="100%"
					height="100%"
					viewBox="0 0 48 48"
				>
					<path
						fill="#00c300"
						d="M12.5,42h23c3.59,0,6.5-2.91,6.5-6.5v-23C42,8.91,39.09,6,35.5,6h-23C8.91,6,6,8.91,6,12.5v23C6,39.09,8.91,42,12.5,42z"
					></path><path
						fill="#fff"
						d="M37.113,22.417c0-5.865-5.88-10.637-13.107-10.637s-13.108,4.772-13.108,10.637c0,5.258,4.663,9.662,10.962,10.495c0.427,0.092,1.008,0.282,1.155,0.646c0.132,0.331,0.086,0.85,0.042,1.185c0,0-0.153,0.925-0.187,1.122c-0.057,0.331-0.263,1.296,1.135,0.707c1.399-0.589,7.548-4.445,10.298-7.611h-0.001C36.203,26.879,37.113,24.764,37.113,22.417z M18.875,25.907h-2.604c-0.379,0-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687c0.379,0,0.687,0.308,0.687,0.687v4.521h1.917c0.379,0,0.687,0.308,0.687,0.687C19.562,25.598,19.254,25.907,18.875,25.907z M21.568,25.219c0,0.379-0.308,0.688-0.687,0.688s-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687s0.687,0.308,0.687,0.687V25.219z M27.838,25.219c0,0.297-0.188,0.559-0.47,0.652c-0.071,0.024-0.145,0.036-0.218,0.036c-0.215,0-0.42-0.103-0.549-0.275l-2.669-3.635v3.222c0,0.379-0.308,0.688-0.688,0.688c-0.379,0-0.688-0.308-0.688-0.688V20.01c0-0.296,0.189-0.558,0.47-0.652c0.071-0.024,0.144-0.035,0.218-0.035c0.214,0,0.42,0.103,0.549,0.275l2.67,3.635V20.01c0-0.379,0.309-0.687,0.688-0.687c0.379,0,0.687,0.308,0.687,0.687V25.219z M32.052,21.927c0.379,0,0.688,0.308,0.688,0.688c0,0.379-0.308,0.687-0.688,0.687h-1.917v1.23h1.917c0.379,0,0.688,0.308,0.688,0.687c0,0.379-0.309,0.688-0.688,0.688h-2.604c-0.378,0-0.687-0.308-0.687-0.688v-2.603c0-0.001,0-0.001,0-0.001c0,0,0-0.001,0-0.001v-2.601c0-0.001,0-0.001,0-0.002c0-0.379,0.308-0.687,0.687-0.687h2.604c0.379,0,0.688,0.308,0.688,0.687s-0.308,0.687-0.688,0.687h-1.917v1.23H32.052z"
					></path>
				</svg>
			</div>
		</Button
		>
	</div>
</div>
<div class="lg:col-span-2">
	<div class="lg:mx-10 sm:mx-10 mx-8 w-4/5">
		<div class="text-3xl ">ABOUT</div>
		<hr>
		<div>
			<Card.Root class="my-5 bg-[url('$lib/image/bakcground.jpg')] bg-cover bg-no-repeat bg-center shadow-inner" >
				<Card.Content >
					<div
						class="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 my-5 px-3 text-pretty"
						style="width: 100%;height:300px"
					>
							<div class="px-3 break-words">Merchant Email : {profiles.Email}</div>
							<div class="px-3 break-words">Merchant Company : {profiles.MerchantCompany}</div>
							<div class="px-3 break-words">Merchant Tel : {profiles.MerchantTel}</div>
							<div class="px-3 break-words">MerchantURL : {profiles.MerchantURL}</div>
							<div class="px-3 break-words">Status : {profiles.Status}</div>
							<div class="px-3 break-words">Address : {profiles.AddressTH}</div>


					</div></Card.Content
				>
			</Card.Root>
		</div>
	</div>


</div>
</div>