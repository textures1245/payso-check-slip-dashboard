export type Pagination = {
	offset: number;
	limit: number;
};

type RangeField =
	| 'Id'
	| 'CreatedAt'
	| 'UpdatedAt'
	// Transaction
	| 'VerifiedDate'
	// Merchant
	| 'QuotaSpending'
	| 'RegisterDate'
	| 'BillDate'
	// Log
	| 'Timestamp';

type OrderField =
	| 'Id'
	| 'CreatedAt'
	| 'UpdatedAt'
	| 'VerifiedDate'
	| 'QuotaSpending'
	| 'RegisterDate'
	| 'QuotaUsage'
	| 'BillDate'
	| 'PackageChangedAt';
	

export type Filter = {
	order_by: 'DESC' | 'ASC';
	order_field: OrderField;
	range?: {
		range_field: RangeField;
		start_date: string;
		end_date: string;
	};
};

export type QueryOpt = {
	p?: Pagination;
	ft?: Filter;
};

export type DataResponse<T = string> = {
	status: string;
	status_code: number;
	result: T;
	message: string;
};

export function getQueryFilterParams(q?: QueryOpt, prefix?: boolean): string {
	let query = '';
	if (q) {
		if (q.p) {
			query += `&offset=${q.p.offset}&limit=${q.p.limit}`;
		}
		if (q.ft) {
			query += `&order_by=${q.ft.order_by}&order_field=${q.ft.order_field}`;
			if (q.ft.range) {
				query += `&range_field=${q.ft.range.range_field}&start_date=${q.ft.range.start_date}&end_Date=${q.ft.range.end_date}`;
			}
		}
	}

	prefix = prefix === undefined ? true : prefix;

	if (query.length > 0 && prefix) {
		query = '?' + query.substring(1);
	}
	return query;
}
