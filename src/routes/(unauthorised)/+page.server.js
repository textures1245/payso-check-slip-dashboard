import { cookiesConfig } from '$lib/cookies';
/** @type {import('./$types').Actions} */
export const actions = {

	signInWithGoogle: async ({ request,cookies}) => {
		const { email, name } = Object.fromEntries(await request.formData());

		console.log("email : ",email," name :",name)
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
                MerchantName: name, // ใช้ชื่อจากข้อมูลฟอร์ม
                MerchantRole: 'ACTIVE', // เปลี่ยน 'your_merchant_role_here' เป็นค่าจริง
                Status: 'NOT_PAYSO', // สมมติว่าสถานะเป็น 'true'
                Email: email
            })
		};
		var result = await fetch(`http://127.0.0.1:4567/api/v1/merchant/login`, config);
		const datalogin = await result.json();
		console.log(datalogin);

		if (datalogin.message == 'Non Merchant') {
            console.log("ใช้งาน แบบ ไม่มี Merchant")
            let config = {
                method: 'POST', //การทำงาน get post update delete
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    MerchantName: name, // ใช้ชื่อจากข้อมูลฟอร์ม
                    MerchantRole: 'NOT_PAYSO', // เปลี่ยน 'your_merchant_role_here' เป็นค่าจริง
                    Status: 'ACTIVE', // สมมติว่าสถานะเป็น 'true'
                    Email: email
                })
            };
            var resultcreate = await fetch(`http://127.0.0.1:4567/api/v1/merchant/create`, config);
            const datacreate = await resultcreate.json();
            cookies.set('merchant_account', JSON.stringify(datacreate.result[1]), cookiesConfig);
            
            console.log(datacreate)
            return {
                data:datacreate.result[0]
            }
		} else {

			cookies.set('merchant_account', JSON.stringify(datalogin.result[1]), cookiesConfig);
            console.log("ใช้งาน มี Merchant")
            return {
                data:datalogin.result[0]
            }
			
		}
	},
    signInWithLine: async ({ request ,cookies}) => {
		const { uid, name } = Object.fromEntries(await request.formData());

		console.log("email : ",uid," name :",name)
		console.log('checking register');
		// Append key-value pairs to the FormData object
		

        // const data = {
        //     MerchantName: name,  // Use the name from the form data
        //     MerchantRole: 'ACTIVE',  // Replace 'your_merchant_role_here' with the actual value
        //     Status: 'NOT_PAYSO',  // Assuming status is 'true'
        //     Email: email  // Use the email from the form data
        // };
        // const jsonString = JSON.stringify(data);

		console.log('email:', uid);
		let config = {
			method: 'POST', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({
                MerchantName: name, // ใช้ชื่อจากข้อมูลฟอร์ม
                MerchantRole: 'ACTIVE', // เปลี่ยน 'your_merchant_role_here' เป็นค่าจริง
                Status: 'NOT_PAYSO', // สมมติว่าสถานะเป็น 'true'
                Email: uid
            })
		};
		var result = await fetch(`http://127.0.0.1:4567/api/v1/merchant/login`, config);
		const datalogin = await result.json();
		console.log(datalogin);

		if (datalogin.message == 'Non Merchant') {
            console.log("ใช้งาน แบบ ไม่มี Merchant")
            let config = {
                method: 'POST', //การทำงาน get post update delete
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    MerchantName: name, // ใช้ชื่อจากข้อมูลฟอร์ม
                    MerchantRole: 'NOT_PAYSO', // เปลี่ยน 'your_merchant_role_here' เป็นค่าจริง
                    Status: 'ACTIVE', // สมมติว่าสถานะเป็น 'true'
                    Email: uid
                })
            };
            var resultcreate = await fetch(`http://127.0.0.1:4567/api/v1/merchant/create`, config);
            const datacreate = await resultcreate.json();
            cookies.set('merchant_account', JSON.stringify(datacreate.result[1]), cookiesConfig);
            console.log(datacreate)
            return {
                data:datacreate.result[0]
            }
		} else {

			cookies.set('merchant_account', JSON.stringify(datalogin.result[1]), cookiesConfig);
            console.log("ใช้งาน มี Merchant")
            return {
                data:datalogin.result[0],
                status:'create'
            }
			
		}

	},
    

};
