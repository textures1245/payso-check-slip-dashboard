import { API_ENDPOINT } from '$env/static/private';
import type { Actions } from './$types';

interface UpdateLineResponse {
    status: boolean;
    userName?: string | null;
}

/** @type {Actions} */
export const actions: Actions = {

    UpdateLine: async ({ request }): Promise<UpdateLineResponse> => {
        const formData = await request.formData();

        // รับข้อมูล uid, name, และ id
        const uids = formData.get('uid') as string; // Cast to string
        const names = formData.get('name') as string; // Cast to string
        const id = formData.get('id') as string; // Cast to string
        const avatar = formData.get('avatar') as string; // Cast to string

        console.log('UIDs:', uids);
        console.log('Names:', names);

        // Convert name to Base64
        const toBase64 = (str: string): string => btoa(unescape(encodeURIComponent(str)));
        const namesBase64 = toBase64(names);
        console.log('ID:', id);

        console.log("email:", uids, "name:", id, namesBase64, avatar);
        console.log('checking update line');

        const config: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Actor-Id': id,
                'Actor-Name': atob(namesBase64),
                'Actor-Role': 'MERCHANT'
            },
            body: JSON.stringify({
                LineUserId: uids,
                UserName: namesBase64,
                MerchantId: id,
                AvatarUrl: avatar,
                Roles:"DASHBOARD,PACKAGE,SLIP_CHECKER"
            })
        };

        const result = await fetch(`${API_ENDPOINT}/merchant/updateUid`, config);
        const data = await result.json();

        console.log("Response data:", data);

        if (data.message && data.message.includes("mssql: Violation of UNIQUE KEY constraint 'CheckslipLineMerchant_LineUserId_key'.")) {
            const errorMsg = data.message;
            const userNameMatch = errorMsg.match(/UserName:\s*(.*?)$/);
            const userName = userNameMatch ? userNameMatch[1] : null;

            return {
                status: false,
                userName: userName
            };
        } else {
            return {
                status: true
            };
        }
    },
};
