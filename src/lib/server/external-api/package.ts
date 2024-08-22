import { getQueryFilterParams, type DataResponse, type QueryOpt } from '$lib/utils/types';
import { API_ENDPOINT } from '$env/static/private';
import axios, { type AxiosRequestConfig } from 'axios';
import type { Package } from '$lib/utils/external-api-type/package';

interface PackageController {
	GetPackages: (qOpt: QueryOpt) => Promise<DataResponse<Package[]>>;
}

export class PackageExternalAPI implements PackageController {
	private endpoint = API_ENDPOINT;

	constructor(endpoint?: string) {
		if (endpoint) {
			this.endpoint = endpoint;
		}
		if (this.endpoint.endsWith('/')) {
			this.endpoint = this.endpoint.slice(0, -1);
		}
	}
    GetPackages = async (qOpt: QueryOpt): Promise<DataResponse<Package[]>> => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `${this.endpoint}/package/getpackage${getQueryFilterParams(qOpt)}`,
            headers: {
                'Access-Control-Allow-Origin': this.endpoint
            }
        };
        return axios(config).then((response) => {
            return response.data;
        });
    }
	
}
