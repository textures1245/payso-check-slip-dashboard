
<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card";
    import payment from"$lib/image/thai-qr.png";
    import { PUBLIC_API_ENDPOINT } from '$env/static/public';
    import cookie from 'cookie';
    let isOpen = false;
    let selectedBank: { imageUrl: any; name: any;code:any; } | null = null;
    let AccNoBank = ""
    let NameTHBank =""
    let NameENBank = ""
    let AccNoPP = ""
    let NameTHPP =""
    let NameENPP = ""
    const banks = [
    { code: "002", name: "ธนาคารกรุงเทพ จำกัด (มหาชน)", imageUrl: "/src/lib/image/bank/bankkok.jpg" },
    { code: "004", name: "ธนาคารกสิกรไทย จำกัด (มหาชน)", imageUrl: "/src/lib/image/bank/kbank.jpg" },
    { code: "006", name: "ธนาคารกรุงไทย จำกัด (มหาชน)", imageUrl: "/src/lib/image/bank/KTB.jpg" },
    { code: "009", name: "ธนาคารโอเวอร์ซี-ไชนีสแบงกิ้งคอร์ปอเรชั่น จำกัด", imageUrl: "/src/lib/image/bank/overbank.png" },
    { code: "011", name: "ธนาคารทหารไทยธนชาต จำกัด (มหาชน)" , imageUrl: "/src/lib/image/bank/ttb.png"},
    { code: "014", name: "ธนาคารไทยพาณิชย์ จำกัด (มหาชน)", imageUrl: "/src/lib/image/bank/SCB.png" },
    { code: "017", name: "ธนาคารซิตี้แบงก์ เอ็น.เอ.", imageUrl: "/src/lib/image/bank/citi.jpg" },
    { code: "018", name: "ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น " ,imageUrl: "/src/lib/image/bank/SMBC.png"},
    { code: "020", name: "ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย) จำกัด (มหาชน)",imageUrl: "/src/lib/image/bank/Standdard.png" },
    { code: "022", name: "ธนาคารซีไอเอ็มบี ไทย จำกัด (มหาชน)",imageUrl: "/src/lib/image/bank/CIMB.png" },
    { code: "024", name: "ธนาคารยูโอบี จำกัด (มหาชน)" ,imageUrl: "/src/lib/image/bank/UOB.png"},
    { code: "025", name: "ธนาคารกรุงศรีอยุธยา จำกัด (มหาชน)" ,imageUrl: "/src/lib/image/bank/kungsri.png"},
    { code: "030", name: "ธนาคารออมสิน",imageUrl: "/src/lib/image/bank/omsinbank.jpg" },
    { code: "031", name: "ธนาคารฮ่องกงและเซี่ยงไฮ้แบงกิ้งคอร์ปอเรชั่น จำกัด" ,imageUrl: "/src/lib/image/bank/HSBC.png"},
    { code: "032", name: "ธนาคารดอยซ์แบงก์",imageUrl: "/src/lib/image/bank/Doybank.png" },
    { code: "033", name: "ธนาคารอาคารสงเคราะห์" ,imageUrl: "/src/lib/image/bank/GHB.png"},
    { code: "034", name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",imageUrl: "/src/lib/image/bank/k.png" },
    { code: "039", name: "ธนาคารมิซูโฮ จำกัด" ,imageUrl: "/src/lib/image/bank/Mizho.png"},
    { code: "045", name: "ธนาคารบีเอ็นพี พารีบาส์",imageUrl: "/src/lib/image/bank/BNP.png" },
    { code: "052", name: "ธนาคารแห่งประเทศจีน (ไทย) จำกัด (มหาชน)",imageUrl: "/src/lib/image/bank/BankChina.jpg" },
    { code: "066", name: "ธนาคารอิสลามแห่งประเทศไทย",imageUrl: "/src/lib/image/bank/islambank.png" },
    { code: "067", name: "ธนาคารทิสโก้ จำกัด (มหาชน)",imageUrl: "/src/lib/image/bank/tisco.png"  },
    { code: "069", name: "ธนาคารเกียรตินาคิน จำกัด (มหาชน)",imageUrl: "/src/lib/image/bank/kiatnakin.png" },
    { code: "070", name: "ธนาคารไอซีบีซี (ไทย) จำกัด (มหาชน)",imageUrl: "/src/lib/image/bank/ICBC.png" },
    { code: "071", name: "ธนาคารไทยเครดิต เพื่อรายย่อย จำกัด (มหาชน)" ,imageUrl: "/src/lib/image/bank/thaicredit.png"},
    { code: "073", name: "ธนาคารแลนด์ แอนด์ เฮ้าส์ จำกัด (มหาชน)" ,imageUrl: "/src/lib/image/bank/LH.png"},
    { code: "098", name: "ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย",imageUrl: "/src/lib/image/bank/SMEBank.png" }
  ];

  function selectBank(bank: any) {
    selectedBank = bank;
    isOpen = false;
  }

  let isBankSelected = true;
  let isPromptPaySelected = false;

  function showBankForm() {
    isBankSelected = true;
    isPromptPaySelected = false;
    selectedOption = ""
    AccNoPP = ""
    NameTHPP =""
    NameENPP = ""
    isOpen = false;
  }

  function showPromptPayForm() {
    isBankSelected = false;
    isPromptPaySelected = true;
    selectedBank =""
    AccNoBank = ""
    NameTHBank =""
    NameENBank = ""
    isOpen = false;
  }

  // สถานะเปิดปิดเมนู dropdown
  let selectedOption = "";  // ตัวเลือกที่เลือกไว้
  const options = [
    { label: "เบอร์โทร", value: "NATID",imageUrl: "/src/lib/image/phone.png" },
    { label: "เลขประจำตัว", value: "MSISDN" ,imageUrl: "/src/lib/image/bg-people.png"},
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
      AccountNo: info.AccountNo,
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
      AccountNo: info.AccountNo,
      TypeAccount: 'PP',
      NameTH: info.NameTH,
      NameEN: info.NameEN
    };
  } else {
    throw new Error('Invalid information provided');
  }

    
  try {
    const response = await fetch(`${PUBLIC_API_ENDPOINT}/create/bank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
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
    PPType: string | null,
    AccNoPP: string | null,
    NameTHPP: string | null,
    NameENPP: string | null
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
            NameTH: NameTHBank || '',
            NameEN: NameENBank || ''
        });
    } else if (PPType) {
        // กรณี PPType
        createBank({
            PPType: PPType,
            AccountNo: AccNoPP || '',
            NameTH: NameTHPP || '',
            NameEN: NameENPP || ''
        });
    } else {
        console.error('ไม่มีข้อมูล Bank หรือ PPType ที่ถูกต้อง');
    }
}


function handleInput(event: { target: { value: any; }; }) {
  const inputValue = event.target.value;

  // ตรวจสอบความยาวของค่าที่ป้อน ถ้ามากกว่า 15 ตัว ให้ตัดออก
  if (inputValue.length > 15) {
    event.target.value = inputValue.slice(0, 15);
  }
}

function handleInputName(event: { target: { value: any; }; }) {
  let inputValue = event.target.value;

  inputValue = inputValue.replace(/[0-9]/g, ''); // ลบตัวเลข
  if (inputValue.charAt(0) === ' ') {
    inputValue = inputValue.trimStart(); // ลบช่องว่างเฉพาะตัวแรก
  }
  

  event.target.value = inputValue;
}


</script>
<div class="flex justify-center bg-primary-foreground  h-screen  custom-min-h px-10 py-0 sm:py-5  xl:px-24 lg:py-10  ">
    
    <div class="container max-w-screen-lg py-5   mx-auto bg-white rounded-2xl shadow">
      <div class="flex  justify-start gap-5">
        <!-- Card ธนาคาร -->
        <div class="w-full sm:w-auto">
          <Card.Root class="w-full min-w-[120px] h-[150px]" on:click={showBankForm}>
            <Card.Header class="flex flex-row items-center justify-center space-y-0 pb-2"></Card.Header>
            <Card.Content class="px-5">
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
          <Card.Root class="w-full min-w-[120px] h-[150px]" on:click={showPromptPayForm}>
            <Card.Header class="flex flex-row items-center justify-center space-y-0 pb-2"></Card.Header>
            <Card.Content class="px-5">
              <div class="flex justify-center">
                <img src="{payment}" width="60" height="60" alt="พร้อมเพย์" />
              </div>
              <div class="text-center">พร้อมเพย์</div>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    {#if isBankSelected}
    <div class="my-5 grid grid-cols-1 lg:px-5" style="height: 100px;">
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
              
            <div class="my-5 px-2">
                <input class="  border-2 w-full px-2 " style="height: 40px;" on:input={handleInput}  placeholder="เลขบัญชีธนาคาร" type="number" bind:value={AccNoBank} required>
            </div>
            <hr >
            <div class=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1">
              
              <div class="px-2">
                <div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาไทย</div>
                <input class="  border-2 w-full px-2 " style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="ชื่อบัญชี ภาษาไทย" bind:value={NameTHBank}  required>
            </div>
           
           
            <div class="px-2">
              <div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาอังกฤษ</div>
                <input class="  border-2 w-full px-2" style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="ชื่อบัญชี ภาษาอังกฤษ" bind:value={NameENBank} required>
            </div>
            </div>
            <div class="flex justify-center sm:justify-end lg:justify-end my-0 sm:my-2 lg:my-2 mx-2"><Button
              type="submit"
              variant="outline"
              class="my-2 flex text-center py-0 px-0  text-white rounded-md hover:text-black bg-primary"
              style="width:25%;height:40px;" on:click={() => sendData(selectedBank.code,AccNoBank,NameTHBank,NameENBank,null,null,null,null)}>บันทึกข้อมูล</Button
            ></div>
            </div>
    </div>
    {/if}
    {#if isPromptPaySelected}
   
  <div class="my-5 grid grid-cols-1 lg:px-5" style="height: 100px;">
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
         <div class="my-5 px-2">
        <input class="border-2 w-full px-2 " on:input={handleInput} style="height: 40px;" placeholder="ใส่ข้อมูลตามที่เลือก"  type="number" bind:value={AccNoPP} required>
    </div>
    <hr class="">
    <div class=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 ">
              
      <div class="px-2">
        <div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาไทย</div>
        <input class="  border-2 w-full px-2 " style="height: 40px;" on:input={handleInputName} maxlength="100" placeholder="ชื่อบัญชี ภาษาไทย" bind:value={NameTHPP} required>
    </div>
   
   
    <div class="px-2">
      <div class=" font-semibold mt-5 mb-3">ชื่อบัญชี ภาษาอังกฤษ</div>
        <input class="  border-2 w-full px-2" style="height: 40px;" on:input={handleInputName} placeholder="ชื่อบัญชี ภาษาอังกฤษ" maxlength="100" bind:value={NameENPP} required>
    </div>
    </div>
            <div class="flex justify-center sm:justify-end lg:justify-end my-2 mx-2  "><Button
              type="submit"
              variant="outline"
              class="my-2 flex text-center py-0 px-0  text-white rounded-md hover:text-black bg-primary"
              style="width:25%;height:40px;" on:click={() => sendData(null,null,null,null,selectedOption.value,AccNoPP,NameTHPP,NameENPP)}>บันทึกข้อมูล</Button
            ></div>
      </div>
    </div>
  </div>
  
  {/if}
</div>
</div>


<dialog id="my_modal_3" class="modal">
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
  .custom-min-h {
    max-height: calc(100vh - 45px);
}
input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>