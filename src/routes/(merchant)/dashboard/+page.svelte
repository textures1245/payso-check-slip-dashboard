<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import Chartdata from "$lib/component/chartdata/+page.svelte";
	import Overview from "$lib/component/overview/+page.svelte";
	import { onMount } from 'svelte';
	let loading = false;
	declare const flatpickr: any;

	

    onMount(async () => {
		clearRemainingTime()
        loadPastandBank();
	});
    function clearRemainingTime() {
    localStorage.removeItem('remainingTime'); // การใช้งานที่ถูกต้อง
	localStorage.removeItem('Img');
	localStorage.removeItem('RefNo');
    if ((window as any).intervalId) {
    clearInterval((window as any).intervalId);
    console.log('Timer stopped.');

	
	
  }
}

let PastandBankComponent:any;

// Load PastandBank lazily only when the user scrolls near it or interacts with it
const loadPastandBank = async () => {
    if (!PastandBankComponent) {
        PastandBankComponent = (await import("$lib/component/pastandbank/+page.svelte")).default;

    }
};



// ฟังก์ชันในการจัดการการเปลี่ยนแปลงของ input

	
</script>

{#if loading}
<svg xmlns="http://www.w3.org/2000/svg" class="spin" x="0px" y="0px" width="100" height="100" viewBox="0 0 128 128">
	<path d="M14.5 39.8c-1.5-.6-3.3.1-3.9 1.6-2.4 5.8-3.9 11.9-4.4 18.1-.1 1.7 1.1 3.1 2.8 3.2.1 0 .2 0 .2 0 1.6 0 2.9-1.2 3-2.8.4-5.6 1.8-11.1 3.9-16.2C16.7 42.2 16 40.5 14.5 39.8zM113.1 39.1c-1.5.7-2.2 2.4-1.5 4 8.7 19.8 4.5 42.5-10.8 57.8C90.9 110.6 77.9 116 64 116c-11.2 0-21.9-3.5-30.8-10.1l0 0h4.9c1.7 0 3-1.3 3-3s-1.3-3-3-3h-13c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3s3-1.3 3-3v-6.3l0 0C38.6 117.8 51.3 122 64 122c14.9 0 29.7-5.7 41-17 17.1-17.1 21.8-42.3 12.1-64.4C116.4 39.1 114.6 38.4 113.1 39.1zM90.1 22.1c-1.6 0-3.1 1.2-3.2 2.8-.1 1.7 1.3 3.2 3 3.2h13c1.7 0 3-1.3 3-3V12.3c0-1.6-1.2-3.1-2.8-3.2-1.7-.1-3.2 1.3-3.2 3v6.3C78 1.1 46.3 1.9 25.3 20.8 24 22 24 24 25.2 25.2c1.1 1.1 2.9 1.2 4.1.1C38.9 16.7 51.1 12 64 12c11.2 0 21.9 3.5 30.8 10.1l0 0H90.1zM11.5 77.69999999999999A2.9 2.9 0 1 0 11.5 83.5 2.9 2.9 0 1 0 11.5 77.69999999999999z"></path>
	</svg>
{:else}


<div class="  bg-primary-foreground min-h-screen flex flex-col xl:px-20 lg:px-10 md:px-10 px-0">
<div class="mx-5 " >
<Overview/>
</div>
<div class="grid gap-2 md:grid-cols-1 lg:grid-cols-2 mx-5 my-6 ">
    <div>
		
		<Card.Root  style="height:100%;width:100%" >
			<Card.Content class="flex justify-center" style="height:100%;width:100%" >
				<div style="width: 100%;" >
					
				<div class="chart-container h-96 mx-2 my-3" style="width: 96%;">
					<Chartdata/>
				  </div>
				  <div>
			</div>
			</Card.Content>
		  </Card.Root>
		  
           
    </div>
	<div>
		<Card.Root style="height:100%;width:100%" >
			<Card.Content class="flex justify-center" style="height:100%;width:100%" >
				
				<div style="height: 100%;width:100%">
					
					{#if PastandBankComponent}
    <svelte:component this={PastandBankComponent} />
{/if}
			
				  <div>
			</div>
			</Card.Content>
		  </Card.Root>
           
		</div>
    
</div>
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

