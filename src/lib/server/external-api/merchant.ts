import { getQueryFilterParams, type DataResponse, type QueryOpt } from '$lib/utils/types';
import { API_ENDPOINT } from '$env/static/private';
import axios, { type AxiosRequestConfig } from 'axios';
import type { MerchantPKG } from '$lib/utils/external-api-type/merchant';

interface MerchantController {
	GetMerchantsDetail: (qOpt?: QueryOpt) => Promise<DataResponse<MerchantPKG[]>>;
}

export class MerchantExternalAPI implements MerchantController {
	private endpoint = API_ENDPOINT;

	constructor(endpoint?: string) {
		if (endpoint) {
			this.endpoint = endpoint;
		}
		if (this.endpoint.endsWith('/')) {
			this.endpoint = this.endpoint.slice(0, -1);
		}
	}
	GetMerchantsDetail = async (qOpt?: QueryOpt,merChantIdorName? : string,merChantRole? : string): Promise<DataResponse<MerchantPKG[]>> => {
		const config: AxiosRequestConfig = {
			method: 'GET',
			url: `${this.endpoint}/merchant/get-merchants-with-pkg?${merChantIdorName ? `searchMerchant=${merChantIdorName}&` : ''}${merChantRole ? `merchantRole=${merChantRole}&` : ''}${getQueryFilterParams(qOpt,false)}`,
			headers: {
				'Access-Control-Allow-Origin': this.endpoint
			}
		};
		return axios(config).then((response) => {
			return response.data;
		});
	};
}
