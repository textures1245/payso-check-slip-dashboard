
<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card";
    import * as Carousel from "$lib/components/ui/carousel";
    import payment from"$lib/image/thai-qr.png";
    import { PUBLIC_API_ENDPOINT } from '$env/static/public';
    import cookie from 'cookie';
	import { onMount } from 'svelte';
	import { Plus } from 'svelte-radix';
    let isOpen = false;
    let selectedMethod='bank' 
    let loading=false;
    let banks: any[] = [];
    let rooms: any[] = [];
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
		return data.result;
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
		return data.result;
	};
  function getBankImage(bankCode: string) {
		const bank = bankchecks.find((b) => b.code === bankCode);
		return bank ? bank.imageUrl : 'https://spoynt.com/wp-content/uploads/2023/12/promtpay-qr.png'; // กรณีไม่พบจะใช้ภาพ default
	}
  function getBankName(bankCode: string) {
		const bank = bankchecks.find((b) => b.code === bankCode);
		return bank ? bank.name : "PrompyPay"; // กรณีไม่พบจะใช้ภาพ default
	}
</script>
<div class="flex justify-center bg-primary-foreground min-h-screen px-10 py-0 pb-0 sm:py-5  xl:px-24 lg:py-5 xl:py-10 lg:pb-5 xl:pb-20 ">
    
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
              <div class="text-center">สาขา</div>
            </Card.Content>
          </Card.Root>
          
        </div>
        
      </div>
    {#if isBankSelected}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="my-5 grid grid-cols-1 lg:px-5" >
        <div class=" w-full">
            <div class=" font-semibold my-5">บัญชีธนาคาร</div>
            </div>
            <Carousel.Root>
              <Carousel.Content>
                {#each banks as banks}
                <Carousel.Item class="md:basis-1/2 lg:basis-1/4">
								<div
									class="  p-4 my-2 bg-white border border-gray-200 rounded-lg shadow-md"
								>
                <div class="mt-2">
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
            window.location.assign("/banklink");
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
              <button class="w-full py-4 px-6 flex items-center gap-3 bg-[#f1f6ff] hover:bg-[#ceddf9] transition-colors relative"
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
      <Carousel.Content  >
        {#each rooms as rooms}
        <Carousel.Item  class="md:basis-1/1 lg:basis-1/3"><div
          class="  p-4 my-2 bg-white border border-gray-200 rounded-lg shadow-md"
        >
        <div class="flex ">
          <div class="avatar ">
            <div class="w-full  flex justify-center min-w-20   bg-green-100 p-5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" {...$$props}>
                <path fill="#156c04" fill-opacity="0.25" fill-rule="evenodd" d="M5.058 12a.06.06 0 0 0-.058.059V19c0 .943 0 1.414.293 1.707S6.057 21 7 21h10c.943 0 1.414 0 1.707-.293S19 19.943 19 19v-6.941a.06.06 0 0 0-.058-.059h-1.278c-.141 0-.318 0-.475-.017a1.5 1.5 0 0 1-.697-.25a.19.19 0 0 0-.207-.003a1.6 1.6 0 0 1-.666.24c-.222.03-.484.03-.709.03h-1.563c-.178 0-.393 0-.581-.024l-.645-.082c-.442-.054.2-.054-.242 0l-.645.082c-.188.024-.403.024-.581.024H9.09c-.225 0-.487 0-.709-.03a1.6 1.6 0 0 1-.666-.24a.19.19 0 0 0-.207.003c-.25.173-.504.228-.697.25a4 4 0 0 1-.475.017zm.876-1c-.497 0-.94-.445-.712-.886c.221-.43.632-.724 1.453-1.31l3-2.143C10.798 5.859 11.36 5.458 12 5.458s1.202.4 2.325 1.203l3 2.143c.821.586 1.232.88 1.453 1.31c.227.441-.215.886-.712.886h-.373c-.335 0-.503 0-.631-.09a.5.5 0 0 1-.161-.203c-.044-.089-.087-.204-.144-.356l-.21-.56l-.434-1.156l-.017-.045c-.22-.585-.329-.878-.415-.857c-.087.021-.048.332.03.952l.005.047l.144 1.144c.048.386.078.63.031.8a.4.4 0 0 1-.083.155c-.149.169-.413.169-.94.169h-1.485c-.42 0-.63 0-.772-.125a.4.4 0 0 1-.087-.112c-.062-.116-.088-.284-.121-.54l-.013-.099l-.18-1.44l-.005-.046l-.007-.05c-.073-.588-.11-.882-.198-.882s-.125.294-.198.882l-.007.05l-.005.045l-.18 1.441l-.013.1c-.032.255-.059.423-.12.54a.4.4 0 0 1-.088.11c-.141.126-.351.126-.772.126H9.133c-.528 0-.792 0-.941-.17a.4.4 0 0 1-.083-.154c-.047-.17-.017-.414.031-.8l.143-1.143v-.001l.006-.047c.078-.62.117-.93.03-.952c-.086-.021-.196.272-.415.857l-.017.044v.001L7.454 9.79l-.21.561c-.058.152-.1.267-.145.356a.5.5 0 0 1-.16.204c-.13.089-.297.089-.632.089z" clip-rule="evenodd" />
                <path fill="#156c04" d="M4.621 4.515c.182-.728.273-1.091.544-1.303C5.437 3 5.812 3 6.562 3h10.876c.75 0 1.125 0 1.397.212c.27.212.362.575.544 1.303l1.466 5.864c.071.286.107.429.032.525s-.223.096-.517.096h-2.616c-.358 0-.538 0-.67-.099c-.133-.099-.185-.27-.288-.614l-.689-2.295c-.216-.722-.324-1.083-.414-1.066c-.089.018-.051.393.024 1.143L15.89 9.9c.051.514.077.771-.072.935s-.407.165-.923.165h-1.49c-.43 0-.645 0-.788-.13c-.143-.128-.164-.342-.207-.77l-.211-2.11c-.072-.723-.108-1.085-.199-1.085c-.09 0-.127.362-.199 1.085l-.211 2.11c-.043.428-.064.642-.207.77c-.143.13-.358.13-.788.13h-1.49c-.516 0-.774 0-.923-.165c-.15-.164-.123-.42-.072-.935l.183-1.831c.075-.75.113-1.125.023-1.143c-.089-.017-.197.344-.413 1.066l-.69 2.295c-.102.344-.154.515-.287.614s-.312.099-.67.099H3.64c-.294 0-.442 0-.517-.096s-.04-.24.032-.525zM12.5 15h-1a2 2 0 0 0-2 2v3.85c0 .083.067.15.15.15h4.7a.15.15 0 0 0 .15-.15V17a2 2 0 0 0-2-2" />
              </svg>
            </div>
          </div>
          <div class="mx-2">
            <div class=" text-slate-400">Line Group</div>
            <div class="   font-semibold   text-xl ">
                {rooms.RoomName}

            </div>
            <div>ตรวจสอบไปแล้ว {rooms.TotalQuotaUsed} ครั้ง</div>
          </div>
        </div>
        </div></Carousel.Item>
        
  {/each}

      </Carousel.Content>
      <Carousel.Previous />
      <Carousel.Next />
    </Carousel.Root>
    
  <div class="my-5 grid grid-cols-1 lg:px-5" style="height: 100px;">
    <div class="w-full">
      <div class="font-semibold my-5"></div>
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