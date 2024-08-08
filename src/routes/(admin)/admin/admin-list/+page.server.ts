// +page.server.ts
export type UserData = {
    Id: number;
    MerchantId: string;
    MerchantName: string;
    Name: string;
    QuotaUsage: number;
    PackageId: number;
    Status: string;
   
};

// export async function load() {
//     const response = await fetch(`http://127.0.0.1:4567/api/v1/getmerchant?offset=0&limit=5`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch data');
//     }
//     const data = await response.json();
//     console.log('Data fetched from API:', data); 

//     if (!Array.isArray(data.result)) {
//         console.error('Result is not an array', data.result);
//         throw new Error('Result is not an array');
//     }

//     const userData: UserData[] = data.result.map((item: UserData) => ({
//         Id: item.Id,
//         MerchantId: item.MerchantId,
//         MerchantName: item.MerchantName,
//         QuotaUsage: item.QuotaUsage,
//         PackageId: item.PackageId,
//         Status: item.Status,
//     }));

//     console.log("userdata", userData);

//     return { userData };
// }
