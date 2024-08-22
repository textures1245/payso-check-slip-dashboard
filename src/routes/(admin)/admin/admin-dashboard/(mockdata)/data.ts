export type MerchantQuotaSpendDetail = {
	MerchantId: number;
	MerchantName: string;
	PackageId: number;
	PackageName: string;
	QuotaSpending: string;
	MerchantRole: string;
};

export type MerchantTransactionDetail = {
	TransactionId: number;
	MerchantId: number;
	MerchantName: string;
	Status: string;
	StatusCode: number;
	CreatedAt: string;
	VerifiedDate: string;
	LineUserId: string;
	QrCode: string;
	TransferRefId: string;
};

export type MerchantReport = {
	MerchantId: number;
	MerchantName: string;
	MerchantEmail: string;
	PackageName: string;
	RegisterDate: string;
};

export const invalidTransReport: MerchantTransactionDetail[] = [
	{
		TransactionId: 1,
		MerchantId: 1,
		MerchantName: 'MerchantQuotaSpendDetail A',
		Status: 'Success',
		CreatedAt: '2022-01-01',
		VerifiedDate: '2022-01-02',
		LineUserId: '123456',
		QrCode: '123456',
		TransferRefId: '123456',
		StatusCode: 200
	},
	{
		TransactionId: 1,
		MerchantId: 1,
		MerchantName: 'Merchant A',
		Status: 'Success',
		CreatedAt: '2022-01-01',
		VerifiedDate: '2022-01-02',
		LineUserId: '123456',
		QrCode: '123456',
		TransferRefId: '123456',
		StatusCode: 0
	},
	{
		TransactionId: 1,
		MerchantId: 1,
		MerchantName: 'Merchant A',
		Status: 'Success',
		CreatedAt: '2022-01-01',
		VerifiedDate: '2022-01-02',
		LineUserId: '123456',
		QrCode: '123456',
		TransferRefId: '123456',
		StatusCode: 0
	},
	{
		TransactionId: 1,
		MerchantId: 1,
		MerchantName: 'Merchant A',
		Status: 'Success',
		CreatedAt: '2022-01-01',
		VerifiedDate: '2022-01-02',
		LineUserId: '123456',
		QrCode: '123456',
		TransferRefId: '123456',
		StatusCode: 0
	}
];

export const transReport: MerchantQuotaSpendDetail[] = [
	{
		MerchantId: 1,
		MerchantName: 'Merchant A',
		QuotaSpending: '100',
		MerchantRole: 'Admin',
		PackageId: 1,
		PackageName: 'Package A'
	},
	{
		MerchantId: 2,
		MerchantName: 'Merchant B',
		QuotaSpending: '200',
		PackageId: 1,
		PackageName: 'Package A',
		MerchantRole: 'Admin'
	},
	{
		MerchantId: 3,
		MerchantName: 'Merchant C',
		QuotaSpending: '300',
		PackageId: 1,
		PackageName: 'Package A',
		MerchantRole: 'Admin'
	},
	{
		MerchantId: 4,
		MerchantName: 'Merchant D',
		QuotaSpending: '400',
		PackageId: 1,
		PackageName: 'Package A',
		MerchantRole: 'Admin'
	}
];

export const transTableList: MerchantTransactionDetail[] = [
	{
		TransactionId: 1,
		MerchantId: 1,
		MerchantName: 'Merchant A',
		Status: 'Success',
		CreatedAt: '2022-01-01',
		VerifiedDate: '2022-01-02',
		LineUserId: '123456',
		QrCode: '123456',
		TransferRefId: '123456',
		StatusCode: 0
	},
	{
		TransactionId: 1,
		MerchantId: 1,
		MerchantName: 'Merchant A',
		Status: 'Success',
		CreatedAt: '2022-01-01',
		VerifiedDate: '2022-01-02',
		LineUserId: '123456',
		QrCode: '123456',
		TransferRefId: '123456',
		StatusCode: 0
	},
	{
		TransactionId: 1,
		MerchantId: 1,
		MerchantName: 'Merchant A',
		Status: 'Success',
		CreatedAt: '2022-01-01',
		VerifiedDate: '2022-01-02',
		LineUserId: '123456',
		QrCode: '123456',
		TransferRefId: '123456',
		StatusCode: 0
	},
	{
		TransactionId: 1,
		MerchantId: 1,
		MerchantName: 'Merchant A',
		Status: 'Success',
		CreatedAt: '2022-01-01',
		VerifiedDate: '2022-01-02',
		LineUserId: '123456',
		QrCode: '123456',
		TransferRefId: '123456',
		StatusCode: 0
	}
];

export const merchantReport: MerchantReport[] = [
	{
		MerchantId: 1,
		MerchantName: 'Merchant A',
		MerchantEmail: 'asdw@test.com',
		PackageName: 'Package A',
		RegisterDate: '2022-01-01'
	},
	{
		MerchantId: 1,
		MerchantName: 'Merchant A',
		MerchantEmail: 'asdw@test.com',
		PackageName: 'Package A',
		RegisterDate: '2022-01-01'
	},
	{
		MerchantId: 1,
		MerchantName: 'Merchant A',
		MerchantEmail: 'asdw@test.com',
		PackageName: 'Package A',
		RegisterDate: '2022-01-01'
	},
	{
		MerchantId: 1,
		MerchantName: 'Merchant A',
		MerchantEmail: 'asdw@test.com',
		PackageName: 'Package A',
		RegisterDate: '2022-01-01'
	}
];
