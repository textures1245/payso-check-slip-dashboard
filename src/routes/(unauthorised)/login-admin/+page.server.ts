import { cookiesConfig } from '$lib/cookies';
import { API_ENDPOINT } from '$env/static/private';
import type { Actions } from './$types'; // Adjust the import according to your project structure

export const actions: Actions = {
    signInAdmin: async ({ request, cookies }): Promise<any> => {
        const { username, password } = Object.fromEntries(await request.formData()) as { username: string; password: string };

        console.log("username: ", username, " password: ", password);

        const config: RequestInit = {
            method: 'POST', // การทำงาน get post update delete
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username, // ใช้ชื่อจากข้อมูลฟอร์ม
                password: password
            })
        };

        const result = await fetch(`${API_ENDPOINT}/merchant/loginadmin`, config);
        const data = await result.json();
        console.log(data);

        if (data.message !== 'Non Admin') {
            cookies.set('admin_account', JSON.stringify(data.result[1]), cookiesConfig);
            return data;
        }

        if (data.message === 'Non Admin') {
            return {
                Status: false
            };
        }
    },
};
