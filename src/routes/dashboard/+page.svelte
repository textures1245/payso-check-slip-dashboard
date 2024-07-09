<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	const items = [
		{
			title: 'Item 1',
			description: 'This is the first item',
			imageUrl: 'path/to/image1.jpg',
			package: '1'
		},
		{
			title: 'Item 2',
			description: 'This is the second item',
			imageUrl: 'path/to/image2.jpg',
			package: '2'
		},
		{
			title: 'Item 3',
			description: 'This is the third item',
			imageUrl: 'path/to/image3.jpg',
			package: '3'
		},
		{
			title: 'Item 4',
			description: 'This is the fourth item',
			imageUrl: 'path/to/image4.jpg',
			package: '4'
		},
		{
			title: 'Item 5',
			description: 'This is the fifth item',
			imageUrl: 'path/to/image5.jpg',
			package: '5'
		},
		{
			title: 'Item 6',
			description: 'This is the fifth item',
			imageUrl: 'path/to/image5.jpg',
			package: '6'
		}
	];
</script>

<div class="flex justify-start ... text-2xl font-sans ... font-bold ...">
	<h1>Data</h1>
</div>
<div class=" flex justify-evenly ... text-xl font-sans ... h-60">
	<div class="w-1/6 text-center">
		<div class="rounded-lg border-2 border-black w-full max-w-80 h-full max-h-24">
			<p>หัวข้อ</p>
			<p>359 bath</p>
		</div>
		<div class="rounded-lg border-2 border-black w-full max-w-80 h-full max-h-24 mt-3">
			<p>หัวข้อ</p>
			<p>359 bath</p>
		</div>
	</div>
	<div
		class="w-1/6 text-center mt-7 rounded-lg border-2 border-black w-full max-w-80 h-32 max-h-70"
	>
		<p>asdasd</p>
		<p>359 bath</p>
		<Button variant="outline">Dowload Excel</Button>
	</div>
	<div class="w-1/6 text-center">
		<div class="rounded-lg border-2 border-black w-full max-w-80 h-full max-h-24">
			<p>หัวข้อ</p>
			<div class="flex justify-evenly">
			<p>IMG</p>
			<p>359 bath</p>
			</div>
		</div>
		<div class="rounded-lg border-2 border-black w-full max-w-80 h-full max-h-24 mt-3">
			<p>หัวข้อ</p>
			<div class="flex justify-evenly">
			<p>IMG</p>
			<p>359 bath</p>
			</div>
		</div>
	</div>
	<div
		class="w-1/6 text-center mt-7 rounded-lg border-2 border-black w-full max-w-80 h-32 max-h-70"
	>
		<p>การใช้งาน</p>
		<p>กราฟ</p>
		<p>3/100</p>
	</div>
</div>

<div class="flex justify-start ... text-2xl font-sans ... font-bold ...">
	<h1>ธนาคาร</h1>
</div>
<div class="rounded-lg border-2 border-black w-100 h-52 max-h-72 mx-8 my-8">
	<div class="w-100 flex justify-center mt-3">
		<Carousel.Root class="w-full max-w-7xl ">
			<Carousel.Content class="-ml-1">
				{#each items as item}
					<Carousel.Item class="pl-1 md:basis-1/2 lg:basis-1/4">
						<div class="p-1">
							<Card.Root>
								<Card.Content
									class="aspect-square items-center justify-center p-6 h-40 max-h-72 w-full"
								>
									<div class="flex">
										<div class="text-2xl font-semibold">{item.package}</div>
										<div class="mx-3">
											<div class="text-2xl font-semibold">{item.title}</div>
											<div class="text-2xl font-semibold">{item.description}</div>
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
<div class="flex justify-start ... text-2xl font-sans ... font-bold ...">
	<h1>รายการย้อนหลัง</h1>
</div>
<div class="rounded-lg border-2 border-black w-100 h-full mx-8 my-8">
	{#each items as item}
		<div class="bg-slate-300 my-5 mx-5">
			<div class="flex justify-around ...">
				<div>img</div>
				<div>ผู้ส่ง : {item.title}</div>
				<div>จาก: XXX-X-XX... , MR....</div>
				<div>จำนวนเงิน : {item.package}</div>

				<AlertDialog.Root >
					<AlertDialog.Trigger><Button variant="outline">ดูรายการ</Button></AlertDialog.Trigger>
					<AlertDialog.Content class="bg-slate-300 rounded-lg p-4 h-full my-10" style="width:auto;height:auto">
						<AlertDialog.Header >
							<AlertDialog.Title >
                                <div class="flex" >
                                    <div> IMG</div>
                                    <div class="mx-2">
                                        <div>ประเภทการชำระ</div>
                                        <div> Merchant Name</div>
                                    </div>
                                    <div>เลขบัญชี</div>
                                    <div class="ms-44"><AlertDialog.Action
                                        class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
                                    >
                                        x
                                    </AlertDialog.Action></div>
                                </div>
                            </AlertDialog.Title>
							<AlertDialog.Description>
								<div class="flex justify-around">
                                    <div class="content-center" style="width: 190px;"><div class="flex justify-center">IMG</div></div>
                                    <div class="h-100 bg-black" >.</div>
                                    <div class="text-start mx-5" style="width: 190px;">

                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                        <div>.....</div>
                                        <div>...</div>
                                        <div>.....</div>
                                       
                                        
                                    </div>
                                </div>
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer class="mt-4 flex justify-end space-x-2">
							
							
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</div>
	{/each}
</div>
