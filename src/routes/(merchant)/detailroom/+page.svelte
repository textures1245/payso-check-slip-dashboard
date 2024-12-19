<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel';
	import payment from '$lib/image/thai-qr.png';
	import { PUBLIC_API_ENDPOINT, PUBLIC_PAYSO_DEFAULT_SECRET,PUBLIC_BACKEND_API_KEY } from '$env/static/public';
	import { writable } from 'svelte/store';
	import cookie from 'cookie';
	import { afterUpdate, onMount } from 'svelte';
	import { Plus } from 'svelte-radix';
	import { goto } from '$app/navigation';
	import QRCode from 'qrcode';
	import CryptoJS from 'crypto-js';
	let isOpen = false;
	let selectedMethod = 'bank';
	let loading = false;
	let banks: any[] = [];
	let rooms: any[] = [];
	let minPayment = 0;
	let paymentAmount = minPayment;
	let NotiOnLineGroupId = '';
	interface Room {
		Id: any;
		LineGroupId: any;
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
		QrToken?: string;
		NotiOnLineGroupId?: string;
		NotiOnSlipDuplicated?: string;
	}

	let QrToken: string | null = null;
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
	let hasPermission = false;

	onMount(async () => {
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		try {
			const bank = await GetBankLink();
			const room = await GetRoomLink();
			// Use profileData here

			banks = bank;
			rooms = room;

			if (rooms && room.length > 0) {
				handleRoomClick(rooms[0].Id);
			} else {
				console.log('No rooms available');
			}
			console.log('***************************************', hasPermission);
			console.log('++++++++++', myCookie.Roles);
			if (
				myCookie.Roles.includes('USER_MANAGEMENT') ||
				myCookie.Roles.includes('LINE_MANAGEMENT')
			) {
				console.log('***************************************', hasPermission);
				hasPermission = true;
			}

			handleResize();
			window.addEventListener('resize', handleResize);

			// Clean up the event listener when component is destroyed
			return () => {
				window.removeEventListener('resize', handleResize);
			};
		} catch (error) {
			console.error('Error fetching profile:', error);
		} finally {
			// การอัปเดตสถานะการโหลด
			loading = false;
		}
	});

	function getCookies() {
		return cookie.parse(document.cookie);
	}

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
				'ngrok-skip-browser-warning': 'true','apikey': PUBLIC_BACKEND_API_KEY
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
	const GetRoomLink = async () => {
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
				'ngrok-skip-browser-warning': 'true','apikey': PUBLIC_BACKEND_API_KEY
			}
		};

		let url;
		if (myCookie.Id) {
			console.log('Get by Merchant Id');
			url = `${PUBLIC_API_ENDPOINT}/roomdata/${myCookie.Id}`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		const result = await fetch(url, config);
		const data = await result.json();
		console.log('Link Room', data);

		return data.result || [];
	};

	const GetBankLinkRoom = async (roomId: string) => {
		let config = {
			method: 'GET', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true','apikey': PUBLIC_BACKEND_API_KEY
			}
		};

		let url;
		if (roomId) {
			url = `${PUBLIC_API_ENDPOINT}/room/bank/${roomId}`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		const result = await fetch(url, config);
		const data = await result.json();
		console.log('Bank Link Room', data);
		return data.result || [];
	};
	function getBankImage(bankCode: string) {
		const bank = bankchecks.find((b) => b.code === bankCode);
		return bank ? bank.imageUrl : 'https://spoynt.com/wp-content/uploads/2023/12/promtpay-qr.png'; // กรณีไม่พบจะใช้ภาพ default
	}

	let selectedRoom: Room | null = null;
	let bankLinkRoom: any[] = [];
	let LineGroupId: any;
	let Id: string;
	async function handleRoomClick(roomId: any) {
		showForm = false;
		selectedRoom = rooms.find((r) => r.Id === roomId);
		const bank = await GetBankLinkRoom(roomId);
		QrToken = selectedRoom?.QrToken ?? null;
		LineGroupId = selectedRoom?.LineGroupId ?? null;
		Id = selectedRoom?.Id ?? null;
		bankLinkRoom = bank;
		selectedBankAccounts = bank;
		if (QrToken) {
			await handleGenerate();
		}
		console.log(selectedRoom, roomId, bank, QrToken);
	}
	let showForm = false;
	let CheckedHideReceiverDetail = false;
	let CheckedHideSenderDetail = false;
	const toggleForm = async (roomId: any) => {
		showForm = !showForm; // เปลี่ยนสถานะของ showForm
		selectedRoom = rooms.find((r) => r.Id === roomId);
		paymentAmount = selectedRoom?.MinAmountReceive ?? 0;
		CheckedHideSenderDetail = selectedRoom?.HideSenderDetail ?? false;
		CheckedHideReceiverDetail = selectedRoom?.HideReceiverDetail ?? false;
		selectedOptions = [
			selectedRoom?.NotiOnValid ?? 'LINE_GROUP', // สลิป ถูกต้อง
			selectedRoom?.NotiOnInvalid ?? 'LINE_GROUP', // สลิป ถูกใช้งานแล้ว
			selectedRoom?.NotiOnInvalidUnverified ?? 'LINE_GROUP', // สลิป ไม่เจอ / หมดอายุ / ไม่พบ QRCode
			selectedRoom?.NotiOnInvalidReceiverBankAccount ?? 'LINE_GROUP', // สลิป ผู้รับเงินไม่ตรง
			selectedRoom?.NotiOnInvalidMinAmount ?? 'LINE_GROUP', // ยอดโอนต่ำกว่ากำหนด
			selectedRoom?.NotiOnQuotaLimitExceed ?? 'LINE_GROUP', // การแจ้งเตือนเติมโควตาและต่ออายุ
			selectedRoom?.NotiOnSlipDuplicated ?? 'LINE_GROUP',
			selectedRoom?.TransactionSummary ?? 'LINE_GROUP' // สรุปยอดสาขารายวัน
		];
		console.log(qrcanvas1);
		console.log(selectedRoom, selectedOptions);
	};

	//////////////////////gen Qrcode
	let qrcanvas1: HTMLCanvasElement;
	let encryptedData: string = '';
	let errorMessage: string = '';
	const encryptionCache: { [key: string]: string } = {};
	const encryptData = async (data: string): Promise<string | null> => {
		if (encryptionCache[data]) {
			console.log('กำลังใช้ข้อมูลเข้ารหัสจากแคช');
			return encryptionCache[data];
		}
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
			encryptionCache[data] = encrypted;
			return encrypted;
		} catch (error) {
			console.error('Encryption error:', error);
			const errorMessage = 'การเข้ารหัสผิดพลาด: ' + (error as Error).message;
			console.log(errorMessage);
			return null;
		}
	};
	afterUpdate(async () => {
		if (QrToken) {
			await handleGenerate(); // เรียกใช้เพื่อสร้าง QR Code ถ้าข้อมูลเปลี่ยน
		}
	});

	// Function to generate QR code
	const generateQR = async (data: string): Promise<void> => {
		try {
			if (qrcanvas1) {
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
			} else {
				errorMessage = 'Canvas element is not available';
			}
		} catch (error) {
			errorMessage = 'การสร้าง QR Code ผิดพลาด: ' + (error as Error).message;
		}
	};

	const handleGenerate = async (): Promise<void> => {
		console.log('handleGenerate called'); // Debug log
		const dataString = `${QrToken}`;

		// Encrypt data
		const encrypted = await encryptData(dataString);
		if (encrypted) {
			encryptedData = encrypted;
			await generateQR(encrypted);
		}
	};

	/////////////////////////////////////////

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
	function selectOption(row: number, option: string) {
		selectedOptions[row] = option;
		console.log(selectedOptions);
	}

	function Update() {
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		const updateData = {
			// ชื่อห้อง
			Id: selectedRoom?.Id,
			RoomName: selectedRoom?.RoomName,
			MerchantId: parseInt(myCookie.Id),
			// บัญชีที่เชื่อมต่อ - กรองเฉพาะบัญชีที่ถูกเลือก (checked)
			// linkedAccounts: selectedBankAccounts,
			NotiOnLineGroupId: selectedRoom?.NotiOnLineGroupId,
			// ยอดเงินขั้นต่ำ
			MinAmountReceive: paymentAmount,

			// การตั้งค่าการซ่อนข้อมูล

			HideSenderDetail: CheckedHideSenderDetail,
			HideReceiverDetail: CheckedHideReceiverDetail,

			// การตั้งค่าการแจ้งเตือน Line

			NotiOnValid: selectedOptions[0], // สลิปถูกต้อง
			NotiOnInvalid: selectedOptions[1], // สลิปถูกใช้งานแล้ว
			NotiOnInvalidReceiverBankAccount: selectedOptions[2], // สลิปไม่เจอ/หมดอายุ/ไม่พบ QR Code
			NotiOnInvalidUnverified: selectedOptions[3], // สลิปผู้รับเงินไม่ตรง
			NotiOnInvalidMinAmount: selectedOptions[4], // ยอดโอนต่ำกว่ากำหนด
			NotiOnQuotaLimitExceed: selectedOptions[5], // การแจ้งเตือนเติมโควตาและต่ออายุ
			NotiOnSlipDuplicated: selectedOptions[6],
			TransactionSummary: selectedOptions[7] // สรุปยอดสาขารายวัน
		};
		console.log(updateData);
		UpdateRoom(updateData, selectedBankAccounts);
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

	const UpdateRoom = async (dataupdate: any, bankData: any[][]) => {
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		const bankIds = bankData.map((bank) => bank.Id);
		console.log('data', dataupdate, bankIds);
		const requestBody = {
			rooms: dataupdate,
			bank: bankIds,
			email: myCookie.Email
		};
		let config = {
			method: 'PUT', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true','apikey': PUBLIC_BACKEND_API_KEY
			},
			body: JSON.stringify(requestBody)
		};

		let url;
		if (dataupdate) {
			url = `${PUBLIC_API_ENDPOINT}/updateroom`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		const result = await fetch(url, config);
		const data = await result.json();
		if (data.message == 'permission denied') {
			const modal = document.getElementById('my_modal_4');
			if (modal) {
				modal.showModal();
			}
			return false;
		} else {
			const modal = document.getElementById('my_modal_3');
			if (modal) {
				modal.showModal();
			}
			return data.result;
		}
	};

	function handleInput(event: { target: { value: string } }) {
		// Only allow alphanumeric characters
		selectedRoom.NotiOnLineGroupId = event.target.value.replace(/[^A-Za-z0-9]/g, '');
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

	let currentPage = 0;

	let windowWidth;

	function handleResize() {
		windowWidth = window.innerWidth;
	}
	$: roomsPerPage = windowWidth < 768 ? 1 : 3;

	// Reactive statement to calculate total pages
	$: totalPages = Math.ceil(rooms.length / roomsPerPage);

	// Reactive statement to get visible rooms for current page
	$: visibleRooms = rooms.slice(
		currentPage * roomsPerPage,
		currentPage * roomsPerPage + roomsPerPage
	);

	let touchStartX = 0;
	let touchEndX = 0;
	let mouseStartX = 0;
	let isMouseDown = false;

	// Touch Event Handlers
	function handleTouchStart(e) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchMove(e) {
		touchEndX = e.touches[0].clientX;
	}

	function handleTouchEnd() {
		const diffX = touchStartX - touchEndX;

		// Minimum swipe distance
		if (Math.abs(diffX) > 50) {
			if (diffX > 0 && currentPage < totalPages - 1) {
				// Swipe left, go to next page
				currentPage++;
			} else if (diffX < 0 && currentPage > 0) {
				// Swipe right, go to previous page
				currentPage--;
			}
		}
	}

	// Mouse Event Handlers
	function handleMouseDown(e) {
		isMouseDown = true;
		mouseStartX = e.clientX;
	}

	function handleMouseMove(e) {
		if (!isMouseDown) return;
	}

	function handleMouseUp(e) {
		if (!isMouseDown) return;

		const diffX = mouseStartX - e.clientX;

		// Minimum swipe distance
		if (Math.abs(diffX) > 50) {
			if (diffX > 0 && currentPage < totalPages - 1) {
				// Swipe left, go to next page
				currentPage++;
			} else if (diffX < 0 && currentPage > 0) {
				// Swipe right, go to previous page
				currentPage--;
			}
		}

		isMouseDown = false;
	}

	function handleMouseLeave() {
		isMouseDown = false;
	}
</script>

<div
	class="flex justify-center bg-primary-foreground min-h-screen px-5 py-0 sm:py-5 xl:px-24 lg:py-5 xl:py-10"
>
	<div
		class="container max-w-screen-xl pt-1 sm:pt-5 lg:pt-5 mx-auto bg-white rounded-2xl shadow mt-5 sm:mt-0 lg:mt-0"
	>
		<!-- <Carousel.Root  class="mt-5" >
      <div  class="flex justify-end">
        {#if hasPermission}
        <button on:click={() => goto('/rooms')} class="cursor-pointer flex items-center justify-center bg-gray-400 text-white p-2 rounded-md transition hover:bg-gray-500 hover:scale-105  duration-200 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32" {...$$props}>
              <path fill="black" d="M16 2A14.173 14.173 0 0 0 2 16a14.173 14.173 0 0 0 14 14a14.173 14.173 0 0 0 14-14A14.173 14.173 0 0 0 16 2m8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z" />
              <path fill="none" d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7z" />
            </svg>
          </button>
    {/if}</div>
      <Carousel.Content  >
        {#each rooms as rooms, index}
       

        <Carousel.Item  class="md:basis-1/1 lg:basis-1/3" >

          <div
          class="  p-4 my-2 bg-white border border-gray-200 rounded-lg shadow-md" on:click={() => handleRoomClick(rooms.Id)}
        >
        <div class="flex ">
          <div class="avatar ">
            <div class="w-full  flex justify-center min-w-20    bg-green-800 p-5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" {...$$props}>
                <path fill="white" d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z" />
              </svg>
            </div>
          </div>
          <div class="mx-2">
            <div class=" text-slate-400">LINE GROUP</div>
            <div class="   font-semibold   text-xl max-w-28 sm:max-w-full truncate ">
                {rooms.RoomName}

            </div>
            <div>ตรวจสอบไปแล้ว {rooms.TotalQuotaUsed} ครั้ง</div>
          </div>
        </div>
        </div>
      </Carousel.Item>
  {/each}

      </Carousel.Content>
      <div class="flex justify-center w-full py-2 gap-2">
        {#each rooms as _, index}
          <button class="btn btn-xs btn-circle" data-carousel-dot={index}>

          </button>
        {/each}
      </div>
      <Carousel.Previous />
      <Carousel.Next />
    </Carousel.Root> -->
		<div class="flex justify-end mb-4">
			{#if hasPermission}
				<button
					on:click={() => goto('/rooms')}
					class="cursor-pointer flex items-center justify-center bg-gray-400 text-white p-2 rounded-md transition hover:bg-gray-500 hover:scale-105 duration-200 ease-in-out"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32">
						<path
							fill="black"
							d="M16 2A14.173 14.173 0 0 0 2 16a14.173 14.173 0 0 0 14 14a14.173 14.173 0 0 0 14-14A14.173 14.173 0 0 0 16 2m8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z"
						/>
						<path fill="none" d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7z" />
					</svg>
				</button>
			{/if}
		</div>

		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="relative w-full overflow-hidden touch-pan-y select-none"
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:touchend={handleTouchEnd}
			on:mousedown={handleMouseDown}
			on:mousemove={handleMouseMove}
			on:mouseup={handleMouseUp}
			on:mouseleave={handleMouseLeave}
		>
			<div
				class="flex transition-transform duration-300 cursor-grab active:cursor-grabbing"
				style="transform: translateX(-{currentPage * 100}%);"
			>
				{#each Array(totalPages) as _, pageIndex}
					<div class="w-full flex-shrink-0">
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							{#each visibleRooms as room}
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div class="w-full">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<div
										class="w-full p-4 bg-white border border-gray-200 shadow-md cursor-pointer"
										on:click={() => handleRoomClick(room.Id)}
									>
										<div class="flex">
											<div class="avatar">
												<div
													class="w-full flex justify-center min-w-20 bg-green-800 p-5 rounded-lg"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="40"
														height="40"
														viewBox="0 0 24 24"
													>
														<path
															fill="white"
															d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z"
														/>
													</svg>
												</div>
											</div>
											<div class="mx-2 flex-1">
												<div class="text-slate-400">LINE GROUP</div>
												<div class="font-semibold text-xl max-w-28 sm:max-w-full truncate">
													{room.RoomName}
												</div>
												<div>ตรวจสอบไปแล้ว {room.TotalQuotaUsed} ครั้ง</div>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<!-- Navigation Dots -->
			<div class="flex flex-wrap justify-center mt-4">
				{#each Array(totalPages) as _, index}
					<button
						class="w-3 h-3 rounded-full mx-2 my-2 {currentPage === index
							? 'bg-blue-500'
							: 'bg-gray-300'}"
						on:click={() => (currentPage = index)}
					></button>
				{/each}
			</div>
		</div>
		{#if selectedRoom && !showForm}
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
								<div class="mx-2">
									<div class=" text-slate-400">สาขา</div>
									<div class="font-semibold text-xl max-w-28 sm:max-w-full truncate">
										{selectedRoom.RoomName}
									</div>
								</div>
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								{#if hasPermission}
									<div class="flex justify-end w-full items-center">
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<div
											on:click={() => {
												toggleForm(selectedRoom?.Id);
											}}
											class="cursor-pointer p-2 bg-gray-400 hover:bg-gray-500 hover:scale-105 rounded-md transition duration-200 ease-in-out"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="30"
												height="30"
												viewBox="0 0 24 24"
												{...$$props}
											>
												<path
													fill="black"
													d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.3 7.3 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68m-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5"
												/>
											</svg>
										</div>
									</div>
								{/if}
							</div>
							<div class=" mx-2 my-5 flex">
								<div class="canvas-container">
									<canvas bind:this={qrcanvas1} class="border-2 border-[#113566] rounded-md"
									></canvas>
								</div>
								<div class="mx-3 font-semibold content-center">
									<div class=" text-slate-400">QR LINK สำหรับการใช้ลงทะเบียกลุ่มไลน์สาธารณะ</div>
									<div>เลขอ้างอิงสาขา</div>
									<div>
										#{Id}
									</div>
								</div>
							</div>
							<div>
								<p class=" font-semibold mx-2">บัญชีที่เชื่อมต่อ</p>
								<div class="mx-2">
									{#if bankLinkRoom}
										{#each bankLinkRoom as bankLinkRoom}
											<div class="flex border my-2 border-gray-300 rounded-lg">
												<div class="avatar">
													<div class="w-10 rounded-full mx-2 my-2">
														{#if bankLinkRoom.TypeAccount === 'BANK' || bankLinkRoom.TypeAccount === 'Bank'}
															<img
																src={getBankImage(bankLinkRoom.BankCode)}
																alt="Bank Image"
																loading="lazy"
															/>
														{:else}
															<img
																src="https://spoynt.com/wp-content/uploads/2023/12/promtpay-qr.png"
																alt={bankLinkRoom.NameTH}
																loading="lazy"
															/>
														{/if}
													</div>
												</div>
												<div class=" col-span-2 content-center">
													<div class=" font-semibold">
														{bankLinkRoom.NameTH}
													</div>
													{#await maskMiddle(bankLinkRoom.AccountNo)}
														<div class="text-slate-400">กำลังโหลด...</div>
													{:then maskedAccountNo}
														<div class="text-slate-400">{maskedAccountNo}</div>
													{:catch error}
														<div class="text-red-500">Error: {error.message}</div>
													{/await}
												</div>
												<!-- svelte-ignore a11y-click-events-have-key-events -->
												<!-- svelte-ignore a11y-no-static-element-interactions -->
												<div
													class="dropdown dropdown-bottom flex flex-row justify-end bg-none my-2 mx-2 items-center col-span-2"
												></div>
											</div>
										{/each}
									{/if}
								</div>
							</div>
							<div class="mx-3 mt-3 font-semibold text-md">
								<div>
									<div class=" text-slate-400">สถานะการเชื่อมต่อ</div>
									<div>{LineGroupId ? 'เชื่อมต่อ' : 'ไม่เชื่อมต่อ'}</div>
								</div>
								<div class="my-3">
									<div class=" text-slate-400">กลุ่มไลน์เชื่อมต่อ</div>
									<div>{LineGroupId ? LineGroupId : '-'}</div>
								</div>
								<div>
									<div>เลขอ้างอิง</div>
									<div>#{Id}</div>
								</div>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}

		{#if selectedRoom && showForm}
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
										<input
											type="text"
											placeholder="กรอกข้อมูลที่นี่"
											class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											bind:value={selectedRoom.RoomName}
										/>
									</div>
								</div>
								<!-- svelte-ignore a11y-no-static-element-interactions -->
							</div>
							<div class=" mx-2 my-5">
								<div class="canvas-container">
									<canvas bind:this={qrcanvas1} class="border-2 border-[#113566] rounded-md"
									></canvas>
								</div>
							</div>
							<div class="my-3 mx-2">
								รหัสอ้างอิงกลุ่มไลน์ :
								<input
									type="text"
									placeholder="กรอกข้อมูลที่นี่"
									class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									pattern="[A-Za-z0-9]*"
									bind:value={selectedRoom.NotiOnLineGroupId}
									on:input={handleInput}
								/>
							</div>
							<div>
								<p class=" font-semibold mx-2">บัญชีที่เชื่อมต่อ</p>
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
																bankLinkRoom.some((bank) => bank.AccountNo === banks.AccountNo)}
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
							<div>ตั้งค่า ระบบการตรวจสอบ</div>
							<div>เตือน ยอดเงินขั่นต่ำ *</div>
							<div class="relative inline-flex items-center w-full">
								<!-- ช่องกรอกจำนวนเงิน -->

								<input
									id="paymentAmount"
									type="number"
									bind:value={paymentAmount}
									min={minPayment}
									step="1"
									class="text-start px-5 py-2 border rounded-lg pr-12 pl-10 w-full"
								/>
								<span
									class="absolute left-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500"
								>
									฿
								</span>
								<!-- ปุ่ม + และ - อยู่ข้างในช่อง input ทางขวา -->
								<button
									on:click={decreaseAmount}
									class="cursor-pointer absolute right-12 top-1/2 transform -translate-y-1/2 text-xl bg-red-500 text-white py-1 px-2 rounded-lg"
								>
									-
								</button>

								<!-- ปุ่ม + อยู่ขวาใกล้สุด -->
								<button
									on:click={increaseAmount}
									class="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-xl bg-green-500 text-white py-1 px-2 rounded-lg"
								>
									+
								</button>
							</div>
							<div class="m-2">
								<div class="flex justify-between">
									<div>ซ่อนเลขบัญชีผู้โอน</div>
									<div>
										<input
											type="checkbox"
											value="synthwave"
											class="toggle theme-controller toggle-success"
											id="menuToggle"
											checked={CheckedHideSenderDetail}
											on:change={handleSenderToggle}
										/>
									</div>
								</div>

								<div class="flex justify-between">
									<div>ซ่อนเลขบัญชีผู้รับ</div>
									<div>
										<input
											type="checkbox"
											value="synthwave"
											class="toggle theme-controller toggle-success"
											id="menuToggle"
											checked={CheckedHideReceiverDetail}
											on:change={handleReceiverToggle}
										/>
									</div>
								</div>
							</div>

							<div>Line Notify 1 ( การแจ้งเตือน)</div>
							<div class="flex flex-col gap-4 p-4">
								<!-- แถว 1 -->
								<div
									class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
								>
									<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">สลิป ถูกต้อง</span>
									<div class="flex space-x-2 justify-center items-center">
										<div>
											<div>
												<button
													class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
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
												</button>
											</div>
										</div>

										<div>
											<div>
												<button
													class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
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
												</button>
											</div>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg"
												class:bg-red-500={selectedOptions[0] === 'ALL'}
												on:click={() => selectOption(0, 'ALL')}
												class:bg-blue-600={selectedOptions[0] === 'ALL'}
												class:bg-gray-300={selectedOptions[0] !== 'ALL'}
											>
												<span class={selectedOptions[0] === 'ALL' ? 'text-white' : 'text-black'}
													>ทั้งสอง</span
												>
											</button>
										</div>
									</div>
								</div>

								<!-- แถว 2 -->
								<div
									class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
								>
									<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
										>สลิป ถูกใช้งานแล้ว</span
									>

									<div class="flex space-x-2 justify-center items-center">
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
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
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
												class:bg-green-500={selectedOptions[1] === 'LINE_GROUP'}
												on:click={() => selectOption(1, 'LINE_GROUP')}
												class:bg-blue-600={selectedOptions[1] === 'LINE_GROUP'}
												class:bg-gray-300={selectedOptions[1] !== 'LINE_GROUP'}
											>
												<span
													class={selectedOptions[1] === 'LINE_GROUP' ? 'text-white' : 'text-black'}
													>กลุ่มสาธารณะ</span
												>
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg"
												class:bg-red-500={selectedOptions[1] === 'ALL'}
												on:click={() => selectOption(1, 'ALL')}
												class:bg-blue-600={selectedOptions[1] === 'ALL'}
												class:bg-gray-300={selectedOptions[1] !== 'ALL'}
											>
												<span class={selectedOptions[1] === 'ALL' ? 'text-white' : 'text-black'}
													>ทั้งสอง</span
												>
											</button>
										</div>
									</div>
								</div>

								<!-- แถว 3 - 8 -->

								<div
									class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
								>
									<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
										>สลิป ไม่เจอ / หมดอายุ / ไม่พบ QRCode จากรูป</span
									>

									<div class="flex space-x-2 justify-center items-center">
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
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
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
												class:bg-green-500={selectedOptions[2] === 'LINE_GROUP'}
												on:click={() => selectOption(2, 'LINE_GROUP')}
												class:bg-blue-600={selectedOptions[2] === 'LINE_GROUP'}
												class:bg-gray-300={selectedOptions[2] !== 'LINE_GROUP'}
											>
												<span
													class={selectedOptions[2] === 'LINE_GROUP' ? 'text-white' : 'text-black'}
													>กลุ่มสาธารณะ</span
												>
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg"
												class:bg-red-500={selectedOptions[2] === 'ALL'}
												on:click={() => selectOption(2, 'ALL')}
												class:bg-blue-600={selectedOptions[2] === 'ALL'}
												class:bg-gray-300={selectedOptions[2] !== 'ALL'}
											>
												<span class={selectedOptions[2] === 'ALL' ? 'text-white' : 'text-black'}
													>ทั้งสอง</span
												>
											</button>
										</div>
									</div>
								</div>
								<div
									class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
								>
									<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
										>สลิป ผู้รับเงินไม่ตรง</span
									>

									<div class="flex space-x-2 justify-center items-center">
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
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
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
												class:bg-green-500={selectedOptions[3] === 'LINE_GROUP'}
												on:click={() => selectOption(3, 'LINE_GROUP')}
												class:bg-blue-600={selectedOptions[3] === 'LINE_GROUP'}
												class:bg-gray-300={selectedOptions[3] !== 'LINE_GROUP'}
											>
												<span
													class={selectedOptions[3] === 'LINE_GROUP' ? 'text-white' : 'text-black'}
													>กลุ่มสาธารณะ</span
												>
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg"
												class:bg-red-500={selectedOptions[3] === 'ALL'}
												on:click={() => selectOption(3, 'ALL')}
												class:bg-blue-600={selectedOptions[3] === 'ALL'}
												class:bg-gray-300={selectedOptions[3] !== 'ALL'}
											>
												<span class={selectedOptions[3] === 'ALL' ? 'text-white' : 'text-black'}
													>ทั้งสอง</span
												>
											</button>
										</div>
									</div>
								</div>
								<div
									class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
								>
									<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
										>ยอดโอนต่ำกว่ากำหนด</span
									>

									<div class="flex space-x-2 justify-center items-center">
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
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
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
												class:bg-green-500={selectedOptions[4] === 'LINE_GROUP'}
												on:click={() => selectOption(4, 'LINE_GROUP')}
												class:bg-blue-600={selectedOptions[4] === 'LINE_GROUP'}
												class:bg-gray-300={selectedOptions[4] !== 'LINE_GROUP'}
											>
												<span
													class={selectedOptions[4] === 'LINE_GROUP' ? 'text-white' : 'text-black'}
													>กลุ่มสาธารณะ</span
												>
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg"
												class:bg-red-500={selectedOptions[4] === 'ALL'}
												on:click={() => selectOption(4, 'ALL')}
												class:bg-blue-600={selectedOptions[4] === 'ALL'}
												class:bg-gray-300={selectedOptions[4] !== 'ALL'}
											>
												<span class={selectedOptions[4] === 'ALL' ? 'text-white' : 'text-black'}
													>ทั้งสอง</span
												>
											</button>
										</div>
									</div>
								</div>
								<div
									class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
								>
									<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
										>การแจ้งเตือนเติมโควตาและต่ออายุ</span
									>

									<div class="flex space-x-2 justify-center items-center">
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
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
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
												class:bg-green-500={selectedOptions[5] === 'LINE_GROUP'}
												on:click={() => selectOption(5, 'LINE_GROUP')}
												class:bg-blue-600={selectedOptions[5] === 'LINE_GROUP'}
												class:bg-gray-300={selectedOptions[5] !== 'LINE_GROUP'}
											>
												<span
													class={selectedOptions[5] === 'LINE_GROUP' ? 'text-white' : 'text-black'}
													>กลุ่มสาธารณะ</span
												>
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg"
												class:bg-red-500={selectedOptions[5] === 'ALL'}
												on:click={() => selectOption(5, 'ALL')}
												class:bg-blue-600={selectedOptions[5] === 'ALL'}
												class:bg-gray-300={selectedOptions[5] !== 'ALL'}
											>
												<span class={selectedOptions[5] === 'ALL' ? 'text-white' : 'text-black'}
													>ทั้งสอง</span
												>
											</button>
										</div>
									</div>
								</div>
								<div
									class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
								>
									<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left"
										>การแจ้งเตือนสลิปซ้ำ</span
									>

									<div class="flex space-x-2 justify-center items-center">
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
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
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg lg:flex md:flex sm:flex"
												class:bg-green-500={selectedOptions[6] === 'LINE_GROUP'}
												on:click={() => selectOption(6, 'LINE_GROUP')}
												class:bg-blue-600={selectedOptions[6] === 'LINE_GROUP'}
												class:bg-gray-300={selectedOptions[6] !== 'LINE_GROUP'}
											>
												<span
													class={selectedOptions[6] === 'LINE_GROUP' ? 'text-white' : 'text-black'}
													>กลุ่มสาธารณะ</span
												>
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg"
												class:bg-red-500={selectedOptions[6] === 'ALL'}
												on:click={() => selectOption(6, 'ALL')}
												class:bg-blue-600={selectedOptions[6] === 'ALL'}
												class:bg-gray-300={selectedOptions[6] !== 'ALL'}
											>
												<span class={selectedOptions[6] === 'ALL' ? 'text-white' : 'text-black'}
													>ทั้งสอง</span
												>
											</button>
										</div>
									</div>
								</div>
								<div
									class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg"
								>
									<span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">สรุปยอดสาขารายวัน</span
									>

									<div class="flex space-x-2 justify-center items-center">
										<div>
											<button
												class="px-4 py-2 rounded-lg"
												class:bg-green-500={selectedOptions[7] === 'LINE_GROUP_PRIVATE'}
												on:click={() => selectOption(7, 'LINE_GROUP_PRIVATE')}
												class:bg-green-600={selectedOptions[7] === 'LINE_GROUP_PRIVATE'}
												class:bg-gray-300={selectedOptions[7] !== 'LINE_GROUP_PRIVATE'}
											>
												<span
													class={selectedOptions[7] === 'LINE_GROUP_PRIVATE'
														? 'text-white'
														: 'text-black'}>กลุ่มส่วนตัว</span
												>
											</button>
										</div>
										<div>
											<button
												class="px-4 py-2 rounded-lg"
												class:bg-red-500={selectedOptions[7] === 'DISABLE'}
												on:click={() => selectOption(7, 'DISABLE')}
												class:bg-red-600={selectedOptions[7] === 'DISABLE'}
												class:bg-gray-300={selectedOptions[7] !== 'DISABLE'}
											>
												<span class={selectedOptions[7] === 'DISABLE' ? 'text-white' : 'text-black'}
													>ปิด</span
												>
											</button>
										</div>
									</div>
								</div>
								<!-- คุณสามารถทำซ้ำรูปแบบด้านบนและแก้ไขตัวแปรใน `selectedOptions` ให้เหมาะสม -->
								<button class="w-full bg-black text-white py-2 rounded-lg mt-4" on:click={Update}>
									บันทึกการเปลี่ยนแปลง
								</button>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
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
				<a href="/dashboard"
					><button class="btn bg-primary text-white hover:text-black">ไปหน้า แดชบอร์ด</button></a
				>
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
		<p class="py-4 text-center font-bold text-4xl">ล้มเหลว</p>
		<p class=" text-center">คุณไม่มีสิทธิ์ในการแก้ไขข้อมูล</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
