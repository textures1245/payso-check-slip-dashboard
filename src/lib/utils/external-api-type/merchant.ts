export type MerchantPKG = {
	Id: number;
	MerchantId: number;
	MerchantName: string;
	QuotaUsage: number;
	MerchantRole: string;
	RegisterDate: string;
	Status: string;
	UpdatedAt: string;
	Email: string;
	BillDate: string;
	BalanceQuotaLeft: number;
	QuotaSpending: number;
	PackageId?: number;
	PackageName: string;
	QuotaLimit?: number;
	TotalCount: number;
	PackageChangedAt : string;
};
