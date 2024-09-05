<script lang="ts">
import cookie from 'cookie';
	import * as Card from '$lib/components/ui/card';
	import logo from '$lib/image/merchant.png';
	import { onDestroy, onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	let cookieValues = null;
	let profiles: any[] = [];
	let id: any[] = [];
	console.log(id);
	let loading = true;
	let showConfirmButton = false;
	export let form;
	let profileData: { userId: string; pictureUrl: string; displayName: string }[] = [];
	let lastProfileData: any[] = [];
	onMount(async () => {
		profileData = getFromLocalStorage<{ userId: string; pictureUrl: string; displayName: string }>('DataUsers');
		const intervalId = startMonitoringLocalStorage();
		
		console.log('Initial Profile Data:', profileData);
		console.log('Parsed data:', JSON.parse(localStorage.getItem('DataUsers') || '[]'));
		checkCookie();

		try {
			console.log(profileData);
			const data = await GetProfile();
			// Use profileData here
			profiles = data;
			id.push(data.Id);
			console.log('profile : ', profiles, id, profileData);
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
		onDestroy(() => {
            return stopMonitoringLocalStorage(intervalId);
        });
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
		} else if (myCookie.Email) {
			console.log('Get by Email');
			url = `${PUBLIC_API_ENDPOINT}/merchant/profileemail/${myCookie.Email}`;
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

	// @ts-ignore
	function deleteCookie(name: string) {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
	}

	// @ts-ignore
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

	function getFromLocalStorage<T>(key: string): T[] {
		const item = localStorage.getItem(key);
		console.log('Data retrieved from localStorage:', item);
		if (item) {
			try {
				const parsedItem = JSON.parse(item);
				// ตรวจสอบว่าข้อมูลที่แปลงแล้วเป็นอาร์เรย์
				if (Array.isArray(parsedItem)) {
					return parsedItem as T[];
				} else {
					console.error('Data is not an array:', parsedItem);
					return [];
				}
			} catch (error) {
				console.error('Error parsing localStorage item:', error);
				return [];
			}
		}
		return [];
	}
	function checkCookie() {
		// อ่านค่าสถานะจากคุกกี้
		const cookie = document.cookie.split('; ').find((row) => row.startsWith('Status='));
		const status = cookie ? cookie.split('=')[1] : null;

		// ตรวจสอบค่าสถานะ และกำหนดค่าให้กับ showConfirmButton
		if (status) {
			showConfirmButton = true;
		}
	}

	function handleSubmit() {
		// Clear localStorage
		clearRemainingTime();
		// Submit the form
		deleteCookie('Status');
		document.getElementById('updateline').submit();
	}
	function clearRemainingTime() {
		localStorage.removeItem('DataUsers');
	}
	
	
let intervalId: number | NodeJS.Timeout;

function startMonitoringLocalStorage(): number | NodeJS.Timeout {
        intervalId = setInterval(() => {
            const newProfileData = getFromLocalStorage<{ userId: string; pictureUrl: string; displayName: string }>('DataUsers');
            if (!arraysEqual(newProfileData, lastProfileData)) {
				lastProfileData = newProfileData;
                profileData = newProfileData;
                console.log('Profile data updated:', profileData);
            }
        }, 1000);

        return intervalId;
    }
	function stopMonitoringLocalStorage(intervalId: number | NodeJS.Timeout) {
    clearInterval(intervalId);
}


function arraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].userId !== arr2[i].userId ||
            arr1[i].pictureUrl !== arr2[i].pictureUrl ||
            arr1[i].displayName !== arr2[i].displayName) {
            return false;
        }
    }

    return true;
}

function formatDate(registerDate: { split: (arg0: string) => { split: (arg0: string) => [any, any, any]; }[]; }) {
        // แยกวันที่และเวลาโดยใช้ "T" และแยกส่วนของปี-เดือน-วัน
        let [year, month, day] = registerDate.split("T")[0].split("-");
        // สร้างอาเรย์ของชื่อเดือน
        let monthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        // แปลงหมายเลขเดือนเป็นชื่อเดือน
        let monthName = monthNames[parseInt(month) - 1];
        // จัดรูปแบบวันที่ในรูปแบบ "วัน เดือน ปี"
        return `${parseInt(day)} ${monthName} ${year}`;
    }

    //////////////////////////////////////////////////////////////////////
    
   let showPopover = false;
  let showLineLogin = false;
  let lineAccounts = [
    { name: 'บัญชีตัวอย่าง 1', email: 'example1@line.com' },
    { name: 'บัญชีตัวอย่าง 2', email: 'example2@line.com' }
  ];

  let newAccount = { name: 'บัญชีใหม่', email: 'newaccount@line.com' };

  function togglePopover() {
    showPopover = !showPopover;
    showLineLogin = false;  // ปิดฟอร์มเพิ่มบัญชีเมื่อเปิด/ปิด Popover
  }

  function addNewAccount() {
    showLineLogin = !showLineLogin;
  }


  /**
	 * @param {number} index
	 */
  function removeAccount(index: number) {
  lineAccounts.splice(index, 1);  // ลบบัญชีออกจาก lineAccounts

  // ดึงข้อมูลจาก localStorage ที่มีชื่อว่า "DataUsers"
  const storedData = getFromLocalStorage<Array<{ userId: string; pictureUrl: string; displayName: string }>>('DataUsers');
  
  if (storedData) {
    console.log("StoredData", storedData);  // ตรวจสอบว่าดึงข้อมูลมาได้ถูกต้องหรือไม่

    // ลบข้อมูลตามลำดับที่ต้องการ
    storedData.splice(index, 1);

    // อัปเดตข้อมูลใน localStorage
    localStorage.setItem('DataUsers', JSON.stringify(storedData));
  } else {
    console.error("No data found in localStorage under 'DataUsers'");
  }
}
function handleRemove(event, index) {
        // Prevent form submission
        event.preventDefault();

        // Your logic to remove the account
        removeAccount(index);
    }

    let showDeleteButton = false;

  function handleMouseEnter() {
    showDeleteButton = true;
  }

  function handleMouseLeave() {
    showDeleteButton = false;
  }
   </script>

<div
class=" grid gap-4 md:grid-cols-1 lg:grid-cols-1 overflow-x-hidden lg:h-screen md:screen sm:h-screen h-screen w-100"
>
<div class="flex justify-center bg-slate-100">
    <div class="lg:my-0 md:my-0 sm:my-0 my-5">
        <div class=" text-center text-3xl  my-3">
            <a class="font-bold">Profile</a>
        </div>

        <div
            class="  bg-white w-80 lg:my-0 md:my-5 sm:my-0 my-8 sm:w-96 md:w-96 lg:w-full rounded-2xl border border-slate-300"
        >
            <div>
                <div>
                    <Card.Content class="flex justify-center relative">
                        <div
                            class="filter blur-md rounded-full flex justify-center my-5 w-96"
                            style="height:30%"
                        >
                            <div
                                class="chart-container content-center flex justify-center"
                                style="height: 130px;"
                            >
                                .
                            </div>

                            <div></div>
                        </div>

                        <img src={logo} alt="" class="w-32 h-32 my-5 absolute bottom-50 left-50" />
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
                    <Card.Root class=" text-black mx-5 border-none shadow-none">
                        <Card.Content class="mx-3 my-3 flex px-3  ">
                            <div style="width: 100%;">
                                <div class="text-3xl text-center">{profiles.MerchantName}</div>
                                <div class="text-sm text-wrap text-center my-2">
                                    Merchant ID : {#if profiles.MerchantId != 0}{profiles.MerchantId}{:else}-{/if}
                                </div>
                                <div class="flex justify-center my-2">
                                    {#if profiles.Status == 'ACTIVE'}
                                        <div
                                            class="  bg-green-500 text-center px-3 rounded-2xl text-sm text-white"
                                            style="height: 18px;"
                                        >
                                            ACTIVE
                                        </div>
                                    {:else}
                                        <div
                                            class="   bg-red-600 text-center px-3 rounded-2xl text-sm text-white"
                                            style="height: 18px;"
                                        >
                                            INACTIVE
                                        </div>
                                    {/if}
                                </div>
                            </div></Card.Content
                        >
                    </Card.Root>
                    <hr class=" bg-gray-400 my-3 mx-5" style="height: 3px;" />

                    <div class="mx-5">
                        <div class=" text-2xl text-center my-3">ข้อมูลส่วนตัว</div>

                        <div class=" grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                            <div class="text-sm">
                                <div class=" text-gray-500">Email</div>
                                <div class="text-xs my-2">{profiles.Email}</div>
                            </div>
                            <div class="text-sm">
                                <div class=" text-gray-500">URL</div>
                                <div class="text-xs my-2">{profiles.MerchantURL}</div>
                            </div>
                            <div class="text-sm">
                                <div class=" text-gray-500">Company</div>
                                <div class="text-xs my-2">{profiles.MerchantCompany}</div>
                            </div>
                            <div class="text-sm">
                                <div class=" text-gray-500">Address</div>
                                <div class="text-xs my-2">{profiles.AddressTH}</div>
                            </div>
                            <div class="text-sm">
                                <div class=" text-gray-500">Phone</div>
                                <div class="text-xs my-2">{profiles.MerchantTel}</div>
                            </div>
                            <div class="text-sm">
                                <div class=" text-gray-500">Date Registered</div>
                                <div class="text-xs my-2">{formatDate(profiles.RegisterDate)}</div>
                            </div>
                        </div>
                    </div>
                {/if}
                <div class="text-center">
                    <form id="updateline" method="post" action="?/UpdateLine">
                        {#each profileData as profile}
                            <input type="text" hidden name="uid" value={profile.userId} />
                            <input type="text" hidden name="name" value={profile.displayName} />
                            <div class="avatar online">
                                <div class="w-10 rounded-full">
                                    <img src={profile.pictureUrl} />
                                </div>
                            </div>
                        {/each}
                        <input type="text" hidden name="id" id="inputid" />
                    </form>
                </div>
                <div class="flex justify-center">
                    <!-- <Button
                        variant="outline"
                        class="my-2 flex text-center py-0 px-0 bg-green-500 rounded-full"
                        on:click={line}
                        style="width:30%;height:30px"
                        ><div style="width:100%;height:100%">
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
                    </Button> -->
                    <Button on:click={togglePopover}>จัดการการเชื่อมต่อ Line</Button>
                </div>
                <div class="popover-container">
   
    
                    {#if showPopover}
                    <div class="popover">
                        <div class="flex justify-between items-center">
                            <h3>บัญชี Line ที่เชื่อมต่อ</h3>
                            <!-- ปุ่มสำหรับปิด popover -->
                            <Button variant="ghost" on:click={() => showPopover = false} class="bg-none">
                             
                            </Button>
                          </div>
                      <ul class="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                        <form id="updateline" method="post" action="?/UpdateLine">
                        {#each profileData as profile , index}
                        <li class="flex items-center">
                           
                               
                                    <input type="text" hidden name="uid" value={profile.userId} />
                                    <input type="text" hidden name="name" value={profile.displayName} />
                                    <div class="avatar" 
                                   >
                                        <div class="w-10 rounded-full "  >
                                            <img src={profile.pictureUrl} />
                                            
                                        </div>
                                        
                        <Button variant="ghost" class=" text-red-600" on:click={(event) => handleRemove(event, index)}>ยกเลิกการเชื่อมต่อ</Button>

                                    </div>
                                
                                    
                    </li>
                        
                    {/each}
                    <input type="text" hidden name="id" id="inputid" />
                </form>
                      </ul>
                      <div class="flex justify-between">
                      <Button on:click={addNewAccount}>เชื่อมต่อบัญชีอื่น</Button>
                      <Button on:click={addNewAccount}>เชื่อมต่อ</Button>
                    </div>
                      {#if showLineLogin}
                      <div class="line-login">
                        <div class="flex justify-center">
                            <Button
                                variant="outline"
                                class="my-2 flex text-center py-0 px-0 bg-green-500 rounded-full"
                                on:click={line}
                                style="width:30%;height:30px"
                                ><div style="width:100%;height:100%">
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
                            </Button>
                        </div>
                      </div>
                      {/if}
                    </div>
                    {/if}
                  </div>
                
                
            </div>
        </div>
    </div>
</div>

</div>

  
  <style>
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
    .popover-container {
  position: relative;
}

.popover {
  position: absolute;
  bottom: 30px; 
  right:0px; 
  background-color: white;
  border: 1px solid #ccc;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 250px;
}

.popover ul {
  list-style-type: none;
  padding: 0;
}

.popover ul li {
  margin: 5px 0;
}

.popover button {
  margin-left: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
}

.line-button {
  display: inline-block;
  background-color: #00c300;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 10px;
}


  
  </style>


