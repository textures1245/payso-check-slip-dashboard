
/** @type {import('./$types').Actions} */
export const actions = {

	GetProfile: async ({ request}) => {
		const { email} = Object.fromEntries(await request.formData());
		console.log("email : ",email)
		console.log('checking register');
		// Append key-value pairs to the FormData object
		

        // const data = {
        //     MerchantName: name,  // Use the name from the form data
        //     MerchantRole: 'ACTIVE',  // Replace 'your_merchant_role_here' with the actual value
        //     Status: 'NOT_PAYSO',  // Assuming status is 'true'
        //     Email: email  // Use the email from the form data
        // };
        // const jsonString = JSON.stringify(data);

		console.log('email:', email);
		let config = {
			method: 'POST', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({
                // MerchantId: '', // ใช้ชื่อจากข้อมูลฟอร์ม
                Email: email
            })
		};
		var result = await fetch(`http://127.0.0.1:4567/api/v1/profile`, config);
		const data = await result.json();
		console.log(data);
         return {
                data
            }
	},


};
