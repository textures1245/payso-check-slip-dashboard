<script lang="ts">
	import spinner from '$lib/image/spinner.gif';
	import { onMount } from 'svelte';
	import cookie from 'cookie';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button';
	import paysoLogo from '$lib/image/SURE2copy.jpg';
	import pie from '$lib/image/pie.png';
	import chart from '$lib/image/chart.png';
	import statuspic from '$lib/image/status.png';
	import * as Select from '$lib/components/ui/select';
	import * as Avatar from '$lib/components/ui/avatar';
	import { PUBLIC_DOMAIN } from '$env/static/public';
	import {
		auth,
		provider,
		signInWithPopup,
		// @ts-ignore
		signOut,
		providerface
		// @ts-ignore
	} from '/src/lib/image/firebase.client.js';


	let lineLoginUrl = 'https://access.line.me/oauth2/v2.1/authorize';
	let clientId = '2006570449';
	let redirectUri = `${PUBLIC_DOMAIN}`;
	let state = '1010-1010';
	let scope = 'profile%20openid%20email';
	let user = null;
	let emailgoogle = [];
	let showModal = false;
	let username = [];

	const line = () => {
		let loginUrl = `${lineLoginUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

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
	console.log('form : ', form);
	function getCookies() {
		return cookie.parse(document.cookie);
	}

	onMount(async () => {

		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const returnedState = urlParams.get('state');
		console.log(code, returnedState, urlParams);
		// ทำงานเฉพาะเมื่อมีการ redirect กลับมาจาก LINE Login
		if (code) {
			try {
				const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: new URLSearchParams({
						grant_type: 'authorization_code',
						code: code,
						redirect_uri: `${PUBLIC_DOMAIN}`,
						client_id: '2006570449',
						client_secret: '3e5ec3e379a1c57402ea6e7426775c80'
					})
				});

				const tokenData = await tokenResponse.json();
				console.log('Token data:', tokenData);

				const profileResponse = await fetch('https://api.line.me/v2/profile', {
					headers: {
						Authorization: `Bearer ${tokenData.access_token}`
					}
				});

				const profileData = await profileResponse.json();
				console.log('Profile data:', profileData);

				// Store user profile data
				localStorage.setItem('profile Data', JSON.stringify(profileData));
				sessionStorage.setItem('profile Data', JSON.stringify(profileData));
				setCookie('UserLineId', JSON.stringify(profileData), 7);
				console.log('data ', profileData);

				if (returnedState === '1010-1010') {
					document.getElementById('emailInputline').value = profileData.userId;
					document.getElementById('nameInputline').value = profileData.displayName;
					document.getElementById('inputavatar').value = profileData.pictureUrl;
					console.log(profileData);
					document.getElementById('mylineForm').submit();
				}
			} catch (error) {
				console.log(error);
			}
		}
		const cookies = getCookies();
		const myCookie = cookies['UserLineId'] ? JSON.parse(cookies['UserLineId']) : null;
		const statusCookie = sessionStorage.getItem('StatusCoockie');
		if (!myCookie) {
			// ลบ StatusCoockie หากคุกกี้ UserLineId ไม่มีอยู่ (หมดอายุ)
			sessionStorage.removeItem('StatusCoockie');
			line();
			// ตั้งเวลาหลังจาก 2-3 วินาทีให้รีโหลดหน้า
		}
		if (
			(!myCookie && !statusCookie) ||
			(myCookie.message === 'invalid token' && statusCookie) ||
			(myCookie.message === 'invalid token' && !statusCookie)
		) {
			line();
			sessionStorage.setItem('StatusCoockie', 'rr');
		}

		//////////////////// เพิ่มมาเพราะ Production ไม่สามารถอ่าน ไฟ .jsได้
		// const urlParams = new URLSearchParams(window.location.search);
		// const code = urlParams.get('code');
		// const returnedState = urlParams.get('state');

		// ทำงานเฉพาะเมื่อมีการ redirect กลับมาจาก LINE Login
		// if (code) {
		// 	try {
		// 		const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
		// 			method: 'POST',
		// 			headers: {
		// 				'Content-Type': 'application/x-www-form-urlencoded'
		// 			},
		// 			body: new URLSearchParams({
		// 				grant_type: 'authorization_code',
		// 				code: code,
		// 				redirect_uri: `${PUBLIC_DOMAIN}`,
		// 				client_id: '2006478813',
		// 				client_secret: '28d4c9a577a54f93c61e88c33c304794'
		// 			})
		// 		});

		// 		const tokenData = await tokenResponse.json();
		// 		console.log('Token data:', tokenData);

		// 		const profileResponse = await fetch('https://api.line.me/v2/profile', {
		// 			headers: {
		// 				Authorization: `Bearer ${tokenData.access_token}`
		// 			}
		// 		});

		// 		const profileData = await profileResponse.json();
		// 		console.log('Profile data:', profileData);

		// 		// Store user profile data
		// 		localStorage.setItem('profile Data', JSON.stringify(profileData));
		// 		sessionStorage.setItem('profile Data', JSON.stringify(profileData));
		// 		setCookie('UserLineId', JSON.stringify(profileData), 7);
		// 		console.log('data ', profileData);

		// 		if (returnedState === '1010-1010') {
		// 			document.getElementById('emailInputline').value = profileData.userId;
		// 			document.getElementById('nameInputline').value = profileData.displayName;
		// 			document.getElementById('inputavatar').value = profileData.pictureUrl;
		// 			console.log(profileData);
		// 			document.getElementById('mylineForm').submit();
		// 		}
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// }
		////////////////////////////////////////////

		if (form) {
			if (form.data) {
				sessionStorage.setItem('email', form.data.Email);
				sessionStorage.setItem('merchant_id', form.data.Id);

				if (form.data.PackageId == '0') {
					if (form.status == 'create') {
						window.location.href = '/advice'; // ถ้าจริงต้องมาหน้า detail ก่อน
					} else {
						window.location.href = '/package';
					}
				} else {
					window.location.href = '/dashboard';
				}
			}
		}
	});


	function setCookie(name: string, value: string, days: number) {
    let d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
	const url = new URL(PUBLIC_DOMAIN); // Convert string to URL object
    const domain = url.hostname; // Get the hostname (payso-check-slip-dashboard-xi.vercel.app)
	document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;Secure;SameSite=Lax;domain=${domain}`;
    console.log("cookie ", document.cookie,domain);
}
	// function setCookie(name: string, value: string, days: number) {
	// 	let d = new Date();
	// 	d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
	// 	document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;Secure;SameSite=Lax;domain=payso-check-slip-dashboard-xi.vercel.app`;
	// 	console.log('cookie ', document.cookie);
	// }


	


	

	// function setCookie(name: string, value: string, days: number) {
	// 	let d = new Date();
	// 	d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
	// 	const isLocal = window.location.hostname === 'localhost'; // ตรวจสอบ environment
	// 	const domain = isLocal ? 'localhost' : 'payso-check-slip-dashboard-xi.vercel.app'; // กำหนด domain ตาม environment
	// 	document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;Secure;SameSite=Lax;domain=${domain}`;
	// 	console.log('cookie ', document.cookie);
	// }
</script>

<!-- <svelte:head>
	<script src="../src/lib/callback.js"></script>
</svelte:head> -->

<div class=" h-lvh bg-cover bg-center md:p-0 bg-opacity-1 grid lg:grid-cols-3 overflow-y-hidden">
	<div
		class=" hidden content-center lg:block lg:h-lvn md:col-span-1 lg:col-span-2 bg-[#EAECF0]"
		style="hight:50px"
	>
		<div class="flex justify-start w-5/5">
			<div class="  rounded-2xl p-6 flex flex-col text-sm">
				<div class="px-10">
					<div class="pt-2 text-start">
						<h2 class="font-semibold xl:text-3xl lg:text-2xl text-[#17B26A]">
							ดูข้อมูลสลิปและการใช้งานผ่านกราฟและสถิติตามช่วงเวลา
						</h2>
					</div>
					<div class="pt-2 text-start">
						<h2 class="font-semibold xl:text-2xl lg:text-2xl text-[#475467]">
							แพ็กเกจการใช้งานที่หลากหลาย พร้อมการชำระเงินสะดวกด้วย QR Code
						</h2>
					</div>
					<div class="py-2 text-start">
						<h2 class="font-semibold xl:text-2xl lg:text-2xl text-[#475467]">
							เชื่อมต่อ LINE เพื่อแชร์จำนวนการใช้งานจากแพ็กเกจที่ซื้อ
						</h2>
					</div>
					<div class="p-2 w-5/5 bg-white rounded-lg shadow-lg">
						<h2 class=" xl:text-lg lg:text-md text-start">
							ยินดีต้อนรับสู่แดชบอร์ดที่ให้คุณดูสถิติและวิเคราะห์ข้อมูลได้อย่างง่ายดาย!
						</h2>
					</div>
				</div>
			</div>
		</div>
		<div
			class=" w-full xl:h-full lg:h-3/5 rounded-2xl flex justify-center items-center relative overflow-hidden"
		>
			<!-- svelte-ignore a11y-missing-attribute -->
			<img
				src={chart}
				class="absolute top-5 left-10 w-3/5 h-auto transform translate-y-[-5%] scale-75 shadow-md hover:-rotate-8 hover:scale-105 -rotate-6"
				style="z-index: 2;"
			/>
			<!-- svelte-ignore a11y-missing-attribute -->
			<img
				src={statuspic}
				class="absolute top-14 right-20 w-3/5 h-auto transform scale-75 shadow-lg hover:-rotate-8 hover:scale-105 rotate-3"
				style="z-index: 1;"
			/>
		</div>
	</div>

	<div
		class="col-span-1 w-full h-full py-20 lg:py-0 lg:px-0 md:px-20 sm:px-20 px-5 place-self-center"
	>
		<Card.Root
			class="h-full border-none grid place-items-center  shadow-xl bg-primary-foreground lg:rounded-none rounded-b-xl"
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
					<!-- <div
						class="flex my-3 grid gap-1 md:grid-cols-1 lg:grid-cols-1 sm:px-20 md:px-32 lg:px-0 text-black"
						style="width: 100%;"
					>
						<form id="loginbypayso" method="post" action="?/signInPayso">
							<div class="flex justify-center rounded-">
								<input
									type="text"
									name="username"
									on:input={handlePasswordInput}
									placeholder="Username"
									id="username"
									style="width: 80%;height:40px"
									class="border border-spacing-10 px-5 rounded-md"
								/>
							</div>
							<div class="flex justify-center">
								<div style="position: relative; width: 80%;">
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
								<Button
									type="submit"
									class="my-2 flex text-center py-0 px-0  text-white rounded-md  bg-primary hover:bg-[#050680]"
									style="width:80%;height:40px;">Sign In</Button
								>
							</div>
						</form>
					</div> -->
					<hr class="my-5" />
					<div
						class="flex my-3 grid gap-1 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 sm:px-20 md:px-32 lg:px-0 px-10 text-white"
						style="width:100%;"
					>
						<!-- <div class="flex justify-center hover:text-black">
							<Button
								variant="outline"
								class="my-2 flex text-center py-0 px-0  lg:bg-white md:bg-white sm:bg-white bg-white lg:rounded-md sm:rounded-md rounded-full text-black"
								style="width:80%;height:40px"
								on:click={loginGoogle}
								><div class=" flex rounded-sm w-20" style="height:100%">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										x="0px"
										y="0px"
										width="100%"
										height="100%"
										viewBox="0 0 48 48"
									>
										<path
											fill="#FFC107"
											d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
										></path><path
											fill="#FF3D00"
											d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
										></path><path
											fill="#4CAF50"
											d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
										></path><path
											fill="#1976D2"
											d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
										></path>
									</svg>
								</div>
								<div
									style="width: 100%;height:100%"
									class="content-center lg:block md:block sm:block hidden hover:text-black"
								>
									Sign up with Google
								</div></Button
							>
						</div> -->
						<div class="flex justify-center hover:text-white">
							<Button
								class="my-2 flex text-center py-0 px-0  lg:bg-green-500 md:bg-green-500 sm:bg-green-500 bg-green-500 lg:rounded-md sm:rounded-md hover:bg-green-800 rounded-full"
								on:click={line}
								style="width:80%;height:40px"
								><div class="rounded-sm w-20" style="height:100%">
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
								<div
									style="width: 100%;height:100%"
									class="content-center lg:block md:block sm:block hidden hover:text-white"
								>
									Sign up with Line
								</div></Button
							>
						</div>
					</div>
				</Card.Content>
			</div>
		</Card.Root>
	</div>
</div>

<dialog id="my_modal_2" class="modal">
	<div class="modal-box lg:ml-20">
		<div class="text-lg font-bold flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 15 15" {...$$props}>
				<path fill="#F04438" fill-rule="evenodd" d="M.877 7.5a6.623 6.623 0 1 1 13.246 0a6.623 6.623 0 0 1-13.246 0M7.5 1.827a5.673 5.673 0 1 0 0 11.346a5.673 5.673 0 0 0 0-11.346m2.354 3.32a.5.5 0 0 1 0 .707L8.207 7.5l1.647 1.646a.5.5 0 0 1-.708.708L7.5 8.207L5.854 9.854a.5.5 0 0 1-.708-.708L6.793 7.5L5.146 5.854a.5.5 0 0 1 .708-.708L7.5 6.793l1.646-1.647a.5.5 0 0 1 .708 0" clip-rule="evenodd" />
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 15 15" {...$$props}>
				<path fill="#F04438" fill-rule="evenodd" d="M.877 7.5a6.623 6.623 0 1 1 13.246 0a6.623 6.623 0 0 1-13.246 0M7.5 1.827a5.673 5.673 0 1 0 0 11.346a5.673 5.673 0 0 0 0-11.346m2.354 3.32a.5.5 0 0 1 0 .707L8.207 7.5l1.647 1.646a.5.5 0 0 1-.708.708L7.5 8.207L5.854 9.854a.5.5 0 0 1-.708-.708L6.793 7.5L5.146 5.854a.5.5 0 0 1 .708-.708L7.5 6.793l1.646-1.647a.5.5 0 0 1 .708 0" clip-rule="evenodd" />
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">ล้มเหลว</p>
		<p class=" text-center"></p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

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
	<input type="text" hidden name="avatar" id="inputavatar" />
	<input type="text" hidden name="name" id="nameInputline" />
</form>

<dialog id="my_modal_2" class="modal" open={showModal}>
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 15 15" {...$$props}>
				<path fill="#F04438" fill-rule="evenodd" d="M.877 7.5a6.623 6.623 0 1 1 13.246 0a6.623 6.623 0 0 1-13.246 0M7.5 1.827a5.673 5.673 0 1 0 0 11.346a5.673 5.673 0 0 0 0-11.346m2.354 3.32a.5.5 0 0 1 0 .707L8.207 7.5l1.647 1.646a.5.5 0 0 1-.708.708L7.5 8.207L5.854 9.854a.5.5 0 0 1-.708-.708L6.793 7.5L5.146 5.854a.5.5 0 0 1 .708-.708L7.5 6.793l1.646-1.647a.5.5 0 0 1 .708 0" clip-rule="evenodd" />
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">เซกชันหมดอายุ</p>
		<p class=" text-center">
			เซกชันของคุณได้หมดอายุเนื่องจาก Cookies หมดอายุ ระบบจะให้ทำการ Login Line ไหม
		</p>
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
