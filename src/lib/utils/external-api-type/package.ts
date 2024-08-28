export type Package = {
	Id: number;
	Name: string;
	Price: number;
	QuotaLimit: number;
	CreatedAt: string;
	UpdatedAt: string;
	Status: string;
	OrderAmount: number;

	// utils
	TotalCount: number;
};
