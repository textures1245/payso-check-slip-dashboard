import { cookiesConfig } from '$lib/cookies';
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
		var result = await fetch(`http://127.0.0.1:4567/api/v1/loginadmin`, config);
		const data = await result.json();
        console.log(data)
		if(data.message !='Non Admin'){
			cookies.set('admin_account', JSON.stringify(data.result[1]), cookiesConfig);
		}
		
        return data
		
	},
    

};
