export type Transaction = {
	Id: number;
	MerchantId: number;
	Status: string;
	StatusCode: number;
	QrCode: string;
	TransferRefId: string;
	VerifiedDate?: string;
	CreatedAt: string;
	UpdatedAt: string;
	BankResponded: string;
	LineUserId: string;
	TotalCount: number;
};