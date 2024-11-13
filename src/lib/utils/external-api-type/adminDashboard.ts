
type PkgStat = {
	Total: number;
	ActiveTotal: number;
	InActiveTotal: number;
	VisibilityOnTotal : number;
};

type MerchantStat = {
	Total: number;
	PaysoTotal: number;
	NonPaysoTotal: number;
	ActiveTotal: number;
	InActiveTotal: number;
};

type TStat = {
	Total: number;
	ValidTotal: number;
	InvalidTotal: number;
	PendingTotal: number;
};

export type MerchantOverviewStat = {
	RegisterTotal: number;
	Year: string;
	Month: string;
};

export type TransactionOverviewStat = {
	TotalCount: number;
	ValidCount: number;
	InvalidCount: number;
	PendingCount: number;
	BANK_ACC_NOT_MATCHCount: number;
	REQUEST_REJECTEDCount : number;
	RESPOND_REJECTEDCount : number;
	REQUEST_REJECTED_TRANSECTION_COUNT : number;
	INVALID_MIN_AMOUNT_RECEIVECount : number;
	Year: string;
	Month: string;
};

export type MerchantTransactionMonthly = {
	Merchant: MerchantOverviewStat;
	Transaction: TransactionOverviewStat;
	Month: string;
	Year: string;
};

export type AdminDBStats = {
	PackageStat: PkgStat;
	MerchantStat: MerchantStat;
	TransactionStat: TStat;
};

export type QuotaAndMerchantUsage = {
	MerchantId: number;
	MerchantRole: string;
	MerchantName: string;
	QuotaUsage: number;
	QuotaSpending: number;
	PackageId: number;
	PackageName: string;
	PackagePrice: string;
	PackageQuotaLimit: number;
};

export type PackageUsage = {
	PackageName: string;
	UsedRatio: number;
	CountUsed: number;
	OrderAmount: number;	
};

export type TransactionCountRecord = {
	RecordCount: number;
	Date: string;
};

export type ReceiptStat = {
    TotalCount: number;
    TotalAmountFromPackage: number;
    Month: string;
    Year: string;
};

