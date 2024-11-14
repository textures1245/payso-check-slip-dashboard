
export type RoomMerchantData = {
    Id : number ;
	MerchantId : number ;
	MerchantName :string 
	TotalQuotaUsed : number 
	RegisteredAt :string 
	NotiOnValid :string 
	NotiOnInvalid :string 
	NotiOnInvalidReciverBankAccount :string 
	NotiOnInvalidUnverified :string 
	NotiOnInvalidMinAmount :string 
	NotiOnQuotaLimitExceed :string 
	MinAmountReceive : number
	HideSenderDetail :boolean
	HideReciverDetail :boolean
	TransactionSummary :string 
	RoomName :string 
	PackageName :string 
	Index : number 
	TotalCount : number;   

}