import { getQueryFilterParams, type DataResponse, type QueryOpt } from '$lib/utils/types';
import { API_ENDPOINT } from '$env/static/private';
import axios, { type AxiosRequestConfig } from 'axios';
import type {
	AdminDBStats,
	MerchantTransactionMonthly,
	PackageUsage,
	QuotaAndMerchantUsage,
	ReceiptStat,
	TransactionCountRecord
} from '$lib/utils/external-api-type/adminDashboard';

interface AdminDBController {
	GetStats: () => Promise<DataResponse<AdminDBStats>>;
	GetPackageUsageRatio: () => Promise<DataResponse<PackageUsage[]>>;
	GetTransactionDailyCount: (
		startDate: string,
		endDate: string
	) => Promise<DataResponse<TransactionCountRecord[]>>;
	GetQuotaAndMerchantUsage: (
		pkgId: number,
		qOpt?: QueryOpt
	) => Promise<DataResponse<QuotaAndMerchantUsage[]>>;
	GetMonthlyOverviewStat: (
		monthCountInterval: number,
		year: string
	) => Promise<DataResponse<MerchantTransactionMonthly[]>>;
	GetReceiptStats: (
		startDate: string,
		endDate: string
	 ) => Promise<DataResponse<ReceiptStat[]>>;
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
	GetReceiptStats = async (startDate: string, endDate: string): Promise<DataResponse<ReceiptStat[]>> => {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/admin-db/get-receipt-stats?start_date=${startDate}&end_date=${endDate}`,
			headers: {
				'Access-Control-Allow-Origin': this.endpoint,
				'Content-Type': 'application/json'
			}
		};
		return axios(config).then((response) => {
			return response.data;
		});
	}
	GetMonthlyOverviewStat = async (
		monthCountInterval: number,
		year: string
	): Promise<DataResponse<MerchantTransactionMonthly[]>> => {
		console.log(monthCountInterval, year);

		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/admin-db/get-monthly-overview?month_count=${monthCountInterval}&year=${year}`,
			headers: {
				'Access-Control-Allow-Origin': this.endpoint,
				'Content-Type': 'application/json'
			}
		};
		return axios(config).then((response) => {
			return response.data;
		});
	};
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
		startDate: string,
		endDate: string
	): Promise<DataResponse<TransactionCountRecord[]>> => {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/admin-db/get-transaction-daily-records?start_date=${startDate}&end_date=${endDate}`,
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
