<script>
	import * as Card from '$lib/components/ui/card';
	// สร้างลิสต์ของข้อมูลการใช้งาน
	let items = [
		{ name: 'Item A', usage: 30 },
		{ name: 'Item B', usage: 50 },
		{ name: 'Item C', usage: 20 },
		{ name: 'Item D', usage: 40 }
	];

	// เรียงลำดับลิสต์ตามจำนวนการใช้งาน (usage) จากมากไปน้อย
	items.sort((a, b) => b.usage - a.usage);
</script>

<Card.Root >
    <Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
    >
        <Card.Title class=" text-sm">ลูกค้าที่มีเปอร์เซ็นสลิปปลอมมากที่สุด</Card.Title>
        
    </Card.Header>
    <Card.Content class="text-center ">
        <ul>
            {#each items as item}
                <li>
                    <span>{item.name}</span>
                </li>
            {/each}
        </ul>
    </Card.Content>
</Card.Root>




<style>
	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		margin: 5px 0;
		padding: 10px;
		background-color: #f0f0f0;
		border-radius: 5px;
		display: flex;
		justify-content: space-between;
	}
</style>
