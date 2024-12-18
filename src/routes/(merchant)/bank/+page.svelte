
<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card";
    import * as Carousel from "$lib/components/ui/carousel";
    import payment from"$lib/image/thai-qr.png";
    import { PUBLIC_API_ENDPOINT,PUBLIC_SECRETKEY,PUBLIC_PAYSO_DEFAULT_SECRET } from '$env/static/public';
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
			const bank = await GetBankLink(offset,limit);
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

  const GetBankLink = async (offset:number,limit:number) => {
		// const email = sessionStorage.getItem('email');
		// const id = sessionStorage.getItem('id'); // Waiting for id from another page
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;

		console.log('++++++++++', offset, myCookie.Email);
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
			url = `${PUBLIC_API_ENDPOINT}/bankdata/${myCookie.Id}/${offset}/${limit}`;
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		const result = await fetch(url, config);
		const data = await result.json();
		console.log('Link Line', data);
    if (data.result && data.result.length > 0) {
  count = data.result[0].TotalCount;
  totalPages = Math.ceil(count / limit);
} else {
  // กรณีที่ไม่มีข้อมูล
  count = 0;
  totalPages = 1;
  // หรือสามารถตั้งค่า default value หรือข้อความแจ้งเตือนตามที่ต้องการ
  console.log('ไม่มีข้อมูล');
}
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


  let qrcanvas1: HTMLCanvasElement;
  let encryptedData: string = '';
  let errorMessage: string = '';
  const encryptData = (data: string): string | null => {
    try {
      
      console.log(data,CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)))

      return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
   
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


    async function maskMiddle(accountNumber: string) {
    try {
        // ถอดรหัส Account Number
        const decryptedAccountNumber = await decryptAccountNo(accountNumber);
        
        // ตรวจสอบความยาว
        const length = decryptedAccountNumber.length;
        if (length < 7) return "Invalid Account Number"; // ต้องยาวพอจะแบ่งส่วนได้
        let middleLength = Math.max(4, Math.floor(length / 3)); // อย่างน้อย 4 ตัว

        // ถ้าความยาวของเลขบัญชีเป็น 15 ตัว
        if (length === 15) {
            middleLength = 5; // กำหนดให้แสดงเลขกลาง 5 ตัวสำหรับบัญชีที่มี 15 ตัว
        }

        // แสดงเลขกลางจากตำแหน่งที่ 3 (index 3) ไปจนถึง middleLength
        const middle = decryptedAccountNumber.slice(3, 3 + middleLength);
        const prefix = "xxx"; // ซ่อนเลขต้น

        const suffix = "xxx"; // ซ่อนเลขท้าย
        
        return `${prefix}-${middle}-${suffix}`;
    } catch (error) {
        console.error("Error in maskMiddle:", error);
        return "Error: Unable to mask account number";
    }
}
async function decryptAccountNo(encryptedBase64: string): Promise<string> {
  const combined = new Uint8Array(atob(encryptedBase64).split('').map(c => c.charCodeAt(0)));
  
  // Extract the nonce (first 16 bytes)
  const nonce = combined.slice(0, 16);

  // Extract the ciphertext (remaining bytes after nonce)
  const ciphertext = combined.slice(16);

  // Recreate the key used for encryption (assuming you have access to the same secret)
  const key = new TextEncoder().encode(PUBLIC_PAYSO_DEFAULT_SECRET);

  // Import the key for decryption
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw", 
    key, 
    { name: "AES-CTR" }, 
    false, 
    ["decrypt"]
  );

  // Decrypt the ciphertext using AES-CTR
  const decryptedBytes = await window.crypto.subtle.decrypt(
    { name: "AES-CTR", counter: nonce, length: 128 },
    cryptoKey,
    ciphertext
  );

  // Decode the decrypted bytes back to a string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBytes);
}

let count=0;
	let offset = 0;
	let limit = 5;
	let totalPages = 1
	let currentPage = 1;
  async function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    offset -= limit;
    // Ensure that the GetBankLink function is awaited correctly
    banks = await GetBankLink(offset, limit);
    scrollToTop()
    dispatchEvent(new CustomEvent('pageChange', { 
      detail: { page: currentPage }
    }));
  }
}

async function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    offset += limit;
    console.log("++++", offset);
    // Ensure that the GetBankLink function is awaited correctly
    
    banks = await GetBankLink(offset, limit);
    scrollToTop()
    dispatchEvent(new CustomEvent('pageChange', { 
      detail: { page: currentPage }
    }));
  }
}

function scrollToTop() {
  const carousel = document.querySelector('.carousel-content');
  if (carousel) {
    carousel.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    console.error('Carousel not found');
  }
}
</script>
<div class="bg-primary-foreground min-h-screen px-5 py-5  sm:py-5  xl:px-24 lg:py-5 xl:pt-10 ">
    
    <div class="container max-w-screen-xl  pt-5 sm:pt-5 lg:pt-5 mx-auto bg-white rounded-2xl shadow  ">
      <div class="flex   justify-evenly gap-5 mt-5 sm:mt-0 lg:mt-0 ">

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
  
       
        
      </div>
    {#if isBankSelected}
    
    <div class="mt-5 grid grid-cols-1 lg:px-5 " >
        <div class=" w-full">
            <div class=" font-semibold my-3">บัญชีธนาคาร</div>
            </div>
            <!-- <Carousel.Root class="overflow-y-auto h-96 overflow-x-hidden " > -->
				<Carousel.Root  >
              <Carousel.Content class="carousel-content flex flex-col">
                {#each banks as banks}
                <Carousel.Item class="flex-shrink-0 h-1/3 mx-2">
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
                    {#await maskMiddle(banks.AccountNo)}
                    <div class="text-slate-400">กำลังโหลด...</div>
                  {:then maskedAccountNo}
                    <div class="text-slate-400">{maskedAccountNo}</div>
                  {:catch error}
                    <div class="text-red-500">Error: {error.message}</div>
                  {/await}
                   
                  </div>

                <div>
                  
								
                  
								</div>
                
              </Carousel.Item>
							{/each}
              
              </Carousel.Content>
             
            </Carousel.Root>
            <div class="flex justify-between my-2 mb-5">
				<div class="content-center mx-2">
				<span class="text-gray-700  font-semibold text-sm">
				  หน้า {currentPage} จากทั้งหมด {totalPages}
				  </span>
				 </div>
				 <div class=" mx-2">
				<button
				  class="join-item btn btn-sm bg-blue-500 text-white px-2 py-0 rounded-lg hover:bg-blue-600 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
				  on:click={() => prevPage()}
				  disabled={currentPage === 1}
				>
				  « ย้อนกลับ
				</button>
				
				<button
				  class="join-item btn btn-sm bg-blue-500 text-white px-2 py-0 rounded-lg hover:bg-blue-600 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
				  on:click={() => nextPage()}
				  disabled={currentPage === totalPages}
				>
				  ถัดไป »
				</button>
			  </div>
				</div>
       
          
          </div>
		  <!-- svelte-ignore a11y-click-events-have-key-events -->
		  <!-- svelte-ignore a11y-no-static-element-interactions -->
		  <div class="relative w-full  max-w-[70vw]  h-20  sticky bottom-0 mx-auto"  on:click={() => {
			goto('/banklink');
		}}>
			
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
			
			
			<div class="relative h-full flex items-center justify-center  ">
			  <button class="w-full py-2 px-6 flex items-center gap-3 bg-[#ceddf9] hover:bg-[#b5c9ef] transition-colors relative"
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


<style scoped>
  
.fixed-bottom {
  position: sticky;
  bottom: 10px;
  z-index: 50;
}



</style>