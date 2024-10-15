import { cookiesConfig } from '$lib/cookies';
import { API_ENDPOINT, API_KEY } from '$env/static/private';

interface Merchant {
    Id: string;
    MerchantId: string;
    MerchantUID: string;
    MerchantName: string;
    QuotaUsage: string;
    MerchantRole: string;
    RegisterDate: string; // Date can be used if desired
    PackageId: string;
    Status: string;
    UpdatedAt: string; // Date can be used if desired
    Email: string;
    BillDate: string; // Date can be used if desired
    BalanceQuotaLeft: string;
    QuotaSpending: string;
}

interface LoginResponse {
    message: string;
    result: Merchant[];  // Adjust based on the expected response
}

interface ActionData {
    data?: Merchant;  // Define the expected data type
    status?: string | boolean;
}

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
    signInWithGoogle: async ({ request, cookies }): Promise<ActionData> => {
        const formData = Object.fromEntries(await request.formData());
        const email = formData.email as string;
        const name = formData.name as string;

        console.log("email : ", email, " name :", name);
        console.log('checking register');

        const config: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                MerchantName: name,
                MerchantRole: 'ACTIVE',
                Status: 'NOT_PAYSO',
                Email: email,
                Type: "Google Facebook"
            })
        };

        try {
            const result = await fetch(`${API_ENDPOINT}/merchant/login`, config);

            const datalogin: LoginResponse = await result.json();
            console.log(datalogin);

            if (datalogin.message === 'Non Merchant') {
                console.log("Creating new Merchant");
                const createConfig: RequestInit = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        MerchantName: name,
                        MerchantRole: 'NOT_PAYSO',
                        Status: 'ACTIVE',
                        Email: email,
                        Type: "Google Facebook"
                    })
                };

                const resultcreate = await fetch(`${API_ENDPOINT}/merchant/create`, createConfig);
                if (!resultcreate.ok) throw new Error('Failed to create merchant');

                const datacreate: LoginResponse = await resultcreate.json();
                cookies.set('merchant_account', JSON.stringify(datacreate.result[1]), cookiesConfig);

                return { data: datacreate.result[0], status: 'create' };
            } else {
                cookies.set('merchant_account', JSON.stringify(datalogin.result[1]), cookiesConfig);
                console.log("Existing Merchant");
                return { data: datalogin.result[0] };
            }
        } catch (error) {
            console.error(error);
            return { status: false };
        }
    },

    signInWithLine: async ({ request, cookies }): Promise<ActionData> => {
        const formData = Object.fromEntries(await request.formData());
        const uid = formData.uid as string;
        const name = formData.name as string;
        const avatar = formData.avatar as string;

        console.log("uid : ", uid, " name :", name, " avatar:", avatar);

        const config: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                MerchantName: name,
                MerchantRole: 'ACTIVE',
                Status: 'NOT_PAYSO',
                Email: uid,
                Type: "Line",
            })
        };

        try {
            const result = await fetch(`${API_ENDPOINT}/merchant/login`, config);

            const datalogin: LoginResponse = await result.json();
            console.log(datalogin);

            if (datalogin.message === 'Non Merchant') {
                console.log("Creating new Merchant");
                const createConfig: RequestInit = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        MerchantName: name,
                        MerchantRole: 'NOT_PAYSO',
                        Status: 'ACTIVE',
                        Email: uid,
                        Type: "Line",
                        AvatarUrl: avatar
                    })
                };

                const resultcreate = await fetch(`${API_ENDPOINT}/merchant/createwithLine`, createConfig);
                if (!resultcreate.ok) throw new Error('Failed to create merchant');

                const datacreate: LoginResponse = await resultcreate.json();
                cookies.set('merchant_account', JSON.stringify(datacreate.result[1]), cookiesConfig);

                return { data: datacreate.result[0], status: 'create' };
            } else {
                cookies.set('merchant_account', JSON.stringify(datalogin.result[1]), cookiesConfig);
                console.log("Existing Merchant");
                return { data: datalogin.result[0] };
            }
        } catch (error) {
            console.error(error);
            return { status: false };
        }
    },

    signInPayso: async ({ request, cookies }): Promise<ActionData> => {
        const formData = Object.fromEntries(await request.formData());
        const username = formData.username as string;
        const password = formData.password as string;

        console.log("username : ", username, " password :", password);
        console.log('checking login');

        const config: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: API_KEY,
            }
        };

        try {
            const result = await fetch(`https://apis.paysolutions.asia/auth/admin/login/?pass=${password}&user=${username}`, config);

            const data = await result.json();

            if (data.message === 'complete') {
                const loginConfig: RequestInit = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        MerchantName: username,
                        MerchantRole: 'ACTIVE',
                        Status: 'PAYSO',
                        Email: username,
                        Type: "PAYSO"
                    })
                };

                const resultLogin = await fetch(`${API_ENDPOINT}/merchant/login`, loginConfig);
                if (!resultLogin.ok) throw new Error('Failed to fetch merchant data');

                const datalogin: LoginResponse = await resultLogin.json();

                if (datalogin.message === 'Non Merchant') {
                    const createConfig: RequestInit = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            MerchantName: username,
                            MerchantRole: 'PAYSO',
                            Status: 'ACTIVE',
                            Email: username,
                            Type: "Payso"
                        })
                    };

                    const resultcreate = await fetch(`${API_ENDPOINT}/merchant/create`, createConfig);
                    if (!resultcreate.ok) throw new Error('Failed to create merchant');

                    const datacreate: LoginResponse = await resultcreate.json();
                    cookies.set('merchant_account', JSON.stringify(datacreate.result[1]), cookiesConfig);

                    return { data: datacreate.result[0], status: 'create' };
                } else {
                    cookies.set('merchant_account', JSON.stringify(datalogin.result[1]), cookiesConfig);
                    return { data: datalogin.result[0] };
                }
            } else {
                return { status: false };
            }
        } catch (error) {
            console.error(error);
            return { status: false };
        }
    }
};
