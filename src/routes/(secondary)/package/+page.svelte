<script lang="ts">
	import PackageCard from './(components)/PackageCard.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Icon from '@iconify/svelte';
	import { Colors } from 'chart.js';
	import { onMount } from 'svelte';
	let packages: any[] = [];
	let maxIndex ='';
	let randomNumber =0;
	// const packages = [
	// 	{
	// 		name: 'bronz',
	// 		price: 45,
	// 		quotalimit: 100,
	// 		color: 'bg-gradient-to-r from-amber-800 via-amber-400 to-amber-600',
	// 		index: 5
	// 	},
	// 	{
	// 		name: 'silver',
	// 		price: 80,
	// 		quotalimit: 200,
	// 		color: 'bg-gradient-to-r from-zinc-500 via-zinc-100 to-zinc-400',
	// 		index: 6
	// 	},
	// 	{
	// 		name: 'gold',
	// 		price: 150,
	// 		quotalimit: 400,
	// 		color: 'bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-500',
	// 		index: 4
	// 	}
	// ];

	onMount(async () => {
		
		try {
			const datas = await GetPackage();
			// Use profileData here
			packages = datas.result;
			maxIndex = datas.result.length;
			randomNumber = getRandomNumber(maxIndex);
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
		var result = await fetch(`http://127.0.0.1:4567/api/v1/package/packageactive`, config);
		const data = await result.json();
		console.log(data)
		return data
	};

	function getRandomNumber(randomIndex: string | number) {
    return Math.floor(Math.random() * randomIndex) + 1;
}



	
</script>

<div class="h-dvh ">
	<div class="sm:text-center flex justify-center text-4xl my-8 font-sans font-bold">
		<h1 class="drop-shadow-lg text-wrap text-primary text-center">CHOOSE YOUR PACKAGE</h1>
	</div>
	<div class="flex bg-primary-foreground gap-2 flex-wrap justify-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-10 ">
		{#each packages as pkg,i}
			<div class="p-1 transition-transform hover:scale-105 drop-shadow-lg" >
				<PackageCard pkg={pkg} maxIndex={randomNumber} index={i}  />
			</div>
		{/each}
	</div>
</div>
