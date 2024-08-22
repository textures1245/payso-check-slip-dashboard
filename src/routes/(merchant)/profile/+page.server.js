
/** @type {import('./$types').Actions} */
export const actions = {

	UpdateLine: async ({ request}) => {
		const { uid, id,name } = Object.fromEntries(await request.formData());

		console.log("email : ",uid," name :",id)
		console.log('checking update line');
		// Append key-value pairs to the FormData object
        let config = {
			method: 'POST', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json',
					'Actor-Id': String(id),
                    'Actor-Name': String(name),
                    'Actor-Role': 'MERCHANT'
            },
			body: JSON.stringify({
                LineUserId: uid, // ใช้ชื่อจากข้อมูลฟอร์ม
                MerchantId: id
            })
		};
		var result = await fetch(`http://127.0.0.1:4567/api/v1/merchant/updateUid`, config);
		const data = await result.json();
		if(data.message.includes("mssql: Violation of UNIQUE KEY constraint 'CheckslipLineMerchant_LineUserId_key'.")){
			return {
                status:false
            }
		}else{
			return {
                status:true
            }
		}
        

	},
    
};
