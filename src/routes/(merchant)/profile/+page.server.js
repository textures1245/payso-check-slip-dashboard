
/** @type {import('./$types').Actions} */
export const actions = {

	UpdateLine: async ({ request}) => {
		const { uid, id } = Object.fromEntries(await request.formData());

		console.log("email : ",uid," name :",id)
		console.log('checking update line');
		// Append key-value pairs to the FormData object
        let config = {
			method: 'POST', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({
                LineUserId: uid, // ใช้ชื่อจากข้อมูลฟอร์ม
                MerchantId: id
            })
		};
		var result = await fetch(`http://127.0.0.1:4567/api/v1/updateUid`, config);
        console.log(result)

	},
    
};
