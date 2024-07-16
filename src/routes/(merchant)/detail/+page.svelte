<script>
	// @ts-nocheck
	import * as Card from '$lib/components/ui/card';
	import logo from '$lib/image/merchant.png';
	const iddetail = sessionStorage.getItem('id_detail');
	console.log(iddetail);
	const items = [
    {
		id:'1',
        bank: 'ธนาคารไทยพาณิชย์ จำกัด (มหาชน)',
        senderAccountName: 'นางสาวสมหญิง สมใจ',
        senderAccountNumber: '1234567890',
        receiverAccountName: 'นายสมชาย สมใจ',
        receiverAccountNumber: '0987654321',
        amount: '1,000 บาท',
        date: '12 กรกฎาคม 2567'
    },
    {
		id:'2',
        bank: 'ธนาคารกรุงไทย จำกัด (มหาชน)',
        senderAccountName: 'นายสมชาย สมฤดี',
        senderAccountNumber: '9876543210',
        receiverAccountName: 'นางสาวสมหญิง สมฤดี',
        receiverAccountNumber: '0123456789',
        amount: '2,000 บาท',
        date: '11 กรกฎาคม 2567'
    },
    {
		id:'3',
        bank: 'ธนาคารกสิกรไทย จำกัด (มหาชน)',
        senderAccountName: 'นางสาวสมใจ สมหวัง',
        senderAccountNumber: '1357924680',
        receiverAccountName: 'นายสมใจ สมหวัง',
        receiverAccountNumber: '8642097531',
        amount: '3,000 บาท',
        date: '10 กรกฎาคม 2567'
    },
    {
		id:'4',
        bank: 'ธนาคารกรุงเทพ จำกัด (มหาชน)',
        senderAccountName: 'นายสมหมาย สมเจริญ',
        senderAccountNumber: '2468135790',
        receiverAccountName: 'นางสาวสมหมาย สมเจริญ',
        receiverAccountNumber: '9753102468',
        amount: '4,000 บาท',
        date: '9 กรกฎาคม 2567'
    },
    {
		id:'5',
        bank: 'ธนาคารออมสิน',
        senderAccountName: 'นายสมชาย สมบุญ',
        senderAccountNumber: '1122334455',
        receiverAccountName: 'นางสาวสมหญิง สมบุญ',
        receiverAccountNumber: '5566778899',
        amount: '5,000 บาท',
        date: '8 กรกฎาคม 2567'
    }
];

	console.log(iddetail);
</script>

<div class="mx-10 my-10" style="height:100%">
	{#if iddetail}
		{iddetail}
		{#each items as item}
			{#if iddetail == item.id}
				<div>
					<div
						class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mx-5 my-5"
						style="width:50%"
					>
						<div class="flex justify-center content-center">
							<img src={logo} alt="" width="80%" height="50%" />
						</div>
						<div class="content-around ">
							<div>PROMPT PAY </div>
							<div>MERCHANT NAME</div>
						</div>
						<div class="content-around ">
							<div>เลขบัญชี : {item.receiverAccountNumber}</div>
						</div>
					</div>
					<div
						class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 mx-5 my-5"
						style="width: 100%;height:350px"
					>
						<div>
							<Card.Root style="height:100%;width:100%">
								<Card.Content class="flex justify-center">
									<div style="width: 100%;" class="m-5">
										<div class="chart-container w-100 h-100 my-1 flex justify-center">
											<img src={logo} alt="" width="60%" height="60%" />
										</div>
										<div></div>
									</div></Card.Content
								>
							</Card.Root>
						</div>
						<div>
							<Card.Root style="height:100%;width:100%">
								<Card.Content class="flex justify-center" style="height:100%">
									<div style="width: 100%;" class="m-5">
										<div class="chart-container w-100 max-w-96 my-1 text-xl">
											<div>ธนาคาร : {item.bank}</div>
											<div>ชื่อผู้โอน : {item.senderAccountName}</div>
											<div>เลขบีญชีผู้โอน : {item.senderAccountNumber}</div>
											<div>ชื่อผู้รับ :{item.receiverAccountName}</div>
											<div>เลขบีญชีผู้รับ : {item.receiverAccountNumber}</div>
											<div>วันที่ทำการ :{item.date}</div>
											<div>จำนวนยอด :{item.amount}</div>
										</div>
										<div></div>
									</div></Card.Content
								>
							</Card.Root>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>
