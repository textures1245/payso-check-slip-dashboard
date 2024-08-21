import type { Actions, PageServerLoad } from './$types';
import type { DataResponse } from '../../../../lib/utils/types';
import type { MerchantTransactionDetail } from './(mockdata)/data';
import { AdminDBExternalAPI } from '$lib/server/external-api/adminDashboard';
import { MerchantExternalAPI } from '$lib/server/external-api/merchant';
import { TransactionExternalAPI } from '$lib/server/external-api/transaction';
import type { AxiosError } from 'axios';
import { fail } from '@sveltejs/kit';
import type { MerchantPKG } from '$lib/utils/external-api-type/merchant';
import type {
	AdminDBStats,
	MerchantTransactionMonthly,
	PackageUsage,
	QuotaAndMerchantUsage,
	TransactionCountRecord
} from '$lib/utils/external-api-type/adminDashboard';
import type { Transaction } from '$lib/utils/external-api-type/transaction';
import type { Package } from '$lib/utils/external-api-type/package';
import { PackageExternalAPI } from '$lib/server/external-api/package';

const ep = {
	adminDb: new AdminDBExternalAPI(),
	merchant: new MerchantExternalAPI(),
	transaction: new TransactionExternalAPI(),
	package: new PackageExternalAPI()
};

export const load: PageServerLoad = async () => {
	console.log('=- load admin-db data -=');

	const defaultOpt = {
		// GetTransactionDailyCount
		quotaAndMerchantUsagePkgSelect: 1,
		dateCountInterval: 15,

		// GetMonthlyOverviewStat
		monthCountInterval: 6,
		year: new Date().toISOString().split('T')[0]
	};
	const formOpt = {
		packages: [] as unknown as Package[]
	};

	let statData: DataResponse<AdminDBStats>;
	let recentlyInvalidTransListReport: DataResponse<MerchantTransactionDetail[]>;
	let merchantListReport: DataResponse<MerchantPKG[]>;
	let topMerchantQuotaSpendListReport: DataResponse<MerchantPKG[]>;
	let recentlyTransactionListReport: DataResponse<Transaction[]>;
	let pkgUsageRatio: DataResponse<PackageUsage[]>;
	let transactionDailyCount: DataResponse<TransactionCountRecord[]>;
	let quotaAndMerchantUsage: DataResponse<QuotaAndMerchantUsage[]>;
	let monthlyOverview: DataResponse<MerchantTransactionMonthly[]>;

	try {
		statData = await ep.adminDb.GetStats();
		recentlyInvalidTransListReport = await ep.transaction.GetInvalidTransaction({
			ft: {
				order_by: 'DESC',
				order_field: 'VerifiedDate'
			},
			p: {
				offset: 1,
				limit: 5
			}
		});
		merchantListReport = await ep.merchant.GetMerchantsDetail({
			ft: {
				order_by: 'DESC',
				order_field: 'RegisterDate'
			},
			p: {
				offset: 1,
				limit: 10
			}
		});
		topMerchantQuotaSpendListReport = await ep.merchant.GetMerchantsDetail({
			ft: {
				order_by: 'DESC',
				order_field: 'QuotaSpending'
			},
			p: {
				offset: 1,
				limit: 4
			}
		});
		recentlyTransactionListReport = await ep.transaction.GetTransactions({
			ft: {
				order_by: 'DESC',
				order_field: 'VerifiedDate'
			},
			p: {
				offset: 1,
				limit: 12
			}
		});
		pkgUsageRatio = await ep.adminDb.GetPackageUsageRatio();
		transactionDailyCount = await ep.adminDb.GetTransactionDailyCount(defaultOpt.dateCountInterval);
		quotaAndMerchantUsage = await ep.adminDb.GetQuotaAndMerchantUsage(
			defaultOpt.quotaAndMerchantUsagePkgSelect
		);
		const pkgs = await ep.package.GetPackages({
			p: {
				offset: 0,
				limit: 100
			}
		});
		formOpt.packages = pkgs.result ?? [];

		monthlyOverview = await ep.adminDb.GetMonthlyOverviewStat(
			defaultOpt.monthCountInterval,
			defaultOpt.year.toString()
		);
	} catch (err) {
		const axiosErr = err as AxiosError;
		console.error(`-= Error while trying to send request to endpoint =-`);
		console.error('ErrorStack:', axiosErr);
		return fail(axiosErr.status || 500, {
			message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
		});
	}

	if (
		statData.status_code != 200 ||
		recentlyInvalidTransListReport.status_code !== 200 ||
		merchantListReport.status_code != 200 ||
		topMerchantQuotaSpendListReport.status_code != 200
	) {
		console.error(`-= ErrorResult given from endpoint =-`);
		console.error(
			'ErrorContext:',
			statData.status_code,
			recentlyInvalidTransListReport.status_code,
			merchantListReport.status_code,
			topMerchantQuotaSpendListReport.status_code
		);
		return fail(500, {
			message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
		});
	}

	return {
		statData: statData.result,
		recentlyInvalidTransListReport: recentlyInvalidTransListReport.result ?? [],
		merchantListReport: merchantListReport.result ?? [],
		topMerchantQuotaSpendListReport: topMerchantQuotaSpendListReport.result ?? [],
		recentlyTransactionListReport: recentlyTransactionListReport.result ?? [],
		pkgUsageRatio: pkgUsageRatio.result ?? [],
		transactionDailyCount: transactionDailyCount.result ?? [],
		quotaAndMerchantUsage: quotaAndMerchantUsage.result ?? [],
		monthlyOverview: monthlyOverview.result ?? [],
		formOpt,
		defaultOpt
	};
};

export const actions: Actions = {
	updateQuotaAndMerchantUsage: async ({ request }) => {
		const { pkgIdSelected } = Object.fromEntries(await request.formData()) as {
			pkgIdSelected: string;
		};

		console.log('request', pkgIdSelected);

		if (
			isNaN(Number(pkgIdSelected)) &&
			!Number.isInteger(Number(pkgIdSelected) && +pkgIdSelected < 0)
		) {
			console.error(
				`-= Error while trying to parse minFreq =- \n  expected non-negative integer number but got ${pkgIdSelected}`
			);
			return fail(401, {
				message:
					'เกิดข้อผิดพลาดระหว่างการส่งข้อมูลจากหน้าบ้าน ไม่สามารถดึงรายการข้อมูลได้ โปรดลองอีกครั้ง '
			});
		}

		let updateQuotaAndMerchantUsage: DataResponse<QuotaAndMerchantUsage[]>;

		try {
			updateQuotaAndMerchantUsage = await ep.adminDb.GetQuotaAndMerchantUsage(+pkgIdSelected);
		} catch (err) {
			const axiosErr = err as AxiosError;
			console.error(`-= Error while trying to send request to endpoint =-`);
			console.error('ErrorStack:', axiosErr);
			return fail(axiosErr.status || 500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		if (updateQuotaAndMerchantUsage.status_code != 200) {
			console.error(`-= ErrorResult given from endpoint =-`);
			console.error('ErrorContext:', updateQuotaAndMerchantUsage.status_code);
			return fail(500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		console.log(updateQuotaAndMerchantUsage);

		return {
			updateQuotaAndMerchantUsage: updateQuotaAndMerchantUsage.result ?? [],
			success: true
		};
	}
};
