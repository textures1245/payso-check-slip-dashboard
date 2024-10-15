import { getQueryFilterParams, type DataResponse, type QueryOpt } from '$lib/utils/types';
import { API_ENDPOINT } from '$env/static/private';
import axios, { type AxiosRequestConfig } from 'axios';
import type { MerchantTransactionDetail } from '../../../routes/(admin)/admin/admin-dashboard/(mockdata)/data';
import type { Transaction } from '$lib/utils/external-api-type/transaction';

interface TransactionController {
	GetInvalidTransaction: (qOpt?: QueryOpt) => Promise<DataResponse<MerchantTransactionDetail[]>>;
	GetTransactions: (qOpt?: QueryOpt) => Promise<DataResponse<Transaction[]>>;
}

export class TransactionExternalAPI implements TransactionController {
	private endpoint = API_ENDPOINT;

	constructor(endpoint?: string) {
		if (endpoint) {
			this.endpoint = endpoint;
		}
		if (this.endpoint.endsWith('/')) {
			this.endpoint = this.endpoint.slice(0, -1);
		}
	}
	GetTransactions = async (qOpt?: QueryOpt,status?: string): Promise<DataResponse<Transaction[]>> => {

		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/transaction/get-all?${status ? `status=${status}` : ''}${getQueryFilterParams(qOpt,false)}`,
			headers: {
				'Access-Control-Allow-Origin': this.endpoint
			}
		};
		return axios(config).then((response) => {
			console.log(response.data)
			return response.data;
		});
	};

	GetInvalidTransaction = async (
		qOpt?: QueryOpt
	): Promise<DataResponse<MerchantTransactionDetail[]>> => {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/transaction/get-invalid${getQueryFilterParams(qOpt)}`,
			headers: {
				'Access-Control-Allow-Origin': this.endpoint
			}
		};
		return axios(config).then((response) => {
			return response.data;
		});
	};
}
