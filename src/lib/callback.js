// @ts-nocheck
import { PUBLIC_DOMAIN } from '$env/static/public';
document.addEventListener('DOMContentLoaded', async () => {
	console.log("login")
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	let returnedState = urlParams.get('state');
	console.log(returnedState);
	if (code) {
		try {
			// @ts-ignore
			const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					grant_type: 'authorization_code',
					code: code,
					redirect_uri: `${PUBLIC_DOMAIN}`,
					// client_id: '2005856083',
					// client_secret: '48a55f999f0d1895eb0bf9bb22b9a564'
					client_id: '2006478813',
					client_secret: '28d4c9a577a54f93c61e88c33c304794'
				})
			});

			const tokenData = await tokenResponse.json();
			console.log('Token data:', tokenData);

			const profileResponse = await fetch('https://api.line.me/v2/profile', {
				headers: {
					Authorization: `Bearer ${tokenData.access_token}`
				}
			});

			const profileData = await profileResponse.json();
			console.log('Profile data:', profileData);

			// Store user profile data in localStorage (or other storage)
			localStorage.setItem('profile Data', JSON.stringify(profileData));
			sessionStorage.setItem('profile Data', JSON.stringify(profileData));
			setCookie('UserLineId', JSON.stringify(profileData), 7);
			
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			if (returnedState == '1010-1010') {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				document.getElementById('emailInputline').value = profileData.userId;
				// @ts-ignore
				document.getElementById('nameInputline').value = profileData.displayName;
				document.getElementById('inputavatar').value = profileData.pictureUrl;
				console.log(profileData);
				// @ts-ignore
				document.getElementById('mylineForm').submit();
			}else{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				
				
            }

			// profileData.userId = document.getElementById('uid').value;
			// profileData.displayName = document.getElementById('name').value;
			//  console.log(document.getElementById('uid') , document.getElementById('name'))
		} catch (error) {
			console.log(error);
		}
	}
});

function setCookie(name, value, days) {
    let d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Lax`;
}