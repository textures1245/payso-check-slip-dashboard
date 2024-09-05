// +page.server.ts
export type UserData = {
    Id: string;
    MerchantId: string;
    MerchantName: string;
    PackageName: string;
    QuotaUsage: string;
    QuotaLimit: string;
    PackageId: string;
    BalanceQuotaLeft : string ;
    Status: string;
    MerchantRole :string;
    Email : string;
    BillDate : string;
    QuotaSpending : string;
    index : number;

   
}; 


export type PackageData = {
    Id : number;    
	Name : string;      
	Price : number;     
	QuotaLimit : number;  
	Status : string;    
}




