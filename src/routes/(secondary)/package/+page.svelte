<script lang="ts">
	import PackageCard from './(components)/PackageCard.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Icon from '@iconify/svelte';
	import { Colors } from 'chart.js';
    import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { onMount } from 'svelte';
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
                'Content-Type': 'application/json'
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


	
</script>
{#if loading}
<svg xmlns="http://www.w3.org/2000/svg" class="spin" x="0px" y="0px" width="100" height="100" viewBox="0 0 128 128">
	<path d="M14.5 39.8c-1.5-.6-3.3.1-3.9 1.6-2.4 5.8-3.9 11.9-4.4 18.1-.1 1.7 1.1 3.1 2.8 3.2.1 0 .2 0 .2 0 1.6 0 2.9-1.2 3-2.8.4-5.6 1.8-11.1 3.9-16.2C16.7 42.2 16 40.5 14.5 39.8zM113.1 39.1c-1.5.7-2.2 2.4-1.5 4 8.7 19.8 4.5 42.5-10.8 57.8C90.9 110.6 77.9 116 64 116c-11.2 0-21.9-3.5-30.8-10.1l0 0h4.9c1.7 0 3-1.3 3-3s-1.3-3-3-3h-13c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3s3-1.3 3-3v-6.3l0 0C38.6 117.8 51.3 122 64 122c14.9 0 29.7-5.7 41-17 17.1-17.1 21.8-42.3 12.1-64.4C116.4 39.1 114.6 38.4 113.1 39.1zM90.1 22.1c-1.6 0-3.1 1.2-3.2 2.8-.1 1.7 1.3 3.2 3 3.2h13c1.7 0 3-1.3 3-3V12.3c0-1.6-1.2-3.1-2.8-3.2-1.7-.1-3.2 1.3-3.2 3v6.3C78 1.1 46.3 1.9 25.3 20.8 24 22 24 24 25.2 25.2c1.1 1.1 2.9 1.2 4.1.1C38.9 16.7 51.1 12 64 12c11.2 0 21.9 3.5 30.8 10.1l0 0H90.1zM11.5 77.69999999999999A2.9 2.9 0 1 0 11.5 83.5 2.9 2.9 0 1 0 11.5 77.69999999999999z"></path>
	</svg>
{:else}
<div class="flex flex-col min-h-[calc(100vh-41px)]">
	<div class="sm:text-center flex justify-center text-4xl mt-8 mb-4  font-bold">
		<h1 class=" text-wrap text-center text-black">ราคาแพ็คเกจ</h1>
		
	</div>
	<div class="text-center mx-5 mb-4"><h5>เพิ่มความสะดวกสบายและประหยัดเวลาด้วยบริการตรวจสอบสลิปธนาคารของเรา เลือกแพ็คเกจที่เหมาะกับคุณ</h5></div>
	<div class="flex gap-2 flex-wrap justify-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-10 ">
		{#each packages as pkg,i}
        {#if pkg.OrderAmount != pkg.AmountLimit || pkg.AmountLimit==0  }
			<div class=" lg:my-3 md:my-3 sm:my-2 my-3 lg:mx-2 md:mx-2 sm:mx-0 mx-0 transition-transform hover:scale-105 drop-shadow-lg" >
				<PackageCard pkg={pkg} maxIndex={randomNumber} index={i}  />
			</div>
            {/if}
		{/each}
	</div>
	<div class="text-center  content-center text-xl my-5 " style="color: #0031E5;"><a href="/dashboard" >ไปหน้า แดชบอร์ด >></a></div>
</div>



{/if}



<style scoped>
.spin {
            display: inline-block;
            animation: spin 2s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
		.tooltip-container {
        position: fixed; /* ใช้ fixed เพื่อให้อยู่ตำแหน่งเดิมเมื่อเลื่อนหน้า */
        right: 10px; /* ปรับให้ปุ่มและ tooltip อยู่ด้านขวาของหน้าจอ */
        top: 95%; /* ปรับตำแหน่งให้อยู่ตรงกลางตามแนวตั้ง */
        transform: translateY(-50%); /* เลื่อนขึ้นครึ่งหนึ่งของความสูงเพื่อให้อยู่ตรงกลาง */
        z-index: 1000;
    }

    


    
</style>