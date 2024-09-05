<script lang="ts">
	import cookie from 'cookie';
	import * as Card from '$lib/components/ui/card';
	import logo from '$lib/image/merchant.png';
	import { onDestroy, onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import logo_customer  from '$lib/image/customer_logo.png';
	let cookieValues = null;
	let profiles: any[] = [];
	let id: any[] = [];
	console.log(id);
	let loading = true;
	let showConfirmButton = false;
	export let form;
	let profileData: { userId: string; pictureUrl: string; displayName: string }[] = [];
	let linkline: any[] = [];
	let QuotaLimit=0;
	let QuotaUse=0;
	onMount(async () => {

		try {
			console.log(profileData);
			const data = await GetProfile();
			const link = await GetLineLink();
			// Use profileData here
			linkline=link
			profiles = data;
			QuotaLimit = data.QuotaLimit
			QuotaUse = data.QuotaUsage
			id.push(data.Id);
			console.log('profile : ', profiles, id, linkline);
		} catch (error) {
			console.error('Error fetching profile:', error);
		} finally {
			// การอัปเดตสถานะการโหลด
			loading = false;
		}

		if (form) {
			if (form.status == false) {
				console.log('มีบัญชีอยู่แล้ว', form.userName);
				const modal = document.getElementById('my_modal_2');
				if (modal) {
					modal.showModal();
				}
			} else {
				console.log('update สำเร็จ');
				const modal = document.getElementById('my_modal_3');
				if (modal) {
					modal.showModal();
				}
			}
		}
	});

	function getCookies() {
		return cookie.parse(document.cookie);
	}

	const GetProfile = async () => {
		// const email = sessionStorage.getItem('email');
		// const id = sessionStorage.getItem('id'); // Waiting for id from another page
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		document.getElementById('inputid').value = myCookie.Id;
		console.log('++++++++++', myCookie.Id, myCookie.Email);
		// console.log('email: ', email, 'id: ', id , );
		console.log('checking register');

		// Create URL parameters from form data
		let config = {
			method: 'GET', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json'
			}
		};

		let url;
		if (myCookie.Id) {
			console.log('Get by Merchant Id');
			url = `${PUBLIC_API_ENDPOINT}/merchant/profileid/${myCookie.Id}`;
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
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
	}

	function setCookie(name: string, value: string, days: number) {
		let d = new Date();
		d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
		let expires = 'expires=' + d.toUTCString();
		document.cookie = name + '=' + value + ';' + expires + ';path=/';
	}

	const line = async () => {
		let loginUrl = `${lineLoginUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
		setCookie('Status', 'update', 1);
		window.location.replace(loginUrl);
	};

	const GetLineLink = async () => {
		// const email = sessionStorage.getItem('email');
		// const id = sessionStorage.getItem('id'); // Waiting for id from another page
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		
		console.log('++++++++++', myCookie.Id, myCookie.Email);
		// console.log('email: ', email, 'id: ', id , );
		console.log('checking register');

		// Create URL parameters from form data
		let config = {
			method: 'GET', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json'
			}
		};

		let url;
		if (myCookie.Id) {
			console.log('Get by Merchant Id');
			url = `${PUBLIC_API_ENDPOINT}/linedata/${myCookie.Id}`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		const result = await fetch(url, config);
		const data = await result.json();
		console.log("Link Line",data);
		return data.result;
	};


	const DeleteLineLink = async (id:String) => {
		

    // Create configuration for the fetch request
    let config = {
        method: 'DELETE', // Use GET method
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        // Make the fetch request
        const result = await fetch(`${PUBLIC_API_ENDPOINT}/delete/linedata/${id}`, config);
        const datas = await result.json();
        console.log(datas);
        if (datas) {
            linkline = linkline.filter(item => String(item.IdLinkLine
			) !== String(id));
			console.log("linkline ",linkline)
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
		

	
	};
// 	function getFromLocalStorage<T>(key: string): T[] {
// 		const item = localStorage.getItem(key);
// 		// console.log('Data retrieved from localStorage:', item);
// 		if (item) {
// 			try {
// 				const parsedItem = JSON.parse(item);
// 				// ตรวจสอบว่าข้อมูลที่แปลงแล้วเป็นอาร์เรย์
// 				if (Array.isArray(parsedItem)) {
// 					return parsedItem as T[];
// 				} else {
// 					console.error('Data is not an array:', parsedItem);
// 					return [];
// 				}
// 			} catch (error) {
// 				console.error('Error parsing localStorage item:', error);
// 				return [];
// 			}
// 		}
// 		return [];
// 	}
	

// 	function handleSubmit() {
// 		// Clear localStorage
// 		clearRemainingTime();
// 		// Submit the form
// 		deleteCookie('Status');
// 		document.getElementById('updateline').submit();
// 	}
// 	function clearRemainingTime() {
// 		localStorage.removeItem('DataUsers');
// 	}
	
	
// let intervalId: number | NodeJS.Timeout;

// function startMonitoringLocalStorage(): number | NodeJS.Timeout {
//         intervalId = setInterval(() => {
//             const newProfileData = getFromLocalStorage<{ userId: string; pictureUrl: string; displayName: string }>('DataUsers');
//             if (!arraysEqual(newProfileData, lastProfileData)) {
// 				lastProfileData = newProfileData;
//                 profileData = newProfileData;
//                 console.log('Profile data updated:', profileData);
//             }
//         }, 1000);

//         return intervalId;
//     }
// 	function stopMonitoringLocalStorage(intervalId: number | NodeJS.Timeout) {
//     clearInterval(intervalId);
// }


// function arraysEqual(arr1: any[], arr2: any[]): boolean {
//     if (arr1.length !== arr2.length) return false;

//     for (let i = 0; i < arr1.length; i++) {
//         if (arr1[i].userId !== arr2[i].userId ||
//             arr1[i].pictureUrl !== arr2[i].pictureUrl ||
//             arr1[i].displayName !== arr2[i].displayName) {
//             return false;
//         }
//     }

//     return true;
// }
// let lineAccounts: any[] = [];
// function removeAccount(index: number) {
//   lineAccounts.splice(index, 1);  // ลบบัญชีออกจาก lineAccounts

//   // ดึงข้อมูลจาก localStorage ที่มีชื่อว่า "DataUsers"
//   const storedData = getFromLocalStorage<Array<{ userId: string; pictureUrl: string; displayName: string }>>('DataUsers');
  
//   if (storedData) {
//     console.log("StoredData", storedData);  // ตรวจสอบว่าดึงข้อมูลมาได้ถูกต้องหรือไม่

//     // ลบข้อมูลตามลำดับที่ต้องการ
//     storedData.splice(index, 1);

//     // อัปเดตข้อมูลใน localStorage
//     localStorage.setItem('DataUsers', JSON.stringify(storedData));
//   } else {
//     console.error("No data found in localStorage under 'DataUsers'");
//   }
// }
// function handleRemove(event, index) {
//         // Prevent form submission
//         event.preventDefault();

//         // Your logic to remove the account
//         removeAccount(index);
//     }
	


</script>

<svelte:head>
	<script src="../src/lib/callbackup.js"></script>
</svelte:head>
<!-- <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-3 w-100 overflow-x-hidden lg:h-screen  md:h-100 sm:h-100  bg-[url('$lib/image/back.jpg')] bg-cover bg-no-repeat bg-center shadow-inner  lg:content-center"  >
<div class="my-10 mx-3  lg:h-96 backdrop-blur-xl bg-white/30 rounded-xl "><div
	class="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 my-5 "
>
<div>
	<div >
		<Card.Content class="flex justify-center ">
			<div
				class="bg-sky-500/40 filter blur-md rounded-full flex justify-center  w-40  "
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
	<div class="w-4/5 lg:mx-5 md:mx-12 sm:mx-5 mx-7 " >
		<Card.Root class="shadow-inner bg-slate-200 text-black">
			<Card.Content class="mx-3 my-3 flex px-3 " >
				<div>
					<div class="chart-container"></div>
					<div class="text-xl  text-wrap">Merchant Name : {profiles.MerchantName}</div>
					<div class="text-lg text-wrap">Merchant ID : {#if profiles.MerchantId != 0}{profiles.MerchantId}{:else}-{/if}</div>
					<div class="text-lg text-wrap">Merchant UID : {profiles.MerchantUID}</div>
				</div></Card.Content
			>
		</Card.Root>
		<div class="lg:mx-5 md:mx-12 sm:mx-15 mx-9  flex justify-center w-4/5">
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
		
	
</div></div>
<div class="my-5 mx-3 lg:col-span-2 lg:content-center  bg-white/30 rounded-xl">
	<div class="lg:mx-10 sm:mx-10 mx-8 w-5/5 ">
		<div class="text-3xl font-bold">ABOUT</div>
		<hr>
		<div>
			<Card.Root class="my-5 bg-[url('$lib/image/bakcground.jpg')] bg-cover bg-no-repeat bg-center shadow-inner" >
				<Card.Content >
					<div
						class="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 my-5 px-3 backdrop-blur-xl bg-white/1 "
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
</div> -->

<div
	class=" grid gap-4 md:grid-cols-1 lg:grid-cols-1 overflow-x-hidden lg:h-screen md:screen sm:h-screen h-screen w-100 bg-primary-foreground"
>
	<div class="flex justify-center bg-slate-100">
		<div class="lg:my-0 md:my-0 sm:my-0 my-5">
			<div class="flex my-3 justify-center">
				<img src={logo} alt="" class="w-24 h-30 my-5" />
				<div class="my-5 content-center mx-2">
					<div class=" text-4xl font-bold truncate lg:w-96 md:w-96 sm:w-96 w-56">{profiles.MerchantName}</div>
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2 my-2"><div class="text-lg">Merchant ID : {#if profiles.MerchantId != 0}{profiles.MerchantId}{:else}-{/if}</div><div class="flex justify-center mx-5">
						{#if profiles.Status == 'ACTIVE'}
							<div
								class="  bg-green-500 text-center px-3  rounded-lg text-sm text-white"
								style="height: 18px;"
							>
								ACTIVE
							</div>
						{:else}
							<div
								class="   bg-red-600 text-center px-3 rounded-lg text-sm text-white"
								style="height: 18px;"
							>
								INACTIVE
							</div>
						{/if}
					</div></div>
				</div>
			</div>
			<Card.Root class="my-2 w-80 sm:w-full md:w-full lg:w-full">
				<Card.Header>
				  <Card.Title>
					<div class="flex justify-between textl-xl mx-5">
						<div> Package</div>
						<div>{profiles.PackageName}</div>
					</div>
					
				  </Card.Title>
				</Card.Header>
				<Card.Content>
				  <div class="flex justify-center"><progress class="progress progress-success w-96 mx-2" value={QuotaLimit-QuotaUse} max={QuotaLimit}></progress></div>
				  <div class="flex justify-end w-100 lg:px-10 md:px-10 sm:px-10 px-2">
					<div class="text-xs	my-2">used {parseInt(profiles.QuotaLimit-profiles.QuotaUsage)} of {parseInt(profiles.QuotaLimit)} requests</div>
				  </div>
				</Card.Content>
				<Card.Footer>
					
				</Card.Footer>
			  </Card.Root>
			<div
				class="  bg-white w-80 lg:my-3 md:my-5 sm:my-0 my-8 sm:w-96 md:w-full lg:w-full rounded-2xl border border-slate-300"
			>
				<div>
					<div>
						<Card.Content class="flex justify-center relative">
						
						</Card.Content>
					</div>
				</div>
				<div class="my-5">
					{#if loading}
					<div class="flex justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="spin"
                            x="0px"
                            y="0px"
                            width="100"
                            height="100"
                            viewBox="0 0 128 128"
                        >
                            <path
                                d="M14.5 39.8c-1.5-.6-3.3.1-3.9 1.6-2.4 5.8-3.9 11.9-4.4 18.1-.1 1.7 1.1 3.1 2.8 3.2.1 0 .2 0 .2 0 1.6 0 2.9-1.2 3-2.8.4-5.6 1.8-11.1 3.9-16.2C16.7 42.2 16 40.5 14.5 39.8zM113.1 39.1c-1.5.7-2.2 2.4-1.5 4 8.7 19.8 4.5 42.5-10.8 57.8C90.9 110.6 77.9 116 64 116c-11.2 0-21.9-3.5-30.8-10.1l0 0h4.9c1.7 0 3-1.3 3-3s-1.3-3-3-3h-13c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3s3-1.3 3-3v-6.3l0 0C38.6 117.8 51.3 122 64 122c14.9 0 29.7-5.7 41-17 17.1-17.1 21.8-42.3 12.1-64.4C116.4 39.1 114.6 38.4 113.1 39.1zM90.1 22.1c-1.6 0-3.1 1.2-3.2 2.8-.1 1.7 1.3 3.2 3 3.2h13c1.7 0 3-1.3 3-3V12.3c0-1.6-1.2-3.1-2.8-3.2-1.7-.1-3.2 1.3-3.2 3v6.3C78 1.1 46.3 1.9 25.3 20.8 24 22 24 24 25.2 25.2c1.1 1.1 2.9 1.2 4.1.1C38.9 16.7 51.1 12 64 12c11.2 0 21.9 3.5 30.8 10.1l0 0H90.1zM11.5 77.69999999999999A2.9 2.9 0 1 0 11.5 83.5 2.9 2.9 0 1 0 11.5 77.69999999999999z"
                            ></path>
                        </svg>
                    </div>
					{:else}
						<Card.Root class=" text-black border-none shadow-none">
							<Card.Content class="mx-3 my-3 flex px-3  ">
								<div style="width: 100%;">
									<div class="text-4xl font-bold">About</div>
									<div class="text-sm text-wrap my-2 grid gap-4 grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
										<div class="text-sm">Email </div>
										<div class=" col-span-2">{profiles.Email}</div>
										<div class="text-sm">Phone </div>
										<div class=" col-span-2">{profiles.MerchantTel}</div>
									</div>
								</div></Card.Content
							>
						</Card.Root>
						<hr class=" bg-gray-300 my-3 mx-5" style="height: 2px;" />
						<div class="mx-5">
							<div class=" text-4xl my-3 font-bold">Address</div>

							<div class=" grid gap-4 grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
								
									<div class="text-sm">URL</div>
									<div class="text-sm break-words col-span-2">{profiles.MerchantURL}</div>
								
								
									<div class="text-sm">Company</div>
									<div class="text-sm col-span-2 break-words">{profiles.MerchantCompany}</div>
								
								
									<div class="text-sm">Address</div>
									<div class="text-sm col-span-2 break-words">{profiles.AddressTH}</div>
							
								
							</div>
						</div>
					<hr class=" bg-gray-300 my-3 mx-5" style="height: 2px;" />
					{/if}
					<div class="mx-5">
						<div class=" text-2xl my-3">Links</div>

						
						
								{#each linkline as profile , index}
									
									<div class=" grid gap-4 grid-cols-4 md:grid-cols-4 lg:grid-cols-4 border my-2 border-gray-300 rounded-lg">
									<div class="avatar">
										<div class="w-10 rounded-full mx-2 my-2">
												<img src={profile.AvatarUrl} />
										</div>
									</div>
									<div class=" col-span-2 content-center">
										{profile.Name}
									</div>
									<div class="dropdown dropdown-bottom flex justify-end bg-none my-2 " >
										<div tabindex="0" role="button" class="btn btn-sm m-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...$$props}>
											<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
												<circle cx="8" cy="2.5" r=".75" />
												<circle cx="8" cy="8" r=".75" />
												<circle cx="8" cy="13.5" r=".75" />
											</g>
										</svg></div>
										<ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 shadow">
										  <li><Button variant="ghost" class=" text-red-600 " on:click={(event) => DeleteLineLink(profile.IdLinkLine)}>ยกเลิกการเชื่อมต่อ</Button></li>
										</ul>
									  </div>
									
								</div>
								{/each}
					
		
						
							
						
					</div>
					<div class="flex justify-start">
						<Button
							variant="outline"
							class="my-2 mx-5 flex text-center py-0 px-0 bg-green-500 rounded-md lg:w-30 md:w-50"
							on:click={line}
							style="height:40px"
							><div
							class="lg:bg-green-800 md:bg-green-800 sm:bg-green-800 rounded-sm w-24 "
							style="height:100%"
						>
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
						<div style="width: 100%;" class="content-center lg:block md:block sm:block hidden hover:text-black text-white">
							Login With Line
						</div>
						</Button>
						
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Open the modal using ID.showModal() method -->
<dialog id="my_modal_2" class="modal">
	<div class="modal-box ">
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
		<p class=" text-center">Line {form?.userName} มีการเชื่อมต่อกับไว้อยู่แล้ว</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<dialog id="my_modal_3" class="modal">
	<div class="modal-box ">
		<div class="text-lg font-bold flex justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="100"
				height="100"
				viewBox="0 0 48 48"
			>
				<linearGradient
					id="I9GV0SozQFknxHSR6DCx5a_70yRC8npwT3d_gr1"
					x1="9.858"
					x2="38.142"
					y1="9.858"
					y2="38.142"
					gradientUnits="userSpaceOnUse"
					><stop offset="0" stop-color="#21ad64"></stop><stop offset="1" stop-color="#088242"
					></stop></linearGradient
				><path
					fill="url(#I9GV0SozQFknxHSR6DCx5a_70yRC8npwT3d_gr1)"
					d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
				></path><path
					d="M32.172,16.172L22,26.344l-5.172-5.172c-0.781-0.781-2.047-0.781-2.828,0l-1.414,1.414	c-0.781,0.781-0.781,2.047,0,2.828l8,8c0.781,0.781,2.047,0.781,2.828,0l13-13c0.781-0.781,0.781-2.047,0-2.828L35,16.172	C34.219,15.391,32.953,15.391,32.172,16.172z"
					opacity=".05"
				></path><path
					d="M20.939,33.061l-8-8c-0.586-0.586-0.586-1.536,0-2.121l1.414-1.414c0.586-0.586,1.536-0.586,2.121,0	L22,27.051l10.525-10.525c0.586-0.586,1.536-0.586,2.121,0l1.414,1.414c0.586,0.586,0.586,1.536,0,2.121l-13,13	C22.475,33.646,21.525,33.646,20.939,33.061z"
					opacity=".07"
				></path><path
					fill="#fff"
					d="M21.293,32.707l-8-8c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414c0.391-0.391,1.024-0.391,1.414,0	L22,27.758l10.879-10.879c0.391-0.391,1.024-0.391,1.414,0l1.414,1.414c0.391,0.391,0.391,1.024,0,1.414l-13,13	C22.317,33.098,21.683,33.098,21.293,32.707z"
				></path>
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">สำเร็จ</p>
		<p class=" text-center">Update การเชื่อมกับ Line สำเร็จ</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
<div class="tooltip-container">
    <div class="tooltip">
        <button class="btn rounded-full  bg-black text-white">i</button>
        <div class="tooltip-text">
            <strong>คำแนะนำเบื้องต้น:</strong> <br>
            แสดงข้อมูลเบื้องต้นของคนที่เข้ามาใช้งาน
            <br><br>  กดปุ่ม Line --> Login Line --> แสดงรูป Line ( สามารถทำแบบเดิมเพื่อเพิ่มอีก Line ได้ )-->กดยืนยัน  
            <br><br>  สามารถใช้งาน Check Slip ผ่านไลน์ได้แล้ว ( ถ้าไม่ได้ ต้องซื้อ โควต้า ที่หน้า Package )
        </div>
    </div>
</div>

<form id="updateline" method="post" action="?/UpdateLine">
		<input type="text" hidden name="uid" id="inputuid" />
		<input type="text" hidden name="name" id="inputname" />
		<input type="text" hidden name="avatar" id="inputavatar" />
		<input type="text" hidden name="id" id="inputid" />
</form>
<style scoped>
	@media (min-width: 1024px) {
		.lg\:h-screen {
			height: calc(100vh - 41px);
		}
	}
	@media (min-width: 768px) {
		.lg\:h-screen {
			height: calc(100vh - 41px);
		}
	}
	.spin {
		display: inline-block;
		animation: spin 2s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.tooltip-container {
        position: fixed; /* ใช้ fixed เพื่อให้อยู่ตำแหน่งเดิมเมื่อเลื่อนหน้า */
        right: 10px; /* ปรับให้ปุ่มและ tooltip อยู่ด้านขวาของหน้าจอ */
        top: 95%; /* ปรับตำแหน่งให้อยู่ตรงกลางตามแนวตั้ง */
        transform: translateY(-50%); /* เลื่อนขึ้นครึ่งหนึ่งของความสูงเพื่อให้อยู่ตรงกลาง */
        z-index: 1000;
    }

    .tooltip {
        position: relative;
        display: inline-block;
        cursor: pointer;
    }

    .tooltip .tooltip-text {
        visibility: hidden;
        width: 250px;
        max-height: 300px; /* กำหนดความสูงสูงสุดเพื่อให้มี scrollbar */
        background-color: #555;
        color: #fff;
        text-align: left;
        border-radius: 5px;
        padding: 10px;
        position: absolute;
        right: 0; /* ให้ tooltip อยู่ชิดขวาของปุ่ม */
        bottom: 100%; /* ให้ tooltip อยู่ด้านล่างของปุ่ม */
        margin-top: 10px; /* ระยะห่างระหว่างปุ่มและ tooltip */
        overflow-y: auto; /* เพิ่ม scrollbar ในแนวตั้ง */
        opacity: 0;
        transition: opacity 0.3s;
    }

    .tooltip:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }
</style>
