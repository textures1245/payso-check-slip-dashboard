<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import logo from '$lib/image/merchant.png';

    const items = [
    {
        id: 1,
        storeName: 'ร้านสมหวังพาณิชย์',
        ownerName: 'นายสมชาย สมหวัง',
        storeAddress: '123 ถนนสุขสันต์ ตำบลศรีสุข อำเภอศรีสำราญ จังหวัดสุขสำราญ 12345',
        phoneNumber: '081-234-5678',
        email: 'somwang@example.com',
        taxIdentificationNumber: '1234567890123',
        usernameLine: 'somwang123'
    },
    {
        id: 2,
        storeName: 'ร้านสมหวังเทรดดิ้ง',
        ownerName: 'นางสาวสมใจ สมหวัง',
        storeAddress: '456 ถนนสุขสำราญ ตำบลศรีสำราญ อำเภอศรีสุข จังหวัดสุขสันต์ 54321',
        phoneNumber: '082-345-6789',
        email: 'somjai@example.com',
        taxIdentificationNumber: '9876543210987',
        usernameLine: 'somjai456'
    },
    {
        id: 3,
        storeName: 'ร้านสมหมายมาร์ท',
        ownerName: 'นายสมหมาย สมบัติ',
        storeAddress: '789 ถนนสุขเจริญ ตำบลสุขใจ อำเภอสุขสำราญ จังหวัดสุขสม 67890',
        phoneNumber: '083-456-7890',
        email: 'sommai@example.com',
        taxIdentificationNumber: '1357924680135',
        usernameLine: 'sommai789'
    },
    {
        id: 4,
        storeName: 'ร้านสมชายช็อป',
        ownerName: 'นายสมชาย สมจิต',
        storeAddress: '101 ถนนสุขใจ ตำบลสุขสำราญ อำเภอสุขสม จังหวัดสุขสันต์ 12345',
        phoneNumber: '084-567-8901',
        email: 'somchai@example.com',
        taxIdentificationNumber: '2468135790246',
        usernameLine: 'somchai101'
    },
    {
        id: 5,
        storeName: 'ร้านสมหญิงโฮม',
        ownerName: 'นางสาวสมหญิง สมใจ',
        storeAddress: '202 ถนนสุขสำราญ ตำบลสุขใจ อำเภอศรีสุข จังหวัดสุขสม 54321',
        phoneNumber: '085-678-9012',
        email: 'somying@example.com',
        taxIdentificationNumber: '3692581470369',
        usernameLine: 'somying202'
    }
];

let example =1

</script>


{#each items as item}
			{#if example == item.id}
            <div class="m-8">
                <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 mx-5 my-5" style="width: 100;">
                    
                        <div class="content-center text-2xl">
                            <Card.Root >
                                <Card.Content class="mx-5" >
                                    <div>
                                        <div class="chart-container"></div>
                                        <div>Merchant Name : {item.storeName}</div>
                                        <div>Username Line : {item.usernameLine}</div>
                                        <div>Tax Identification Number : {item.taxIdentificationNumber}</div>
                                        <div></div>
                                    </div></Card.Content
                                >
                            </Card.Root>
                        </div>
                    
                
                    <div >
                        <div style="height:150px bg-black ">
                            <Card.Content class="flex justify-center " >
                                <div class="bg-sky-500/40 filter blur-md  rounded-full flex justify-center " style="width: 30%;height:30%">
                                    <div class="chart-container content-center flex justify-center " style="height: 130px;">.</div>
                                    
                                    <div></div>
                                </div>
                                <img src={logo} alt="" class="w-32 h-32 absolute bottom-50 left-50  " />
                                </Card.Content
                            >
                        </div>
                    </div>
                
                </div>
                <div class="mx-5">
                    <div class="text-3xl">
                        About
                    </div>
                    <div class="bg-zinc-400 w-100 h-1">
                        
                    </div>
                    <div>
                        <Card.Root class="my-5" >
                            <Card.Content class="mx-5" >
                                <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 mx-5 my-5" style="width: 100;">
                                    <div class="flex">
                                        <div class="w-3/5">OwnerName :</div>
                                        <div class="w-3/5">{item.ownerName}</div>
                                    </div>
                                    <div class="flex">
                                        <div class="w-3/5">StoreAddress :</div>
                                        <div class="w-3/5">{item.storeAddress}</div>
                                    </div>
                                    <div class="flex">
                                        <div class="w-3/5">PhoneNumber</div>
                                        <div class="w-3/5">{item.phoneNumber}</div>
                                    </div>
                                    <div class="flex">
                                        <div class="w-3/5">Email :</div>
                                        <div class="w-3/5">{item.email}</div>
                                    </div>
                                </div></Card.Content
                            >
                        </Card.Root>
                        
                    </div>
                </div>
                </div>
			{/if}
		{/each}