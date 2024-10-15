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
	ReceiptStat,
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

	const date15DaysAgo = new Date();
	date15DaysAgo.setDate(date15DaysAgo.getDate() - 15);

	const dateSixMonthsAgo = new Date();
	dateSixMonthsAgo.setMonth(dateSixMonthsAgo.getMonth() - 6)

	const defaultOpt = {
		// GetTransactionDailyCount
		quotaAndMerchantUsagePkgSelect: 1,

		dailyTrans: {
			startDate: date15DaysAgo.toISOString().split('T')[0],
			endDate: new Date().toISOString().split('T')[0]
		},

		receiptIncome: {
			startDate: dateSixMonthsAgo.toISOString().split('T')[0],
			endDate: new Date().toISOString().split('T')[0]
		},

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
	let receiptIncomeOverview: DataResponse<ReceiptStat[]>;

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
				order_field: 'UpdatedAt'
			},
			p: {
				offset: 1,
				limit: 10
			}
		});
		topMerchantQuotaSpendListReport = await ep.merchant.GetMerchantsDetail({
			ft: {
				order_by: 'DESC',
				order_field: 'PackageChangedAt'
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
				limit: 10
			}
		});
		
		
		pkgUsageRatio = await ep.adminDb.GetPackageUsageRatio();
		transactionDailyCount = await ep.adminDb.GetTransactionDailyCount(
			defaultOpt.dailyTrans.startDate,
			defaultOpt.dailyTrans.endDate
		);
		quotaAndMerchantUsage = await ep.adminDb.GetQuotaAndMerchantUsage(
			defaultOpt.quotaAndMerchantUsagePkgSelect,
			{
				ft: {
					order_field: 'QuotaUsage',
					order_by: 'ASC'
				}
			}
		);
		const pkgs = await ep.package.GetPackages({
			p: {
				offset: 1,
				limit: 100
			}
		});
		formOpt.packages = pkgs.result ?? [];

		monthlyOverview = await ep.adminDb.GetMonthlyOverviewStat(
			defaultOpt.monthCountInterval,
			defaultOpt.year.toString()
		);

		receiptIncomeOverview = await ep.adminDb.GetReceiptStats(
			defaultOpt.receiptIncome.startDate,
			defaultOpt.receiptIncome.endDate,
		)
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
		topMerchantQuotaSpendListReport.status_code != 200 ||
		receiptIncomeOverview.status_code !== 200
	) {
		console.error(`-= ErrorResult given from endpoint =-`);
		console.error(
			'ErrorContext:',
			statData.message,
			recentlyInvalidTransListReport.message,
			merchantListReport.message,
			topMerchantQuotaSpendListReport.message,
			receiptIncomeOverview.message
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
		receiptIncomeOverview: receiptIncomeOverview.result ?? [],
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
			updateQuotaAndMerchantUsage = await ep.adminDb.GetQuotaAndMerchantUsage(+pkgIdSelected, {
				ft: {
					order_field: 'QuotaUsage',
					order_by: 'ASC'
				}
			});
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
			console.error('ErrorContext:', updateQuotaAndMerchantUsage.message);
			return fail(500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		console.log(updateQuotaAndMerchantUsage);

		return {
			updateQuotaAndMerchantUsage: updateQuotaAndMerchantUsage.result ?? [],
			success: true
		};
	},

	updateTransactionDailyCount: async ({ request }) => {
		const { startDate, endDate } = Object.fromEntries(await request.formData()) as {
			startDate: string;
			endDate: string;
		};

		console.log('request ', startDate, endDate);

		let updateTransactionDailyCount: DataResponse<TransactionCountRecord[]>;

		try {
			updateTransactionDailyCount = await ep.adminDb.GetTransactionDailyCount(startDate, endDate);
		} catch (err) {
			const axiosErr = err as AxiosError;
			console.error(`-= Error while trying to send request to endpoint =-`);
			console.error('ErrorStack:', axiosErr);
			return fail(axiosErr.status || 500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		if (updateTransactionDailyCount.status_code != 200) {
			console.error(`-= ErrorResult given from endpoint =-`);
			console.error('ErrorContext:', updateTransactionDailyCount.message);
			return fail(500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		return {
			updateTransactionDailyCount: updateTransactionDailyCount.result ?? [],
			success: true
		};
	},

	updateReceiptIncomeOverview: async ({ request }) => {
		const { startDate, endDate } = Object.fromEntries(await request.formData()) as {
			startDate: string;
			endDate: string;
		};

		console.log('request ', startDate, endDate);

		let updateReceiptIncomeOverview: DataResponse<ReceiptStat[]>;

		try {
			updateReceiptIncomeOverview = await ep.adminDb.GetReceiptStats(startDate, endDate);
		} catch (err) {
			const axiosErr = err as AxiosError;
			console.error(`-= Error while trying to send request to endpoint =-`);
			console.error('ErrorStack:', axiosErr);
			return fail(axiosErr.status || 500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		if (updateReceiptIncomeOverview.status_code != 200) {
			console.error(`-= ErrorResult given from endpoint =-`);
			console.error('ErrorContext:', updateReceiptIncomeOverview.message);
			return fail(500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		return {
			updateReceiptIncomeOverview: updateReceiptIncomeOverview.result ?? [],
			success: true
		};
	},

	updateMonthlyOverview: async ({ request }) => {
		const { monthInterval, year } = Object.fromEntries(await request.formData()) as {
			filterSelected: string;
			monthInterval: string;
			year: string;
		};

		console.log('request', monthInterval, year);

		let updateMonthlyOverview: DataResponse<MerchantTransactionMonthly[]>;

		if (
			isNaN(Number(monthInterval)) &&
			!Number.isInteger(Number(monthInterval) && +monthInterval < 0)
		) {
			console.error(
				`-= Error while trying to parse minFreq =- \n  expected non-negative integer number but got ${monthInterval}`
			);
			return fail(401, {
				message:
					'เกิดข้อผิดพลาดระหว่างการส่งข้อมูลจากหน้าบ้าน ไม่สามารถดึงรายการข้อมูลได้ โปรดลองอีกครั้ง '
			});
		}

		try {
			updateMonthlyOverview = await ep.adminDb.GetMonthlyOverviewStat(+monthInterval, year);
		} catch (err) {
			const axiosErr = err as AxiosError;
			console.error(`-= Error while trying to send request to endpoint =-`);
			console.error('ErrorStack:', axiosErr);
			return fail(axiosErr.status || 500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		if (updateMonthlyOverview.status_code != 200) {
			console.error(`-= ErrorResult given from endpoint =-`);
			console.error('ErrorContext:', updateMonthlyOverview.status_code);
			return fail(500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		console.log(updateMonthlyOverview);

		return {
			updateMonthlyOverview: updateMonthlyOverview.result ?? [],
			success: true
		};
	},
	updateTransactionList: async ({ request }) => {
		// ดึงข้อมูลจากฟอร์ม
		const { status, sortOrder } = Object.fromEntries(await request.formData()) as {
			status: string;
			sortOrder: string;
		};

		console.log('Request parameters:', { status, sortOrder });

		let transactionList: DataResponse<Transaction[]>;

		const transactionAPI = new TransactionExternalAPI(); // Initialize your API class

		try {
			// เรียกใช้ GetTransactions พร้อมกับสถานะและการเรียงลำดับ
			transactionList = await transactionAPI.GetTransactions(
				{
					ft: {
						order_by: sortOrder,
						order_field: 'VerifiedDate'
					},
					p: {
						offset: 1, 
						limit: 10 
					}
				},
				status // ตัวกรองสถานะ
			);
		} catch (err) {
			const axiosErr = err as AxiosError;
			console.error(`-= Error while trying to send request to endpoint =-`);
			console.error('ErrorStack:', axiosErr);
			return fail(axiosErr.status || 500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		// ตรวจสอบว่าคำขอสำเร็จหรือไม่
		if (transactionList.status_code !== 200) {
			console.error(`-= ErrorResult given from endpoint =-`);
			return fail(500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		// ส่งข้อมูลรายการธุรกรรมไปยัง frontend
		return {
			transactionList: transactionList.result ?? [],
			success: true
		};
	},
	updatetopMerchantQuotaSpendListReport: async ({ request }) => {
		// ดึงข้อมูลจากฟอร์ม
		const { merChantIdorName, merChantRole,sortOrder } = Object.fromEntries(await request.formData()) as {
			merChantIdorName: string;
			merChantRole : string;
			sortOrder: string;
		};

		console.log('Request parameters:', { merChantIdorName,merChantRole, sortOrder });

		let merchantListReport: DataResponse<MerchantPKG[]>;

		const merchantAPI = new MerchantExternalAPI() // Initialize your API class

		try {
			// เรียกใช้ GetTransactions พร้อมกับสถานะและการเรียงลำดับ
			merchantListReport = await merchantAPI.GetMerchantsDetail(
				{
					ft: {
						order_by: sortOrder,
						order_field: 'UpdatedAt'
					},
					p: {
						offset: 1, 
						limit: 10 
					}
				},
				merChantIdorName, merChantRole// ตัวกรองสถานะ
			);
		} catch (err) {
			const axiosErr = err as AxiosError;
			console.error(`-= Error while trying to send request to endpoint =-`);
			console.error('ErrorStack:', axiosErr);
			return fail(axiosErr.status || 500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		// ตรวจสอบว่าคำขอสำเร็จหรือไม่
		if (merchantListReport.status_code !== 200) {
			console.error(`-= ErrorResult given from endpoint =-`);
			return fail(500, {
				message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ ไม่สามารถดึงรายการได้ โปรดลองอีกครั้ง'
			});
		}

		// ส่งข้อมูลรายการธุรกรรมไปยัง frontend
		return {
			MerchantQuotaSpendListReport: merchantListReport.result ?? [],
			success: true
		};
	},


};
