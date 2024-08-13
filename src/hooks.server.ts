// import { CookiesJsonParser } from '$lib/cookies';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ resolve, event }) => {
	console.log('server hook');
	const adminPaths = [
		'/admin/admin-list',
		'/admin/admin-dashboard',
		'/admin/admin-manage-package',
		'/admin/admin-log',
		'/admin/admin-update'
	];
	const isAdminPath = adminPaths.some((path) => event.url.pathname.startsWith(path));

	console.log('isAdminPath', isAdminPath);

	try {
		console.log(event.url.pathname);
		if (event.url.pathname == '/') {
			const token = event.cookies.get('merchant_account') || '';
			const update = event.cookies.get('Status') || '';
			if (token && !update) {
				redirect(302, '/dashboard');
			}
		}
		if (
			event.url.pathname !== '/' &&
			!isAdminPath &&
			event.url.pathname !== '/login-admin' &&
			!event.url.pathname.includes('profile')
		) {
			const token = event.cookies.get('merchant_account') || '';
			// If no token is found, redirect to the login page
			if (!token) {
				return redirect(302, '/');
			}
		}
		if (isAdminPath) {
			const token = event.cookies.get('admin_account') || '';
			// const paths = event.url.pathname
			// const path = `/${paths}`;
			// If no token is found, redirect to the login page
			if (!token) {
				return redirect(302, '/login-admin');
			}
		}

		return await resolve(event);
	} catch (error) {
		console.log(error);
		// /** @type {Error} err */
		// let err = error;
		// if (err.message === 'Cookie not found') {
		// 	// @ts-ignore
		// 	event.locals.account_token = null;
		// 	return await resolve(event);
		// }
		throw error;
	}
};
