
import { API_ENDPOINT } from '$env/static/private';
/** @type {import('./$types').Actions} */
export const actions = {

	UpdateLine: async ({ request}) => {

		const formData = await request.formData();
            
		// รับข้อมูล uid, name, และ id
		// formData.getAll() จะได้รับค่าทั้งหมดที่มีชื่อเดียวกันเป็น array
		const uids = formData.getAll('uid');
		const names = formData.getAll('name');
		const id = formData.get('id'); // รับค่า id ที่ไม่มี array

		console.log('UIDs:', uids);
		console.log('Names:', names);
		console.log('ID:', id);
		// const { uid, id,name } = Object.fromEntries(await request.formData());

		console.log("email : ",uids," name :",id , names)
		console.log('checking update line');
        let config = {
			method: 'POST', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json',
					'Actor-Id': id,
                    'Actor-Name': names[0] || '',
                    'Actor-Role': 'MERCHANT'
            },
			body: JSON.stringify({
                LineUserId: uids, // ใช้ชื่อจากข้อมูลฟอร์ม
				UserName:names,
                MerchantId: id
            })
		};
		// @ts-ignore
		var result = await fetch(`${API_ENDPOINT}/merchant/updateUid`, config);
		const data = await result.json();
		console.log(data)
		if(data.message && data.message.includes("mssql: Violation of UNIQUE KEY constraint 'CheckslipLineMerchant_LineUserId_key'.")){
			const errorMsg = data.message;
			const userNameMatch = errorMsg.match(/UserName:\s*(.*?)$/);
			const userName = userNameMatch ? userNameMatch[1] : null;
			return {
                status:false,
				userName:userName
            }
		}else{
			return {
                status:true
            }
		}
        

	},
    
};
