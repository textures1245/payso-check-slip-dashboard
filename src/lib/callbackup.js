// @ts-nocheck

document.addEventListener('DOMContentLoaded', async () => {
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
					redirect_uri: 'http://localhost:5173/profile',
					client_id: '2006015671',
					client_secret: '14ad9236387e9250c4ae32c12219ab02'
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
			localStorage.setItem('profile Data ', JSON.stringify(profileData));
			sessionStorage.setItem('profile Data', JSON.stringify(profileData));
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			if (returnedState == '1010-1010') {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				document.getElementById('emailInputline').value = profileData.userId;
				// @ts-ignore
				document.getElementById('nameInputline').value = profileData.displayName;
				console.log(profileData);
				// @ts-ignore
				document.getElementById('mylineForm').submit();
			}else{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
                
				document.getElementById('inputuid').value = profileData.userId;
                document.getElementById('inputid').value = returnedState;
				// @ts-ignore
				document.getElementById('updateline').submit();
            }

			// profileData.userId = document.getElementById('uid').value;
			// profileData.displayName = document.getElementById('name').value;
			//  console.log(document.getElementById('uid') , document.getElementById('name'))
		} catch (error) {
			console.log(error);
		}
	}
});
