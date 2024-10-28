<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import cookie from 'cookie';
	// @ts-ignore
	import { PUBLIC_oauth_KEY } from '$env/static/public';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { onMount } from 'svelte';
    import * as Card from "$lib/components/ui/card";
	import dowlaod from"$lib/image/downloads.png";
	import payment from"$lib/image/Payment.png";
	const date = new Date();
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
	const day = date.getDate().toString().padStart(2, '0');

	// Generate a random 4-digit number
	const randomNumber = Math.floor(1000 + Math.random() * 9000).toString(); // Ensures a 4-digit number
	let packageprice="";
	let packagename="";
	// Concatenate to form RefNo
	let refNo = `${year}${month}${day}${randomNumber}`;

	const Create = async () => {
		const price = sessionStorage.getItem('packageprice');
		const name = sessionStorage.getItem('packagename');
        const cookies = getCookies();
			const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log('Package : ', price, name , myCookie.Email);
		// Create URL parameters from form data
		let config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${PUBLIC_oauth_KEY}`
			}
		};
		let url;
		if(myCookie.Type != "Line"){
			url = `https://apis.paysolutions.asia/tep/api/v2/promptpay?merchantID=31817563&productDetail=${name}&customerEmail=${myCookie.Email}&customerName=customer&total=${price}&referenceNo=${refNo}`
		}else{
			url = `https://apis.paysolutions.asia/tep/api/v2/promptpay?merchantID=31817563&productDetail=${name}&customerEmail=napatone123@gmail.com&customerName=customer&total=${price}&referenceNo=${refNo}`
			
		}
		console.log(" URL ",url)
		console.time('Fetch Only Create');
		const result = await fetch(url, config);
		const data = await result.json();
		console.timeEnd('Fetch Only Create');
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
		packageprice = sessionStorage.getItem('packageprice') as string;
		packagename = sessionStorage.getItem('packagename') as string;
		const storedTime = localStorage.getItem('remainingTime');
		localStorage.removeItem('timerCleared');
		const Img = localStorage.getItem('Img');
		
		
		
    if (storedTime) {
        seconds = parseInt(storedTime, 10); // นำค่าที่เก็บไว้มาใช้
		dataImg = Img as string
		console.log('data : ', dataImg);
    }else{
		try {
			
			const data = await Create();
			
			console.time('Fetch Only Create onMount');
			CreateRefno();
			console.timeEnd('Fetch Only Create onMount');
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
		function countdown() {
			const isTimerCleared = localStorage.getItem('timerCleared');
    
    // ถ้าตัวจับเวลาถูกล้าง ไม่ให้ทำงานต่อ
    if (isTimerCleared === 'true') {
        console.log('Timer was cleared on another page.');
        return; // หยุดการทำงาน
    }
        if (seconds > 0) {
            seconds -= 1; // ลดค่าการนับเวลา
            localStorage.setItem('remainingTime', seconds.toString());
            setTimeout(countdown, 1000); // ทำงานซ้ำทุกๆ 1 วินาที
        }
    }
		(window as any).intervalId = setInterval(async () => {
			// seconds -= 1; // ลดค่าการนับเวลา
			// localStorage.setItem('remainingTime', seconds.toString());
			const data = await Check();
			const datatest = await CheckLimit();  // ต้องลบถ้ามี postback 
			console.log("Check : ",data,datatest)
			// ตรวจสอบว่าหมดเวลา  ถ้าเป็น Postback ต้องเปิด อันนี้ test ใช้ อินคิวรี ปิดก่อน
			if(datatest.OrderAmount ==datatest.AmountLimit){  //ถ้าเป็น Postback datatest จะเปลี่ยนเป็น data เฉยๆ เพราะใช้แค่ตัวเดียวเช็ค
				const modal = document.getElementById('my_modal_2');
				if (modal) {
					modal.showModal();
					setTimeout(() => {
            		window.location.assign("/package");
        			}, 2000);
				}
				
			}
			if (seconds <= 0 || data.length > 0) {					//    || data.Status == "SUCCESS" ถ้าเป็น Postback ต้องใช้เงื่อนไขนี้ อันนี้ test ใช้ อินคิวรี
				clearInterval((window as any).intervalId); // หยุดการนับเวลา
				clearRemainingTime()
				messageVisible = false; // ซ่อนข้อความ
				if (data.length > 0) {   //    || data.Status == "SUCCESS" ถ้าเป็น Postback ต้องใช้เงื่อนไขนี้ อันนี้ test ใช้ อินคิวรี
                    UpdatePackage()
					if(datatest.OrderAmount == datatest.AmountLimit-1){   //ถ้าเป็น Postback datatest จะเปลี่ยนเป็น data เฉยๆ เพราะใช้แค่ตัวเดียวเช็ค
						UpdateLimitPackage()
					}
                    window.location.assign("/banklink")
				}
				if (seconds <= 0 ) {
                    window.location.assign("/package")
				}
			}
		}, 5000); // ทำงานทุกๆ 1 วินาที
		countdown();
	
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
		// let config = {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({
		// 		RefNo : refNo
        //     })
		// };
		// var result = await fetch(
		// 	`${PUBLIC_API_ENDPOINT}/payment/get`,
		// 	config
		// );
		// Create URL parameters from form data    ตัวล่าง Inquire  ตัวบน Postback
		let config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				apikey: 'AptnQj3WuOI',
				merchantSecretKey: 'BPWiTNc5bmMJzeqH',
				merchantID: '17563'
			},
			body: JSON.stringify({
				merchantId: '17563', 
				refno: refNo,
				productDetail: 'QWERTY'
			})
		};
		var result = await fetch(`https://apis.paysolutions.asia/order/orderdetailpost`, config);

		const data = await result.json();
		console.log("asdaada",data)
		if (data) {
			return data;			// Postback ใช้ data.result
		}
	};
	
//////////////////////////////////////////////////////////////////////////
	// ต้องลบถ้ามี postback 
	const CheckLimit = async () => {
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
		console.log("asdaada",data)
		if (data) {
			return data.result;			//data.result
		}
	};


	//////////////////////////////////////////////////////////////////////////


	function getCookies() {
		return cookie.parse(document.cookie);
	}
    
    const UpdatePackage = async () => {
		// Create URL parameters from form data
       		 const Id = sessionStorage.getItem('packageId') as string;
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
	if ((window as any).intervalId) {
    clearInterval((window as any).intervalId);
    console.log('Timer stopped.');
  }
}


const UpdateLimitPackage = async () => {
		const packagegId = sessionStorage.getItem('packageId')
		let config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			}
		};
		var result = await fetch(
			`${PUBLIC_API_ENDPOINT}/update/visibility/${packagegId}/false`,
			config
		);

		const data = await result.json();
		return data;
	};

	const filename = 'QRcode.png';
	function downloadImage(imageUrl: string, filename: string) {
    const link = document.createElement('a'); // สร้างลิงค์ใหม่
    link.href = imageUrl; // ตั้งค่า URL ของรูปภาพ
    link.download = filename; // ตั้งชื่อไฟล์เมื่อดาวน์โหลด

    // เพิ่มลิงค์ลงในเอกสารและคลิกเพื่อดาวน์โหลด
    document.body.appendChild(link);
    link.click(); // เริ่มการดาวน์โหลด
    document.body.removeChild(link); // ลบลิงค์หลังจากดาวน์โหลดเสร็จ
}
    
</script>

<!-- {#if messageVisible}
    {#if dataImg}
	<img src={dataImg} />
    {/if}
	<p>เวลาที่เหลือ: {formatTime(seconds)} วินาที</p>
{/if} -->
<div class="flex justify-center items-center flex-col h-[calc(100vh-41px)]  bg-primary-foreground ">
<Card.Root class=" lg:w-2/5 md:w-3/5">
    <Card.Header
        class="p-0 items-center justify-center "
    >
        <Card.Title class="text-lg font-medium"></Card.Title>
        
    </Card.Header>
    <Card.Content class="flex justify-center text-center ">
        
        <div>
        <p class="text-2xl mt-5 font-semibold">สแกนเพื่อชำระเงิน</p>
        {#if messageVisible}
		
        {#if dataImg}
		<div class="flex justify-center mt-3">
		<div class="border-2 border-[#113566] rounded-md overflow-hidden w-5/5  ">
		<!-- svelte-ignore a11y-missing-attribute -->
		<div class=" bg-[#113566]  flex justify-center"> <img src={payment}  width="120px" height="100px"/> </div>
		<!-- svelte-ignore a11y-missing-attribute -->
		<div class=""><img src={dataImg}  class="w-[220px] h-[220px] lg:w-[250px] lg:h-[230px]"/></div>
	</div>
	</div>
        {/if}
        <div class="text-lg flex justify-center items-center mt-3" >
			<span>แพ็คเกจ :</span>
			<p class="ml-2 text-lg  font-semibold  truncate">{packagename}</p>
		  </div>
		<div class="text-lg flex justify-center items-center">
			<span>จำนวนเงิน :</span>
			<p class="ml-2 text-2xl font-semibold " style="color:#1353EC">{(packageprice).toLocaleString()} Bath</p>
		  </div>
    {/if}
	
    </div>
    </Card.Content>
	<div class="m-5">
	<div class=" text-center p-3  bg-[#FEF6F6] text-[#E02424]">
        <p class=" lg:text-xl md:text-xl text-xl  font-semibold">หมดอายุใน  {formatTime(seconds)} นาที</p>
		<p class=" text-sm">*จ่ายสำเร็จแล้ว โปรดรอจนหน้าจอกลับไปยังหน้าหลัก</p>
		<p class=" text-sm">คิวอาร์โค้ดที่จ่ายสำเร็จแล้ว ไม่สามารถจ่ายซ้ำได้</p>
		</div>
	</div>
	<!-- svelte-ignore a11y-missing-attribute -->
	<div class="mx-5 mb-5"><Button variant="outline" class="w-full h-12 text-white hover:text-black  bg-primary font-semibold" on:click={() => downloadImage(dataImg, filename)}  ><img src="{dowlaod}" width="18px" height="18px" class="mr-3">ดาวน์โหลดคิวอาร์โค้ด</Button></div>
</Card.Root>

</div>

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
		<p class="py-4 text-center font-bold text-2xl">แพ็คเกจนี้ถูกซื้อครบจำนวนที่กำหนดแล้ว</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>


<style scoped>
.truncate {
    white-space: nowrap; /* ไม่ให้ข้อความแถวใหม่ */
    overflow: hidden; /* ซ่อนข้อความที่เกิน */
    text-overflow: ellipsis; /* แสดง ... เมื่อเกิน */
    max-width: 20ch; /* จำกัดความกว้างให้ไม่เกิน 15 ตัวอักษร */
}
</style>