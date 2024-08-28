<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import cookie from 'cookie';
	// @ts-ignore
	import { PUBLIC_oauth_KEY } from '$env/static/public';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { onMount } from 'svelte';
    import * as Card from "$lib/components/ui/card";
	const date = new Date();
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
	const day = date.getDate().toString().padStart(2, '0');

	// Generate a random 4-digit number
	const randomNumber = Math.floor(1000 + Math.random() * 9000).toString(); // Ensures a 4-digit number

	// Concatenate to form RefNo
	let refNo = `${year}${month}${day}${randomNumber}`;

	const Create = async () => {
		const price = sessionStorage.getItem('packageprice');
		const name = sessionStorage.getItem('packagename');
        const cookies = getCookies();
			const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log('Package : ', price, name);
		// Create URL parameters from form data
		let config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${PUBLIC_oauth_KEY}`
			}
		};
		var result = await fetch(
			`https://apis.paysolutions.asia/tep/api/v2/promptpay?merchantID=31817563&productDetail=${name}&customerEmail=napatone123@gmail.com&customerName=-&total=1&referenceNo=${refNo}`,
			config
		);

		const data = await result.json();
		console.log('Fetched data:', data);
		if (data) {
			return data.data.image;
			// return data.data.orderNo
		}
	};

	const CreateRefno = async () => {
		const price = sessionStorage.getItem('packageprice');
		const name = sessionStorage.getItem('packagename');
		const Id = sessionStorage.getItem('packageId');
        const cookies = getCookies();
			const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log('Package : ', price, name);
		// Create URL parameters from form data
		let config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				RefNo : refNo,
    			ProductId : Id,
    			MerchantId : myCookie.Id,
				Total : price
            })
		};
		var result = await fetch(
			`${PUBLIC_API_ENDPOINT}/payment/create`,
			config
		);

		const data = await result.json();
		console.log('Fetched data:', data);
		if (data) {
			return data;
			// return data.data.orderNo
		}
	};
	let dataImg="";

	onMount(async () => {
		
		const storedTime = localStorage.getItem('remainingTime');
		const Img = localStorage.getItem('Img');
		
    if (storedTime) {
        seconds = parseInt(storedTime, 10); // นำค่าที่เก็บไว้มาใช้
		dataImg = Img
		console.log('data : ', dataImg);
    }else{
		try {
			const data = await Create();
			CreateRefno();
			dataImg = data;
			console.log('dataIMG : ', dataImg);
			localStorage.setItem('Img', dataImg.toString());
			localStorage.setItem('RefNo', refNo.toString());
		} catch (error) {
			console.error('Error fetching profile:', error);
		}
	}
    if (!timerStarted) {
        startTimer();
		
    }


		
	});
	let timerStarted = false;
	let seconds = 10*60;
	let messageVisible = true;

	// ฟังก์ชันเริ่มต้นนับเวลา
	function startTimer() {
		timerStarted = true; // ตั้งค่าสถานะว่าเริ่มต้นแล้ว
		localStorage.setItem('remainingTime', seconds.toString());
		const intervalId = setInterval(async () => {
			seconds -= 1; // ลดค่าการนับเวลา
			localStorage.setItem('remainingTime', seconds.toString());
			const data = await Check();
			console.log("Check : ",data)
			// ตรวจสอบว่าหมดเวลา
			if (seconds <= 0 || data.Status == "SUCCESS") {
				clearInterval(intervalId); // หยุดการนับเวลา
				clearRemainingTime()
				messageVisible = false; // ซ่อนข้อความ
				if (data.Status =="SUCCESS") {
                    UpdatePackage()
                    window.location.assign("/dashboard")
				}
				window.location.assign("/package")
			}
		}, 1000); // ทำงานทุกๆ 1 วินาที

// เช็คเวลาแบบตรวจทุกๆ 5 วินาที
	// 	const intervalId = setInterval(async () => {
    //     seconds -= 1; // ลดค่าการนับเวลา
    //     localStorage.setItem('remainingTime', seconds.toString());

    //     // ตรวจสอบว่าหมดเวลา
    //     if (seconds <= 0) {
    //         clearInterval(intervalId); // หยุดการนับเวลา
    //         clearRemainingTime();
    //         messageVisible = false; // ซ่อนข้อความ
    //         window.location.assign("/package"); // ไปยังหน้า package
    //     }
    // }, 1000); // นับเวลาทุก 1 วินาที
	// 	const checkIntervalId = setInterval(async () => {
    //     const data = await Check(); // ฟังก์ชัน Check ถูกเรียกใช้งานที่นี่

    //     if (seconds <= 0 || data.length > 0) {
    //         clearInterval(intervalId); // หยุดการนับเวลา
    //         clearInterval(checkIntervalId); // หยุดการตรวจสอบ
    //         clearRemainingTime();
    //         messageVisible = false; // ซ่อนข้อความ
    //         if (data.length > 0) {
    //             UpdatePackage();
    //             window.location.assign("/dashboard");
    //         } else {
    //             window.location.assign("/package");
    //         }
    //     }
    // }, 5000);
	}
	
	function formatTime(seconds: number) {
		const minutes = Math.floor(seconds / 60); // คำนวณนาที
		const remainingSeconds = seconds % 60; // คำนวณวินาทีที่เหลือ
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	const Check = async () => {
		const refNo = localStorage.getItem('RefNo');
		let config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				RefNo : refNo
            })
		};
		var result = await fetch(
			`${PUBLIC_API_ENDPOINT}/payment/get`,
			config
		);
		// Create URL parameters from form data
		// let config = {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Accept: 'application/json',
		// 		apikey: 'AptnQj3WuOI',
		// 		merchantSecretKey: 'BPWiTNc5bmMJzeqH',
		// 		merchantID: '17563'
		// 	},
		// 	body: JSON.stringify({
		// 		merchantId: '17563', 
		// 		refno: refNo,
		// 		productDetail: 'QWERTY'
		// 	})
		// };
		// var result = await fetch(`https://apis.paysolutions.asia/order/orderdetailpost`, config);

		const data = await result.json();
		if (data) {
			return data.result;
		}
	};
	function getCookies() {
		return cookie.parse(document.cookie);
	}
    
    const UpdatePackage = async () => {
		// Create URL parameters from form data
        const Id = sessionStorage.getItem('packageId');
			const cookies = getCookies();
			const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
			console.log('package Id :', typeof(Id), typeof(myCookie.Id));
		    let config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				PackageId: parseInt(Id, 10),
                MerchantId: parseInt(myCookie.Id, 10),
			})
		};
		var result = await fetch(`${PUBLIC_API_ENDPOINT}/merchant/updatepackage`, config);

		const data = await result.json();
		console.log('Check data:', data);
		if (data) {
			return data;
		}
	};

	function clearRemainingTime() {
    localStorage.removeItem('remainingTime'); 
	localStorage.removeItem('Img');
	localStorage.removeItem('RefNo');
}


    
</script>

<!-- {#if messageVisible}
    {#if dataImg}
	<img src={dataImg} />
    {/if}
	<p>เวลาที่เหลือ: {formatTime(seconds)} วินาที</p>
{/if} -->
<div class="flex justify-center items-center" style="height: 500px;">
<Card.Root class=" lg:w-2/5 md:w-4/5">
    <Card.Header
        class="p-0 items-center justify-center "
    >
        <Card.Title class="text-lg font-medium"></Card.Title>
        
    </Card.Header>
    <Card.Content class="flex justify-center text-center ">
        
        <div>
        <p class="text-xl my-2">สแกนเพื่อชำระเงิน</p>
        {#if messageVisible}
        {#if dataImg}
        <img src={dataImg} />
        {/if}
        
        <p class=" lg:text-4xl md:text-4xl text-2xl my-3"> {formatTime(seconds)}</p>
    {/if}
    </div>
    </Card.Content>
</Card.Root>

</div>
