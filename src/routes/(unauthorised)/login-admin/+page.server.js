import { cookiesConfig } from '$lib/cookies';
import { API_ENDPOINT } from '$env/static/private';
/** @type {import('./$types').Actions} */
export const actions = {

	signInAdmin: async ({ request,cookies}) => {
		const { username, password } = Object.fromEntries(await request.formData());

		console.log("username : ",username," password :",password)
        let config = {
			method: 'POST', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({
                username: username, // ใช้ชื่อจากข้อมูลฟอร์ม
                password: password
            })
		};
		var result = await fetch(`${API_ENDPOINT}/merchant/loginadmin`, config);
		const data = await result.json();
        console.log(data)
		if(data.message !='Non Admin'){
			cookies.set('admin_account', JSON.stringify(data.result[1]), cookiesConfig);
		}
		
        return data
		
	},
    

};
