
<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card";
    import payment from"$lib/image/thai-qr.png";
    import { PUBLIC_API_ENDPOINT,PUBLIC_BACKEND_API_KEY } from '$env/static/public';
    import cookie from 'cookie';
	import { onMount } from 'svelte';
    let isOpen = false;
    let selectedBank: { imageUrl: any; name: any;code:any; } | null = null;
    let AccNoBank = ""
    let NameTHBank =""
    let LastNameTHBank =""
    let NameENBank = ""
    let LastNameENBank =""
    let AccNoPP = ""
    let NameTHPP =""
    let LastNameTHPP =""
    let NameENPP = ""
    let LastNameENPP =""
    let selectedMethod='bank' 
    const banks = [
    { code: "002", name: "ธนาคารกรุงเทพ จำกัด (มหาชน)", imageUrl: "https://moneyexpo.net/wp-content/uploads/2023/05/BBL.jpg" },
    { code: "004", name: "ธนาคารกสิกรไทย จำกัด (มหาชน)", imageUrl: "https://i.pinimg.com/736x/cb/7c/ca/cb7cca77e49eece5ce042aa9f25ad27c.jpg" },
    { code: "006", name: "ธนาคารกรุงไทย จำกัด (มหาชน)", imageUrl: "https://moneyexpo.net/wp-content/uploads/2023/05/KTB.jpg" },
    { code: "009", name: "ธนาคารโอเวอร์ซี-ไชนีสแบงกิ้งคอร์ปอเรชั่น จำกัด", imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_ocbc@2x.png" },
    { code: "011", name: "ธนาคารทหารไทยธนชาต จำกัด (มหาชน)" , imageUrl: "https://media.ttbbank.com/1/global/ttb.jpg"},
    { code: "014", name: "ธนาคารไทยพาณิชย์ จำกัด (มหาชน)", imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_sb@2x.png" },
    { code: "017", name: "ธนาคารซิตี้แบงก์ เอ็น.เอ.", imageUrl: "https://moneyandbanking.co.th/wp-content/uploads/2024/04/Citi-Bank-905x613.webp" },
    { code: "018", name: "ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น " ,imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_smbc@2x.png"},
    { code: "020", name: "ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย) จำกัด (มหาชน)",imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_scthai@2x.png" },
    { code: "022", name: "ธนาคารซีไอเอ็มบี ไทย จำกัด (มหาชน)",imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_cimbthai@2x.png" },
    { code: "024", name: "ธนาคารยูโอบี จำกัด (มหาชน)" ,imageUrl: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/UOB_LOGO_800x800.png"},
    { code: "025", name: "ธนาคารกรุงศรีอยุธยา จำกัด (มหาชน)" ,imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhQjvxKz4c3kDRgXc3YS1gVDAv1rlVu6NIEA&s"},
    { code: "030", name: "ธนาคารออมสิน",imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKB3R_1uIDD6IOdNF0ASnynXcUrrdxs3OUVw&s" },
    { code: "031", name: "ธนาคารฮ่องกงและเซี่ยงไฮ้แบงกิ้งคอร์ปอเรชั่น จำกัด" ,imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_hsbc@2x.png"},
    { code: "032", name: "ธนาคารดอยซ์แบงก์",imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_deutsche@2x.png" },
    { code: "033", name: "ธนาคารอาคารสงเคราะห์" ,imageUrl: "https://ghbloyalty.ghbank.co.th/logo_ghb.png"},
    { code: "034", name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",imageUrl: "https://s.isanook.com/mn/0/ud/175/877323/fack.jpg" },
    { code: "039", name: "ธนาคารมิซูโฮ จำกัด" ,imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_mizuho@2x.png"},
    { code: "045", name: "ธนาคารบีเอ็นพี พารีบาส์",imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_bnpparibas@2x.png" },
    { code: "052", name: "ธนาคารแห่งประเทศจีน (ไทย) จำกัด (มหาชน)",imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMrfV_dWH9d6FO7JrEw11bWRbiIx0izN_I5g&s" },
    { code: "066", name: "ธนาคารอิสลามแห่งประเทศไทย",imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIzQBxnxe1oqnWPkll8vmLqnxJcaRanB23ow&s" },
    { code: "067", name: "ธนาคารทิสโก้ จำกัด (มหาชน)",imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_tisco@2x.png"  },
    { code: "069", name: "ธนาคารเกียรตินาคิน จำกัด (มหาชน)",imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_kkp@2x.png" },
    { code: "070", name: "ธนาคารไอซีบีซี (ไทย) จำกัด (มหาชน)",imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_icbc@2x.png" },
    { code: "071", name: "ธนาคารไทยเครดิต เพื่อรายย่อย จำกัด (มหาชน)" ,imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_thaicredit@2x.png"},
    { code: "073", name: "ธนาคารแลนด์ แอนด์ เฮ้าส์ จำกัด (มหาชน)" ,imageUrl: "https://www.dpa.or.th/storage/uploads/bank/dpa_bank_lhbank@2x.png"},
    { code: "098", name: "ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย",imageUrl: "https://csrgroup.co.th/img/Client258-6.png" }
  ];

  let rooms:any[]=[]
  let loading=false;
  onMount(async () => {
		//////////////////// เพิ่มมาเพราะ Production ไม่สามารถอ่าน ไฟ .jsได้
		
		try {
      const room = await GetRoomLink();
			// Use profileData here
      rooms=room;
      console.log(rooms)
		} catch (error) {
			console.error('Error fetching profile:', error);
		} finally {
			// การอัปเดตสถานะการโหลด
			loading = false;
		}

	});
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
				'ngrok-skip-browser-warning': 'true',
        'apikey': PUBLIC_BACKEND_API_KEY
			}
		};

		let url;
		if (myCookie.Id) {
			console.log('Get by Merchant Id');
			url = `${PUBLIC_API_ENDPOINT}/roomdata/${myCookie.Id}`;
      
		} else {
			throw new Error('Neither email nor id is provided.');
		}

		// const result = await fetch(url, config);
		// const data = await result.json();
    const data = await fetch(url, config)
            .then((response) => response.json())
            .catch((error) => console.error(error));
		console.log('Link Room', data);
		return data.result || [];
	};
  function selectBank(bank: any) {
    selectedBank = bank;
    isOpen = false;
  }

  let isBankSelected = true;
  let isPromptPaySelected = false;

  function showBankForm() {
    selectedMethod = "bank";
    isBankSelected = true;
    isPromptPaySelected = false;
    selectedOption = ""
    AccNoPP = ""
    NameTHPP =""
    LastNameTHPP =""
    NameENPP = ""
    LastNameENPP =""
    isOpen = false;
  }

  function showPromptPayForm() {
    selectedMethod = "promptpay";
    isBankSelected = false;
    isPromptPaySelected = true;
    selectedBank =""
    AccNoBank = ""
    LastNameTHBank =""
    LastNameENBank =""
    NameTHBank =""
    NameENBank = ""
    isOpen = false;
  }

  // สถานะเปิดปิดเมนู dropdown
  let selectedOption = "";  // ตัวเลือกที่เลือกไว้
  const options = [
    { label: "เบอร์โทร", value: "MSISDN",imageUrl: "/src/lib/image/phone.png" },
    { label: "เลขประจำตัว", value: "NATID" ,imageUrl: "/src/lib/image/bg-people.png"},
    { label: "e-Wallet ID", value: "EWALLETID",imageUrl: "/src/lib/image/phone.png" },
    { label: "บัญชีธนาคาร", value: "BANKAC",imageUrl: "/src/lib/image/bg-people.png" }
  ];
  function selectOption(option: any) {
    selectedOption = option;  // อัปเดตตัวเลือกที่เลือก
    isOpen = false;  // ปิดเมนูหลังจากเลือกตัวเลือกแล้ว
  }
  function getCookies() {
		return cookie.parse(document.cookie);
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
    // กรณีที่มี BankCode
    payload = {
      MerchantId: myCookie.Id,
      BankCode: info.Bank,
      PPTYPE: null,
      AccountNo: info.AccountNo.toString(),
      TypeAccount: 'BANK',
      NameTH: info.NameTH,
      NameEN: info.NameEN
    };
  } else if ('PPType' in info) {
    // กรณีที่มี PPTYPE
    payload = {
      MerchantId: myCookie.Id,
      BankCode: null,
      PPTYPE: info.PPType,
      AccountNo: info.AccountNo.toString(),
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
        console.log("AccountNo",requestBody)
    const response = await fetch(`${PUBLIC_API_ENDPOINT}/create/bank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'apikey': PUBLIC_BACKEND_API_KEY
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
          selectedBank =""
          AccNoBank = ""
          NameTHBank =""
          NameENBank = ""
          selectedOption = ""
          AccNoPP = ""
          NameTHPP =""
          NameENPP = ""
          
				}
    return await response.json();
  } catch (error) {
    console.error('Error:', error.message || error);
    throw error;
  }
};
function sendData(
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
    console.log('NameTHBank:', NameTHBank + " " + LastNameTHBank);
    console.log('NameENBank:', NameENBank + " " + LastNameENBank);
    console.log('PPType:', PPType);
    console.log('AccNoPP:', AccNoPP);
    console.log('NameTHPP:', NameTHPP);
    console.log('NameENPP:', NameENPP);
    console.log('NameTHPP:', NameTHPP + " " + LastNameTHPP);
    console.log('NameENPP:', NameENPP + " " + LastNameENPP);

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


function handleInput(event: { target: { value: any; }; }) {
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

function handleInputName(event: { target: { value: any; }; }) {
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
      selectedRoomIds = selectedRoomIds.filter(id => id !== roomId);
    }
    console.log('Selected rooms:', selectedRoomIds); // For debugging
  }





</script>
<div class="flex justify-center bg-primary-foreground min-h-screen px-10 py-5 pb-0 sm:py-5  xl:px-24 lg:py-5 xl:py-10 lg:pb-5 xl:pb-20 ">
    
    <div class="container max-w-screen-lg  pt-1 sm:pt-5 lg:pt-5 mx-auto bg-white rounded-2xl shadow ">
      <div class="flex  justify-start gap-5 mt-5 sm:mt-0 lg:mt-0">
        <!-- Card ธนาคาร -->
        <div class="w-full sm:w-auto  ">
          <Card.Root class={`w-full min-w-[120px] h-[120px] sm:h-[120px] lg:h-[130px] cursor-pointer 
            transition-all duration-200
            ${selectedMethod === 'bank' 
              ? 'border-4 border-[#477DFF] bg-[#F0F4FF]' 
              : 'border border-[#EAECF0]'}`} on:click={showBankForm}>
            <Card.Content class="px-5 h-full content-center">
              <div class="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="0 0 24 24">
                  <path fill="#0066ff" d="M11.5 1L2 6v2h19V6m-5 4v7h3v-7M2 22h19v-3H2m8-9v7h3v-7m-9 0v7h3v-7z" />
                </svg>
              </div>
              <div class="text-center">บัญชีธนาคาร</div>
            </Card.Content>
          </Card.Root>
        </div>
  
        <!-- Card พร้อมเพย์ -->
        <div class="w-full sm:w-auto">
          <Card.Root class={`w-full min-w-[120px] h-[120px] sm:h-[120px] lg:h-[130px] cursor-pointer 
            transition-all duration-200
            ${selectedMethod === 'promptpay' 
              ? 'border-4 border-[#477DFF] bg-[#F0F4FF]' 
              : 'border border-[#EAECF0]'}`} on:click={showPromptPayForm}>
            <Card.Content class="px-5 h-full content-center">
              <div class="flex justify-center">
                <img src="{payment}" width="60" height="60" alt="พร้อมเพย์" />
              </div>
              <div class="text-center">พร้อมเพย์</div>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    {#if isBankSelected}
    <div class="my-5 grid grid-cols-1 lg:px-5" >
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
                    <img src={selectedBank.imageUrl} alt={selectedBank.name} class="w-6 h-6 mr-2" />
                    <span>{selectedBank.name} </span>
                  {:else}
                    <span>-- เลือกธนาคาร --</span>
                  {/if}
                  <span class="ml-auto">{isOpen ? "▲" : "▼"}</span>
                </div>
              
                <!-- Dropdown Menu -->
                {#if isOpen}
                  <div class="absolute mt-2 bg-white border rounded-md w-full z-50 shadow-lg max-h-48 overflow-y-auto">
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    {#each banks as bank}
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
              <form on:submit|preventDefault={() => sendData(selectedBank.code, AccNoBank, NameTHBank, NameENBank, LastNameTHBank, LastNameENBank, null, null, null, null, null, null)}>
            <div class="my-5 px-2">
                <input class="  border-2 w-full px-2 " style="height: 40px;" on:input={handleInput}  placeholder="เลขบัญชีธนาคาร" bind:value={AccNoBank} required>
            </div>
            <hr >
            <div class=" grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
            <div class=" grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
              
              <div class="px-2">
                <div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาไทย</div>
                <div class=" grid sm:grid-cols-2 lg:grid-cols-2 ">
                  <div class="flex justify-start "><input class="  border-2 w-full px-2  md:w-72 lg:w-96 xl:w-96 " style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="ชื่อภาษาไทย(ห้ามเขียนคำนำหน้า)" bind:value={NameTHBank}  required></div>
                  <div class="flex justify-end mt-2 sm:mt-0 lg:mt-0"><input class="  border-2 w-full px-2 flex  md:w-72 lg:w-96  xl:w-96" style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="นามสกุลภาษาไทย" bind:value={LastNameTHBank}  required></div>
              </div>
            </div>
           
           
            <div class="px-2">
              <div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาอังกฤษ</div>
              <div class=" grid sm:grid-cols-2 lg:grid-cols-2 ">
                <div class="flex justify-start "> <input class="  border-2 w-full px-2  md:w-72 lg:w-96 xl:w-96 " style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="ชื่อภาษาอังกฤษ(ห้ามเขียนคำนำหน้า)" bind:value={NameENBank} required></div>
                <div class="flex justify-end mt-2 sm:mt-0 lg:mt-0"><input class="  border-2 w-full px-2 flex  md:w-72 lg:w-96  xl:w-96" style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="นามสกุลภาษาอังกฤษ" bind:value={LastNameENBank}  required></div>
            </div>
            </div>
            </div>
            
            {#each rooms as rooms }
            <div class="flex w-full my-3 border-2 rounded-lg ">
            <div class="avatar p-2">
              <div class="w-full  flex justify-center min-w-15 content-center    bg-green-800 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" {...$$props}>
                  <path fill="white" d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z" />
                </svg>
              </div>
            </div>
            <div class="w-full content-center mx-3 truncate">{rooms.RoomName}</div>
            <div class=" content-center flex justify-end items-center lg:mx-2"><input
              type="checkbox"
              value="synthwave"
              class="toggle theme-controller toggle-success"
              id="menuToggle"
              on:change={(e) => toggleRoom(rooms.Id, e.target.checked)}
            />
              </div>
            </div>
            {/each}
            <div class="flex justify-center sm:justify-end lg:justify-end my-0 sm:my-2 lg:my-2 mx-2"><Button
              type="submit"
              variant="outline"
              class="my-2 flex text-center py-0 px-0  text-white rounded-md hover:text-black bg-primary w-full sm:w-1/6 lg:w-1/6"
              style="height:40px;">บันทึกข้อมูล</Button
            > <!-- on:click={() => sendData(selectedBank.code,AccNoBank,NameTHBank,NameENBank,null,null,null,null)} -->
          </div> 
           
          </form>
            </div>
    </div>
    {/if}
    {#if isPromptPaySelected}
   
  <div class="my-5 grid grid-cols-1 lg:px-5" >
    <div class="w-full">
      <div class="font-semibold my-5">พร้อมเพย์</div>
      <div class="relative w-full ">
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
              <span class="ml-auto">{isOpen ? "▲" : "▼"}</span>
            </div>
          
            <!-- เมนู Dropdown -->
            {#if isOpen}
              <div class="absolute mt-2 bg-white border rounded-md w-full z-50 shadow-lg max-h-48 overflow-y-auto">
                {#each options as option}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                    class="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                    on:click={() => selectOption(option)}
                  >
                  
                    <span>{option.label}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        <!-- Inputs for PromptPay -->
         
        <form on:submit|preventDefault={() => sendData(null,null,null,null,null,null,selectedOption.value,AccNoPP,NameTHPP,NameENPP,LastNameTHPP,LastNameENPP)}>
         <div class="my-5 px-2">
        <input class="border-2 w-full px-2 " on:input={handleInput} style="height: 40px;" placeholder="ใส่ข้อมูลตามที่เลือก" bind:value={AccNoPP} required>
    </div>
    <hr class="">
    <div class=" grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 ">
    <div class=" grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 ">
              
      <div class="px-2">
        <div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาไทย</div>
        <div class=" grid sm:grid-cols-2 lg:grid-cols-2 ">
          <div class="flex justify-start "><input class="  border-2 w-full px-2  md:w-72 lg:w-96 xl:w-96  " style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="ชื่อภาษาไทย(ห้ามเขียนคำนำหน้า)" bind:value={NameTHPP} required></div>
          <div class="flex justify-end mt-2 sm:mt-0 lg:mt-0"><input class="  border-2 w-full px-2 flex  md:w-72 lg:w-96  xl:w-96" style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="นามสกุลของบัญชี ภาษาไทย" bind:value={LastNameTHPP}  required></div>
      </div>
    </div>
   
   
    <div class="px-2">
      <div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาอังกฤษ</div>
      <div class=" grid sm:grid-cols-2 lg:grid-cols-2 ">
        <div class="flex justify-start "><input class=" border-2 w-full px-2 md:w-72 lg:w-96 xl:w-96 " style="height: 40px;" on:input={handleInputName} placeholder="ชื่อภาษาอังกฤษ(ห้ามเขียนคำนำหน้า)" maxlength="100" bind:value={NameENPP} required></div>
        <div class="flex justify-end mt-2 sm:mt-0 lg:mt-0"><input class="  border-2 w-full px-2 flex  md:w-72 lg:w-96  xl:w-96" style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="นามสกุลของบัญชี ภาษาอังกฤษ" bind:value={LastNameENPP}  required></div>
    </div>
    </div>
    </div>
    {#each rooms as rooms }
    <div class="flex w-full my-3 border-2 rounded-lg ">
    <div class="avatar p-2">
      <div class="w-full  flex justify-center min-w-15 content-center    bg-green-800 p-3 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" {...$$props}>
          <path fill="white" d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z" />
        </svg>
      </div>
    </div>
    <div class="w-full content-center mx-3 truncate">{rooms.RoomName}</div>
    <div class=" content-center flex justify-end items-center lg:mx-2"><input
      type="checkbox"
      value="synthwave"
      class="toggle theme-controller toggle-success"
      id="menuToggle"
      on:change={(e) => toggleRoom(rooms.Id, e.target.checked)}
    />
      </div>
    </div>
    {/each}
            <div class="flex justify-center sm:justify-end lg:justify-end my-0 sm:my-2 lg:my-2 mx-2  "><Button
              type="submit"
              variant="outline"
              class="my-2 flex text-center py-0 px-0  text-white rounded-md hover:text-black bg-primary w-full sm:w-1/6 lg:w-1/6"
              style="height:40px;" >บันทึกข้อมูล</Button
            ></div>
            <!-- on:click={() => sendData(null,null,null,null,selectedOption.value,AccNoPP,NameTHPP,NameENPP)} -->
          </form>
      </div>
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


<style scoped>
  /* .custom-min-h {
    max-height: calc(100vh - 45px);
} */
/* input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  } */
</style>