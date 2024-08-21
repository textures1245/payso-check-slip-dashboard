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


export type PackageData = {
    Id : number;    
	Name : string;      
	Price : number;     
	QuotaLimit : number;  
	Status : string;    
}




