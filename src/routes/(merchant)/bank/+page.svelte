
<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card";
    import * as Carousel from "$lib/components/ui/carousel";
    import payment from"$lib/image/thai-qr.png";
    import { PUBLIC_API_ENDPOINT,PUBLIC_SECRETKEY } from '$env/static/public';
    import cookie from 'cookie';
	import { afterUpdate, onMount } from 'svelte';
	import { Plus } from 'svelte-radix';
  import { goto } from '$app/navigation';
  import QRCode from 'qrcode';
  import CryptoJS from 'crypto-js';
    let isOpen = false;
    let selectedMethod='bank' 
    let loading=false;
    let banks: any[] = [];
    let rooms: any[] = [];
    let minPayment = 0;
    let paymentAmount = minPayment;
    let NotiOnLineGroupId = ""
    interface Room {
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
  QrToken?:string;
  NotiOnLineGroupId?:string;
  NotiOnSlipDuplicated?:string;
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
		imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhQjvxKz4c3kDRgXc3YS1gVDAv1rlVu6NIEA&s'
	},
	{
		code: '030',
		name: 'ธ.ออมสิน',
		imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKB3R_1uIDD6IOdNF0ASnynXcUrrdxs3OUVw&s'
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
		imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMrfV_dWH9d6FO7JrEw11bWRbiIx0izN_I5g&s'
	},
	{
		code: '066',
		name: 'ธ.อิสลาม',
		imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIzQBxnxe1oqnWPkll8vmLqnxJcaRanB23ow&s'
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
    onMount(async () => {
		//////////////////// เพิ่มมาเพราะ Production ไม่สามารถอ่าน ไฟ .jsได้
		
		try {
			const bank = await GetBankLink();
      const room = await GetRoomLink();
			// Use profileData here

			banks = bank;
      rooms=room;

      

		} catch (error) {
			console.error('Error fetching profile:', error);
		} finally {
			// การอัปเดตสถานะการโหลด
			loading = false;
		}

	});

  let isBankSelected = true;
  let isRoomSelected = false;

  function showBankForm() {
    selectedMethod = "bank";
    isBankSelected = true;
    isRoomSelected = false;
    showForm = false;
    selectedOption = ""
    isOpen = false;
  }

  function showPromptPayForm() {
    selectedMethod = "promptpay";
    isBankSelected = false;
    isRoomSelected = true;
    isOpen = false;
  }

  // สถานะเปิดปิดเมนู dropdown
  let selectedOption = "";  // ตัวเลือกที่เลือกไว้

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
				'ngrok-skip-browser-warning': 'true'
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
				'ngrok-skip-browser-warning': 'true'
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

  const GetBankLinkRoom = async (roomId:string) => {
		let config = {
			method: 'GET', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
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
  function getBankName(bankCode: string) {
		const bank = bankchecks.find((b) => b.code === bankCode);
		return bank ? bank.name : "PrompyPay"; // กรณีไม่พบจะใช้ภาพ default
	}
  let selectedRoom: Room | null = null;
  let bankLinkRoom : any[]=[];

  async function handleRoomClick(roomId: any) {
    showForm = false;
    selectedRoom = rooms.find(r => r.Id === roomId);
    const bank = await GetBankLinkRoom(roomId);
    QrToken=selectedRoom?.QrToken ?? null
    bankLinkRoom = bank
    selectedBankAccounts = bank
    if (QrToken) {
        await handleGenerate();
    }
    console.log(selectedRoom,roomId,bank,QrToken)
  }
  let showForm = false;
  let CheckedHideReceiverDetail = false
  let CheckedHideSenderDetail  = false
  const toggleForm =async (roomId: any) => {
    showForm = !showForm; // เปลี่ยนสถานะของ showForm
    selectedRoom  = rooms.find(r => r.Id === roomId);
    paymentAmount = selectedRoom?.MinAmountReceive ?? 0;
    CheckedHideSenderDetail = selectedRoom?.HideSenderDetail?? false;
    CheckedHideReceiverDetail = selectedRoom?.HideReceiverDetail?? false;
    selectedOptions = [
    selectedRoom?.NotiOnValid ?? 'option1',         // สลิป ถูกต้อง
    selectedRoom?.NotiOnInvalid ?? 'option1',           // สลิป ถูกใช้งานแล้ว
    selectedRoom?.NotiOnInvalidUnverified ?? 'option1',       // สลิป ไม่เจอ / หมดอายุ / ไม่พบ QRCode
    selectedRoom?.NotiOnInvalidReceiverBankAccount ?? 'option1',  // สลิป ผู้รับเงินไม่ตรง
    selectedRoom?.NotiOnInvalidMinAmount ?? 'option1',     // ยอดโอนต่ำกว่ากำหนด
    selectedRoom?.NotiOnQuotaLimitExceed ?? 'option1',    // การแจ้งเตือนเติมโควตาและต่ออายุ
    selectedRoom?.NotiOnSlipDuplicated ?? 'option2' ,
    selectedRoom?.TransactionSummary ?? 'option2'        // สรุปยอดสาขารายวัน
  ];
    console.log(qrcanvas1)
    console.log(selectedRoom,selectedOptions)
  }
 
  //////////////////////gen Qrcode
  let qrcanvas1: HTMLCanvasElement;
  let encryptedData: string = '';
  let errorMessage: string = '';
  const encryptData = (data: string): string | null => {
    try {
      console.log('Encrypting data:', data);
      const key = CryptoJS.enc.Utf8.parse(PUBLIC_SECRETKEY); // ทำให้แน่ใจว่าเป็นคีย์ที่มีขนาด 256 บิต
      const encrypted = CryptoJS.AES.encrypt(data, key, { mode: CryptoJS.mode.ECB }).toString();
      console.log('Encrypted result:', encrypted);
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      errorMessage = 'การเข้ารหัสผิดพลาด: ' + (error as Error).message;
      return null;
    }
  };
  afterUpdate(async () => {
  if (QrToken) {
    await handleGenerate();  // เรียกใช้เพื่อสร้าง QR Code ถ้าข้อมูลเปลี่ยน
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
      console.log("+++++++++++++",qrcanvas1)
      
      // คัดลอก QR Code จาก canvas1 ไปยัง canvas2
      errorMessage = '';
    } else {
      errorMessage = 'Canvas element is not available';
    }
    } catch (error) {
      errorMessage = 'การสร้าง QR Code ผิดพลาด: ' + (error as Error).message;
    }
  };

  const handleGenerate =async (): Promise<void> => {
    console.log('handleGenerate called'); // Debug log
    const dataString = `${QrToken}`;
    
    // Encrypt data
    const encrypted = encryptData(dataString);
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
    console.log(selectedOptions)
  }

  function Update() {
    const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
    const updateData = {
    // ชื่อห้อง
    Id  : selectedRoom?.Id,
    RoomName: selectedRoom?.RoomName,
    MerchantId:parseInt(myCookie.Id),
    // บัญชีที่เชื่อมต่อ - กรองเฉพาะบัญชีที่ถูกเลือก (checked)
    // linkedAccounts: selectedBankAccounts,
    NotiOnLineGroupId:selectedRoom?.NotiOnLineGroupId,
    // ยอดเงินขั้นต่ำ
    MinAmountReceive: paymentAmount,
    
    // การตั้งค่าการซ่อนข้อมูล

    HideSenderDetail: CheckedHideSenderDetail,
      HideReceiverDetail: CheckedHideReceiverDetail,

    
    // การตั้งค่าการแจ้งเตือน Line

    NotiOnValid: selectedOptions[0],           // สลิปถูกต้อง
    NotiOnInvalid: selectedOptions[1],            // สลิปถูกใช้งานแล้ว
    NotiOnInvalidReceiverBankAccount: selectedOptions[2],         // สลิปไม่เจอ/หมดอายุ/ไม่พบ QR Code
    NotiOnInvalidUnverified: selectedOptions[3],      // สลิปผู้รับเงินไม่ตรง
    NotiOnInvalidMinAmount: selectedOptions[4],        // ยอดโอนต่ำกว่ากำหนด
    NotiOnQuotaLimitExceed: selectedOptions[5],     // การแจ้งเตือนเติมโควตาและต่ออายุ
    NotiOnSlipDuplicated:selectedOptions[6],
    TransactionSummary: selectedOptions[7]   // สรุปยอดสาขารายวัน

  };
  console.log(updateData)
  UpdateRoom(updateData,selectedBankAccounts)

  }
  let selectedBankAccounts: any[] = [];
  const handleBankSelection = (bank: { AccountNo: any; }, isChecked: any) => {
  if (isChecked) {
    selectedBankAccounts = [...selectedBankAccounts, bank];
  } else {
    selectedBankAccounts = selectedBankAccounts.filter(acc => acc.AccountNo !== bank.AccountNo);
  }
};

const handleSenderToggle = () => {
  CheckedHideSenderDetail = !CheckedHideSenderDetail;
};

// handler สำหรับ receiver
const handleReceiverToggle = () => {
  CheckedHideReceiverDetail = !CheckedHideReceiverDetail;
};

const UpdateRoom = async (dataupdate:any,bankData:any[][]) => {
  const cookies = getCookies();
  const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
  const bankIds = bankData.map(bank => bank.Id);
  console.log('data', dataupdate,bankIds);
  const requestBody = {
            rooms: dataupdate,
            bank: bankIds,
            email:myCookie.Email
        };
		let config = {
			method: 'PUT', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
			},
      body: JSON.stringify(
  requestBody),
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
			}else {
				const modal = document.getElementById('my_modal_3');
				if (modal) {
					modal.showModal();
				}
		      return data.result;
			}
		
	};

  async function handleCheckboxChange(event: { target: { checked: boolean } }, id: any) {
		const isChecked = event.target.checked;
		try {
		const permissionGranted = await UpdateBankLink(id, isChecked); // Send value 1 or 0
		console.log(id, isChecked);

		if (!permissionGranted) {
			// Revert the checkbox value if permission denied
			event.target.checked = !isChecked;
			// You might also want to revert the state in the banks array
			const bank = banks.find(b => b.Id === id);
			if (bank) {
				bank.Active = !isChecked; // Ensure the bank state reflects the checkbox state
			}
		} else {
			// If the operation is successful, update the banks array to reflect the new status
			const bank = banks.find(b => b.Id === id);
			if (bank) {
				bank.Active = isChecked; // Update the active state
			}
		}
	} 
	catch (error) {
		console.error("Error updating bank link:", error);
		// Revert the checkbox state if there was an error
		event.target.checked = !isChecked;
		const bank = banks.find(b => b.Id === id);
		if (bank) {
			bank.Active = !isChecked; // Ensure the bank state reflects the checkbox state
		}
	}
	}

  const UpdateBankLink = async (id: String, status: boolean) => {
		// Create configuration for the fetch request
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log(id, status);
		let config = {
			method: 'PUT', // Use GET method
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
			}
		};
		console.log(id);
		try {
			// Make the fetch request
			const type = myCookie.Type || 'PaySo';
			const result = await fetch(`${PUBLIC_API_ENDPOINT}/update/bankdata/${id}/${status}/${myCookie.Email}/${type}/${myCookie.Id}`, config);
			const datas = await result.json();
			if (datas.message == 'permission denied') {
				const modal = document.getElementById('my_modal_4');
				if (modal) {
					modal.showModal();
				}
				return false;
			}else {
				return true;
			}
		} catch (error) {
			console.error('Error fetching transaction data:', error);
		}
	};

  // const DeleteBankLink = async (id: String) => {
	// 	// Create configuration for the fetch request
	// 	const cookies = getCookies();
	// 	const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
	// 	console.log('++++++++++', myCookie.Id, myCookie.Email);
	// 	let config = {
	// 		method: 'DELETE', // Use GET method
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'ngrok-skip-browser-warning': 'true'
	// 		}
	// 	};

	// 	try {
	// 		// Make the fetch request
	// 		const type = myCookie.Type || 'PaySo';
	// 		const result = await fetch(
	// 			`${PUBLIC_API_ENDPOINT}/delete/bankdata/${id}/${myCookie.Email}/${type}/${myCookie.Id}`,
	// 			config
	// 		);
	// 		const datas = await result.json();
	// 		console.log(datas.message);
	// 		if (datas.message != 'permission denied') {
	// 			banks = banks.filter((item) => String(item.Id) !== String(id));
	// 			console.log('banks ', banks);
	// 			const modal = document.getElementById('my_modal_1');
	// 			modal.close();
	// 		} else {
	// 			const modal = document.getElementById('my_modal_4');
	// 			if (modal) {
	// 				modal.showModal();
	// 			}
	// 		}
	// 	} catch (error) {
	// 		console.error('Error fetching transaction data:', error);
	// 	}
	// };

  function handleInput(event: { target: { value: string; }; }) {
        // Only allow alphanumeric characters
        selectedRoom.NotiOnLineGroupId = event.target.value.replace(/[^A-Za-z0-9]/g, "");
    }
</script>
<div class="flex justify-center bg-primary-foreground min-h-screen px-10 py-0  sm:py-5  xl:px-24 lg:py-5 xl:py-10 ">
    
    <div class="container max-w-screen-xl  pt-1 sm:pt-5 lg:pt-5 mx-auto bg-white rounded-2xl shadow ">
      <div class="flex   justify-evenly gap-5">
        <!-- Card ธนาคาร -->
        <div class="w-full sm:w-auto  ">
          <Card.Root class={`w-full min-w-[100px] h-[100px] sm:h-[100px] lg:h-[100px] cursor-pointer 
            transition-all duration-200
            ${selectedMethod === 'bank' 
              ? 'border-4 border-[#477DFF] bg-[#F0F4FF]' 
              : 'border border-[#EAECF0]'}`} on:click={showBankForm}>
            <Card.Content class="px-5 h-full content-center">
              <div class="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 48 48" {...$$props}>
                  <g fill="none" stroke-linejoin="round" stroke-width="4">
                    <rect width="40" height="28" x="4" y="10" fill="white" stroke="black" rx="2" />
                    <path stroke="black" stroke-linecap="round" d="M4 20H44" />
                    <path stroke="black" stroke-linecap="round" d="M4 17V23" />
                    <path stroke="black" stroke-linecap="round" d="M44 17V23" />
                    <path stroke="black" stroke-linecap="round" d="M29 29L37 29" />
                  </g>
                </svg>
              </div>
              <div class="text-center">บัญชีธนาคาร</div>
            </Card.Content>
          </Card.Root>
        </div>
  
        <!-- Card พร้อมเพย์ -->
        <div class="w-full sm:w-auto">
          <Card.Root class={`w-full min-w-[100px] h-[100px] sm:h-[100px] lg:h-[100px] cursor-pointer 
            transition-all duration-200
            ${selectedMethod === 'promptpay' 
              ? 'border-4 border-[#477DFF] bg-[#F0F4FF]' 
              : 'border border-[#EAECF0]'}`} on:click={showPromptPayForm}>
            <Card.Content class="px-5 h-full content-center">
              <div class="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" {...$$props}>
                  <g fill="none" stroke="black">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.5 21v-5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v5" />
                    <path d="M5 11v6c0 1.886 0 2.828.586 3.414S7.114 21 9 21h6c1.886 0 2.828 0 3.414-.586S19 18.886 19 17v-6M4.621 4.515c.182-.728.273-1.091.544-1.303C5.437 3 5.812 3 6.562 3h10.876c.75 0 1.125 0 1.397.212c.27.212.362.575.544 1.303l1.203 4.814c.097.388.146.581.135.739a1 1 0 0 1-.69.883c-.15.049-.354.049-.763.049c-.533 0-.8 0-1.023-.052a2 2 0 0 1-1.393-1.18c-.089-.212-.132-.47-.217-.983c-.024-.144-.036-.216-.05-.235a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489l-.018.1A2 2 0 0 1 14.352 11h-.204a2 2 0 0 1-1.936-1.726l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489l-.018.1A2 2 0 0 1 9.852 11h-.204A2 2 0 0 1 7.73 9.374l-.018-.1l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235c-.085.514-.128.77-.217.983a2 2 0 0 1-1.392 1.18C5.536 11 5.27 11 4.736 11c-.409 0-.613 0-.763-.049a1 1 0 0 1-.69-.883c-.01-.158.038-.351.135-.739z" />
                  </g>
                </svg>
              </div>
              <div class="text-center">ห้อง</div>
            </Card.Content>
          </Card.Root>
          
        </div>
        
      </div>
    {#if isBankSelected}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="my-5 grid grid-cols-1 lg:px-5" >
        <div class=" w-full">
            <div class=" font-semibold my-3">บัญชีธนาคาร</div>
            </div>
            <Carousel.Root>
              <Carousel.Content>
                {#each banks as banks}
                <Carousel.Item class="md:basis-1/2 lg:basis-1/4">
								<div
									class="  p-4 my-2 bg-white border border-gray-200 rounded-lg shadow-md"
								>
                
                <div class="mt-2">
                  <div class=" content-end flex justify-end"><input
                    type="checkbox"
                    value="synthwave"
                    class="toggle theme-controller toggle-success"
                    id="menuToggle"
                    checked={banks.Active}
                    on:click={(event) => handleCheckboxChange(event, banks.Id)}
                  />
                </div>
                  <div class="flex">
                    
									<div class="avatar">
										<div class="w-10 rounded-full mx-2 my-2">
											{#if banks.TypeAccount === 'BANK' || banks.TypeAccount === 'Bank'}
												<img src={getBankImage(banks.BankCode)} alt="Bank Image" loading="lazy" />
											{:else}
												<img
													src="https://spoynt.com/wp-content/uploads/2023/12/promtpay-qr.png"
													alt={banks.NameTH}
													loading="lazy"
												/>
											{/if}
										</div>
									</div>
                  <div>
                    <div class=" text-slate-400">บัญชี</div>
                    <div class=" text-wrap  font-semibold   text-xl">
                      {#if banks.TypeAccount === 'BANK' || banks.TypeAccount === 'Bank'}
                      {getBankName(banks.BankCode)}
                    {:else}
                        Promptpay
                    {/if}

                    </div>
                  </div>
                </div>
									<div class="col-span-5  min-w-full mx-3 text-md my-2">
                    <div class="font-semibold"> {banks.NameTH}</div> 
                    <div class="text-slate-400"> {banks.AccountNo}</div>
                    <!-- <div class="flex justify-end">
                      <div class="content-end"><button
                        class="dropdown dropdown-bottom flex flex-col justify-center mx-3 bg-none items-center"
                        on:click={(event) => DeleteBankLink(banks.Id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#ff0000"
                            d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
                          />
                        </svg>
                      </button>
                    </div></div> -->
                  </div>

                <div>
                  
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<!-- <div
										class="dropdown dropdown-bottom flex flex-row justify-end bg-none my-2 mx-2 items-center col-span-2"
									>
										<input
											type="checkbox"
											value="synthwave"
											class="toggle theme-controller toggle-success"
											id="menuToggle"
											checked={banks.Active}
										/>

										<button
											class="dropdown dropdown-bottom flex flex-col justify-center bg-none my-2 ml-3 items-center"
											
										>

											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="30"
												height="30"
												viewBox="0 0 24 24"
											>
												<path
													fill="#ff0000"
													d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
												/>
											</svg>
										</button>
									</div> -->
								</div>
                
              </Carousel.Item>
							{/each}
                
              </Carousel.Content>
              <Carousel.Previous />
  <Carousel.Next />
            </Carousel.Root>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div class="relative w-full h-32 "  on:click={() => {
            goto('/banklink');
        }}>
            <!-- Background and overlay -->
            <div class="absolute inset-0 overflow-hidden flex items-center  justify-center  bg-slate-50">
              <svg width="400" height="400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="60" y="80" width="120" height="80" rx="8" fill="#E2E8F0" opacity="0.5" />
                <rect x="70" y="100" width="80" height="10" rx="2" fill="#CBD5E1" />
                <rect x="70" y="120" width="40" height="10" rx="2" fill="#CBD5E1" />
                <circle cx="150" cy="125" r="15" fill="#CBD5E1" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}>
              <path fill="#0055ff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
            </svg>
            </div>
            
            <!-- Floating button -->
            <div class="relative h-full flex items-center justify-center  ">
              <button class="w-full py-4 px-6 flex items-center gap-3 bg-[#ceddf9] hover:bg-[#b5c9ef] transition-colors relative"
                 >
                 <div class="w-full flex justify-center ">
                  <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Plus class="w-5 h-5 text-white" />
                  </div>
                  <span class="text-blue-600 font-medium content-center mx-2">สร้างบัญชีธนาคารเพิ่ม</span>
                </div>
              </button>
            </div>
          </div>
          </div>
    {/if}
    {#if isRoomSelected}

    <Carousel.Root  class="mt-5" >
      <div  class="flex justify-end"><a href="/rooms"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32" {...$$props}>
        <path fill="black" d="M16 2A14.173 14.173 0 0 0 2 16a14.173 14.173 0 0 0 14 14a14.173 14.173 0 0 0 14-14A14.173 14.173 0 0 0 16 2m8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z" />
        <path fill="none" d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7z" />
      </svg></a></div>
      <Carousel.Content  >
        {#each rooms as rooms}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
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
            <div class=" text-slate-400">Line Group</div>
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
      <Carousel.Previous />
      <Carousel.Next />
    </Carousel.Root>
    
    {#if selectedRoom && !showForm}
    <Card.Root class="my-5" >
			<Card.Content>
				<div class="my-5 grid grid-cols-1 lg:px-5" >
          <div class="w-full  ">
            <div class="flex mx-2">
              <div class="avatar ">
                <div class="w-full  flex justify-center min-w-15 content-center    bg-green-800 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" {...$$props}>
                    <path fill="white" d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z" />
                  </svg>
                </div>
              </div>
              <div class="mx-2">
                <div class=" text-slate-400">สาขา</div>
                <div class="font-semibold text-xl max-w-28 sm:max-w-full truncate" >
                    {selectedRoom.RoomName}
                </div>
              </div>
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div class="flex justify-end w-full items-center">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={() => {
                 toggleForm(selectedRoom?.Id);
              }} ><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" {...$$props}>
                  <path fill="black" d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.3 7.3 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68m-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5" />
                </svg></div></div>
              
            </div>
            <div class=" mx-2 my-5"><div class="canvas-container">
              <canvas bind:this={qrcanvas1} class="border-2 border-[#113566] rounded-md"></canvas>
            </div></div>
            <div>
              <p class=" font-semibold mx-2">บัญชีที่เชื่อมต่อ</p>
              <div class="mx-2">
                {#if bankLinkRoom}
                {#each bankLinkRoom as bankLinkRoom}
                <div
									class="flex border my-2 border-gray-300 rounded-lg"
								>
									<div class="avatar">
										<div class="w-10 rounded-full mx-2 my-2">
											{#if  bankLinkRoom.TypeAccount === 'BANK' || bankLinkRoom.TypeAccount === 'Bank'}
												<img src={getBankImage(bankLinkRoom.BankCode)} alt="Bank Image" loading="lazy" />
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
                  <div class=" text-slate-400">
                    {bankLinkRoom.AccountNo}
                  </div>
									</div>
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class="dropdown dropdown-bottom flex flex-row justify-end bg-none my-2 mx-2 items-center col-span-2"
									>
									</div>
								</div>
          {/each}
          {/if}
                
              </div>
            </div>
            <!-- Add any other detailed information you want to display here -->
             
          </div>
        </div>
			</Card.Content>
		  </Card.Root>
    
  {/if}
      
  {#if  selectedRoom && showForm }
  <Card.Root class="my-5" >
    <Card.Content>
      <div class="my-5 grid grid-cols-1 lg:px-5" >
        <div class="w-full  ">
          <div class="flex mx-2">
            <div class="avatar ">
              <div class="w-full  flex justify-center min-w-15 content-center    bg-green-800 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" {...$$props}>
                  <path fill="white" d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z" />
                </svg>
              </div>
            </div>
            <div class="mx-2 w-full">
              <div class="font-semibold text-xl w-full sm:max-w-full truncate" >
                <input 
      type="text" 
      placeholder="กรอกข้อมูลที่นี่" 
      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
      bind:value={selectedRoom.RoomName}
      />
              </div>
            </div>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
           
            
          </div>
          <div class=" mx-2 my-5"><div class="canvas-container">
            <canvas bind:this={qrcanvas1} class="border-2 border-[#113566] rounded-md"></canvas>
          </div></div>
          <div class="my-3 mx-2">
            Notion Line Group Id:
            <input 
            type="text" 
            placeholder="กรอกข้อมูลที่นี่" 
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
            pattern="[A-Za-z0-9]*"
            bind:value={selectedRoom.NotiOnLineGroupId}
            on:input={handleInput}
            />
          </div>
          <div>
            <p class=" font-semibold mx-2">บัญชีที่เชื่อมต่อ</p>
            <div class="mx-2">
              {#if banks }
              {#each banks as banks}
              {#if banks.Active != false}
              <div
                class="flex border my-2 border-gray-300 rounded-lg "
              >
                <div class="avatar">
                  <div class="w-10 rounded-full mx-2 my-2">
                    {#if  banks.TypeAccount === 'BANK' || banks.TypeAccount === 'Bank'}
                      <img src={getBankImage(banks.BankCode)} alt="Bank Image" loading="lazy" />
                    {:else}
                      <img
                        src="https://spoynt.com/wp-content/uploads/2023/12/promtpay-qr.png"
                        alt={banks.NameTH}
                        loading="lazy"
                      />
                    {/if}
                  </div>
                </div>
                <div class="  content-center  w-full">
                <div class=" font-semibold">
                  {banks.NameTH}
                </div>
                <div class=" text-slate-400">
                  {banks.AccountNo}
                </div>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class=" content-center flex justify-end items-center lg:mx-2"><input
                type="checkbox"
                value="synthwave"
                class="toggle theme-controller toggle-success"
                id="menuToggle"
                checked={bankLinkRoom && Array.isArray(bankLinkRoom) && bankLinkRoom.some(bank => bank.AccountNo === banks.AccountNo)}
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
              class="text-start px-5 py-2   border rounded-lg pr-12 pl-10 w-full" 
            />
            <span class="absolute left-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">
              ฿
            </span>
            <!-- ปุ่ม + และ - อยู่ข้างในช่อง input ทางขวา -->
            <button 
    on:click={decreaseAmount} 
    class="absolute right-12 top-1/2 transform -translate-y-1/2 text-xl bg-red-500 text-white py-1 px-2 rounded-full"
  >
    -
  </button>
  
  <!-- ปุ่ม + อยู่ขวาใกล้สุด -->
  <button 
    on:click={increaseAmount} 
    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl bg-green-500 text-white py-1 px-2 rounded-full"
  >
    +
  </button>
          </div>
          <div class="m-2">
            <div class="flex justify-between">
              <div>ซ่อนเลขบัญชีผู้โอน</div>
              <div> <input
                type="checkbox"
                value="synthwave"
                class="toggle theme-controller toggle-success"
                id="menuToggle"
                checked={CheckedHideSenderDetail}
                on:change={handleSenderToggle}
              /></div>
            </div>
           
            <div class="flex justify-between">
              <div>ซ่อนเลขบัญชีผู้โอน</div>
              <div> <input
                type="checkbox"
                value="synthwave"
                class="toggle theme-controller toggle-success"
                id="menuToggle"
                checked={CheckedHideReceiverDetail}
                on:change={handleReceiverToggle}
              /></div>
            </div>
          </div>

          <div>Line Notify 1 ( การแจ้งเตือน)</div>
          <div class="flex flex-col gap-4 p-4">
            <!-- แถว 1 -->
            <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg">
              <span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">สลิป ถูกต้อง</span>
              <div class="flex space-x-2">
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-blue-500={selectedOptions[0] === 'LINE OA'}
                  on:click={() => selectOption(0, 'LINE OA')}
                >
                  Line OA
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-green-500={selectedOptions[0] === 'LINE GROUP'}
                  on:click={() => selectOption(0, 'LINE GROUP')}
                >
                  Line กลุ่ม
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-red-500={selectedOptions[0] === 'ALL'}
                  on:click={() => selectOption(0, 'ALL')}
                >
                ทั้งสอง
                </button>
              </div>
            </div>
          
            <!-- แถว 2 -->
            <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg">
              <span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">สลิป ถูกใช้งานแล้ว</span>
              
              <div class="flex space-x-2">
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-blue-500={selectedOptions[1] === 'LINE OA'}
                  on:click={() => selectOption(1, 'LINE OA')}
                >
                  Line OA
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-green-500={selectedOptions[1] === 'LINE GROUP'}
                  on:click={() => selectOption(1, 'LINE GROUP')}
                >
                  Line กลุ่ม
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-red-500={selectedOptions[1] === 'ALL'}
                  on:click={() => selectOption(1, 'ALL')}
                >
                ทั้งสอง
                </button>
              </div>
            </div>
          
            <!-- แถว 3 - 8 -->

            <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg">
              <span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">สลิป ไม่เจอ / หมดอายุ / ไม่พบ QRCode จากรูป</span>
              
              <div class="flex space-x-2">
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-blue-500={selectedOptions[2] === 'LINE OA'}
                  on:click={() => selectOption(2, 'LINE OA')}
                >
                  Line OA
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-green-500={selectedOptions[2] === 'LINE GROUP'}
                  on:click={() => selectOption(2, 'LINE GROUP')}
                >
                  Line กลุ่ม
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-red-500={selectedOptions[2] === 'ALL'}
                  on:click={() => selectOption(2, 'ALL')}
                >
                ทั้งสอง
                </button>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg">
              <span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">สลิป ผู้รับเงินไม่ตรง</span>
              
              <div class="flex space-x-2">
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-blue-500={selectedOptions[3] === 'LINE OA'}
                  on:click={() => selectOption(3, 'LINE OA')}
                >
                  Line OA
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-green-500={selectedOptions[3] === 'LINE GROUP'}
                  on:click={() => selectOption(3, 'LINE GROUP')}
                >
                  Line กลุ่ม
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-red-500={selectedOptions[3] === 'ALL'}
                  on:click={() => selectOption(3, 'ALL')}
                >
                ทั้งสอง
                </button>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg">
              <span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">ยอดโอนต่ำกว่ากำหนด</span>
              
              <div class="flex space-x-2">
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-blue-500={selectedOptions[4] === 'LINE OA'}
                  on:click={() => selectOption(4, 'LINE OA')}
                >
                  Line OA
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-green-500={selectedOptions[4] === 'LINE GROUP'}
                  on:click={() => selectOption(4, 'LINE GROUP')}
                >
                  Line กลุ่ม
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-red-500={selectedOptions[4] === 'ALL'}
                  on:click={() => selectOption(4, 'ALL')}
                >
                ทั้งสอง
                </button>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg">
              <span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">การแจ้งเตือนเติมโควตาและต่ออายุ</span>
              
              <div class="flex space-x-2">
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-blue-500={selectedOptions[5] === 'LINE OA'}
                  on:click={() => selectOption(5, 'LINE OA')}
                >
                  Line OA
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-green-500={selectedOptions[5] === 'LINE GROUP'}
                  on:click={() => selectOption(5, 'LINE GROUP')}
                >
                  Line กลุ่ม
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-red-500={selectedOptions[5] === 'ALL'}
                  on:click={() => selectOption(5, 'ALL')}
                >
                ทั้งสอง
                </button>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg">
              <span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">การแจ้งเตือนสลิปซ้ำ</span>
              
              <div class="flex space-x-2">
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-blue-500={selectedOptions[6] === 'LINE OA'}
                  on:click={() => selectOption(6, 'LINE OA')}
                >
                  Line OA
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-green-500={selectedOptions[6] === 'LINE GROUP'}
                  on:click={() => selectOption(6, 'LINE GROUP')}
                >
                  Line กลุ่ม
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-red-500={selectedOptions[6] === 'ALL'}
                  on:click={() => selectOption(6, 'ALL')}
                >
                ทั้งสอง
                </button>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 shadow rounded-lg">
              <span class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">สรุปยอดสาขารายวัน</span>
              
              <div class="flex space-x-2">
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-green-500={selectedOptions[7] === 'LINE OA'}
                  on:click={() => selectOption(7, 'LINE OA')}
                >
                  Line OA
                </button>
                <button
                  class="px-4 py-2 rounded-lg"
                  class:bg-red-500={selectedOptions[7] === 'DISABLE'}
                  on:click={() => selectOption(7, 'DISABLE')}
                >
                  ทั้งสอง
                </button>
              </div>
            </div>
            <!-- คุณสามารถทำซ้ำรูปแบบด้านบนและแก้ไขตัวแปรใน `selectedOptions` ให้เหมาะสม -->
             <button 
                  class="w-full bg-black text-white py-2 rounded-lg mt-4"
                  on:click={Update}
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
          </div>
        </div>
      </div>
    </Card.Content>
    </Card.Root>
  {/if}
  {/if}
</div>
</div>



<dialog id="my_modal_3" class="modal">
	<div class="modal-box ">
		<div class="text-lg font-bold flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 32 32" {...$$props}>
				<path fill="#17B26A" d="m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415z" />
				<path fill="#17B26A" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12" />
			</svg>
		</div>
		<p class="py-4 text-center font-bold text-4xl">สำเร็จ</p>
		<p class=" text-center">บันทึกข้อมูลสำเร็จ</p>
    <div class="flex  w-full  justify-around mt-5">
    <div class="flex content-center">
      <!-- Button to close the modal -->
      

      <!-- Button to go to another page -->
      <a href="/dashboard"><button class="btn bg-primary text-white hover:text-black" >ไปหน้า แดชบอร์ด</button></a>
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


