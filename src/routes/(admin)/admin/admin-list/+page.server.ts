// +page.server.ts
export type UserData = {
    Id: string;
    MerchantId: string;
    MerchantName: string;
    PackageName: string;
    QuotaUsage: number;
    QuotaLimit: number;
    PackageId: string;
    BalanceQuotaLeft : number ;
    Status: string;
    MerchantRole :string;
    Email : string;
    BillDate : string;
    QuotaSpending : number;
    index : number;

   
}; 


export type PackageData = {
    Id : number;    
	Name : string;      
	Price : number;     
	QuotaLimit : number;  
	Status : string;    
}




