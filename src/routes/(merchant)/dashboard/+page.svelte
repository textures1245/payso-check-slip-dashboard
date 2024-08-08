<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import Chartdata from "$lib/component/chartdata/+page.svelte";
	import Overview from "$lib/component/overview/+page.svelte";
	import PastandBank from "$lib/component/pastandbank/+page.svelte";
	import { onMount } from 'svelte';

	// let datas = {
    //     totalRealItems: 33333,
    //     totalFakeItems: 1111,
    //     totalUsed: 2222,
    //     max: 300,
    //     used: 200
    // };
	let dataOverview: any[] = [];
	onMount(async () => {
		try {
			const data = await GetTransactionByid();
			// Use profileData here
			dataOverview =data;
			console.log('profile : ',dataOverview);
			
			
		} catch (error) {
			console.error('Error fetching profile:', error);
		}


	});


	const GetTransactionByid = async () => {
		const id= sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		console.log( 'id: ', id , typeof(id));
		
		console.log('checking register');

		// Create URL parameters from form data
		let config = {
			method: 'GET', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json'
            }
		};
		var result = await fetch(`http://127.0.0.1:4567/api/v1/trasactionid/${id}`, config);
		const datas = await result.json();
        console.log(datas)
		return datas.result[0]

	
	};

</script>


<div class="mx-5" >
<Overview {dataOverview}/>
</div>
<div class="grid gap-2 md:grid-cols-1 lg:grid-cols-2 mx-5 my-6 ">
    <div>
		
		<Card.Root class="w-100" style="height:100%;" >
			<Card.Content class="flex justify-center" style="height:100%;width:100%" >
				<div style="width: 100%;" >
				<div class="chart-container content-center h-96 flex justify-center" style="width: 96%;">
					<Chartdata />
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
				
					<PastandBank />
			
				  <div>
			</div>
			</Card.Content>
		  </Card.Root>
           
		</div>
    
</div>


