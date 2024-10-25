
import { redirect } from '@sveltejs/kit';
export const handle = async ({ resolve, event }) => {
	console.log('server hook');
	
	const adminPaths = [
		'/admin/admin-list',
		'/admin/admin-dashboard',
		'/admin/admin-manage-package',
		'/admin/admin-log',
		'/admin/admin-update',
		'/admin/admin-manage-package',
		'/admin/admin-report-transection'
	];
	const isAdminPath = adminPaths.some((path) => event.url.pathname.startsWith(path));

	try {
		console.log(event.url.pathname);
		if (event.url.pathname == '/') {
			const token = event.cookies.get('merchant_account') || '';

			if (token) {
				redirect(302, '/dashboard');
			}
		}
		if (event.url.pathname == '/dashboard') {
			const token = event.cookies.get('merchant_account') || '';

			if (token.includes('-/All/-') ||  token.includes('DASHBOARD')) {
				console.log('มีคำว่า -/All/- DASHBOARD อยู่ใน token');
			} else {
				redirect(302, '/package');
			}
		}

		if (event.url.pathname == '/package') {
			const token = event.cookies.get('merchant_account') || '';

			if (token.includes('-/All/-') ||  token.includes('PACKAGE')) {
				console.log('มีคำว่า -/All/- PACKAGE อยู่ใน token');
			} else {
				redirect(302, '/dashboard');
			}
		}
		
		if (
			event.url.pathname !== '/' &&
			!isAdminPath &&
			event.url.pathname !== '/login-admin' &&
			!event.url.pathname.includes('profile')
			&& event.url.pathname !== '/line-login'
		) {
			const token = event.cookies.get('merchant_account') || '';
			// If no token is found, redirect to the login page
			if (!token) {
				return redirect(302, '/');
			}
		}
		if (isAdminPath) {
			const token = event.cookies.get('admin_account') || '';
			const tokenmercahnt = event.cookies.get('merchant_account') || '';
			// const paths = event.url.pathname
			// const path = `/${paths}`;
			// If no token is found, redirect to the login page
			if (!token) {
				if(tokenmercahnt){
					return redirect(302, '/dashboard');
				}else{
					return redirect(302, '/login-admin');
				}
				
			}
		}
		if(event.url.pathname == '/login-admin'){
			const token = event.cookies.get('admin_account') || '';
			if (token ) {
				redirect(302, '/admin/admin-dashboard');
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
