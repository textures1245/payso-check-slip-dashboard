type PkgStat = {
	Total: number;
	ActiveTotal: number;
	InActiveTotal: number;
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
};

export type TransactionCountRecord = {
    RecordCount: number;
    Date: string;
};