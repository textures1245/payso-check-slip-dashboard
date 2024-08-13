// +page.server.ts
export type UserData = {
    Id: number;
    MerchantId: string;
    MerchantName: string;
    PackageName: string;
    QuotaUsage: number;
    QuotaLimit: number;
    PackageId: number;
    BalanceQuotaLeft : number ;
    Status: string;

   
};

