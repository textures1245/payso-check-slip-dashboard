// import { CookiesJsonParser } from '$lib/cookies';
import {  redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ resolve, event }) => {
    console.log('server hook')
    const adminPaths = ['/admin', '/admin-dashboard', '/admin-log','/admin-update'];
    const isAdminPath = adminPaths.some(path => event.url.pathname.startsWith(path));
	try {
        console.log(event.url.pathname )
		if(event.url.pathname.includes('login') && !isAdminPath || event.url.pathname == '/'){
            const token = event.cookies.get('merchant_account') || ''
            if(token){
                redirect(302,"/dashboard")
            }
        }
        if (event.url.pathname !== '/' && !isAdminPath ) {
            const token = event.cookies.get('merchant_account') || '';
            
            // If no token is found, redirect to the login page
            if (!token) {
                return redirect(302, '/');
            }
        }
        // if (isAdminPath) {
        //     const token = event.cookies.get('merchant_account') || '';
        //     // const paths = event.url.pathname
        //     // const path = `/${paths}`;
        //     // If no token is found, redirect to the login page
        //     if (token || !token) {
        //         return redirect(302, '/');
        //     }
        // }
        
            return await resolve(event);
	} catch (error) {
        console.log(error)
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
