export type Pagination = {
	offset: number;
	limit: number;
};

export type Filter = {
	order_by: 'DESC' | 'ASC';
	order_field: 'Id' | 'CreatedAt' | 'UpdatedAt' | 'VerifiedDate' | 'QuotaSpending' | 'RegisterDate';
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
		}
	}

	prefix = prefix === undefined ? true : prefix;

	if (query.length > 0 && prefix) {
		query = '?' + query.substring(1);
	}
	return query;
}
