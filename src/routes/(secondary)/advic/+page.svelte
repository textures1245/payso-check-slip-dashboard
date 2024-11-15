<!-- App.svelte -->
<script lang='ts'>
    import { writable } from 'svelte/store';
    import PackageCard from './(components)/PackageCards.svelte';
    import { PUBLIC_API_ENDPOINT } from '$env/static/public';
    import addGroup from '$lib/image/addGroup.png';
	import { afterUpdate, onMount } from 'svelte';
	let packages: any[] = [];
	let maxIndex ='';
	let loading = false;
	let randomNumber =0;

	onMount(async () => {
		clearRemainingTime()
		try {
			const datas = await GetPackage();
			// Use profileData here
			packages = datas.result;
			maxIndex = datas.result.length;
            const maxQuotaLimit = Math.max(...packages.map(pkg => pkg.OrderAmount));
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
                'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
            }
		};
		var result = await fetch(`${PUBLIC_API_ENDPOINT}/package/packageactive`, config);
		const data = await result.json();
		return data
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
      packageId:'',
      packageName:'',
      packagePrice:'',
      
      // Verification
      idCard: null,
      selfie: null
    });
    const selectedPackage = writable(null);
    async function handlePackageSelect(event: { detail: { price: any; name: any; id: any; }; }) {
    const { price, name, id } = event.detail;
    console.log("----------------------",price,name,id)
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
    updateStepStatus()
    currentStep = 1;
    currentSubStep = 0;

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
        subSteps: [
          { label: 'เลือกแพ็คเกจตามต้องการ', completed: false },
        ]
      },
      {
        label: 'Payment',
        completed: false,
        active: false,
        subSteps: [
          { label: 'ชำระเงิน', completed: false }
        ]
      },
      {
        label: 'Bank',
        completed: false,
        active: false,
        subSteps: [
          { label: 'เพิ่มธนาคารของคุณ', completed: false },
        ]
      },
      {
        label: 'Group Line',
        completed: false,
        active: false,
        subSteps: [
          { label: 'สร้างกลุ่มของในไลน์และเชิญ SURESURE', completed: false },
        ]
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
  
  
    // อัพเดทสถานะ step
    function updateStepStatus() {
      $steps = $steps.map((step, index) => {
        if (index === currentStep) {
          const updatedSubSteps = step.subSteps.map((subStep, subIndex) => ({
            ...subStep,
            completed: subIndex === currentSubStep ? true : subStep.completed
          }));
          
          const allSubStepsCompleted = updatedSubSteps.every(sub => sub.completed);
          
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
    import * as Card from "$lib/components/ui/card";
	import dowlaod from"$lib/image/downloads.png";
	import payment from"$lib/image/Payment.png";
	import { goto } from '$app/navigation';
	const date = new Date();
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
	const day = date.getDate().toString().padStart(2, '0');

	// Generate a random 4-digit number
	const randomNumberpayment = Math.floor(1000 + Math.random() * 9000).toString(); // Ensures a 4-digit number
	let packageprice="";
	let packagename="";
	// Concatenate to form RefNo
	let refNo = `${year}${month}${day}${randomNumberpayment}`;

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
				'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
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
				'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
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
	let timerStarted = false;
	let seconds = 10*60;
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
            setTimeout(countdown, 1000); // ทำงานซ้ำทุกๆ 1 วินาที
        }
    }
		(window as any).intervalId = setInterval(async () => {
			// seconds -= 1; // ลดค่าการนับเวลา
			// localStorage.setItem('remainingTime', seconds.toString());
			const data = await Check();
			const datatest = await CheckLimit();  // ต้องลบถ้ามี postback 
			// console.log("Check : ",data,datatest)
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
			// if(packagePrice == "0.00" && packageName == "Free trial"){
			// 		console.log("--------",packagePrice,packageName)
			// 	}
			
			if (seconds <= 0 || data.length > 0 || (packagePrice == "0.00" && packageName == "Free trial")) {					//    || data.Status == "SUCCESS" ถ้าเป็น Postback ต้องใช้เงื่อนไขนี้ อันนี้ test ใช้ อินคิวรี
				clearInterval((window as any).intervalId); // หยุดการนับเวลา
				messageVisible = false; // ซ่อนข้อความ
				if (data.length > 0 || (packagePrice == "0.00" && packageName == "Free trial") ) {   //    || data.Status == "SUCCESS" ถ้าเป็น Postback ต้องใช้เงื่อนไขนี้ อันนี้ test ใช้ อินคิวรี
					UpdatePayment()
					UpdatePackage()
					if(datatest.OrderAmount == datatest.AmountLimit-1){   //ถ้าเป็น Postback datatest จะเปลี่ยนเป็น data เฉยๆ เพราะใช้แค่ตัวเดียวเช็ค
						UpdateLimitPackage()
					}
					clearRemainingTime()
          updateStepStatus();
          currentStep=2
          currentSubStep = 0;
				}
				
				if (seconds <= 0 ) {
					clearRemainingTime()
                    window.location.assign("/package")
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
				'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
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
				'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
			},
			body: JSON.stringify({
				RefNo : refNo
            })
		};
		var result = await fetch(
			`${PUBLIC_API_ENDPOINT}/payment/get`,
			config
		);
		
		const data = await result.json();
		console.log("asdaada",data)
		if (data) {
			return data.result;			//data.result
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
			console.log('package Id :', typeof(Id), typeof(myCookie.Id));
		    let config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
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




const UpdatePayment = async () => {
		// Create URL parameters from form data
			const refNo = localStorage.getItem('RefNo');
			console.log(refNo)
		    let config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
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
		const packagegId = sessionStorage.getItem('packageId')
		let config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
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
	  const canUseShare = navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: blob.type })] });
      
      if (isMobile && canUseShare) {
        // สำหรับ iOS: เปิดรูปในแท็บใหม่
        // window.open(blobUrl, '_blank');
		await navigator.share({
        files: [new File([blob], filename, { type: blob.type })],
        title: 'ดาวน์โหลดรูปภาพ',
        text: 'บันทึกภาพลงในเครื่องของคุณ',
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

  let rooms:any[]=[]
  
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
  let selectedOptionBank = "";  // ตัวเลือกที่เลือกไว้
  const options = [
    { label: "เบอร์โทร", value: "MSISDN",imageUrl: "/src/lib/image/phone.png" },
    { label: "เลขประจำตัว", value: "NATID" ,imageUrl: "/src/lib/image/bg-people.png"},
    { label: "e-Wallet ID", value: "EWALLETID",imageUrl: "/src/lib/image/phone.png" },
    { label: "บัญชีธนาคาร", value: "BANKAC",imageUrl: "/src/lib/image/bg-people.png" }
  ];
  function selectOptionBank(option: any) {
    selectedOption = option;  // อัปเดตตัวเลือกที่เลือก
    isOpen = false;  // ปิดเมนูหลังจากเลือกตัวเลือกแล้ว
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
        'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
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
          LastNameENBank = ""
          LastNameENPP=""
          LastNameTHBank=""
          LastNameTHPP=""
          selectedOption = ""
          AccNoPP = ""
          NameTHPP =""
          NameENPP = ""
          setTimeout(() => {
    updateStepStatus();
    currentStep = 3;
    currentSubStep = 0;
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


  // ---------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------
  
 
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
  


  // สถานะเปิดปิดเมนู dropdown
  let selectedOption = "";  // ตัวเลือกที่เลือกไว้


  





  function StepStatustofinish() {
    updateStepStatus();  // เรียกฟังก์ชันที่คุณต้องการ
    currentStep = 4;      // ตั้งค่า currentStep เป็น 4
    currentSubStep = 0;   // ตั้งค่า currentSubStep เป็น 0
  }

  </script>
  <div class="mx-auto px-6 pt-6 pb-0 bg-primary-foreground min-h-screen">
    <div class="mb-8 ">
      <div class="w-full  items-center flex justify-center">
        <!-- Container that changes flex direction based on screen size -->
        <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center relative gap-8 md:gap-0">
          {#each $steps as step, i}
            <div class="flex flex-1">
              <!-- Vertical line for mobile -->
              {#if i > 0}
                <div class="md:hidden absolute h-8 w-0.5 bg-gray-300 -mt-8 ml-4">
                  <div 
                    class="h-full bg-blue-500" 
                    style="height: {$steps[i-1].completed ? '100%' : '0%'}"
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
                        {step.completed ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-600'}
                        {step.active ? 'border-blue-500 text-blue-500' : ''}
                      "
                    >
                      {#if step.completed}
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      {:else}
                        {i + 1}
                      {/if}
                    </div>
                    
                    <!-- Progress Circle -->
                    {#if step.subSteps.length > 0 && !step.completed && step.subSteps.some(sub => sub.completed)}
                      <svg class="absolute top-0 left-0 -rotate-90" width="32" height="32">
                        <circle
                          stroke="currentColor"
                          stroke-width="2"
                          fill="none"
                          r="14"
                          cx="16"
                          cy="16"
                          class="text-blue-500"
                          style="stroke-dasharray: {2 * Math.PI * 14}; stroke-dashoffset: {2 * Math.PI * 14 * (1 - (step.subSteps.filter(sub => sub.completed).length / step.subSteps.length))}"
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
                            <div class="w-1 h-1 rounded-full {subStep.completed ? 'bg-blue-500' : 'bg-gray-300'}" />
                            {subStep.label}
                          </div>
                        {/each}
                      </div>
                    {/if}
                  </div>
                </div>
  
                <!-- Connecting Line - Only show on larger screens and if not last item -->
                {#if i < $steps.length - 1}
                  <div class="
                    hidden md:block flex-1 h-0.5 mx-4
                    {step.completed ? 'bg-blue-500' : 'bg-gray-300'}
                  " />
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class=" bg-primary-foreground rounded-lg shadow-none border  min-w-6xl  border-none  ">
      {#if currentStep === 0}
        <!-- Basic Details -->
        {#if currentSubStep === 0}
        <div class="flex flex-col min-h-[calc(100vh-41px)]">
          <div class="sm:text-center flex justify-center text-4xl mt-2 mb-4 font-bold">
            <h1 class="text-wrap text-center text-black">เลือกแพ็คเกจเพื่อใช้โควต้าในระบบ SURESURE</h1>
        </div>
        <div class="text-center mx-5 mb-4">
            <h5>เพิ่มความสะดวกในการใช้งานด้วยการเลือกแพ็คเกจที่มีโควต้า พร้อมใช้บริการตรวจสอบสลิปธนาคารผ่านระบบ Sure Sure ของเรา</h5>
        </div>
            <div class="flex gap-2 flex-wrap justify-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-10  ">
                {#each packages as pkg,i}
                {#if pkg.OrderAmount != pkg.AmountLimit || pkg.AmountLimit==0  }
                    <div class=" lg:my-3 md:my-3 sm:my-2 my-3 lg:mx-2 md:mx-2 sm:mx-0 mx-0 transition-transform hover:scale-105 drop-shadow-lg" >
                        <PackageCard pkg={pkg} on:packageSelect={handlePackageSelect} maxIndex={randomNumber} index={i}  />
                    </div>
                    {/if}
                {/each}
            </div>
        </div>
        
        {/if}
  
      {:else if currentStep === 1}
        <!-- Contact Details -->
        {#if currentSubStep === 0}
        <div class="flex justify-center items-center flex-col  bg-primary-foreground  content-center">
          <Card.Root class=" lg:w-2/5 md:w-3/5 mb-5">
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
              <p class="text-sm">**สำหรับผู้ใช้มือถือสามารถแคปหน้าจอได้ทันที</p>
              </div>
            </div>
            <!-- svelte-ignore a11y-missing-attribute -->
            <div class="mx-5 mb-5"><Button variant="outline" class="w-full h-12 text-white hover:text-black  bg-primary font-semibold" on:click={() => downloadImage(dataImg, filename)}  ><img src="{dowlaod}" width="18px" height="18px" class="mr-3">ดาวน์โหลดคิวอาร์โค้ด</Button></div>
          </Card.Root>
          
          </div>
          
          <dialog id="my_modal_2" class="modal">
            <div class="modal-box ">
              <div class="text-lg font-bold flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 15 15" {...$$props}>
                  <path fill="#F04438" fill-rule="evenodd" d="M.877 7.5a6.623 6.623 0 1 1 13.246 0a6.623 6.623 0 0 1-13.246 0M7.5 1.827a5.673 5.673 0 1 0 0 11.346a5.673 5.673 0 0 0 0-11.346m2.354 3.32a.5.5 0 0 1 0 .707L8.207 7.5l1.647 1.646a.5.5 0 0 1-.708.708L7.5 8.207L5.854 9.854a.5.5 0 0 1-.708-.708L6.793 7.5L5.146 5.854a.5.5 0 0 1 .708-.708L7.5 6.793l1.646-1.647a.5.5 0 0 1 .708 0" clip-rule="evenodd" />
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
        <div class="flex justify-center bg-primary-foreground  px-0 py-0 pb-0 sm:py-5  xl:px-24 lg:py-5 xl:py-5 lg:pb-5 xl:pb-5 ">
    
          <div class="container max-w-screen-lg   mx-auto bg-white rounded-2xl shadow ">
            <div class="flex  justify-start gap-5 mt-5 sm:mt-5 lg:mt-5">
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
                    <form on:submit|preventDefault={() => sendData(selectedBank.code, AccNoBank, NameTHBank, NameENBank, LastNameTHBank, LastNameENBank, null, null, null, null, null, null)}>
                  <div class="my-5 px-2">
                      <input class="  border-2 w-full px-2 " style="height: 40px;" on:input={handleInput}  placeholder="เลขบัญชีธนาคาร" bind:value={AccNoBank} required>
                  </div>
                  <hr >
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
                          on:click={() => selectOptionBank(option)}
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
      
      
      
        {:else}
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Face Verification</h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Upload Selfie</label>
              <input 
                type="file" 
                accept="image/*"
                on:change={(e) => $formData.selfie = e.target.files[0]}
                class="w-full"
              />
            </div>
          </div>
        {/if}
    

        {:else if currentStep === 3}
        <!-- Contact Details -->
        {#if currentSubStep === 0}
        <div class="flex justify-center">
        <div class="w-full max-w-sm sm:max-w-xl lg:max-w-3xl  bg-white shadow-md rounded-lg p-6 mb-6">
          <div class="text-sm">
              <h2 class="text-2xl font-semibold mb-5">ขั้นตอนที่ 5: เพิ่มบอทในกลุ่ม Line</h2>
              <div class="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
                  <div class="flex justify-center">
                      <img src={addGroup} alt="Add Bot to Group" width="250px">
                  </div>
                  <div>
                      <div class="text-gray-600 mt-5">
                          <strong class="text-lg"> สร้างกลุ่มและเชิญบอท</strong>
                          <ul class="list-disc ml-5 text-sm">
                              <li>ให้สร้างกลุ่ม Line เพื่อใช้ตรวจสอบสลิป</li>
                              <li>คลิก "สร้างกลุ่ม" เพื่อสร้างกลุ่มใหม่</li>
                              <li>เลือก "เชิญเพื่อน" และเพิ่ม Line OA Check Slip เข้ากลุ่ม</li>
                              <li>เชิญเพื่อนคนอื่นที่ต้องการใช้บริการด้วยได้</li>
                             
                          </ul>
                      </div>
                      <div class="mt-5 flex justify-center">
                        <Button
                        variant="outline"
                        class=" flex text-center py-0 px-5 bg-primary rounded-md lg:w-full md:w-full group"
                        style="height:40px"
                        on:click={() => StepStatustofinish()} 
                      >
                        <div
                          style="width: 100%; height:100%"
                          class="content-center sm:p-2 lg:p-2 group-hover:text-black text-white"
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
        <div class="text-center py-8 min-h-[calc(100vh-250px)]  ">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-2xl font-semibold mb-2">สามารถใช้งานระบบ SURE SURE ได้แล้ว</h2>
          <div class="flex justify-center mt-5"><Button
  variant="outline"
  class=" flex text-center py-0 px-0 bg-primary rounded-md lg:w-70 md:w-70 group"
  style="height:50px"
  on:click={() => goto('/dashboard')}
>
  <div
    style="width: 200px; height:200px"
    class="content-center sm:p-2 lg:p-2 group-hover:text-black text-white"
  >
    ไปหน้า Dashboard
  </div>
</Button></div>
        </div>
      {/if}
  
      <!-- Form Controls -->
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
        <p class=" text-center">รอประมาณ 3 วินาที ไปขั้นตอนถัดไป</p>
    </div>
  </div>
    </div>
    <!-- <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form> -->
  </dialog>