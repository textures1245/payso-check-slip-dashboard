export type Transaction = {
	Id: number;
	MerchantId: number;
	MerchantName : string;
	Status: string;
	StatusCode: number;
	QrCode: string;
	TransferRefId: string;
	VerifiedDate?: string;
	CreatedAt: string;
	UpdatedAt: string;
	LineUserId: string;
	TotalCount: number;
	BankRespondedId?: number;
};