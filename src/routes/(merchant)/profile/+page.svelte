<script lang="ts">
	import cookie from 'cookie';
	import * as Card from '$lib/components/ui/card';
	import logo from '$lib/image/logoshop.png';
	import { onDestroy, onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { PUBLIC_DOMAIN } from '$env/static/public';
	import logo_customer from '$lib/image/customer_logo.png';
	let cookieValues = null;
	let profiles: any[] = [];
	let banks: any[] = [];
	let id: any[] = [];
	let loading = true;
	let isChecked1 = false;
  let isChecked2 = false;
  let isChecked3 = false;
  let isChecked4 = false;

  let isCheckedLink1 = false;
  let isCheckedLink2 = false;
  let isCheckedLink3 = false;
  let isCheckedLink4 = false;
	export let form;
	let profileData: { userId: string; pictureUrl: string; displayName: string }[] = [];
	let linkline: any[] = [];
	let QuotaLimit = 0;
	let QuotaUse = 0;
	onMount(async () => {
		clearRemainingTime();
		try {
			console.log(profileData);
			const data = await GetProfile();
			const link = await GetLineLink();
			const bank = await GetBankLink();
			// Use profileData here
			linkline = link;
			profiles = data;
			banks = bank;
			QuotaLimit = data.QuotaLimit;
			QuotaUse = data.QuotaUsage;
			id.push(data.Id);
			console.log('profile : ', profiles, linkline, banks);
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
		if (myCookie && myCookie.Type === 'Line') {
			url = `${PUBLIC_API_ENDPOINT}/merchant/profileline/${myCookie.Email}`;
		} else if (myCookie.Id) {
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
	// let lineLoginUrl = 'https://access.line.me/oauth2/v2.1/authorize';
	// let clientId = '2006015671';
	// let redirectUri = 'http://localhost:5173/profile';
	// let state = id;
	// let scope = 'profile%20openid%20email';
	let lineLoginUrl = 'https://access.line.me/oauth2/v2.1/authorize';
	let clientId = '2006478813';
	let redirectUri = `${PUBLIC_DOMAIN}profile`;
	let state = id;
	let scope = 'profile%20openid%20email';

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

		// Create URL parameters from form data
		let config = {
			method: 'GET', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json'
			}
		};

		let url;
		if (myCookie && myCookie.Type === 'Line') {
			url = `${PUBLIC_API_ENDPOINT}/linedata/${myCookie.Email}/LINE`;
		} else if (myCookie.Id) {
			console.log('Get by Merchant Id');
			url = `${PUBLIC_API_ENDPOINT}/linedata/${myCookie.Id}/-`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		const result = await fetch(url, config);
		const data = await result.json();
		console.log('Link Line', data);
		return data.result;
	};

	const GetBankLink = async () => {
		// const email = sessionStorage.getItem('email');
		// const id = sessionStorage.getItem('id'); // Waiting for id from another page
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;

		console.log('++++++++++', myCookie.Id, myCookie.Email);
		// console.log('email: ', email, 'id: ', id , );

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
			url = `${PUBLIC_API_ENDPOINT}/bankdata/${myCookie.Id}`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		const result = await fetch(url, config);
		const data = await result.json();
		console.log('Link Line', data);
		return data.result;
	};

	const DeleteLineLink = async (id: String) => {
		// Create configuration for the fetch request
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log('++++++++++', myCookie.Id, myCookie.Email);
		let config = {
			method: 'DELETE', // Use GET method
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			// Make the fetch request
			const result = await fetch(`${PUBLIC_API_ENDPOINT}/delete/linedata/${id}/${myCookie.Email}/${myCookie.Type}`, config);
			const datas = await result.json();
			console.log(datas.message);
			if (datas.message != "permission denied") {
				linkline = linkline.filter((item) => String(item.IdLinkLine) !== String(id));
				console.log('linkline ', linkline);
				const modal = document.getElementById('my_modal_1');
				modal.close();
			}else{
				const modal = document.getElementById('my_modal_4');
				if (modal) {
					modal.showModal();
				}
			}
		} catch (error) {
			console.error('Error fetching transaction data:', error);
		}
	};

	const UpdateBankLink = async (id: String, status: boolean) => {
		// Create configuration for the fetch request
		console.log(id, status);
		let config = {
			method: 'PUT', // Use GET method
			headers: {
				'Content-Type': 'application/json'
			}
		};
		console.log(id);
		try {
			// Make the fetch request
			const result = await fetch(`${PUBLIC_API_ENDPOINT}/update/bankdata/${id}/${status}`, config);
			const datas = await result.json();
			console.log(datas);
		} catch (error) {
			console.error('Error fetching transaction data:', error);
		}
	};

	const UpdateLineLink = async (id: String, status: String) => {
		// Create configuration for the fetch request
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		let config = {
			method: 'PUT', // Use GET method
			headers: {
				'Content-Type': 'application/json'
			}
		};
		console.log(id);
		try {
			// Make the fetch request
			const result = await fetch(`${PUBLIC_API_ENDPOINT}/update/linedata/${id}/${status}/${myCookie.Email}/${myCookie.Type}`, config);
			const datas = await result.json();
			if (datas.message == "permission denied") {
				const modal = document.getElementById('my_modal_4');
				if (modal) {
					modal.showModal();
				}
				return false;
			}else{
				return true;
			}
		} catch (error) {
			console.error('Error fetching transaction data:', error);
			return false;
		}
	};

	const UpdateLineRoles = async (id: String, roles: String) => {
		// Create configuration for the fetch request
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		let config = {
			method: 'PUT', // Use GET method
			headers: {
				'Content-Type': 'application/json'
			}
		};
		console.log(id);
		try {
			// Make the fetch request
			const result = await fetch(`${PUBLIC_API_ENDPOINT}/updateline/roles/${id}/${roles}/${myCookie.Email}/${myCookie.Type}`, config);
			const datas = await result.json();
			if (datas.message == "permission denied") {
				const modal = document.getElementById('my_modal_4');
				if (modal) {
					modal.showModal();
				}
				return false;
			}else{
				const modal = document.getElementById('my_modal_1');
				if (modal) {
					modal.close();
				}
			}
		} catch (error) {
			console.error('Error fetching transaction data:', error);
		}
	};
	

	function clearRemainingTime() {
		localStorage.removeItem('remainingTime'); // การใช้งานที่ถูกต้อง
		localStorage.removeItem('Img');
		localStorage.removeItem('RefNo');
		if ((window as any).intervalId) {
			clearInterval((window as any).intervalId);
			console.log('Timer stopped.');
		}
	}

	function formatDate(dateString: any) {
		const date = new Date(dateString);

		// ตรวจสอบว่ามีวันที่ถูกต้องหรือไม่
		if (isNaN(date.getTime())) {
			return 'Invalid date'; // คืนค่าข้อความหากวันที่ไม่ถูกต้อง
		}

		// แปลงวันที่เป็นรูปแบบ "18 ก.ย. 2024"
		const day = date.getDate();
		const month = date.toLocaleString('th-TH', { month: 'short' });
		const year = date.getFullYear(); // ปี ค.ศ.

		return `${day} ${month} ${year}`; // คืนค่าในรูปแบบ "18 ก.ย. 2024"
	}

	const bankchecks = [
		{
			code: '002',
			name: 'ธนาคารกรุงเทพ จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/bankkok.jpg'
		},
		{
			code: '004',
			name: 'ธนาคารกสิกรไทย จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/kbank.jpg'
		},
		{ code: '006', name: 'ธนาคารกรุงไทย จำกัด (มหาชน)', imageUrl: '/src/lib/image/bank/KTB.jpg' },
		{
			code: '009',
			name: 'ธนาคารโอเวอร์ซี-ไชนีสแบงกิ้งคอร์ปอเรชั่น จำกัด',
			imageUrl: '/src/lib/image/bank/overbank.png'
		},
		{
			code: '011',
			name: 'ธนาคารทหารไทยธนชาต จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/ttb.png'
		},
		{
			code: '014',
			name: 'ธนาคารไทยพาณิชย์ จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/SCB.png'
		},
		{ code: '017', name: 'ธนาคารซิตี้แบงก์ เอ็น.เอ.', imageUrl: '/src/lib/image/bank/citi.jpg' },
		{
			code: '018',
			name: 'ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น ',
			imageUrl: '/src/lib/image/bank/SMBC.png'
		},
		{
			code: '020',
			name: 'ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย) จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/Standdard.png'
		},
		{
			code: '022',
			name: 'ธนาคารซีไอเอ็มบี ไทย จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/CIMB.png'
		},
		{ code: '024', name: 'ธนาคารยูโอบี จำกัด (มหาชน)', imageUrl: '/src/lib/image/bank/UOB.png' },
		{
			code: '025',
			name: 'ธนาคารกรุงศรีอยุธยา จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/kungsri.png'
		},
		{ code: '030', name: 'ธนาคารออมสิน', imageUrl: '/src/lib/image/bank/omsinbank.jpg' },
		{
			code: '031',
			name: 'ธนาคารฮ่องกงและเซี่ยงไฮ้แบงกิ้งคอร์ปอเรชั่น จำกัด',
			imageUrl: '/src/lib/image/bank/HSBC.png'
		},
		{ code: '032', name: 'ธนาคารดอยซ์แบงก์', imageUrl: '/src/lib/image/bank/Doybank.png' },
		{ code: '033', name: 'ธนาคารอาคารสงเคราะห์', imageUrl: '/src/lib/image/bank/GHB.png' },
		{
			code: '034',
			name: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร',
			imageUrl: '/src/lib/image/bank/k.png'
		},
		{ code: '039', name: 'ธนาคารมิซูโฮ จำกัด', imageUrl: '/src/lib/image/bank/Mizho.png' },
		{ code: '045', name: 'ธนาคารบีเอ็นพี พารีบาส์', imageUrl: '/src/lib/image/bank/BNP.png' },
		{
			code: '052',
			name: 'ธนาคารแห่งประเทศจีน (ไทย) จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/BankChina.jpg'
		},
		{
			code: '066',
			name: 'ธนาคารอิสลามแห่งประเทศไทย',
			imageUrl: '/src/lib/image/bank/islambank.png'
		},
		{ code: '067', name: 'ธนาคารทิสโก้ จำกัด (มหาชน)', imageUrl: '/src/lib/image/bank/tisco.png' },
		{
			code: '069',
			name: 'ธนาคารเกียรตินาคิน จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/kiatnakin.png'
		},
		{
			code: '070',
			name: 'ธนาคารไอซีบีซี (ไทย) จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/ICBC.png'
		},
		{
			code: '071',
			name: 'ธนาคารไทยเครดิต เพื่อรายย่อย จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/thaicredit.png'
		},
		{
			code: '073',
			name: 'ธนาคารแลนด์ แอนด์ เฮ้าส์ จำกัด (มหาชน)',
			imageUrl: '/src/lib/image/bank/LH.png'
		},
		{
			code: '098',
			name: 'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย',
			imageUrl: '/src/lib/image/bank/SMEBank.png'
		}
	];

	function getBankImage(bankCode: string) {
		const bank = bankchecks.find((b) => b.code === bankCode);
		return bank ? bank.imageUrl : '/src/lib/image/promtpay-qr.png'; // กรณีไม่พบจะใช้ภาพ default
	}

	
	function handleCheckboxChange(event: { target: { checked: boolean } }, id: any) {
		const isChecked = event.target.checked;
		UpdateBankLink(id, isChecked); // ส่งค่า 1 หรือ 0
		console.log(id, isChecked);
	}
	async function handleCheckboxChangeLine(event: { target: { checked: boolean } }, id: any) {
		const isChecked = event.target.checked;
		console.log(id, isChecked);
		const status = isChecked ? "ACTIVE" : "INACTIVE";
		
		const permissionGranted = await UpdateLineLink(id, status); // Await the permission check
		console.log(permissionGranted,isChecked)
    if (!permissionGranted) {
        // Revert the checkbox value if permission denied
        event.target.checked = !isChecked;
		Status = !isChecked;
    }
	}

	function submitValues(Id: any) {
		let selectedText = "";
if (isChecked1) selectedText += "DASHBOARD";
if (isChecked2) selectedText += selectedText ? ",PACKAGE" : "PACKAGE";
if (isChecked3) selectedText += selectedText ? ",USER_MANAGEMENT" : "USER_MANAGEMENT";
if (isChecked4) selectedText += selectedText ? ",SLIP_CHECKER" : "SLIP_CHECKER";
	UpdateLineRoles(Id,selectedText)
  }

  let currentId: null = null;
  let Status: boolean | null = null;

  function openModal(id: any,status:any,roles:any) {
    currentId = id;
	Status = status === 'ACTIVE' ? true : status === 'INACTIVE' ? false : null;
	 isChecked1 = false;
     isChecked2 = false;
	 isChecked3 = false;

    // แยก string ด้วยการใช้ split และตรวจสอบค่าที่มีอยู่
    const rolesArray = roles.split(',');

    // ตรวจสอบว่า roles มีค่าหรือไม่
    if (rolesArray.includes('DASHBOARD')) {
        isChecked1 = true;
    }
    if (rolesArray.includes('PACKAGE')) {
        isChecked2 = true;
    }
	if (rolesArray.includes('USER_MANAGEMENT')) {
        isChecked3 = true;
    }
	if (rolesArray.includes('SLIP_CHECKER')) {
        isChecked4 = true;
    }
    const modal = document.getElementById('my_modal_1');
    modal.showModal();
  }
  
  let base64Result=""
  function submitLink() {
	const today = new Date();
  const date = today.toISOString().split('T')[0];
  const cookies = getCookies();
	const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		let selectedText = "";
if (isCheckedLink1) selectedText += "DASHBOARD";
if (isCheckedLink2) selectedText += selectedText ? ",PACKAGE" : "PACKAGE";
if (isCheckedLink3) selectedText += selectedText ? ",USER_MANAGEMENT" : "USER_MANAGEMENT";
if (isCheckedLink4) selectedText += selectedText ? ",SLIP_CHECKER" : "SLIP_CHECKER";
if (isCheckedLink1 || isCheckedLink2 || isCheckedLink3 ||isCheckedLink4) {
const result = `${myCookie.Id}:${date}:${selectedText}`;
 base64Result = btoa(result); // แปลงเป็น Base64
 console.log(result);
}
  
  
  }
  
  function openModalLink() {
    const modal = document.getElementById('my_modal_5');
    modal.showModal();
  }
  let showNotification = false;
  function copyToClipboard() {
    const input = document.getElementById('base64') as HTMLInputElement;;
    input.select(); // เลือกเนื้อหาทั้งหมดใน input
    document.execCommand('copy'); // คัดลอกเนื้อหาใน input
    try {
      showNotification = true; // แสดงข้อความแจ้งเตือน
      setTimeout(() => {
        showNotification = false; // ซ่อนข้อความหลังจาก 2 วินาที
      }, 1000); // ระยะเวลาที่จะให้แสดงข้อความ
    } catch (err) {
      console.error('คัดลอกลิงก์ไม่สำเร็จ:', err);
    }
  }

  function resetValues() {
    isCheckedLink1 = false;
    isCheckedLink2 = false;
    isCheckedLink3 = false;
	isCheckedLink4 = false;
    base64Result = ''; // Reset the base64 result if needed
    showNotification = false; // Reset notification state if needed
  }
</script>

<svelte:head>
	<script src="../src/lib/callbackup.js"></script>
</svelte:head>

<div
	class=" grid gap-4 md:grid-cols-1 lg:grid-cols-1 overflow-x-hidden min-h-[calc(100vh-41px)] w-100 bg-primary-foreground"
>
	<div class="flex justify-center bg-primary-foreground">
		<div class="lg:my-8 md:my-8 sm:my-8 my-5">
			<Card.Root class="my-2 w-80 sm:w-full md:w-full lg:w-full">
				<Card.Header>
					<Card.Title>
						<div class="flex justify-center lg:w-full md:w-full sm:w-full w-80">
							<div class="content-center">
								<div
									class="bg-[#DBE8FF] rounded-full content-center min-w-20 min-h-20 flex flex-col justify-center items-center"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="50px"
										height="50px"
										viewBox="0 0 24 24"
										{...$$props}
									>
										<g fill="none" stroke="#1353EC">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M14.5 21v-5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v5"
											/>
											<path
												d="M5 11v6c0 1.886 0 2.828.586 3.414S7.114 21 9 21h6c1.886 0 2.828 0 3.414-.586S19 18.886 19 17v-6M4.621 4.515c.182-.728.273-1.091.544-1.303C5.437 3 5.812 3 6.562 3h10.876c.75 0 1.125 0 1.397.212c.27.212.362.575.544 1.303l1.203 4.814c.097.388.146.581.135.739a1 1 0 0 1-.69.883c-.15.049-.354.049-.763.049c-.533 0-.8 0-1.023-.052a2 2 0 0 1-1.393-1.18c-.089-.212-.132-.47-.217-.983c-.024-.144-.036-.216-.05-.235a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489l-.018.1A2 2 0 0 1 14.352 11h-.204a2 2 0 0 1-1.936-1.726l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489l-.018.1A2 2 0 0 1 9.852 11h-.204A2 2 0 0 1 7.73 9.374l-.018-.1l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235c-.085.514-.128.77-.217.983a2 2 0 0 1-1.392 1.18C5.536 11 5.27 11 4.736 11c-.409 0-.613 0-.763-.049a1 1 0 0 1-.69-.883c-.01-.158.038-.351.135-.739z"
											/>
										</g>
									</svg>
								</div>
							</div>
							<div class=" content-center mx-2">
								<div
									class=" text-2xl font-bold truncate lg:w-96 md:w-96 sm:w-96 w-56"
									title={profiles.MerchantName}
								>
									{#if loading}-{:else}{profiles.MerchantName}{/if}
								</div>
								<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2 my-2 font-normal">
									<div class="text-md content-center">
										รหัสร้านค้า : {#if profiles.MerchantId == 0 || loading}-{:else}{profiles.MerchantId}{/if}
									</div>
									<div class="flex lg:justify-end sm:justify-end justify-start content-center">
										{#if profiles.Status == 'ACTIVE'}
											<div
												class="  bg-[#ECFDF3] text-[#067647] border border-[#ABEFC6] font-semibold text-center px-2 py-1 rounded-xl text-sm content-center"
											>
												<li>ACTIVE</li>
											</div>
										{:else}
											<div
												class="   bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] font-semibold text-center px-2 py-1 rounded-lg text-sm content-center"
											>
												<li>INACTIVE</li>
											</div>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex justify-between textl-lg mx-5 font-semibold">
						<div class="px-1">แพ็คเกจ</div>
						<div>
							{#if loading}-{:else}{profiles.PackageName}{/if}
						</div>
					</div>
					<div class="flex justify-center mt-3">
						<progress
							class="progress progress-success w-full mx-5"
							value={QuotaLimit - QuotaUse}
							max={QuotaLimit}
						></progress>
					</div>
					<div class="flex w-100 lg:px-5 md:px-5 sm:px-5 px-5">
						<div class="text-xs my-4 flex justify-start" style="width: 100%;">
							{#if loading || profiles.BillDate == '-'}วันที่หมดอายุ -{:else}วันที่หมดอายุ {formatDate(
									profiles.BillDate.split('T')[0]
								)}
							{/if}
						</div>
						<div class="text-xs my-4 flex justify-end" style="width: 100%;">
							{#if loading}ใช้ไป 0 จาก 0 รายการ{:else}ใช้ไป {parseInt(
									profiles.QuotaLimit - profiles.QuotaUsage
								).toLocaleString()} จาก {parseInt(profiles.QuotaLimit).toLocaleString()} รายการ{/if}
						</div>
					</div>
				</Card.Content>
			</Card.Root>
			<div
				class="  bg-white w-80 lg:my-3 md:my-5 sm:my-0 my-8 sm:w-96 md:w-full lg:w-full rounded-2xl border border-slate-300"
			>
				<div>
					<div>
						<Card.Content class="flex justify-center relative"></Card.Content>
					</div>
				</div>
				<div class="my-5">
					{#if loading}
						<div class="border border-blue-300 shadow rounded-md p-4 max-w-md w-full mx-auto h-56">
							<div class="animate-pulse flex space-x-4">
								<div class="rounded-full bg-slate-200 h-10 w-10"></div>
								<div class="flex-1 space-y-6 py-1">
									<div class="h-2 bg-slate-200 rounded"></div>
									<div class="space-y-3">
										<div class="grid grid-cols-3 gap-4">
											<div class="h-2 bg-slate-200 rounded col-span-2"></div>
											<div class="h-2 bg-slate-200 rounded col-span-1"></div>
											<div class="h-2 bg-slate-200 rounded col-span-2"></div>
											<div class="h-2 bg-slate-200 rounded col-span-1"></div>
											<div class="h-2 bg-slate-200 rounded col-span-2"></div>
											<div class="h-2 bg-slate-200 rounded"></div>
											<div class="h-2 bg-slate-200 rounded col-span-1"></div>
											<div class="h-2 bg-slate-200 rounded col-span-2"></div>
											<div class="h-2 bg-slate-200 rounded"></div>
										</div>
										<div class="h-2 bg-slate-200 rounded"></div>
									</div>
								</div>
							</div>
						</div>
					{:else}
						<Card.Root class=" text-black border-none shadow-none">
							<Card.Content class="mx-3 my-3 flex px-3  ">
								<div style="width: 100%;">
									<div class="text-2xl  font-semibold">เกี่ยวกับ</div>
									<div
										class="text-sm text-wrap my-2  grid gap-4 grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
									>
										<div class="text-sm">อีเมล</div>
										<div class=" col-span-2 break-words">{profiles.Email}</div>
										<div class="text-sm">โทรศัพท์</div>
										<div class=" col-span-2">{profiles.MerchantTel}</div>
									</div>
								</div></Card.Content
							>
						</Card.Root>
						<hr class=" bg-gray-300 my-3 mx-5" style="height: 2px;" />
						<div class="mx-3 my-3 px-3">
							<div class=" text-2xl font-semibold">ที่อยู่</div>

							<div class=" grid gap-4 my-2 grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
								<div class="text-sm">บริษัท</div>
								<div class="text-sm col-span-2 break-words">{profiles.MerchantCompany}</div>

								<div class="text-sm">ที่อยู่</div>
								<div class="text-sm col-span-2 break-words">{profiles.AddressTH}</div>
								<div class="text-sm">ลิงก์</div>
								<div class="text-sm break-words col-span-2">{profiles.MerchantURL}</div>
							</div>
						</div>
						<hr class=" bg-gray-300 mb-3 mt-5 mx-5" style="height: 2px;" />
						<div class="mx-3 my-3 px-3">
							<div class=" text-2xl my-3 font-semibold">บัญชีธนาคาร</div>

							{#each banks as banks}
								<div
									class=" grid gap-4 grid-cols-4 md:grid-cols-4 lg:grid-cols-4 border my-2 border-gray-300 rounded-lg"
								>
									<div class="avatar">
										<div class="w-10 rounded-full mx-2 my-2">
											{#if banks.TypeAccount === 'BANK' || banks.TypeAccount === 'Bank'}
												<img src={getBankImage(banks.BankCode)} alt="Bank Image" loading="lazy" />
											{:else}
												<img
													src="/src/lib/image/promtpay-qr.png"
													alt={banks.NameTH}
													loading="lazy"
												/>
											{/if}
										</div>
									</div>
									<div class=" col-span-2 content-center">
										{banks.AccountNo}
									</div>
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class="dropdown dropdown-bottom flex flex-col justify-center bg-none my-2 mx-2  items-center"
									>
									<input
									type="checkbox"
									value="synthwave"
									class="toggle theme-controller toggle-success"
									id="menuToggle"
									checked={banks.Active}
									on:click={(event) => handleCheckboxChange(event, banks.Id)}
								/>
										<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
										
									</div>
								</div>
							{/each}
						</div>
						<a href="/banklink">
							<Button
								variant="outline"
								class="my-2 mx-6 flex text-center py-0 px-0 bg-primary rounded-md lg:w-30 md:w-50 group"
								style="height:40px"
							>
								<div
									style="width: 100%;height:100%"
									class="content-center group-hover:text-black px-5 text-white"
								>
									เพิ่มบัญชี
								</div>
							</Button>
						</a>
						<hr class=" bg-gray-300 mb-3 mt-5 mx-5" style="height: 2px;" />
						<div class="mx-3 my-3 px-3">
							<div class=" text-2xl my-3 font-semibold">ลิงก์</div>

							{#each linkline as profile}
								<div
									class=" grid gap-4 grid-cols-4 md:grid-cols-4 lg:grid-cols-4 border my-2 border-gray-300 rounded-lg"
								>
									<div class="avatar">
										<div class="w-10 rounded-full mx-2 my-2">
											<img src={profile.AvatarUrl} loading="lazy" />
										</div>
									</div>
									<div class=" col-span-2 content-center">
										{profile.Name} 
									</div>
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class="dropdown dropdown-bottom flex justify-end bg-none my-2"
										on:click={() => openModal(profile.IdLinkLine,profile.Status,profile.Roles)}
									>
										<div tabindex="0" role="button" class=" btn-sm m-1 content-center">
											<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" {...$$props}>
												<path fill="black" fill-rule="evenodd" d="M13.984 2.542c.087.169.109.386.152.82c.082.82.123 1.23.295 1.456a1 1 0 0 0 .929.384c.28-.037.6-.298 1.238-.82c.337-.277.506-.415.687-.473a1 1 0 0 1 .702.035c.175.076.33.23.637.538l.894.894c.308.308.462.462.538.637a1 1 0 0 1 .035.702c-.058.181-.196.35-.472.687c-.523.639-.784.958-.822 1.239a1 1 0 0 0 .385.928c.225.172.636.213 1.457.295c.433.043.65.065.82.152a1 1 0 0 1 .47.521c.071.177.071.395.071.831v1.264c0 .436 0 .654-.07.83a1 1 0 0 1-.472.522c-.169.087-.386.109-.82.152c-.82.082-1.23.123-1.456.295a1 1 0 0 0-.384.929c.038.28.299.6.821 1.238c.276.337.414.505.472.687a1 1 0 0 1-.035.702c-.076.175-.23.329-.538.637l-.894.893c-.308.309-.462.463-.637.538a1 1 0 0 1-.702.035c-.181-.058-.35-.196-.687-.472c-.639-.522-.958-.783-1.238-.82a1 1 0 0 0-.929.384c-.172.225-.213.635-.295 1.456c-.043.434-.065.651-.152.82a1 1 0 0 1-.521.472c-.177.07-.395.07-.831.07h-1.264c-.436 0-.654 0-.83-.07a1 1 0 0 1-.522-.472c-.087-.169-.109-.386-.152-.82c-.082-.82-.123-1.23-.295-1.456a1 1 0 0 0-.928-.384c-.281.037-.6.298-1.239.82c-.337.277-.506.415-.687.473a1 1 0 0 1-.702-.035c-.175-.076-.33-.23-.637-.538l-.894-.894c-.308-.308-.462-.462-.538-.637a1 1 0 0 1-.035-.702c.058-.181.196-.35.472-.687c.523-.639.784-.958.821-1.239a1 1 0 0 0-.384-.928c-.225-.172-.636-.213-1.457-.295c-.433-.043-.65-.065-.82-.152a1 1 0 0 1-.47-.521C2 13.286 2 13.068 2 12.632v-1.264c0-.436 0-.654.07-.83a1 1 0 0 1 .472-.522c.169-.087.386-.109.82-.152c.82-.082 1.231-.123 1.456-.295a1 1 0 0 0 .385-.928c-.038-.281-.3-.6-.822-1.24c-.276-.337-.414-.505-.472-.687a1 1 0 0 1 .035-.702c.076-.174.23-.329.538-.637l.894-.893c.308-.308.462-.463.637-.538a1 1 0 0 1 .702-.035c.181.058.35.196.687.472c.639.522.958.783 1.238.821a1 1 0 0 0 .93-.385c.17-.225.212-.635.294-1.456c.043-.433.065-.65.152-.82a1 1 0 0 1 .521-.471c.177-.07.395-.07.831-.07h1.264c.436 0 .654 0 .83.07a1 1 0 0 1 .522.472M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8" clip-rule="evenodd" />
											</svg>
										</div>
										
										
									</div>
								</div>
							{/each}
						</div>
					{/if}

					<div class="flex  justify-between	 hover:text-black">
						<div><Button
							variant="outline"
							class="my-2 mx-6 flex text-center py-0 px-0 bg-green-500 rounded-md lg:w-30 md:w-50 group"
							on:click={line}
							style="height:40px"
							><div class=" rounded-sm w-24" style="height:100%">
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
								class="content-center lg:block md:block sm:block hidden group-hover:text-black text-white"
							>
								เข้าสู่ระบบด้วย Line
							</div>
						</Button></div>
							<div><Button
								variant="outline"
								class="my-2 mx-6 flex text-center py-0 px-0   bg-primary rounded-md lg:w-30 md:w-50 group"
								style="height:40px"
								on:click={openModalLink}
								>
								<div
									style="width: 100%;height:100%"
									class="content-center sm:p-2 lg:p-2 group-hover:text-black text-white "
								>
									สร้าง Link เชิญเพื่อน
								</div>
							</Button></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Open the modal using ID.showModal() method -->
<dialog id="my_modal_2" class="modal">
	<div class="modal-box">
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
	<div class="modal-box">
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


<dialog id="my_modal_1" class="modal">
	<div class="modal-box">
		<!-- {currentId} {Status} -->
		<form method="dialog">
		  <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">รายละเอียดข้อมูล</h3>
		
		<div class="   grid grid-rows-4 px-5 bg-[#94969C] rounded-md" style="height: 350px;">
			
			<div class=" content-center   p-2">
				

				<label class="flex  bg-white rounded-lg  h-full">
					<div class=" content-center pl-5"><input type="checkbox" class="checkbox checkbox-lg" bind:checked={isChecked1}></div>
					<div class="mx-5 py-3">
						<div class="font-md font-semibold">Dashboard</div>
						<div class="font-xs lg:bolck md:block  sm:hidden hidden">สามารถเข้าถึง Dashboard </div>
						<div class="font-xs lg:hidden md:hidden sm:block block">เข้าถึง Dashboard </div>
					</div>
				  </label></div>
			<div class=" content-center  p-2  "><label class="flex bg-white rounded-lg  h-full">
				<div class=" content-center pl-5"><input type="checkbox" class="checkbox checkbox-lg " bind:checked={isChecked2}></div>
				<div class="mx-5 py-3">
					<div class="font-md font-semibold">Package</div>
					<div class="font-xs lg:bolck md:block sm:hidden hidden">สามารถเข้าถึง Package 	</div>
					<div class="font-xs lg:hidden md:hidden sm:block block">เข้าถึง Package 	</div>
				</div>
			  </label></div>
			  <div class=" content-center p-2"><label class="flex bg-white rounded-lg  h-full">
				<div class=" content-center pl-5"><input type="checkbox" class="checkbox checkbox-lg flex flex-col justify-center" bind:checked={isChecked4}></div>
				<div class="mx-5 py-3">
					<div class="font-md font-semibold">Slip Checker</div>
					<div class="font-xs lg:bolck md:block  sm:hidden hidden">สามารถใช้งานCheck Slip</div>
					<div class="font-xs lg:hidden md:hidden sm:block block">ใช้งานCheck Slip</div>
				</div>
			  </label></div>
			<div class=" content-center p-2"><label class="flex bg-white rounded-lg  h-full">
				<div class=" content-center pl-5"><input type="checkbox" class="checkbox checkbox-lg flex flex-col justify-center" bind:checked={isChecked3}></div>
				<div class="mx-5 py-3">
					<div class="font-md font-semibold">User Management</div>
					<div class="font-xs lg:bolck md:block  sm:hidden hidden">สามารถแก้สิทธิ์ Line เชื่อมต่อ </div>
					<div class="font-xs lg:hidden md:hidden sm:block block">แก้สิทธิ์ Line เชื่อมต่อ </div>
				</div>
			  </label></div>
			  
		</div>
		<div class="flex justify-center my-3"><Button on:click={() => submitValues(currentId)} class="px-3 py-6">บันทึการเปลี่ยน</Button></div>
		<div class="flex  justify-between">
			<div class=""><button class=" flex p-1  items-center " on:click={(event) => DeleteLineLink(currentId)}><svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" {...$$props}>
				<path fill="#ff0000" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z" />
			</svg>ยกเลิกเชื่อมต่อ</button></div>
			<div class=" content-center flex items-center"><div class="mr-2">{Status ? 'ใช้งาน' : 'ปิดใช้งาน'}</div><input
				type="checkbox"
				value="synthwave"
				class="toggle theme-controller toggle-success "
				id="menuToggle"
				bind:checked={Status}
				on:click={(event) => handleCheckboxChangeLine(event, currentId)}
			/></div>
			
		</div>
	  </div>
  </dialog>
  <dialog id="my_modal_5" class="modal">
	<div class="modal-box">
		<!-- {currentId} {Status} -->
		<form method="dialog">
		  <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={resetValues}>✕</button>
		</form>
		<h3 class="text-lg font-bold">เลือกสิทธิ์ในการเข้าถึง</h3>
		
		<div class="   grid grid-rows-4 px-5 bg-[#94969C] rounded-md" style="height: 350px;" >
			
			<div class=" content-center   p-2">
				

				<label class="flex  bg-white rounded-lg  h-full">
					<div class=" content-center pl-5"><input type="checkbox" class="checkbox checkbox-lg" bind:checked={isCheckedLink1}></div>
					<div class="mx-5 py-3">
						<div class="font-md font-semibold">Dashboard</div>
						<div class="font-xs lg:bolck md:block  sm:hidden hidden">สามารถเข้าถึง Dashboard </div>
						<div class="font-xs lg:hidden md:hidden sm:block block">เข้าถึง Dashboard </div>
					</div>
				  </label></div>
			<div class=" content-center  p-2  "><label class="flex bg-white rounded-lg  h-full">
				<div class=" content-center pl-5"><input type="checkbox" class="checkbox checkbox-lg " bind:checked={isCheckedLink2}></div>
				<div class="mx-5 py-3">
					<div class="font-md font-semibold">Package</div>
					<div class="font-xs lg:bolck md:block sm:hidden hidden">สามารถเข้าถึง Package 	</div>
					<div class="font-xs lg:hidden md:hidden sm:block block">เข้าถึง Package 	</div>
				</div>
			  </label></div>
			  <div class=" content-center p-2"><label class="flex bg-white rounded-lg  h-full">
				<div class=" content-center pl-5"><input type="checkbox" class="checkbox checkbox-lg flex flex-col justify-center" bind:checked={isCheckedLink4}></div>
				<div class="mx-5 py-3">
					<div class="font-md font-semibold">Slip Checker</div>
					<div class="font-xs lg:bolck md:block  sm:hidden hidden">สามารถใช้งานCheck Slip</div>
					<div class="font-xs lg:hidden md:hidden sm:block block">ใช้งานCheck Slip</div>
				</div>
			  </label></div>
			<div class=" content-center p-2"><label class="flex bg-white rounded-lg  h-full">
				<div class=" content-center pl-5"><input type="checkbox" class="checkbox checkbox-lg flex flex-col justify-center" bind:checked={isCheckedLink3}></div>
				<div class="mx-5 py-3">
					<div class="font-md font-semibold">Manage User</div>
					<div class="font-xs lg:bolck md:block  sm:hidden hidden">สามารถแก้สิทธิ์ Line เชื่อมต่อ </div>
					<div class="font-xs lg:hidden md:hidden sm:block block">แก้สิทธิ์ Line เชื่อมต่อ </div>
				</div>
			  </label></div>
		</div>
		<div class="flex justify-center my-3"><Button on:click={() => submitLink()} class="px-3 py-6">สร้าง ลิงค์ เชิญ</Button></div>
		{#if base64Result}
		<div class="relative my-3">
			<!-- Input ที่สามารถคลิกเพื่อคัดลอกเนื้อหาได้ -->
			<input
			  id="base64"
			  type="text"
			  class="input input-bordered w-full  pr-10"  
			  value={base64Result}
			  readonly
			  on:click={copyToClipboard}
			/>
			<!-- ไอคอนสำหรับการคัดลอก -->
			<button
			  class="absolute right-2 top-1/2 transform -translate-y-1/2"
			  on:click={copyToClipboard}
			  aria-label="Copy to clipboard"
			>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}>
				<path fill="black" d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2" />
				<path fill="black" d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z" />
			</svg>
			</button>
		  </div>
		  {#if showNotification}
    <div role="alert" class="alert alert-warning absolute bottom-0 right-0 transform -translate-x-0/2 -translate-y-full mt-2 w-auto">
      <span>คัดลอกลิงก์เรียบร้อย!</span>
    </div>
  {/if}
    {/if}
	  </div>
  </dialog>

  


  <dialog id="my_modal_4" class="modal">
	<div class="modal-box">
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
		<p class=" text-center">คุณไม่มีสิทธิ์ในการแก้ไขข้อมูล</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

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

	
</style>
