<script lang="ts">
     import * as Card from "$lib/components/ui/card";
    import * as Carousel from "$lib/components/ui/carousel";
    import payment from"$lib/image/thai-qr.png";
    import { PUBLIC_API_ENDPOINT,PUBLIC_SECRETKEY,PUBLIC_BACKEND_API_KEY, PUBLIC_PAYSO_DEFAULT_SECRET } from '$env/static/public';
    import cookie from 'cookie';
	import { onMount } from 'svelte';
  import QRCode from 'qrcode';
  import CryptoJS from 'crypto-js';
    let loading=false;
    let banks: any[] = [];
    let minPayment = 1;
    let paymentAmount = minPayment;
    let Name = ""
     let NotiOnLineGroupId = ""
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
      handleGenerate();
			const bank = await GetBankLink();

			// Use profileData here

			banks = bank;
      
           selectedOptions[0] = "ALL",           // สลิปถูกต้อง
     selectedOptions[1]= "ALL",            // สลิปถูกใช้งานแล้ว
     selectedOptions[2]= "ALL",         // สลิปไม่เจอ/หมดอายุ/ไม่พบ QR Code
    selectedOptions[3]= "ALL",      // สลิปผู้รับเงินไม่ตรง
    selectedOptions[4]= "ALL",        // ยอดโอนต่ำกว่ากำหนด
     selectedOptions[5]= "ALL",     // การแจ้งเตือนเติมโควตาและต่ออายุ
     selectedOptions[6]= "ALL",
    selectedOptions[7]= "DISABLE"   // สรุปยอดสาขารายวัน

		} catch (error) {
			console.error('Error fetching profile:', error);
		} finally {
			// การอัปเดตสถานะการโหลด
			loading = false;
		}

	});


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
				'ngrok-skip-browser-warning': 'true',
        'apikey': PUBLIC_BACKEND_API_KEY
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

  /**
	 * @param {string} bankCode
	 */
  function getBankImage(bankCode: string) {
		const bank = bankchecks.find((b) => b.code === bankCode);
		return bank ? bank.imageUrl : 'https://spoynt.com/wp-content/uploads/2023/12/promtpay-qr.png'; // กรณีไม่พบจะใช้ภาพ default
	}
  let selectedRoom: Rooms | null = null;
  let bankLinkRoom : any[]=[];

  let CheckedHideReceiverDetail = false
  let CheckedHideSenderDetail  = false

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
  function selectOption(row: number ,option: string) {
    selectedOptions[row] = option;
    console.log(selectedOptions)
  }

  function Update() {
    if (!Name) {
      errorMessage = "กรุณากรอกข้อมูลให้ครบถ้วน"; // ตั้งค่า errorMessage
      document.getElementById('nameInput').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return; // ไม่ทำการบันทึก
    }
    const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
    if(Name != ""){
        const updateData = {
    // ชื่อห้อง
    RoomName: Name,
    LineGroupId: "",
    MerchantId:parseInt(myCookie.Id),
    // บัญชีที่เชื่อมต่อ - กรองเฉพาะบัญชีที่ถูกเลือก (checked)
    // linkedAccounts: selectedBankAccounts,
    
    // ยอดเงินขั้นต่ำ
    MinAmountReceive: paymentAmount,
    
    // การตั้งค่าการซ่อนข้อมูล

    HideSenderDetail: CheckedHideSenderDetail,
      HideReceiverDetail: CheckedHideReceiverDetail,

    
    // การตั้งค่าการแจ้งเตือน Line
    NotiOnLineGroupId: NotiOnLineGroupId,
    NotiOnValid: selectedOptions[0],           // สลิปถูกต้อง
    NotiOnInvalid: selectedOptions[1],            // สลิปถูกใช้งานแล้ว
    NotiOnInvalidReceiverBankAccount: selectedOptions[2],         // สลิปไม่เจอ/หมดอายุ/ไม่พบ QR Code
    NotiOnInvalidUnverified: selectedOptions[3],      // สลิปผู้รับเงินไม่ตรง
    NotiOnInvalidMinAmount: selectedOptions[4],        // ยอดโอนต่ำกว่ากำหนด
    NotiOnQuotaLimitExceed: selectedOptions[5],     // การแจ้งเตือนเติมโควตาและต่ออายุ
    NotiOnSlipDuplicated: selectedOptions[6],  
    TransactionSummary: selectedOptions[7] ,  // สรุปยอดสาขารายวัน
    QrToken:QrToken
  };
  console.log("rqrqrqrqrqrq",updateData,QrToken)
  CreateRoom(updateData,selectedBankAccounts)
    }
    

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


const CreateRoom = async (dataupdate:any,bankData:any[][]) => {
  const bankIds = bankData.map(bank => bank.Id);
  console.log('data', dataupdate,bankIds);
  const cookies = getCookies();
	const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
  const requestBody = {
            rooms: dataupdate,
            bank: bankIds,
            email:myCookie.Email
        };
		let config = {
			method: 'POST', // Use GET instead of POST
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
        'apikey': PUBLIC_BACKEND_API_KEY
			},
      body: JSON.stringify(
  requestBody),
		};

		let url;
		if (dataupdate) {
			url = `${PUBLIC_API_ENDPOINT}/createroom`;
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
          return data.result;
				}
			}
    
		
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
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-CTR" },
      false,
      ["encrypt"]
    );

    // เข้ารหัส plaintext โดยใช้ AES-CTR
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-CTR", counter: nonce, length: 128 },
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
    const timestampUtcSec = Math.floor(Date.now() / 1000);
    const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
    QrToken = `PAYSO_ROOM_TOKEN:${myCookie.Id}:${timestampUtcSec}`;
    // Encrypt data
    const encrypted = await encryptData(QrToken);
    if (encrypted) {
      encryptedData = encrypted;
      await generateQR(encrypted);
    }
  };
  function handleInput(event: { target: { value: string; }; }) {
        // Only allow alphanumeric characters
        NotiOnLineGroupId = event.target.value.replace(/[^A-Za-z0-9]/g, "");
    }

    
</script>

<div class="flex justify-center bg-primary-foreground min-h-screen px-10 py-0 pb-0 sm:py-5  xl:px-24 lg:py-5 xl:py-10 lg:pb-5 xl:pb-20 ">
    
    <div class="container max-w-screen-xl  pt-1 sm:pt-5 lg:pt-5 mx-auto bg-white rounded-2xl shadow ">
      
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
                        id="nameInput"
              type="text" 
              placeholder="กรอกข้อมูลที่นี่" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
              bind:value={Name}
              required
              />
              {#if errorMessage && !Name}
              <p class="text-red-500 text-sm mt-1">{errorMessage}</p> <!-- แสดงข้อความแจ้งเตือน -->
            {/if}
                      </div>
                    </div>
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                   
                    
                  </div>
                  <div class=" mx-2 my-5"><div class="canvas-container">
                    <canvas bind:this={qrcanvas1} class="border-2 border-[#113566] rounded-md"></canvas>
                  </div></div>
                  <div class="my-3">
                    Notion Line Group Id:
                    <input 
              type="text" 
              placeholder="เลือกกรอกหรือไม่ก็ได้" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
              bind:value={NotiOnLineGroupId}
              on:input={handleInput}
              required
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
                      <div>ซ่อนเลขบัญชีผู้รับ</div>
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
                          ปิด
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
		<p class=" text-center">คุณไม่มีสิทธิ์ในการสร้างห้อง</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
