export type Package = {
	Id: number;
	Name: string;
	Price: number;
	QuotaLimit: number;
	CreatedAt: string;
	UpdatedAt: string;
	Status: string;

	// utils
	TotalCount: number;
};
