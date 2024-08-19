import { getQueryFilterParams, type DataResponse, type QueryOpt } from '$lib/utils/types';
import { API_ENDPOINT } from '$env/static/private';
import axios, { type AxiosRequestConfig } from 'axios';
import type {
	AdminDBStats,
	PackageUsage,
	QuotaAndMerchantUsage,
	TransactionCountRecord
} from '$lib/utils/external-api-type/adminDashboard';

interface AdminDBController {
	GetStats: () => Promise<DataResponse<AdminDBStats>>;
	GetPackageUsageRatio: () => Promise<DataResponse<PackageUsage[]>>;
	GetTransactionDailyCount: (
		dateCountInterval: number
	) => Promise<DataResponse<TransactionCountRecord[]>>;
	GetQuotaAndMerchantUsage: (
		pkgId: number,
		qOpt?: QueryOpt
	) => Promise<DataResponse<QuotaAndMerchantUsage[]>>;
}

export class AdminDBExternalAPI implements AdminDBController {
	private endpoint = API_ENDPOINT;

	constructor(endpoint?: string) {
		if (endpoint) {
			this.endpoint = endpoint;
		}
		if (this.endpoint.endsWith('/')) {
			this.endpoint = this.endpoint.slice(0, -1);
		}
	}
	GetPackageUsageRatio = async (): Promise<DataResponse<PackageUsage[]>> => {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/admin-db/get-packages-usage-ratio`,
			headers: {
				'Access-Control-Allow-Origin': this.endpoint,
				'Content-Type': 'application/json'
			}
		};
		return axios(config).then((response) => {
			return response.data;
		});
	};
	GetTransactionDailyCount = async (
		dateCountInterval: number
	): Promise<DataResponse<TransactionCountRecord[]>> => {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/admin-db/get-transaction-daily-records?date_num_count_interval=${dateCountInterval}`,
			headers: {
				'Access-Control-Allow-Origin': this.endpoint,
				'Content-Type': 'application/json'
			}
		};
		return axios(config).then((response) => {
			return response.data;
		});
	};
	GetQuotaAndMerchantUsage = async (
		pkgId: number,
		qOpt?: QueryOpt
	): Promise<DataResponse<QuotaAndMerchantUsage[]>> => {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/admin-db/get-quota-merchants-comparison?pkg_id=${pkgId}${getQueryFilterParams(qOpt, false)}`,
			headers: {
				'Access-Control-Allow-Origin': this.endpoint,
				'Content-Type': 'application/json'
			}
		};
		return axios(config).then((response) => {
			return response.data;
		});
	};

	GetStats = async (): Promise<DataResponse<AdminDBStats>> => {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/admin-db/get-stats`,
			headers: {
				'Access-Control-Allow-Origin': this.endpoint,
				'Content-Type': 'application/json'
			}
		};
		return axios(config).then((response) => {
			return response.data;
		});
	};
}
