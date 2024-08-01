<script lang="ts">
    import { Bar } from 'svelte-chartjs';
    import logo from"$lib/image/pack.png";
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card";
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
    // Register Chart.js components
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
 
  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  );
  const items = [
		{
			title: 'Item 1',
			description: 'This is the first item',
			imageUrl: logo,
			status: 'success'
		},
		{
			title: 'Item 2',
			description: 'This is the second item',
			imageUrl: logo,
			status: 'faild'
		},
		{
			title: 'Item 3',
			description: 'This is the third item',
			imageUrl: logo,
			status: 'success'
		},
		{
			title: 'Item 4',
			description: 'This is the fourth item',
			imageUrl: logo,
			status: 'success'
		},
		{
			title: 'Item 5',
			description: 'This is the fifth item',
			imageUrl: logo,
			status: 'faild'
		},
		{
			title: 'Item 5',
			description: 'This is the fifth item',
			imageUrl: logo,
			status: 'success'
		},
		{
			title: 'Item 5',
			description: 'This is the fifth item',
			imageUrl: logo,
			status: 'faild'
		}
	];

    function sendData(param1: string) {
    
    console.log(param1)  // Replace with your actual URL
    sessionStorage.setItem('id_detail', param1);    
  }
  </script>

<div class="rounded-lg  mx-2 "  style="width:96%;height:80%">
    <div class=" flex justify-center my-2">
        <Carousel.Root class="w-full">
            <Carousel.Content class="-ml-1">
                {#each items as item}
                    <Carousel.Item >
                        <div class="p-1">
                            <Card.Root>
                                <Card.Content
                                    class="aspect-square items-center justify-center my-2 h-28 max-h-72"
                                >
                                    <div class="flex w-64 mx-2" >
                                        <div style="width:50%;height:24%">
                                            <img src={logo} class="w-11/12 h-2/5 my-0" />
                                        </div>
                                        <div class="mx-3 w-72 text-left">
                                            <div class="text-sm font-semibold"><article class="text-wrap ...">
                                                <p>{item.title} : 12313asdada</p>
                                                <p>{item.title}</p>
                                                <p>{item.title}</p>
                                                <p>{item.title}</p>
                                              </article></div>
                                            
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card.Root>
                        </div>
                    </Carousel.Item>
                {/each}
            </Carousel.Content>
            <Carousel.Previous />
            <Carousel.Next />
        </Carousel.Root>
    </div>
</div>

<ScrollArea class="h-72 mx-2 rounded-md border " style="width:96%;">
<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-1 ">
<div class="rounded-lg snap-y" style="width:100%">
    {#each items as item}
        <div class=" my-5 mx-5 rounded-xl snap-start text-sm">
            <div class="flex justify-between h-full">
                <div>
                <div class="content-end">ผู้ส่ง : {item.title}</div>
                <div class="content-end">จาก: XXX-X-XX... , MR....</div>
            </div>
                <div class="content-center">{item.status}</div>
                <div >
                    <a href="/detail">
                <Button variant="outline" class="bg-orange-500 w-50  h-50 flex justify-end" on:click={() => sendData(item.package)}>ดูรายการ</Button
                    >
                </a></div>
                
            </div>
        </div>
    {/each}
</div>
</div>
</ScrollArea>