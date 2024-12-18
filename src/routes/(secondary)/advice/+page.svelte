<!-- App.svelte -->
<script lang="ts">
	import { writable } from 'svelte/store';
	import PackageCard from './(components)/PackageCards.svelte';
	import { PUBLIC_API_ENDPOINT, PUBLIC_PAYSO_DEFAULT_SECRET } from '$env/static/public';
	import addGroup from '$lib/image/addGroup.png';
	import { afterUpdate, onMount } from 'svelte';
	let packages: any[] = [];
	let maxIndex = '';
	let loading = false;
	let randomNumber = 0;

	onMount(async () => {
		clearRemainingTime();
		try {
			const storedSteps = sessionStorage.getItem('steps');
			if (storedSteps) {
				// ถ้ามีค่า ให้ใช้ค่าใน sessionStorage
				// อัปเดตสถานะของทุกขั้นตอนก่อนหน้า
				currentStep = JSON.parse(storedSteps);
				updateAllPreviousSteps(currentStep);
			} else {
				// ถ้าไม่มีค่า ให้ตั้งค่าใหม่
				sessionStorage.setItem('steps', JSON.stringify(currentStep));
			}
			const datas = await GetPackage();
			// Use profileData here
			packages = datas.result;
			maxIndex = datas.result.length;
			const maxQuotaLimit = Math.max(...packages.map((pkg) => pkg.OrderAmount));
			randomNumber = maxQuotaLimit;
		} catch (error) {
			console.error('Error fetching profile:', error);
		}
	});
	const GetPackage = async () => {
		// Create URL parameters from form data
		let config = {
			method: 'GET', //การทำงาน get post update delete
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
			}
		};
		var result = await fetch(`${PUBLIC_API_ENDPOINT}/package/packageactive`, config);
		const data = await result.json();
		return data;
	};

	function clearRemainingTime() {
		localStorage.removeItem('remainingTime'); // การใช้งานที่ถูกต้อง
		localStorage.removeItem('Img');
		localStorage.removeItem('RefNo');
		localStorage.setItem('timerCleared', 'true');
		if ((window as any).intervalId) {
			clearInterval((window as any).intervalId);
			console.log('Timer stopped.');
		}
	}
	// Store สำหรับเก็บข้อมูลฟอร์ม
	const formData = writable({
		// Basic Details
		firstName: '',
		lastName: '',
		username: '',
		password: '',

		// Contact Details
		email: '',
		phone: '',
		address: '',
		city: '',
		packageId: '',
		packageName: '',
		packagePrice: '',

		// Verification
		idCard: null,
		selfie: null
	});
	const selectedPackage = writable(null);
	async function handlePackageSelect(event: { detail: { price: any; name: any; id: any } }) {
		const { price, name, id } = event.detail;
		console.log('----------------------', price, name, id);
		$selectedPackage = { price, name, id };
		$formData.packageId = id;
		$formData.packageName = name;
		$formData.packagePrice = price;
		packagename = name;
		packageprice = price;
		// ไปขั้นตอนถัดไป

		const storedTime = localStorage.getItem('remainingTime');
		localStorage.removeItem('timerCleared');
		const Img = localStorage.getItem('Img');
		sessionStorage.removeItem('hasShownWarning');

		if (storedTime) {
			seconds = parseInt(storedTime, 10); // นำค่าที่เก็บไว้มาใช้
			dataImg = Img as string;
			console.log('data : ', dataImg);
		} else {
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
		updateStepStatus(currentStep);
		currentStep = 1;
		currentSubStep = 0;
		sessionStorage.setItem('steps', JSON.stringify(currentStep));
		// อัพเดทสถานะ steps
		// $steps = $steps.map((step, index) => ({
		//     ...step,
		//     active: index === currentStep,
		//     completed: index < currentStep
		// }));
	}
	// Store สำหรับเก็บสถานะ steps
	const steps = writable([
		{
			label: 'Package',
			completed: false,
			active: false,
			subSteps: [{ label: 'เลือกแพ็คเกจตามต้องการ', completed: false }]
		},
		{
			label: 'Payment',
			completed: false,
			active: false,
			subSteps: [{ label: 'ชำระเงิน', completed: false }]
		},
		{
			label: 'Bank',
			completed: false,
			active: false,
			subSteps: [{ label: 'เพิ่มธนาคารของคุณ', completed: false }]
		},
		{
			label: 'Room',
			completed: false,
			active: false,
			subSteps: [{ label: 'เพิ่มห้องเพื่อยืนในกลุ่มไลน์', completed: false }]
		},
		{
			label: 'Group Line',
			completed: false,
			active: false,
			subSteps: [{ label: 'สร้างกลุ่มของในไลน์และเชิญ SURESURE', completed: false }]
		},
		{
			label: 'สำเร็จ',
			completed: false,
			active: false,
			subSteps: []
		}
	]);

	let currentStep = 0;
	let currentSubStep = 0;

	function updateAllPreviousSteps(currentSteptest: any) {
		for (let i = 0; i < currentSteptest; i++) {
			console.log(i, currentSteptest);
			updateStepStatus(i); // อัปเดตสถานะของทุกขั้นตอนก่อนหน้า
		}
	}
	// อัพเดทสถานะ step
	function updateStepStatus(stepIndex: any) {
		$steps = $steps.map((step, index) => {
			if (index === stepIndex) {
				const updatedSubSteps = step.subSteps.map((subStep, subIndex) => ({
					...subStep,
					completed: subIndex === currentSubStep ? true : subStep.completed
				}));

				const allSubStepsCompleted = updatedSubSteps.every((sub) => sub.completed);

				return {
					...step,
					subSteps: updatedSubSteps,
					completed: allSubStepsCompleted
				};
			}
			return step;
		});
	}

	// จัดการการ submit form

	// ---------------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------
	import { Button } from '$lib/components/ui/button';
	import cookie from 'cookie';
	// @ts-ignore
	import { PUBLIC_oauth_KEY } from '$env/static/public';
	import * as Card from '$lib/components/ui/card';
	import dowlaod from '$lib/image/downloads.png';
	import payment from '$lib/image/Payment.png';
	const date = new Date();
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
	const day = date.getDate().toString().padStart(2, '0');

	// Generate a random 4-digit number
	const randomNumberpayment = Math.floor(1000 + Math.random() * 9000).toString(); // Ensures a 4-digit number
	let packageprice = '';
	let packagename = '';
	// Concatenate to form RefNo
	let refNo = `${year}${month}${day}${randomNumberpayment}`;

	const Create = async () => {
		const price = sessionStorage.getItem('packageprice');
		const name = sessionStorage.getItem('packagename');
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log('Package : ', price, name, myCookie.Email);
		// Create URL parameters from form data
		let config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				Accept: 'application/json',
				Authorization: `Bearer ${PUBLIC_oauth_KEY}`
			}
		};
		let url;
		if (myCookie.Type != 'Line') {
			url = `https://apis.paysolutions.asia/tep/api/v2/promptpay?merchantID=31817563&productDetail=${name}&customerEmail=${myCookie.Email}&customerName=customer&total=${price}&referenceNo=${refNo}`;
		} else {
			url = `https://apis.paysolutions.asia/tep/api/v2/promptpay?merchantID=31817563&productDetail=${name}&customerEmail=napatone123@gmail.com&customerName=customer&total=${price}&referenceNo=${refNo}`;
		}
		console.log(' URL ', url);
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
				'ngrok-skip-browser-warning': 'true'
			},
			body: JSON.stringify({
				RefNo: refNo,
				ProductId: Id,
				MerchantId: myCookie.Id,
				Total: price
			})
		};
		var result = await fetch(`${PUBLIC_API_ENDPOINT}/payment/create`, config);
		const data = await result.json();
		console.log('Fetched data:', data);
		if (data) {
			return data;
			// return data.data.orderNo
		}
	};
	let dataImg = '';
	let timerStarted = false;
	let seconds = 10 * 60;
	let messageVisible = true;

	// ฟังก์ชันเริ่มต้นนับเวลา
	function startTimer() {
		timerStarted = true; // ตั้งค่าสถานะว่าเริ่มต้นแล้ว
		localStorage.setItem('remainingTime', seconds.toString());
		const packagePrice = sessionStorage.getItem('packageprice');
		const packageName = sessionStorage.getItem('packagename');
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
				if (packagePrice == '0.00' && packageName == 'Free trial') {
					UpdatePayment();
					UpdatePackage();
					clearRemainingTime();
					const modal = document.getElementById('my_modal_4');
					if (modal) {
						modal.showModal();
						setTimeout(() => {
							updateStepStatus(currentStep);
							currentStep = 2;

							currentSubStep = 0;
							sessionStorage.setItem('steps', JSON.stringify(currentStep));
							modal.close();
						}, 2000);
					}
				}
				setTimeout(countdown, 1000); // ทำงานซ้ำทุกๆ 1 วินาที
			}
		}
		(window as any).intervalId = setInterval(async () => {
			// seconds -= 1; // ลดค่าการนับเวลา
			// localStorage.setItem('remainingTime', seconds.toString());
			const data = await Check();
			const datatest = await CheckLimit(); // ต้องลบถ้ามี postback
			// console.log("Check : ",data,datatest)
			// ตรวจสอบว่าหมดเวลา  ถ้าเป็น Postback ต้องเปิด อันนี้ test ใช้ อินคิวรี ปิดก่อน
			if (datatest.OrderAmount == datatest.AmountLimit) {
				//ถ้าเป็น Postback datatest จะเปลี่ยนเป็น data เฉยๆ เพราะใช้แค่ตัวเดียวเช็ค
				const modal = document.getElementById('my_modal_2');
				if (modal) {
					modal.showModal();
					setTimeout(() => {
						currentStep = 0;
						currentSubStep = 0;
						sessionStorage.setItem('steps', JSON.stringify(currentStep));
					}, 2000);
				}
			}
			// if(packagePrice == "0.00" && packageName == "Free trial"){
			// 		console.log("--------",packagePrice,packageName)
			// 	}

			if (
				seconds <= 0 ||
				data.length > 0 ||
				(packagePrice == '0.00' && packageName == 'Free trial')
			) {
				//    || data.Status == "SUCCESS" ถ้าเป็น Postback ต้องใช้เงื่อนไขนี้ อันนี้ test ใช้ อินคิวรี
				clearInterval((window as any).intervalId); // หยุดการนับเวลา
				messageVisible = false; // ซ่อนข้อความ
				if (data.length > 0 || (packagePrice == '0.00' && packageName == 'Free trial')) {
					//    || data.Status == "SUCCESS" ถ้าเป็น Postback ต้องใช้เงื่อนไขนี้ อันนี้ test ใช้ อินคิวรี
					UpdatePayment();
					UpdatePackage();
					if (datatest.OrderAmount == datatest.AmountLimit - 1) {
						//ถ้าเป็น Postback datatest จะเปลี่ยนเป็น data เฉยๆ เพราะใช้แค่ตัวเดียวเช็ค
						UpdateLimitPackage();
					}
					clearRemainingTime();
					const modal = document.getElementById('my_modal_4');
					if (modal) {
						modal.showModal();
						setTimeout(() => {
							updateStepStatus(currentStep);
							currentStep = 2;
							currentSubStep = 0;
							sessionStorage.setItem('steps', JSON.stringify(currentStep));
							modal.close();
						}, 2000);
					}
				}

				if (seconds <= 0) {
					clearRemainingTime();
					currentStep = 0;
					currentSubStep = 0;
				}
			}
		}, 5000); // ทำงานทุกๆ 1 วินาที
		countdown();
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
		// 		'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
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
				'ngrok-skip-browser-warning': 'true',
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
		console.log('asdaada', data);
		if (data) {
			return data; // Postback ใช้ data.result
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
				'ngrok-skip-browser-warning': 'true'
			},
			body: JSON.stringify({
				RefNo: refNo
			})
		};
		var result = await fetch(`${PUBLIC_API_ENDPOINT}/payment/get`, config);

		const data = await result.json();
		console.log('asdaada', data);
		if (data) {
			return data.result; //data.result
		}
	};

	function getCookies() {
		return cookie.parse(document.cookie);
	}

	const UpdatePackage = async () => {
		// Create URL parameters from form data
		const Id = sessionStorage.getItem('packageId') as string;
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log('package Id :', typeof Id, typeof myCookie.Id);
		let config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
			},
			body: JSON.stringify({
				PackageId: parseInt(Id, 10),
				MerchantId: parseInt(myCookie.Id, 10)
			})
		};
		var result = await fetch(`${PUBLIC_API_ENDPOINT}/merchant/updatepackage`, config);

		const data = await result.json();
		console.log('Check data:', data);
		if (data) {
			return data;
		}
	};

	const UpdatePayment = async () => {
		// Create URL parameters from form data
		const refNo = localStorage.getItem('RefNo');
		console.log(refNo);
		let config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
			},
			body: JSON.stringify({
				RefNo: refNo
			})
		};
		var result = await fetch(`${PUBLIC_API_ENDPOINT}/payment/callback`, config);

		const data = await result.json();
		console.log('Check data:', data);
		if (data) {
			return data;
		}
	};

	const UpdateLimitPackage = async () => {
		const packagegId = sessionStorage.getItem('packageId');
		let config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
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
	// 	function downloadImage(imageUrl: string, filename: string) {
	//     const link = document.createElement('a'); // สร้างลิงค์ใหม่
	//     link.href = imageUrl; // ตั้งค่า URL ของรูปภาพ
	//     link.download = filename; // ตั้งชื่อไฟล์เมื่อดาวน์โหลด

	//     // เพิ่มลิงค์ลงในเอกสารและคลิกเพื่อดาวน์โหลด
	//     document.body.appendChild(link);
	//     link.click(); // เริ่มการดาวน์โหลด
	//     document.body.removeChild(link); // ลบลิงค์หลังจากดาวน์โหลดเสร็จ
	// }
	const downloadImage = async (imageUrl: string, filename: string) => {
		try {
			// สร้าง Blob จาก URL
			const response = await fetch(imageUrl);
			const blob = await response.blob();

			// สร้าง Object URL

			// ย้ายการตรวจสอบ iOS มาไว้ในฟังก์ชัน
			const isMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
			const canUseShare =
				navigator.canShare &&
				navigator.canShare({ files: [new File([blob], filename, { type: blob.type })] });

			if (isMobile && canUseShare) {
				// สำหรับ iOS: เปิดรูปในแท็บใหม่
				// window.open(blobUrl, '_blank');
				await navigator.share({
					files: [new File([blob], filename, { type: blob.type })],
					title: 'ดาวน์โหลดรูปภาพ',
					text: 'บันทึกภาพลงในเครื่องของคุณ'
				});
			} else {
				// สำหรับระบบปฏิบัติการอื่นๆ
				const blobUrl = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = blobUrl;
				link.download = filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(() => {
					window.URL.revokeObjectURL(blobUrl);
				}, 100);
			}

			// ทำความสะอาด Object URL
		} catch (error) {
			console.error('เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ:', error);
			alert('ไม่สามารถดาวน์โหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
		}
	};
	// ---------------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------

	let isOpen = false;
	let selectedBank: { imageUrl: any; name: any; code: any } | null = null;
	let AccNoBank = '';
	let NameTHBank = '';
	let LastNameTHBank = '';
	let NameENBank = '';
	let LastNameENBank = '';
	let AccNoPP = '';
	let NameTHPP = '';
	let LastNameTHPP = '';
	let NameENPP = '';
	let LastNameENPP = '';
	let selectedMethod = 'bank';

	let rooms: any[] = [];

	function selectBank(bank: any) {
		selectedBank = bank;
		isOpen = false;
	}

	let isBankSelected = true;
	let isPromptPaySelected = false;

	function showBankForm() {
		selectedMethod = 'bank';
		isBankSelected = true;
		isPromptPaySelected = false;
		selectedOption = '';
		AccNoPP = '';
		NameTHPP = '';
		LastNameTHPP = '';
		NameENPP = '';
		LastNameENPP = '';
		isOpen = false;
	}

	function showPromptPayForm() {
		selectedMethod = 'promptpay';
		isBankSelected = false;
		isPromptPaySelected = true;
		selectedBank = '';
		AccNoBank = '';
		LastNameTHBank = '';
		LastNameENBank = '';
		NameTHBank = '';
		NameENBank = '';
		isOpen = false;
	}

	// สถานะเปิดปิดเมนู dropdown
	let selectedOptionBank = ''; // ตัวเลือกที่เลือกไว้
	const options = [
		{ label: 'เบอร์โทร', value: 'MSISDN', imageUrl: '/src/lib/image/phone.png' },
		{ label: 'เลขประจำตัว', value: 'NATID', imageUrl: '/src/lib/image/bg-people.png' },
		{ label: 'e-Wallet ID', value: 'EWALLETID', imageUrl: '/src/lib/image/phone.png' },
		{ label: 'บัญชีธนาคาร', value: 'BANKAC', imageUrl: '/src/lib/image/bg-people.png' }
	];
	function selectOptionBank(option: any) {
		selectedOption = option; // อัปเดตตัวเลือกที่เลือก
		isOpen = false; // ปิดเมนูหลังจากเลือกตัวเลือกแล้ว
	}
	interface BankInfo {
		Bank?: string;
		AccountNo: string;
		NameTH: string;
		NameEN: string;
	}

	interface PPInfo {
		PPType: string;
		AccountNo: string;
		NameTH: string;
		NameEN: string;
	}
	// Define the createBank function before sendData
	const createBank = async (info: BankInfo | PPInfo) => {
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;

		if (!myCookie) {
			throw new Error('Merchant account information not found in cookies');
		}

		let payload;
		if ('Bank' in info) {
			const encryptedAccountNo = await encryptAccountNo(info.AccountNo.toString());
			// กรณีที่มี BankCode
			payload = {
				MerchantId: myCookie.Id,
				BankCode: info.Bank,
				PPTYPE: null,
				AccountNo: encryptedAccountNo,
				TypeAccount: 'BANK',
				NameTH: info.NameTH,
				NameEN: info.NameEN
			};
		} else if ('PPType' in info) {
			const encryptedAccountNo = await encryptAccountNo(info.AccountNo.toString());
			// กรณีที่มี PPTYPE
			payload = {
				MerchantId: myCookie.Id,
				BankCode: null,
				PPTYPE: info.PPType,
				AccountNo: encryptedAccountNo,
				TypeAccount: 'PP',
				NameTH: info.NameTH,
				NameEN: info.NameEN
			};
		} else {
			throw new Error('Invalid information provided');
		}

		try {
			const requestBody = {
				rooms: selectedRoomIds,
				bank: payload
			};
			console.log('AccountNo', requestBody);
			const response = await fetch(`${PUBLIC_API_ENDPOINT}/create/bank`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'ngrok-skip-browser-warning': 'true'
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			console.log('Bank information created successfully!');
			const modal = document.getElementById('my_modal_3');

			if (modal) {
				modal.showModal();
				selectedBank = '';
				AccNoBank = '';
				NameTHBank = '';
				NameENBank = '';
				LastNameENBank = '';
				LastNameENPP = '';
				LastNameTHBank = '';
				LastNameTHPP = '';
				selectedOption = '';
				AccNoPP = '';
				NameTHPP = '';
				NameENPP = '';
				setTimeout(() => {
					updateStepStatus(currentStep);
					currentStep = 3;
					currentSubStep = 0;
					sessionStorage.setItem('steps', JSON.stringify(currentStep));
					modal.close();
				}, 3000); // 3000 ms = 3 seconds
			}
			return await response.json();
		} catch (error) {
			console.error('Error:', error.message || error);
			throw error;
		}
	};
	async function sendData(
		Bank: string | null,
		AccNoBank: string | null,
		NameTHBank: string | null,
		NameENBank: string | null,
		LastNameTHBank: string | null,
		LastNameENBank: string | null,
		PPType: string | null,
		AccNoPP: string | null,
		NameTHPP: string | null,
		NameENPP: string | null,
		LastNameTHPP: string | null,
		LastNameENPP: string | null
	) {
		console.log('Bank:', Bank);
		console.log('AccNoBank:', AccNoBank);
		console.log('NameTHBank:', NameTHBank);
		console.log('NameENBank:', NameENBank);
		console.log('PPType:', PPType);
		console.log('AccNoPP:', AccNoPP);
		console.log('NameTHPP:', NameTHPP);
		console.log('NameENPP:', NameENPP);

		// Call createBank with the parameters received
		if (Bank) {
			// กรณี Bank
			createBank({
				Bank: Bank,
				AccountNo: AccNoBank || '',
				NameTH: `${NameTHBank || ''} ${LastNameTHBank || ''}`,
				NameEN: `${NameENBank || ''} ${LastNameENBank || ''}`
			});
		} else if (PPType) {
			// กรณี PPType
			createBank({
				PPType: PPType,
				AccountNo: AccNoPP || '',
				NameTH: `${NameTHPP || ''} ${LastNameTHPP || ''}`,
				NameEN: `${NameENPP || ''} ${LastNameENPP || ''}`
			});
		} else {
			console.error('ไม่มีข้อมูล Bank หรือ PPType ที่ถูกต้อง');
		}
	}

	function handleInput(event: { target: { value: any } }) {
		// รับค่า input และอนุญาตเฉพาะตัวเลข
		let inputValue = event.target.value.replace(/[^0-9]/g, '');

		// จำกัดความยาวไม่เกิน 15 ตัว
		if (inputValue.length > 15) {
			inputValue = inputValue.slice(0, 15);
		}

		// อัพเดทค่าใน Svelte
		// AccNoBank = inputValue;
		// อัพเดทค่าใน input
		event.target.value = inputValue;
	}

	function handleInputName(event: { target: { value: any } }) {
		let inputValue = event.target.value;

		inputValue = inputValue.replace(/[0-9]/g, ''); // ลบตัวเลข
		if (inputValue.charAt(0) === ' ') {
			inputValue = inputValue.trimStart(); // ลบช่องว่างเฉพาะตัวแรก
		}

		event.target.value = inputValue;
	}

	let selectedRoomIds: any[] = [];
	function toggleRoom(roomId: any, isChecked: any) {
		if (isChecked) {
			selectedRoomIds = [...selectedRoomIds, roomId];
		} else {
			selectedRoomIds = selectedRoomIds.filter((id) => id !== roomId);
		}
		console.log('Selected rooms:', selectedRoomIds); // For debugging
	}

	// ---------------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------

	import QRCode from 'qrcode';
	import CryptoJS from 'crypto-js';
	import { PUBLIC_SECRETKEY } from '$env/static/public';
	import { goto } from '$app/navigation';
	let banks: any[] = [];
	let minPayment = 1;
	let paymentAmount = minPayment;
	let Name = '';
	let NotiOnLineGroupId = '';
	interface Rooms {
		Id: any;
		RoomName: any;
		TotalQuotaUsed: any;
		MinAmountReceive: number;
		HideSenderDetail: boolean;
		HideReceiverDetail: boolean;
		NotiOnValid?: string;
		NotiOnInvalid?: string;
		NotiOnInvalidUnverified?: string;
		NotiOnInvalidReceiverBankAccount?: string;
		NotiOnInvalidMinAmount?: string;
		NotiOnQuotaLimitExceed?: string;
		TransactionSummary?: string;
	}
	const bankchecks = [
		{
			code: '002',
			name: 'ธ.กรุงเทพ',
			imageUrl: 'https://moneyexpo.net/wp-content/uploads/2023/05/BBL.jpg'
		},
		{
			code: '004',
			name: 'ธ.กสิกรไทย',
			imageUrl: 'https://i.pinimg.com/736x/cb/7c/ca/cb7cca77e49eece5ce042aa9f25ad27c.jpg'
		},
		{
			code: '006',
			name: 'ธ.กรุงไทย',
			imageUrl: 'https://moneyexpo.net/wp-content/uploads/2023/05/KTB.jpg'
		},
		{
			code: '009',
			name: 'ธ.โอเวอร์ซี',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_ocbc@2x.png'
		},
		{
			code: '011',
			name: 'ธ.ทหารไทยธนชาต',
			imageUrl: 'https://media.ttbbank.com/1/global/ttb.jpg'
		},
		{
			code: '014',
			name: 'ธ.ไทยพาณิชย์',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_sb@2x.png'
		},
		{
			code: '017',
			name: 'ธ.ซิตี้แบงก์',
			imageUrl: 'https://moneyandbanking.co.th/wp-content/uploads/2024/04/Citi-Bank-905x613.webp'
		},
		{
			code: '018',
			name: 'ธ.ซูมิโตโม มิตซุย',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_smbc@2x.png'
		},
		{
			code: '020',
			name: 'ธ.สแตนดาร์ดชาร์เตอร์ด',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_scthai@2x.png'
		},
		{
			code: '022',
			name: 'ธ.CIMB ไทย',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_cimbthai@2x.png'
		},
		{
			code: '024',
			name: 'ธ.ยูโอบี',
			imageUrl: 'https://cms-tpq.theparq.com/wp-content/uploads/2020/07/UOB_LOGO_800x800.png'
		},
		{
			code: '025',
			name: 'ธ.กรุงศรี',
			imageUrl:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhQjvxKz4c3kDRgXc3YS1gVDAv1rlVu6NIEA&s'
		},
		{
			code: '030',
			name: 'ธ.ออมสิน',
			imageUrl:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKB3R_1uIDD6IOdNF0ASnynXcUrrdxs3OUVw&s'
		},
		{
			code: '031',
			name: 'ธ.ฮ่องกงและเซี่ยงไฮ้แบงกิ้ง',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_hsbc@2x.png'
		},
		{
			code: '032',
			name: 'ธ.ดอยซ์แบงก์',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_deutsche@2x.png'
		},
		{
			code: '033',
			name: 'ธ.อาคารสงเคราะห์',
			imageUrl: 'https://ghbloyalty.ghbank.co.th/logo_ghb.png'
		},
		{
			code: '034',
			name: 'ธ.เพื่อการเกษตรและสหกรณ์การเกษตร',
			imageUrl: 'https://s.isanook.com/mn/0/ud/175/877323/fack.jpg'
		},
		{
			code: '039',
			name: 'ธ.มิซูโฮ',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_mizuho@2x.png'
		},
		{
			code: '045',
			name: 'ธ.บีเอ็นพี พารีบาส์',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_bnpparibas@2x.png'
		},
		{
			code: '052',
			name: 'ธ.ประเทศจีน',
			imageUrl:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMrfV_dWH9d6FO7JrEw11bWRbiIx0izN_I5g&s'
		},
		{
			code: '066',
			name: 'ธ.อิสลาม',
			imageUrl:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIzQBxnxe1oqnWPkll8vmLqnxJcaRanB23ow&s'
		},
		{
			code: '067',
			name: 'ธ.ทิสโก้',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_tisco@2x.png'
		},
		{
			code: '069',
			name: 'ธ.เกียรตินาคิน',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_kkp@2x.png'
		},
		{
			code: '070',
			name: 'ธ.ICBC ไทย',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_icbc@2x.png'
		},
		{
			code: '071',
			name: 'ธ.ไทยเครดิต',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_thaicredit@2x.png'
		},
		{
			code: '073',
			name: 'ธ.แลนด์ แอนด์ เฮ้าส์',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_lhbank@2x.png'
		},
		{
			code: '098',
			name: 'ธ.พัฒนาวิสาหกิจขนาดกลางและขนาดย่อม',
			imageUrl: 'https://csrgroup.co.th/img/Client258-6.png'
		}
	];

	// สถานะเปิดปิดเมนู dropdown
	let selectedOption = ''; // ตัวเลือกที่เลือกไว้

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
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
			}
		};

		let url;
		if (myCookie.Id) {
			console.log('Get by Merchant Id');
			url = `${PUBLIC_API_ENDPOINT}/bankdata/${myCookie.Id}/-1/-1`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		const result = await fetch(url, config);
		const data = await result.json();
		console.log('Link Line', data);
		return data.result || [];
	};

	/**
	 * @param {string} bankCode
	 */
	function getBankImage(bankCode: string) {
		const bank = bankchecks.find((b) => b.code === bankCode);
		return bank ? bank.imageUrl : 'https://spoynt.com/wp-content/uploads/2023/12/promtpay-qr.png'; // กรณีไม่พบจะใช้ภาพ default
	}
	let selectedRoom: Rooms | null = null;
	let bankLinkRoom: any[] = [];

	let CheckedHideReceiverDetail = false;
	let CheckedHideSenderDetail = false;

	const increaseAmount = () => {
		paymentAmount += 1; // เพิ่มจำนวนเงินทีละ 1
	};

	const decreaseAmount = () => {
		if (paymentAmount > 0) {
			paymentAmount -= 1; // ลดจำนวนเงินทีละ 1 ถ้าจำนวนเงินไม่ต่ำกว่าขั้นต่ำ
		}
	};

	let selectedOptions = Array(8).fill(null);

	// ฟังก์ชันสำหรับเลือกตัวเลือก
	/**
	 * @param {number} row
	 * @param {string} option
	 */
	function selectOption(row: number, option: string) {
		selectedOptions[row] = option;
		console.log(selectedOptions);
	}

	function Update() {
		if (!Name) {
			errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วน'; // ตั้งค่า errorMessage
			document.getElementById('nameInput').scrollIntoView({ behavior: 'smooth', block: 'center' });
			return; // ไม่ทำการบันทึก
		}
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		if (Name != '') {
			const updateData = {
				// ชื่อห้อง
				RoomName: Name,
				LineGroupId: '',
				MerchantId: parseInt(myCookie.Id),
				// บัญชีที่เชื่อมต่อ - กรองเฉพาะบัญชีที่ถูกเลือก (checked)
				// linkedAccounts: selectedBankAccounts,

				// ยอดเงินขั้นต่ำ
				MinAmountReceive: paymentAmount,

				// การตั้งค่าการซ่อนข้อมูล

				HideSenderDetail: CheckedHideSenderDetail,
				HideReceiverDetail: CheckedHideReceiverDetail,

				// การตั้งค่าการแจ้งเตือน Line
				NotiOnLineGroupId: NotiOnLineGroupId,
				NotiOnValid: selectedOptions[0], // สลิปถูกต้อง
				NotiOnInvalid: selectedOptions[1], // สลิปถูกใช้งานแล้ว
				NotiOnInvalidReceiverBankAccount: selectedOptions[2], // สลิปไม่เจอ/หมดอายุ/ไม่พบ QR Code
				NotiOnInvalidUnverified: selectedOptions[3], // สลิปผู้รับเงินไม่ตรง
				NotiOnInvalidMinAmount: selectedOptions[4], // ยอดโอนต่ำกว่ากำหนด
				NotiOnQuotaLimitExceed: selectedOptions[5], // การแจ้งเตือนเติมโควตาและต่ออายุ
				NotiOnSlipDuplicated: selectedOptions[6],
				TransactionSummary: selectedOptions[7], // สรุปยอดสาขารายวัน
				QrToken: QrToken
			};
			console.log('rqrqrqrqrqrq', updateData, QrToken);
			CreateRoom(updateData, selectedBankAccounts);
		}
	}
	let selectedBankAccounts: any[] = [];
	const handleBankSelection = (bank: { AccountNo: any }, isChecked: any) => {
		if (isChecked) {
			selectedBankAccounts = [...selectedBankAccounts, bank];
		} else {
			selectedBankAccounts = selectedBankAccounts.filter((acc) => acc.AccountNo !== bank.AccountNo);
		}
	};

	const handleSenderToggle = () => {
		CheckedHideSenderDetail = !CheckedHideSenderDetail;
	};

	// handler สำหรับ receiver
	const handleReceiverToggle = () => {
		CheckedHideReceiverDetail = !CheckedHideReceiverDetail;
	};

	const CreateRoom = async (dataupdate: any, bankData: any[][]) => {
		const bankIds = bankData.map((bank) => bank.Id);
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log('data', dataupdate, bankIds);
		const requestBody = {
			rooms: dataupdate,
			bank: bankIds,
			email: myCookie.Email
		};
		let config = {
			method: 'POST', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
			},
			body: JSON.stringify(requestBody)
		};

		let url;
		if (dataupdate) {
			url = `${PUBLIC_API_ENDPOINT}/createroom`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		const result = await fetch(url, config);
		const data = await result.json();
		const modal = document.getElementById('my_modal_5');
		if (modal) {
			modal.showModal();
		}
		return data.result;
	};
	let QrToken: string;
	let qrcanvas1: HTMLCanvasElement;
	let encryptedData: string = '';
	let errorMessage: string = '';

	const encryptData = async (data: string): Promise<string | null> => {
		try {
			console.log('Encrypting data:', data);

			const encoder = new TextEncoder();
			const plaintextBytes = encoder.encode(data);

			// สร้าง nonce แบบสุ่ม (16 ไบต์สำหรับ AES-CTR)
			const nonce = crypto.getRandomValues(new Uint8Array(16));

			// นำเข้ากุญแจสำหรับ AES-CTR
			const keyBytes = encoder.encode(PUBLIC_PAYSO_DEFAULT_SECRET);
			const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CTR' }, false, [
				'encrypt'
			]);

			// เข้ารหัส plaintext โดยใช้ AES-CTR
			const ciphertext = await crypto.subtle.encrypt(
				{ name: 'AES-CTR', counter: nonce, length: 128 },
				cryptoKey,
				plaintextBytes
			);

			// รวม nonce และ ciphertext
			const combined = new Uint8Array(nonce.length + ciphertext.byteLength);
			combined.set(nonce);
			combined.set(new Uint8Array(ciphertext), nonce.length);

			// แปลงเป็น Base64 และคืนค่า
			const encrypted = btoa(String.fromCharCode(...combined));
			console.log('Encrypted result:', encrypted);

			return encrypted;
		} catch (error) {
			console.error('Encryption error:', error);
			const errorMessage = 'การเข้ารหัสผิดพลาด: ' + (error as Error).message;
			console.log(errorMessage);
			return null;
		}
	};

	// Function to generate QR code
	const generateQR = async (data: string): Promise<void> => {
		try {
			console.log('+++++++++++++', qrcanvas1);
			await QRCode.toCanvas(qrcanvas1, data, {
				width: 150,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#ffffff'
				}
			});
			console.log('+++++++++++++', qrcanvas1);

			// คัดลอก QR Code จาก canvas1 ไปยัง canvas2
			errorMessage = '';
		} catch (error) {
			errorMessage = 'การสร้าง QR Code ผิดพลาด: ' + (error as Error).message;
		}
	};

	const handleGenerate = async (): Promise<void> => {
		console.log('handleGenerate called'); // Debug log
		const timestampUtcSec = Math.floor(Date.now() / 1000);
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		QrToken = `PAYSO_ROOM_TOKEN:${myCookie.Id}:${timestampUtcSec}`;
		// Encrypt data
		const encrypted = await encryptData(QrToken);
		if (encrypted) {
			encryptedData = encrypted;
			console.log('QRtoken ', QrToken);
			await generateQR(encrypted);
		}
	};
	function handleInputNoti(event: { target: { value: string } }) {
		// Only allow alphanumeric characters
		NotiOnLineGroupId = event.target.value.replace(/[^A-Za-z0-9]/g, '');
	}

	$: if (currentStep === 3) {
		handleStep();
	}

	async function handleStep() {
		try {
			const bank = await GetBankLink();
			handleGenerate();
			banks = bank;

			// Set default values for selectedOptions
			selectedOptions = [
				'LINE_GROUP', // สลิปถูกต้อง
				'LINE_GROUP', // สลิปถูกใช้งานแล้ว
				'LINE_GROUP', // สลิปไม่เจอ/หมดอายุ/ไม่พบ QR Code
				'LINE_GROUP', // สลิปผู้รับเงินไม่ตรง
				'LINE_GROUP', // ยอดโอนต่ำกว่ากำหนด
				'LINE_GROUP', // การแจ้งเตือนเติมโควตาและต่ออายุ
				'LINE_GROUP', // ยังไม่ตั้งค่า
				'DISABLE'
			];

			console.log('Banks loaded:', banks);
		} catch (error) {
			console.error('Error in handleStep:', error);
		}
	}

	function StepStatustofinish() {
		updateStepStatus(currentStep); // เรียกฟังก์ชันที่คุณต้องการ
		currentStep = 5; // ตั้งค่า currentStep เป็น 4
		currentSubStep = 0; // ตั้งค่า currentSubStep เป็น 0
		sessionStorage.setItem('steps', JSON.stringify(currentStep));
	}
	let isSettingEnabled = false;
	function handleSettingChange() {
		if (!isSettingEnabled) {
			CheckedHideSenderDetail = false;
			CheckedHideReceiverDetail = false;
			paymentAmount = 0;
			selectedOptions = [
				'LINE_GROUP', // สลิปถูกต้อง
				'LINE_GROUP', // สลิปถูกใช้งานแล้ว
				'LINE_GROUP', // สลิปไม่เจอ/หมดอายุ/ไม่พบ QR Code
				'LINE_GROUP', // สลิปผู้รับเงินไม่ตรง
				'LINE_GROUP', // ยอดโอนต่ำกว่ากำหนด
				'LINE_GROUP', // การแจ้งเตือนเติมโควตาและต่ออายุ
				'LINE_GROUP', // ยังไม่ตั้งค่า
				'DISABLE' // ถูกปิด
			];
		} else {
		}
	}

	function handleNextStep() {
		const modal = document.getElementById('my_modal_5');
		updateStepStatus(currentStep); // Update step status
		currentStep = 4; // Set current step to 4
		currentSubStep = 0; // Reset sub step
		sessionStorage.setItem('steps', JSON.stringify(currentStep));
		modal.close(); // Close the modal
	}

	async function encryptAccountNo(accountNo: string): Promise<string> {
		const encoder = new TextEncoder();
		const plaintextBytes = encoder.encode(accountNo);

		// สร้าง nonce แบบสุ่ม (ขนาดของบล็อก AES)
		const nonce = new Uint8Array(16); // ขนาดบล็อก AES คือ 16 ไบต์
		window.crypto.getRandomValues(nonce);
		const key = new TextEncoder().encode(PUBLIC_PAYSO_DEFAULT_SECRET);
		// นำเข้ากุญแจสำหรับการเข้ารหัส AES-CTR
		const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: 'AES-CTR' }, false, [
			'encrypt'
		]);

		// เข้ารหัส plaintext โดยใช้ AES-CTR
		const ciphertext = await window.crypto.subtle.encrypt(
			{ name: 'AES-CTR', counter: nonce, length: 128 },
			cryptoKey,
			plaintextBytes
		);

		// รวม nonce และ ciphertext และเข้ารหัสเป็น base64
		const combined = new Uint8Array(nonce.length + ciphertext.byteLength);
		combined.set(nonce);
		combined.set(new Uint8Array(ciphertext), nonce.length);

		// แปลงผลลัพธ์เป็น base64
		return btoa(String.fromCharCode(...combined));
	}

	async function maskMiddle(accountNumber: string) {
		try {
			// ถอดรหัส Account Number
			const decryptedAccountNumber = await decryptAccountNo(accountNumber);

			// ตรวจสอบความยาว
			const length = decryptedAccountNumber.length;
			if (length < 7) return 'Invalid Account Number'; // ต้องยาวพอจะแบ่งส่วนได้
			let middleLength = Math.max(4, Math.floor(length / 3)); // อย่างน้อย 4 ตัว

			// ถ้าความยาวของเลขบัญชีเป็น 15 ตัว
			if (length === 15) {
				middleLength = 5; // กำหนดให้แสดงเลขกลาง 5 ตัวสำหรับบัญชีที่มี 15 ตัว
			}

			// แสดงเลขกลางจากตำแหน่งที่ 3 (index 3) ไปจนถึง middleLength
			const middle = decryptedAccountNumber.slice(3, 3 + middleLength);
			const prefix = 'xxx'; // ซ่อนเลขต้น

			const suffix = 'xxx'; // ซ่อนเลขท้าย

			return `${prefix}-${middle}-${suffix}`;
		} catch (error) {
			console.error('Error in maskMiddle:', error);
			return 'Error: Unable to mask account number';
		}
	}
	async function decryptAccountNo(encryptedBase64: string): Promise<string> {
		const combined = new Uint8Array(
			atob(encryptedBase64)
				.split('')
				.map((c) => c.charCodeAt(0))
		);

		// Extract the nonce (first 16 bytes)
		const nonce = combined.slice(0, 16);

		// Extract the ciphertext (remaining bytes after nonce)
		const ciphertext = combined.slice(16);

		// Recreate the key used for encryption (assuming you have access to the same secret)
		const key = new TextEncoder().encode(PUBLIC_PAYSO_DEFAULT_SECRET);

		// Import the key for decryption
		const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: 'AES-CTR' }, false, [
			'decrypt'
		]);

		// Decrypt the ciphertext using AES-CTR
		const decryptedBytes = await window.crypto.subtle.decrypt(
			{ name: 'AES-CTR', counter: nonce, length: 128 },
			cryptoKey,
			ciphertext
		);

		// Decode the decrypted bytes back to a string
		const decoder = new TextDecoder();
		return decoder.decode(decryptedBytes);
	}

	function openLineGroupCreation() {
		// More type-safe user agent detection
		const userAgent = navigator.userAgent.toLowerCase();

		const isIOS = /ipad|iphone|ipod/.test(userAgent);
		const isAndroid = /android/.test(userAgent);

		// Line deep links for group creation
		const iosLineLink = 'https://line.me/ti/g/createGroup';
		const androidLineLink = 'line://ti/g/createGroup';

		// Web store links for Line app
		const iosAppStoreLink = 'https://apps.apple.com/app/line/id443904275';
		const androidPlayStoreLink =
			'https://play.google.com/store/apps/details?id=jp.naver.line.android';

		try {
			if (isIOS) {
				window.location.href = androidLineLink;
				setTimeout(() => {
					window.location.href = iosLineLink;
				}, 100);
			} else if (isAndroid) {
				window.location.href = androidLineLink;
			} else {
				// Fallback for other platforms
				window.location.href = iosLineLink;
			}

			// Fallback mechanism to app stores if Line is not installed
			setTimeout(() => {
				if (isIOS) {
					window.location.href = iosAppStoreLink;
				} else if (isAndroid) {
					window.location.href = androidPlayStoreLink;
				} else {
					alert('กรุณาติดตั้งแอพ Line');
				}
			}, 1500);
		} catch (error) {
			alert('ไม่สามารถเปิดแอพ Line ได้ กรุณาตรวจสอบการติดตั้ง');
		}
	}
</script>

<div class="mx-auto px-6 pt-6 pb-0 bg-primary-foreground min-h-screen">
	<div class="mb-8">
		<div class="w-full items-center flex justify-center">
			<!-- Container that changes flex direction based on screen size -->
			<div
				class="flex flex-col md:flex-row justify-between items-stretch md:items-center relative gap-8 md:gap-0"
			>
				{#each $steps as step, i}
					<div class="flex flex-1">
						<!-- Vertical line for mobile -->
						{#if i > 0}
							<div class="md:hidden absolute h-8 w-0.5 bg-gray-300 -mt-8 ml-4">
								<div
									class="h-full bg-blue-500"
									style="height: {$steps[i - 1].completed ? '100%' : '0%'}"
								/>
							</div>
						{/if}

						<div class="flex md:items-center flex-1 flex-col md:flex-row">
							<!-- Circle and Label Container -->
							<div class="flex items-start md:items-center flex-1">
								<!-- Circle with Progress -->
								<div class="relative">
									<div
										class="
                        w-8 h-8 rounded-full flex items-center justify-center
                        border-2 font-semibold text-sm z-10
                        {step.completed
											? 'bg-blue-500 border-blue-500 text-white'
											: 'bg-gray-100 border-gray-300 text-gray-600'}
                        {step.active ? 'border-blue-500 text-blue-500' : ''}
                      "
									>
										{#if step.completed}
											<svg
												class="h-4 w-4"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
										{:else}
											{i + 1}
										{/if}
									</div>

									<!-- Progress Circle -->
									{#if step.subSteps.length > 0 && !step.completed && step.subSteps.some((sub) => sub.completed)}
										<svg class="absolute top-0 left-0 -rotate-90" width="32" height="32">
											<circle
												stroke="currentColor"
												stroke-width="2"
												fill="none"
												r="14"
												cx="16"
												cy="16"
												class="text-blue-500"
												style="stroke-dasharray: {2 * Math.PI * 14}; stroke-dashoffset: {2 *
													Math.PI *
													14 *
													(1 -
														step.subSteps.filter((sub) => sub.completed).length /
															step.subSteps.length)}"
											/>
										</svg>
									{/if}
								</div>

								<!-- Label and SubSteps -->
								<div class="ml-2">
									<span class="text-sm text-gray-600 font-medium">
										{step.label}
									</span>

									{#if step.subSteps.length > 0}
										<div class="flex flex-col gap-0.5 mt-1">
											{#each step.subSteps as subStep}
												<div class="flex items-center text-xs text-gray-500 gap-1">
													<div
														class="w-1 h-1 rounded-full {subStep.completed
															? 'bg-blue-500'
															: 'bg-gray-300'}"
													/>
													{subStep.label}
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</div>

							<!-- Connecting Line - Only show on larger screens and if not last item -->
							{#if i < $steps.length - 1}
								<div
									class="
                    hidden md:block flex-1 h-0.5 mx-4
                    {step.completed ? 'bg-blue-500' : 'bg-gray-300'}
                  "
								/>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class=" bg-primary-foreground rounded-lg shadow-none border min-w-6xl border-none">
		{#if currentStep === 0}
			<!-- Basic Details -->
			{#if currentSubStep === 0}
				<div class="flex flex-col min-h-[calc(100vh-41px)]">
					<div class="sm:text-center flex justify-center text-4xl mt-2 mb-4 font-bold">
						<h1 class="text-wrap text-center text-black">
							เลือกแพ็คเกจเพื่อใช้โควต้าในระบบ SURESURE
						</h1>
					</div>
					<div class="text-center mx-5 mb-4">
						<h5>
							เพิ่มความสะดวกในการใช้งานด้วยการเลือกแพ็คเกจที่มีโควต้า
							พร้อมใช้บริการตรวจสอบสลิปธนาคารผ่านระบบ Sure Sure ของเรา
						</h5>
					</div>
					<div
						class="flex gap-2 flex-wrap justify-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-10"
					>
						{#each packages as pkg, i}
							{#if pkg.OrderAmount != pkg.AmountLimit || pkg.AmountLimit == 0}
								<div
									class=" lg:my-3 md:my-3 sm:my-2 my-3 lg:mx-2 md:mx-2 sm:mx-0 mx-0 transition-transform hover:scale-105 drop-shadow-lg"
								>
									<PackageCard
										{pkg}
										on:packageSelect={handlePackageSelect}
										maxIndex={randomNumber}
										index={i}
									/>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{:else if currentStep === 1}
			<!-- Contact Details -->
			{#if currentSubStep === 0}
				<div class="flex justify-center items-center flex-col bg-primary-foreground content-center">
					<Card.Root class=" lg:w-2/5 md:w-3/5 mb-5">
						<Card.Header class="p-0 items-center justify-center ">
							<Card.Title class="text-lg font-medium"></Card.Title>
						</Card.Header>
						<Card.Content class="flex justify-center text-center ">
							<div>
								<p class="text-2xl mt-5 font-semibold">สแกนเพื่อชำระเงิน</p>
								{#if messageVisible}
									{#if dataImg}
										<div class="flex justify-center mt-3">
											<div class="border-2 border-[#113566] rounded-md overflow-hidden w-5/5">
												<!-- svelte-ignore a11y-missing-attribute -->
												<div class=" bg-[#113566] flex justify-center">
													<img src={payment} width="120px" height="100px" />
												</div>
												<!-- svelte-ignore a11y-missing-attribute -->
												<div class="">
													<img
														src={dataImg}
														class="w-[220px] h-[220px] lg:w-[250px] lg:h-[230px]"
													/>
												</div>
											</div>
										</div>
									{/if}
									<div class="text-lg flex justify-center items-center mt-3">
										<span>แพ็คเกจ :</span>
										<p class="ml-2 text-lg font-semibold truncate">{packagename}</p>
									</div>
									<div class="text-lg flex justify-center items-center">
										<span>จำนวนเงิน :</span>
										<p class="ml-2 text-2xl font-semibold" style="color:#1353EC">
											{packageprice.toLocaleString()} Bath
										</p>
									</div>
								{/if}
							</div>
						</Card.Content>
						<div class="m-5">
							<div class=" text-center p-3 bg-[#FEF6F6] text-[#E02424]">
								<p class=" lg:text-xl md:text-xl text-xl font-semibold">
									หมดอายุใน {formatTime(seconds)} นาที
								</p>
								<p class=" text-sm">*จ่ายสำเร็จแล้ว โปรดรอจนหน้าจอกลับไปยังหน้าหลัก</p>
								<p class=" text-sm">คิวอาร์โค้ดที่จ่ายสำเร็จแล้ว ไม่สามารถจ่ายซ้ำได้</p>
								<p class="text-sm">**สำหรับผู้ใช้มือถือสามารถแคปหน้าจอได้ทันที</p>
							</div>
						</div>
						<!-- svelte-ignore a11y-missing-attribute -->
						<div class="mx-5 mb-5">
							<Button
								variant="outline"
								class="w-full h-12 text-white hover:text-black  bg-primary font-semibold"
								on:click={() => downloadImage(dataImg, filename)}
								><img
									src={dowlaod}
									width="18px"
									height="18px"
									class="mr-3"
								/>ดาวน์โหลดคิวอาร์โค้ด</Button
							>
						</div>
					</Card.Root>
				</div>

				<dialog id="my_modal_2" class="modal">
					<div class="modal-box">
						<div class="text-lg font-bold flex justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="100"
								height="100"
								viewBox="0 0 15 15"
								{...$$props}
							>
								<path
									fill="#F04438"
									fill-rule="evenodd"
									d="M.877 7.5a6.623 6.623 0 1 1 13.246 0a6.623 6.623 0 0 1-13.246 0M7.5 1.827a5.673 5.673 0 1 0 0 11.346a5.673 5.673 0 0 0 0-11.346m2.354 3.32a.5.5 0 0 1 0 .707L8.207 7.5l1.647 1.646a.5.5 0 0 1-.708.708L7.5 8.207L5.854 9.854a.5.5 0 0 1-.708-.708L6.793 7.5L5.146 5.854a.5.5 0 0 1 .708-.708L7.5 6.793l1.646-1.647a.5.5 0 0 1 .708 0"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<p class="py-4 text-center font-bold text-2xl">แพ็คเกจนี้ถูกซื้อครบจำนวนที่กำหนดแล้ว</p>
					</div>
					<form method="dialog" class="modal-backdrop">
						<button>close</button>
					</form>
				</dialog>
			{:else}
				<div class="space-y-4">
					<h2 class="text-xl font-semibold">Address Information</h2>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
							<input
								type="text"
								bind:value={$formData.address}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">City</label>
							<input
								type="text"
								bind:value={$formData.city}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					</div>
				</div>
			{/if}
		{:else if currentStep === 2}
			<!-- Verification -->
			{#if currentSubStep === 0}
				<div
					class="flex justify-center bg-primary-foreground px-0 py-0 pb-0 sm:py-5 xl:px-24 lg:py-5 xl:py-5 lg:pb-5 xl:pb-5"
				>
					<div class="container max-w-screen-lg mx-auto bg-white rounded-2xl shadow">
						<div class="flex justify-start gap-5 mt-5 sm:mt-5 lg:mt-5">
							<!-- Card ธนาคาร -->
							<div class="w-full sm:w-auto">
								<Card.Root
									class={`w-full min-w-[120px] h-[120px] sm:h-[120px] lg:h-[130px] cursor-pointer 
                  transition-all duration-200
                  ${
										selectedMethod === 'bank'
											? 'border-4 border-[#477DFF] bg-[#F0F4FF]'
											: 'border border-[#EAECF0]'
									}`}
									on:click={showBankForm}
								>
									<Card.Content class="px-5 h-full content-center">
										<div class="flex justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="60px"
												height="60px"
												viewBox="0 0 24 24"
											>
												<path
													fill="#0066ff"
													d="M11.5 1L2 6v2h19V6m-5 4v7h3v-7M2 22h19v-3H2m8-9v7h3v-7m-9 0v7h3v-7z"
												/>
											</svg>
										</div>
										<div class="text-center">บัญชีธนาคาร</div>
									</Card.Content>
								</Card.Root>
							</div>

							<!-- Card พร้อมเพย์ -->
							<div class="w-full sm:w-auto">
								<Card.Root
									class={`w-full min-w-[120px] h-[120px] sm:h-[120px] lg:h-[130px] cursor-pointer 
                  transition-all duration-200
                  ${
										selectedMethod === 'promptpay'
											? 'border-4 border-[#477DFF] bg-[#F0F4FF]'
											: 'border border-[#EAECF0]'
									}`}
									on:click={showPromptPayForm}
								>
									<Card.Content class="px-5 h-full content-center">
										<div class="flex justify-center">
											<img src={payment} width="60" height="60" alt="พร้อมเพย์" />
										</div>
										<div class="text-center">พร้อมเพย์</div>
									</Card.Content>
								</Card.Root>
							</div>
						</div>
						{#if isBankSelected}
							<div class="my-5 grid grid-cols-1 lg:px-5">
								<div class=" w-full">
									<div class=" font-semibold my-5">บัญชีธนาคาร</div>
									<div class="relative w-full px-2">
										<!-- Selected Bank -->
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-static-element-interactions -->
										<div
											class="p-2 border rounded-md cursor-pointer bg-white flex items-center justify-between"
											on:click={() => (isOpen = !isOpen)}
										>
											{#if selectedBank}
												<img
													src={selectedBank.imageUrl}
													alt={selectedBank.name}
													class="w-6 h-6 mr-2"
												/>
												<span>{selectedBank.name} </span>
											{:else}
												<span>-- เลือกธนาคาร --</span>
											{/if}
											<span class="ml-auto">{isOpen ? '▲' : '▼'}</span>
										</div>

										<!-- Dropdown Menu -->
										{#if isOpen}
											<div
												class="absolute mt-2 bg-white border rounded-md w-full z-50 shadow-lg max-h-48 overflow-y-auto"
											>
												<!-- svelte-ignore a11y-no-static-element-interactions -->
												{#each bankchecks as bank}
													<!-- svelte-ignore a11y-click-events-have-key-events -->
													<div
														class="flex items-center p-2 cursor-pointer hover:bg-gray-100"
														on:click={() => selectBank(bank)}
													>
														<img src={bank.imageUrl} alt={bank.name} class="w-12 h-12 mr-2" />
														<span>{bank.name}</span>
													</div>
												{/each}
											</div>
										{/if}
									</div>
									<form
										on:submit|preventDefault={() =>
											sendData(
												selectedBank.code,
												AccNoBank,
												NameTHBank,
												NameENBank,
												LastNameTHBank,
												LastNameENBank,
												null,
												null,
												null,
												null,
												null,
												null
											)}
									>
										<div class="my-5 px-2">
											<input
												class="  border-2 w-full px-2"
												style="height: 40px;"
												on:input={handleInput}
												placeholder="เลขบัญชีธนาคาร"
												bind:value={AccNoBank}
												required
											/>
										</div>
										<hr />
										<div class=" grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
											<div class="px-2">
												<div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาไทย</div>
												<div class=" grid sm:grid-cols-2 lg:grid-cols-2">
													<div class="flex justify-start">
														<input
															class="  border-2 w-full px-2 md:w-72 lg:w-96 xl:w-96"
															style="height: 40px;"
															on:input={handleInputName}
															maxlength="100"
															placeholder="ชื่อภาษาไทย(ห้ามเขียนคำนำหน้า)"
															bind:value={NameTHBank}
															required
														/>
													</div>
													<div class="flex justify-end mt-2 sm:mt-0 lg:mt-0">
														<input
															class="  border-2 w-full px-2 flex md:w-72 lg:w-96 xl:w-96"
															style="height: 40px;"
															on:input={handleInputName}
															maxlength="100"
															placeholder="นามสกุลภาษาไทย"
															bind:value={LastNameTHBank}
															required
														/>
													</div>
												</div>
											</div>

											<div class="px-2">
												<div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาอังกฤษ</div>
												<div class=" grid sm:grid-cols-2 lg:grid-cols-2">
													<div class="flex justify-start">
														<input
															class="  border-2 w-full px-2 md:w-72 lg:w-96 xl:w-96"
															style="height: 40px;"
															on:input={handleInputName}
															maxlength="100"
															placeholder="ชื่อภาษาอังกฤษ(ห้ามเขียนคำนำหน้า)"
															bind:value={NameENBank}
															required
														/>
													</div>
													<div class="flex justify-end mt-2 sm:mt-0 lg:mt-0">
														<input
															class="  border-2 w-full px-2 flex md:w-72 lg:w-96 xl:w-96"
															style="height: 40px;"
															on:input={handleInputName}
															maxlength="100"
															placeholder="นามสกุลภาษาอังกฤษ"
															bind:value={LastNameENBank}
															required
														/>
													</div>
												</div>
											</div>
										</div>

										<div
											class="flex justify-center sm:justify-end lg:justify-end my-0 sm:my-2 lg:my-2 mx-2"
										>
											<Button
												type="submit"
												variant="outline"
												class="my-2 flex text-center py-0 px-0  text-white rounded-md hover:text-black bg-primary w-full sm:w-1/6 lg:w-1/6"
												style="height:40px;">บันทึกข้อมูล</Button
											>
											<!-- on:click={() => sendData(selectedBank.code,AccNoBank,NameTHBank,NameENBank,null,null,null,null)} -->
										</div>
									</form>
								</div>
							</div>
						{/if}
						{#if isPromptPaySelected}
							<div class="my-5 grid grid-cols-1 lg:px-5">
								<div class="w-full">
									<div class="font-semibold my-5">พร้อมเพย์</div>
									<div class="relative w-full">
										<!-- svelte-ignore a11y-no-static-element-interactions -->
										<div class="relative w-full px-2">
											<!-- ตัวเลือกที่ถูกเลือกจะแสดงในกล่อง -->
											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<div
												class="p-2 border rounded-md cursor-pointer bg-white flex items-center justify-between"
												on:click={() => (isOpen = !isOpen)}
											>
												{#if selectedOption}
													<span>{selectedOption.label}</span>
												{:else}
													<span>-- เลือกตัวเลือก --</span>
												{/if}
												<span class="ml-auto">{isOpen ? '▲' : '▼'}</span>
											</div>

											<!-- เมนู Dropdown -->
											{#if isOpen}
												<div
													class="absolute mt-2 bg-white border rounded-md w-full z-50 shadow-lg max-h-48 overflow-y-auto"
												>
													{#each options as option}
														<!-- svelte-ignore a11y-click-events-have-key-events -->
														<div
															class="flex items-center p-2 cursor-pointer hover:bg-gray-100"
															on:click={() => selectOptionBank(option)}
														>
															<span>{option.label}</span>
														</div>
													{/each}
												</div>
											{/if}
										</div>
										<!-- Inputs for PromptPay -->

										<form
											on:submit|preventDefault={() =>
												sendData(
													null,
													null,
													null,
													null,
													null,
													null,
													selectedOption.value,
													AccNoPP,
													NameTHPP,
													NameENPP,
													LastNameTHPP,
													LastNameENPP
												)}
										>
											<div class="my-5 px-2">
												<input
													class="border-2 w-full px-2"
													on:input={handleInput}
													style="height: 40px;"
													placeholder="ใส่ข้อมูลตามที่เลือก"
													bind:value={AccNoPP}
													required
												/>
											</div>
											<hr class="" />
											<div class=" grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
												<div class="px-2">
													<div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาไทย</div>
													<div class=" grid sm:grid-cols-2 lg:grid-cols-2">
														<div class="flex justify-start">
															<input
																class="  border-2 w-full px-2 md:w-72 lg:w-96 xl:w-96"
																style="height: 40px;"
																on:input={handleInputName}
																maxlength="100"
																placeholder="ชื่อภาษาไทย(ห้ามเขียนคำนำหน้า)"
																bind:value={NameTHPP}
																required
															/>
														</div>
														<div class="flex justify-end mt-2 sm:mt-0 lg:mt-0">
															<input
																class="  border-2 w-full px-2 flex md:w-72 lg:w-96 xl:w-96"
																style="height: 40px;"
																on:input={handleInputName}
																maxlength="100"
																placeholder="นามสกุลของบัญชี ภาษาไทย"
																bind:value={LastNameTHPP}
																required
															/>
														</div>
													</div>
												</div>

												<div class="px-2">
													<div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาอังกฤษ</div>
													<div class=" grid sm:grid-cols-2 lg:grid-cols-2">
														<div class="flex justify-start">
															<input
																class=" border-2 w-full px-2 md:w-72 lg:w-96 xl:w-96"
																style="height: 40px;"
																on:input={handleInputName}
																placeholder="ชื่อภาษาอังกฤษ(ห้ามเขียนคำนำหน้า)"
																maxlength="100"
																bind:value={NameENPP}
																required
															/>
														</div>
														<div class="flex justify-end mt-2 sm:mt-0 lg:mt-0">
															<input
																class="  border-2 w-full px-2 flex md:w-72 lg:w-96 xl:w-96"
																style="height: 40px;"
																on:input={handleInputName}
																maxlength="100"
																placeholder="นามสกุลของบัญชี ภาษาอังกฤษ"
																bind:value={LastNameENPP}
																required
															/>
														</div>
													</div>
												</div>
											</div>
											<div
												class="flex justify-center sm:justify-end lg:justify-end my-0 sm:my-2 lg:my-2 mx-2"
											>
												<Button
													type="submit"
													variant="outline"
													class="my-2 flex text-center py-0 px-0  text-white rounded-md hover:text-black bg-primary w-full sm:w-1/6 lg:w-1/6"
													style="height:40px;">บันทึกข้อมูล</Button
												>
											</div>
											<!-- on:click={() => sendData(null,null,null,null,selectedOption.value,AccNoPP,NameTHPP,NameENPP)} -->
										</form>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="space-y-4">
					<h2 class="text-xl font-semibold">Face Verification</h2>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Upload Selfie</label>
						<input
							type="file"
							accept="image/*"
							on:change={(e) => ($formData.selfie = e.target.files[0])}
							class="w-full"
						/>
					</div>
				</div>
			{/if}
		{:else if currentStep === 3}
			<!-- Contact Details -->
			{#if currentSubStep === 0}
				<div
					class="flex justify-center bg-primary-foreground min-h-screen px-0 py-0 pb-0 sm:py-5 xl:px-24 lg:py-5 xl:py-10 lg:pb-5 xl:pb-5"
				>
					<div
						class="container max-w-screen-xl mx-auto bg-white rounded-2xl shadow overflow-x-hidden"
					>
						<Card.Root class="my-5">
							<Card.Content>
								<div class="my-5 grid grid-cols-1 lg:px-5">
									<div class="w-full">
										<div class="flex mx-2">
											<div class="avatar">
												<div
													class="w-full flex justify-center min-w-15 content-center bg-green-800 p-3 rounded-lg"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="30"
														height="30"
														viewBox="0 0 24 24"
														{...$$props}
													>
														<path
															fill="white"
															d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z"
														/>
													</svg>
												</div>
											</div>
											<div class="mx-2 w-full">
												<div class="font-semibold text-xl w-full sm:max-w-full truncate">
													<label for="nameInput" class="block text-gray-700 text-md font-semibold">
														ชื่อห้อง :
													</label>
													<input
														id="nameInput"
														type="text"
														placeholder="กรอกข้อมูลที่นี่"
														class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
														bind:value={Name}
														required
													/>
													{#if errorMessage && !Name}
														<p class="text-red-500 text-sm mt-1">{errorMessage}</p>
														<!-- แสดงข้อความแจ้งเตือน -->
													{/if}
												</div>
											</div>
											<!-- svelte-ignore a11y-no-static-element-interactions -->
										</div>
										<!-- <div class=" mx-2 my-5"><div class="canvas-container">
                          <canvas bind:this={qrcanvas1} class="border-2 border-[#113566] rounded-md"></canvas>
                        </div></div> -->

										<div>
											<p class=" font-semibold mx-2 my-3">บัญชีที่เชื่อมต่อ</p>
											<div class="mx-2">
												{#if banks}
													{#each banks as banks}
														{#if banks.Active != false}
															<div class="flex border my-2 border-gray-300 rounded-lg">
																<div class="avatar">
																	<div class="w-10 rounded-full mx-2 my-2">
																		{#if banks.TypeAccount === 'BANK' || banks.TypeAccount === 'Bank'}
																			<img
																				src={getBankImage(banks.BankCode)}
																				alt="Bank Image"
																				loading="lazy"
																			/>
																		{:else}
																			<img
																				src="https://spoynt.com/wp-content/uploads/2023/12/promtpay-qr.png"
																				alt={banks.NameTH}
																				loading="lazy"
																			/>
																		{/if}
																	</div>
																</div>
																<div class="  content-center w-full">
																	<div class=" font-semibold">
																		{banks.NameTH}
																	</div>
																	{#await maskMiddle(banks.AccountNo)}
																		<div class="text-slate-400">กำลังโหลด...</div>
																	{:then maskedAccountNo}
																		<div class="text-slate-400">{maskedAccountNo}</div>
																	{:catch error}
																		<div class="text-red-500">Error: {error.message}</div>
																	{/await}
																</div>
																<!-- svelte-ignore a11y-click-events-have-key-events -->
																<!-- svelte-ignore a11y-no-static-element-interactions -->
																<div class=" content-center flex justify-end items-center lg:mx-2">
																	<input
																		type="checkbox"
																		value="synthwave"
																		class="toggle theme-controller toggle-success"
																		id="menuToggle"
																		checked={bankLinkRoom &&
																			Array.isArray(bankLinkRoom) &&
																			bankLinkRoom.some(
																				(bank) => bank.AccountNo === banks.AccountNo
																			)}
																		on:change={(e) => handleBankSelection(banks, e.target.checked)}
																	/>
																</div>
															</div>
														{/if}
													{/each}
												{/if}
											</div>
										</div>
										<!-- Add any other detailed information you want to display here -->
										<div class="flex items-center space-x-4">
											<div class="text-lg font-semibold">ตั้งค่า ระบบการตรวจสอบ</div>
											<div class="flex items-center space-x-2">
												<div class="tooltip">
													<label for="enableSettings" class="block">
														{#if isSettingEnabled}
															เปิดการตั้งค่าเอง
														{:else}
															ปิดการตั้งค่าเอง
														{/if}
													</label>
												</div>
												<div class="tooltip">
													<input
														id="enableSettings"
														type="checkbox"
														bind:checked={isSettingEnabled}
														on:change={handleSettingChange}
														class="toggle"
													/>
												</div>
											</div>
										</div>
										{#if isSettingEnabled}
											<div class="mt-3 mx-2 relative">
												<div class="flex items-center">
													รหัสอ้างอิงกลุ่มไลน์
													<div
														class="tooltip ml-2"
														data-tip="รหัสอ้างอิงกลุ่มไลน์ได้จากการสร้างกลุ่มในไลน์โดยจะเขียนอยู่ที่ข้อความต้อนรับ"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-5 w-5 text-blue-500 cursor-help"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
													</div>
												</div>
												<input
													type="text"
													placeholder="เลือกกรอกหรือไม่ก็ได้"
													class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
													bind:value={NotiOnLineGroupId}
													on:input={handleInput}
													required
												/>
											</div>
											<div class="flex mt-3">
												<div class="ml-2">เตือน ยอดเงินขั่นต่ำ *</div>
												<div
													class="tooltip ml-2"
													data-tip="กำหนดยอดเงินขั้นต่ำสำหรับการแจ้งเตือนสลิป"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-5 w-5 text-blue-500 cursor-help"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
												</div>
											</div>
											<div class="relative inline-flex items-center w-full mt-2">
												<!-- ช่องกรอกจำนวนเงิน -->
												<input
													id="paymentAmount"
													type="number"
													bind:value={paymentAmount}
													min={minPayment}
													step="1"
													class="text-start px-5 py-2 border rounded-lg mx-2 pr-12 pl-10 w-full"
													data-tip="กรอกจำนวนเงินขั้นต่ำ"
												/>
												<span
													class="absolute left-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500"
												>
													฿
												</span>
												<!-- ปุ่ม + และ - อยู่ข้างในช่อง input ทางขวา -->
												<div class="tooltip" data-tip="ลดจำนวนเงิน">
													<button
														on:click={decreaseAmount}
														class="absolute right-14 top-1/2 transform -translate-y-1/2 text-xl bg-red-500 text-white py-1 px-2 rounded-full"
													>
														-
													</button>
												</div>

												<!-- ปุ่ม + อยู่ขวาใกล้สุด -->
												<div class="tooltip" data-tip="เพิ่มจำนวนเงิน">
													<button
														on:click={increaseAmount}
														class="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl bg-green-500 text-white py-1 px-2 rounded-full"
													>
														+
													</button>
												</div>
											</div>
											<div class="mx-2 mt-3">
												<div class="flex justify-between items-center">
													<div class="flex">
														<span>ซ่อนเลขบัญชีผู้โอน</span>
														<div class="tooltip ml-2">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>
													<div class="tooltip">
														<input
															type="checkbox"
															value="synthwave"
															class="toggle theme-controller toggle-success"
															id="senderDetailToggle"
															checked={CheckedHideSenderDetail}
															on:change={handleSenderToggle}
														/>
													</div>
												</div>

												<div class="flex justify-between items-center">
													<div class="flex">
														<span>ซ่อนเลขบัญชีผู้รับ</span>
														<div class="tooltip ml-2" data-tip="ซ่อนรายละเอียดเลขบัญชีผู้รับ">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>
													<div class="tooltip" data-tip="เปิด/ปิดการซ่อนเลขบัญชีผู้รับ">
														<input
															type="checkbox"
															value="synthwave"
															class="toggle theme-controller toggle-success"
															id="receiverDetailToggle"
															checked={CheckedHideReceiverDetail}
															on:change={handleReceiverToggle}
														/>
													</div>
												</div>
											</div>

											<div class="mt-3 mx-2">การแจ้งเตือน</div>
											<div class="flex flex-col gap-4 p-4">
												<!-- แถว 1 - สลิป ถูกต้อง -->
												<div
													class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
												>
													<div class="flex">
														<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
															>สลิป ถูกต้อง</span
														>
														<div
															class="tooltip ml-2"
															data-tip="การแจ้งเตือนเมื่อสลิปถูกตรวจสอบและถูกต้องสมบูรณ์"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>

													<div class="flex space-x-2 justify-center items-center">
														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-blue-500={selectedOptions[0] === 'LINE_GROUP_PRIVATE'}
																	on:click={() => selectOption(0, 'LINE_GROUP_PRIVATE')}
																	class:bg-blue-600={selectedOptions[0] === 'LINE_GROUP_PRIVATE'}
																	class:bg-gray-300={selectedOptions[0] !== 'LINE_GROUP_PRIVATE'}
																>
																	<span
																		class={selectedOptions[0] === 'LINE_GROUP_PRIVATE'
																			? 'text-white'
																			: 'text-black'}>กลุ่มส่วนตัว</span
																	>
																	<div
																		class="tooltip flex justify-center items-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่าน Line Official Account"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[0] === 'LINE_GROUP_PRIVATE'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-green-500={selectedOptions[0] === 'LINE_GROUP'}
																	on:click={() => selectOption(0, 'LINE_GROUP')}
																	class:bg-blue-600={selectedOptions[0] === 'LINE_GROUP'}
																	class:bg-gray-300={selectedOptions[0] !== 'LINE_GROUP'}
																>
																	<span
																		class={selectedOptions[0] === 'LINE_GROUP'
																			? 'text-white'
																			: 'text-black'}>กลุ่มสาธารณะ</span
																	>
																	<div
																		class="tooltip flex justify-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่านกลุ่ม Line"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[0] === 'LINE_GROUP'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h -1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>
														<div>
															<button
																class="px-2 py-2 rounded-lg"
																class:bg-red-500={selectedOptions[0] === 'ALL'}
																on:click={() => selectOption(0, 'ALL')}
																class:bg-blue-600={selectedOptions[0] === 'ALL'}
																class:bg-gray-300={selectedOptions[0] !== 'ALL'}
															>
																<span
																	class={selectedOptions[0] === 'ALL' ? 'text-white' : 'text-black'}
																	>ทั้งสอง</span
																>
															</button>
														</div>
													</div>
												</div>

												<!-- แถว 2 - สลิป ถูกใช้งานแล้ว -->
												<div
													class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
												>
													<div class="flex">
														<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
															>สลิป ถูกใช้งานแล้ว</span
														>
														<div class="tooltip ml-2" data-tip="การแจ้งเตือนเมื่อสลิปถูกใช้งานแล้ว">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>

													<div class="flex space-x-2 justify-center items-center">
														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-blue-500={selectedOptions[1] === 'LINE_GROUP_PRIVATE'}
																	on:click={() => selectOption(1, 'LINE_GROUP_PRIVATE')}
																	class:bg-blue-600={selectedOptions[1] === 'LINE_GROUP_PRIVATE'}
																	class:bg-gray-300={selectedOptions[1] !== 'LINE_GROUP_PRIVATE'}
																>
																	<span
																		class={selectedOptions[1] === 'LINE_GROUP_PRIVATE'
																			? 'text-white'
																			: 'text-black'}>กลุ่มส่วนตัว</span
																	>
																	<div
																		class="tooltip flex justify-center items-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่าน Line Official Account"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[1] === 'LINE_GROUP_PRIVATE'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-green-500={selectedOptions[1] === 'LINE_GROUP'}
																	on:click={() => selectOption(1, 'LINE_GROUP')}
																	class:bg-blue-600={selectedOptions[1] === 'LINE_GROUP'}
																	class:bg-gray-300={selectedOptions[1] !== 'LINE_GROUP'}
																>
																	<span
																		class={selectedOptions[1] === 'LINE_GROUP'
																			? 'text-white'
																			: 'text-black'}>กลุ่มสาธารณะ</span
																	>
																	<div
																		class="tooltip flex justify-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่านกลุ่ม Line"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[1] === 'LINE_GROUP'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<button
																class="px-2 py-2 rounded-lg"
																class:bg-red-500={selectedOptions[1] === 'ALL'}
																on:click={() => selectOption(1, 'ALL')}
																class:bg-blue-600={selectedOptions[1] === 'ALL'}
																class:bg-gray-300={selectedOptions[1] !== 'ALL'}
															>
																<span
																	class={selectedOptions[1] === 'ALL' ? 'text-white' : 'text-black'}
																	>ทั้งสอง</span
																>
															</button>
														</div>
													</div>
												</div>

												<!-- แถว 3 - 8 -->

												<!-- แถว 3 - สลิป ไม่เจอ / หมดอายุ / ไม่พบ QRCode จากรูป -->
												<div
													class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
												>
													<div class="flex">
														<span
															class="flex-1 mb-2 sm:mb-0 text-center sm:text-left md:block md:whitespace-pre-line md:max-w-none sm:max-w-[150px] max-w-[150px]"
															>สลิปไม่เจอ/ หมดอายุ / ไม่พบ QRCode จากรูป</span
														>
														<div
															class="tooltip ml-2"
															data-tip="การแจ้งเตือนเมื่อสลิปหาไม่เจอ หมดอายุ หรือไม่พบ QR Code"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>

													<div class="flex space-x-2 justify-center items-center">
														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-blue-500={selectedOptions[2] === 'LINE_GROUP_PRIVATE'}
																	on:click={() => selectOption(2, 'LINE_GROUP_PRIVATE')}
																	class:bg-blue-600={selectedOptions[2] === 'LINE_GROUP_PRIVATE'}
																	class:bg-gray-300={selectedOptions[2] !== 'LINE_GROUP_PRIVATE'}
																>
																	<span
																		class={selectedOptions[2] === 'LINE_GROUP_PRIVATE'
																			? 'text-white'
																			: 'text-black'}>กลุ่มส่วนตัว</span
																	>
																	<div
																		class="tooltip flex justify-center items-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่าน Line Official Account"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[2] === 'LINE_GROUP_PRIVATE'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-green-500={selectedOptions[2] === 'LINE_GROUP'}
																	on:click={() => selectOption(2, 'LINE_GROUP')}
																	class:bg-blue-600={selectedOptions[2] === 'LINE_GROUP'}
																	class:bg-gray-300={selectedOptions[2] !== 'LINE_GROUP'}
																>
																	<span
																		class={selectedOptions[2] === 'LINE_GROUP'
																			? 'text-white'
																			: 'text-black'}>กลุ่มสาธารณะ</span
																	>
																	<div
																		class="tooltip flex justify-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่านกลุ่ม Line"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[2] === 'LINE_GROUP'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<button
																class="px-2 py-2 rounded-lg"
																class:bg-red-500={selectedOptions[2] === 'ALL'}
																on:click={() => selectOption(2, 'ALL')}
																class:bg-blue-600={selectedOptions[2] === 'ALL'}
																class:bg-gray-300={selectedOptions[2] !== 'ALL'}
															>
																<span
																	class={selectedOptions[2] === 'ALL' ? 'text-white' : 'text-black'}
																	>ทั้งสอง</span
																>
															</button>
														</div>
													</div>
												</div>
												<!-- แถว 4 - สลิป ผู้รับเงินไม่ตรง -->
												<div
													class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
												>
													<div class="flex">
														<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
															>สลิป ผู้รับเงินไม่ตรง</span
														>
														<div
															class="tooltip ml-2 whitespace-normal break-words"
															data-tip="การแจ้งเตือนเมื่อผู้รับเงินไม่ตรงกับข้อมูลที่ระบุ"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>

													<div class="flex space-x-2 justify-center items-center">
														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-blue-500={selectedOptions[3] === 'LINE_GROUP_PRIVATE'}
																	on:click={() => selectOption(3, 'LINE_GROUP_PRIVATE')}
																	class:bg-blue-600={selectedOptions[3] === 'LINE_GROUP_PRIVATE'}
																	class:bg-gray-300={selectedOptions[3] !== 'LINE_GROUP_PRIVATE'}
																>
																	<span
																		class={selectedOptions[3] === 'LINE_GROUP_PRIVATE'
																			? 'text-white'
																			: 'text-black'}>กลุ่มส่วนตัว</span
																	>
																	<div
																		class="tooltip flex justify-center items-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่าน Line Official Account"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[3] === 'LINE_GROUP_PRIVATE'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-green-500={selectedOptions[3] === 'LINE_GROUP'}
																	on:click={() => selectOption(3, 'LINE_GROUP')}
																	class:bg-blue-600={selectedOptions[3] === 'LINE_GROUP'}
																	class:bg-gray-300={selectedOptions[3] !== 'LINE_GROUP'}
																>
																	<span
																		class={selectedOptions[3] === 'LINE_GROUP'
																			? 'text-white'
																			: 'text-black'}>กลุ่มสาธารณะ</span
																	>
																	<div
																		class="tooltip flex justify-center ml-2 whitespace-normal break-words"
																		data-tip="ส่งการแจ้งเตือนผ่านกลุ่ม Line"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[3] === 'LINE_GROUP'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<button
																class="px-2 py-2 rounded-lg"
																class:bg-red-500={selectedOptions[3] === 'ALL'}
																on:click={() => selectOption(3, 'ALL')}
																class:bg-blue-600={selectedOptions[3] === 'ALL'}
																class:bg-gray-300={selectedOptions[3] !== 'ALL'}
															>
																<span
																	class={selectedOptions[3] === 'ALL' ? 'text-white' : 'text-black'}
																	>ทั้งสอง</span
																>
															</button>
														</div>
													</div>
												</div>
												<!-- แถว 5 - ยอดโอนต่ำกว่ากำหนด -->
												<div
													class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
												>
													<div class="flex">
														<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
															>ยอดโอนต่ำกว่ากำหนด</span
														>
														<div
															class="tooltip ml-2"
															data-tip="การแจ้งเตือนเมื่อยอดโอนต่ำกว่ายอดเงินขั้นต่ำที่กำหนด"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>

													<div class="flex space-x-2 justify-center items-center">
														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-blue-500={selectedOptions[4] === 'LINE_GROUP_PRIVATE'}
																	on:click={() => selectOption(4, 'LINE_GROUP_PRIVATE')}
																	class:bg-blue-600={selectedOptions[4] === 'LINE_GROUP_PRIVATE'}
																	class:bg-gray-300={selectedOptions[4] !== 'LINE_GROUP_PRIVATE'}
																>
																	<span
																		class={selectedOptions[4] === 'LINE_GROUP_PRIVATE'
																			? 'text-white'
																			: 'text-black'}>กลุ่มส่วนตัว</span
																	>
																	<div
																		class="tooltip flex justify-center items-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่าน Line Official Account"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[4] === 'LINE_GROUP_PRIVATE'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-green-500={selectedOptions[4] === 'LINE_GROUP'}
																	on:click={() => selectOption(4, 'LINE_GROUP')}
																	class:bg-blue-600={selectedOptions[4] === 'LINE_GROUP'}
																	class:bg-gray-300={selectedOptions[4] !== 'LINE_GROUP'}
																>
																	<span
																		class={selectedOptions[4] === 'LINE_GROUP'
																			? 'text-white'
																			: 'text-black'}>กลุ่มสาธารณะ</span
																	>
																	<div
																		class="tooltip flex justify-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่านกลุ่ม Line"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[4] === 'LINE_GROUP'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<button
																class="px-2 py-2 rounded-lg"
																class:bg-red-500={selectedOptions[4] === 'ALL'}
																on:click={() => selectOption(4, 'ALL')}
																class:bg-blue-600={selectedOptions[4] === 'ALL'}
																class:bg-gray-300={selectedOptions[4] !== 'ALL'}
															>
																<span
																	class={selectedOptions[4] === 'ALL' ? 'text-white' : 'text-black'}
																	>ทั้งสอง</span
																>
															</button>
														</div>
													</div>
												</div>
												<div
													class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
												>
													<div class="flex">
														<span
															class="flex-1 mb-2 sm:mb-0 text-center sm:text-left md:block md:whitespace-pre-line md:max-w-none sm:max-w-[150px] max-w-[150px]"
															>การแจ้งเตือนเติมโควตาและต่ออายุ</span
														>
														<div
															class="tooltip ml-2"
															data-tip="การแจ้งเตือนเมื่อต้องเติมโควตาหรือต่ออายุการใช้งาน"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>

													<div class="flex space-x-2 justify-center items-center">
														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-blue-500={selectedOptions[5] === 'LINE_GROUP_PRIVATE'}
																	on:click={() => selectOption(5, 'LINE_GROUP_PRIVATE')}
																	class:bg-blue-600={selectedOptions[5] === 'LINE_GROUP_PRIVATE'}
																	class:bg-gray-300={selectedOptions[5] !== 'LINE_GROUP_PRIVATE'}
																>
																	<span
																		class={selectedOptions[5] === 'LINE_GROUP_PRIVATE'
																			? 'text-white'
																			: 'text-black'}>กลุ่มส่วนตัว</span
																	>
																	<div
																		class="tooltip flex justify-center items-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่าน Line Official Account"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[5] === 'LINE_GROUP_PRIVATE'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-green-500={selectedOptions[5] === 'LINE_GROUP'}
																	on:click={() => selectOption(5, 'LINE_GROUP')}
																	class:bg-blue-600={selectedOptions[5] === 'LINE_GROUP'}
																	class:bg-gray-300={selectedOptions[5] !== 'LINE_GROUP'}
																>
																	<span
																		class={selectedOptions[5] === 'LINE_GROUP'
																			? 'text-white'
																			: 'text-black'}>กลุ่มสาธารณะ</span
																	>
																	<div
																		class="tooltip flex justify-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่านกลุ่ม Line"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[5] === 'LINE_GROUP'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<button
																class="px-2 py-2 rounded-lg"
																class:bg-red-500={selectedOptions[5] === 'ALL'}
																on:click={() => selectOption(5, 'ALL')}
																class:bg-blue-600={selectedOptions[5] === 'ALL'}
																class:bg-gray-300={selectedOptions[5] !== 'ALL'}
															>
																<span
																	class={selectedOptions[5] === 'ALL' ? 'text-white' : 'text-black'}
																	>ทั้งสอง</span
																>
															</button>
														</div>
													</div>
												</div>
												<div
													class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
												>
													<div class="flex">
														<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
															>การแจ้งเตือนสลิปซ้ำ</span
														>
														<div
															class="tooltip ml-2"
															data-tip="การแจ้งเตือนเมื่อพบสลิปที่มีการใช้ซ้ำ"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>

													<div class="flex space-x-2 justify-center items-center">
														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-blue-500={selectedOptions[6] === 'LINE_GROUP_PRIVATE'}
																	on:click={() => selectOption(6, 'LINE_GROUP_PRIVATE')}
																	class:bg-blue-600={selectedOptions[6] === 'LINE_GROUP_PRIVATE'}
																	class:bg-gray-300={selectedOptions[6] !== 'LINE_GROUP_PRIVATE'}
																>
																	<span
																		class={selectedOptions[6] === 'LINE_GROUP_PRIVATE'
																			? 'text-white'
																			: 'text-black'}>กลุ่มส่วนตัว</span
																	>
																	<div
																		class="tooltip flex justify-center items-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่าน Line Official Account"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[6] === 'LINE_GROUP_PRIVATE'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-green-500={selectedOptions[6] === 'LINE_GROUP'}
																	on:click={() => selectOption(6, 'LINE_GROUP')}
																	class:bg-blue-600={selectedOptions[6] === 'LINE_GROUP'}
																	class:bg-gray-300={selectedOptions[6] !== 'LINE_GROUP'}
																>
																	<span
																		class={selectedOptions[6] === 'LINE_GROUP'
																			? 'text-white'
																			: 'text-black'}>กลุ่มสาธารณะ</span
																	>
																	<div
																		class="tooltip flex justify-center ml-2"
																		data-tip="ส่งการแจ้งเตือนผ่านกลุ่ม Line"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[6] === 'LINE_GROUP'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<button
																class="px-2 py-2 rounded-lg"
																class:bg-red-500={selectedOptions[6] === 'ALL'}
																on:click={() => selectOption(6, 'ALL')}
																class:bg-blue-600={selectedOptions[6] === 'ALL'}
																class:bg-gray-300={selectedOptions[6] !== 'ALL'}
															>
																<span
																	class={selectedOptions[6] === 'ALL' ? 'text-white' : 'text-black'}
																	>ทั้งสอง</span
																>
															</button>
														</div>
													</div>
												</div>
												<!-- แถว 8 - สรุปยอดสาขารายวัน -->
												<div
													class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
												>
													<div class="flex">
														<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
															>สรุปยอดสาขารายวัน</span
														>
														<div
															class="tooltip ml-2"
															data-tip="การแจ้งเตือนสรุปยอดการทำธุรกรรมของสาขาประจำวัน"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-blue-500 cursor-help"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
													</div>

													<div class="flex space-x-2 justify-center items-center">
														<div>
															<div>
																<button
																	class="px-2 py-2 rounded-lg lg:flex md:flex sm:flex"
																	class:bg-blue-500={selectedOptions[7] === 'LINE_GROUP_PRIVATE'}
																	on:click={() => selectOption(7, 'LINE_GROUP_PRIVATE')}
																	class:bg-blue-600={selectedOptions[7] === 'LINE_GROUP_PRIVATE'}
																	class:bg-gray-300={selectedOptions[7] !== 'LINE_GROUP_PRIVATE'}
																>
																	<span
																		class={selectedOptions[7] === 'LINE_GROUP_PRIVATE'
																			? 'text-white'
																			: 'text-black'}>กลุ่มส่วนตัว</span
																	>
																	<div
																		class="tooltip flex justify-center items-center ml-2 whitespace-normal break-words"
																		data-tip="ส่งการแจ้งเตือนผ่าน Line Official Account"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class={selectedOptions[7] === 'LINE_GROUP_PRIVATE'
																				? 'text-white h-5 w-5 cursor-help'
																				: 'text-blue-500 h-5 w-5 cursor-help'}
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</button>
															</div>
														</div>

														<div>
															<button
																class="px-2 py-2 rounded-lg"
																class:bg-red-500={selectedOptions[7] === 'DISABLE'}
																on:click={() => selectOption(7, 'DISABLE')}
																class:bg-blue-600={selectedOptions[7] === 'DISABLE'}
																class:bg-gray-300={selectedOptions[7] !== 'DISABLE'}
															>
																<span
																	class={selectedOptions[7] === 'DISABLE'
																		? 'text-white'
																		: 'text-black'}>ปิด</span
																>
															</button>
														</div>
													</div>
												</div>
												<!-- คุณสามารถทำซ้ำรูปแบบด้านบนและแก้ไขตัวแปรใน `selectedOptions` ให้เหมาะสม -->
											</div>
										{/if}
										<button
											class="w-full bg-black text-white py-2 rounded-lg mt-4"
											on:click={Update}
										>
											บันทึกการเปลี่ยนแปลง
										</button>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					</div>
				</div>
			{/if}
		{:else if currentStep === 4}
			<!-- Contact Details -->
			{#if currentSubStep === 0}
				<div class="flex justify-center">
					<div
						class="w-full max-w-sm sm:max-w-xl lg:max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6"
					>
						<div class="text-sm">
							<h2 class="text-2xl font-semibold mb-5">ขั้นตอนที่ 5: เพิ่มบอทในกลุ่ม Line</h2>
							<div class="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
								<div class="flex justify-center">
									<img src={addGroup} alt="Add Bot to Group" width="250px" />
								</div>
								<div>
									<div class="text-gray-600 mt-5">
										<strong class="text-lg"> สร้างกลุ่มและเชิญบอท</strong>
										<ul class="list-disc ml-5 text-md mt-3">
											<li>ให้สร้างกลุ่ม Line เพื่อใช้ตรวจสอบสลิป</li>
											<li>คลิก "สร้างกลุ่ม" เพื่อสร้างกลุ่มใหม่</li>
											<li>เลือก "เชิญเพื่อน" และเพิ่ม Line OA Sure Sure เข้ากลุ่ม</li>
											<li>
												นำ QR code ที่แคปขั้นตอนที่แล้วมาส่งในกลุ่มเพื่อทำการยืนยันว่าจะนับ
												โควต้าการใช้งานของคุณ เมื่อมีการส่งรูป
											</li>
											<li>เชิญคนอื่นที่ต้องการใช้บริการด้วย</li>
										</ul>
										<div class="flex justify-center mt-5">
											<button
												class="btn bg-primary text-white hover:scale-105 hover:bg-primary"
												on:click={() => openLineGroupCreation()}>เข้าหน้าสร้างกลุ่มในไลน์</button
											>
										</div>
									</div>
									<div class="mt-10 flex justify-center">
										<Button
											variant="secondary"
											class=" flex text-center py-0 px-5  rounded-md w-full group border hover:scale-105"
											style="height:40px"
											on:click={() => StepStatustofinish()}
										>
											<div
												style="width: 100%; height:100%"
												class="content-center sm:p-2 lg:p-2 group-hover:text-black text-black"
											>
												ไปขั้นตอนถัดไป
											</div>
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{:else}
			<!-- Completed -->
			<div class="text-center py-8 min-h-[calc(100vh-250px)]">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-32 w-32 mx-auto text-green-500 mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h2 class="text-2xl font-semibold mb-2">สามารถใช้งานระบบ SURE SURE ได้แล้ว</h2>
				<div class="flex justify-center mt-5">
					<Button
						class=" flex text-center py-0 px-0 bg-primary rounded-md lg:w-70 md:w-70 group hover:scale-105 "
						style="height:50px"
						on:click={() => {
							sessionStorage.removeItem('steps');
							goto('/dashboard');
						}}
					>
						<div
							style="width: 200px; height:200px"
							class="content-center sm:p-2 lg:p-2 group-hover:text-white text-white"
						>
							ไปหน้า Dashboard
						</div>
					</Button>
				</div>
			</div>
		{/if}

		<!-- Form Controls -->
	</div>
</div>

<dialog id="my_modal_3" class="modal">
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="100"
				height="100"
				viewBox="0 0 32 32"
				{...$$props}
			>
				<path fill="#17B26A" d="m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415z" />
				<path
					fill="#17B26A"
					d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
				/>
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">สำเร็จ</p>
		<p class=" text-center">บันทึกข้อมูลสำเร็จ</p>
		<div class="flex w-full justify-around mt-5">
			<div class="flex content-center">
				<!-- Button to close the modal -->

				<!-- Button to go to another page -->
				<p class=" text-center">รอประมาณ 3 วินาที ไปขั้นตอนถัดไป</p>
			</div>
		</div>
	</div>
	<!-- <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form> -->
</dialog>

<dialog id="my_modal_4" class="modal">
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="100"
				height="100"
				viewBox="0 0 32 32"
				{...$$props}
			>
				<path fill="#17B26A" d="m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415z" />
				<path
					fill="#17B26A"
					d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
				/>
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">สำเร็จ</p>
		<p class=" text-center">การชำระเงินสำเร็จแล้ว</p>
		<div class="flex w-full justify-around mt-5">
			<div class="flex content-center">
				<!-- Button to close the modal -->

				<!-- Button to go to another page -->
				<p class=" text-center">รอประมาณ 3 วินาที ไปขั้นตอนถัดไป</p>
			</div>
		</div>
	</div>
	<!-- <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form> -->
</dialog>

<dialog
	id="my_modal_5"
	class="modal fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
>
	<div class="modal-box">
		<div class="text-lg font-bold flex justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="100"
				height="100"
				viewBox="0 0 32 32"
				{...$$props}
			>
				<path fill="#17B26A" d="m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415z" />
				<path
					fill="#17B26A"
					d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
				/>
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">สำเร็จ</p>
		<div class=" mx-2 mb-2 flex justify-center">
			<div class="canvas-container">
				<canvas bind:this={qrcanvas1} class="border-2 border-[#113566] rounded-md"></canvas>
			</div>
		</div>
		<p class=" text-center mt-2">แคป QR CODE นี้ เพื่อใช้ในขั้นตอนถัดไป</p>
		<div class="flex w-full justify-around mt-5">
			<div class="flex content-center">
				<div class="flex w-full justify-around mt-5">
					<button class="btn bg-primary text-white hover:text-black" on:click={handleNextStep}>
						ไปขั้นตอนถัดไป
					</button>
				</div>
			</div>
		</div>
	</div>
</dialog>

<style scoped>
	.tooltip:before {
		max-width: 10rem; /* 320px */
		white-space: normal; /* อนุญาตให้ข้อความขึ้นบรรทัดใหม่ */
		word-wrap: break-word; /* แบ่งคำเมื่อยาวเกินขอบเขต */
		overflow-wrap: break-word; /* การแบ่งคำทางเลือกสำหรับความเข้ากันได้ */
		hyphens: auto; /* ตัดคำอัตโนมัติ */
		text-align: center; /* จัดข้อความให้อยู่กึ่งกลาง */
	}
</style>
