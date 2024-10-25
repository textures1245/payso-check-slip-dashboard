// @ts-nocheck
import { PUBLIC_DOMAIN } from '$env/static/public';
document.addEventListener('DOMContentLoaded', async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	let returnedState = urlParams.get('state');
    
	console.log(returnedState);
	if (code) {
		try {
			
			const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					grant_type: 'authorization_code',
					code: code,
					redirect_uri: `${PUBLIC_DOMAIN}profile`,
					// client_id: '2006015671',
					// client_secret: '14ad9236387e9250c4ae32c12219ab02'
					// client_id: '2005856083',
					// client_secret: '48a55f999f0d1895eb0bf9bb22b9a564'
					client_id: '2006478813',
					client_secret: '28d4c9a577a54f93c61e88c33c304794'
				})
			});

			const tokenData = await tokenResponse.json();
			console.log('Token data:', tokenData);
			if (tokenData.error) {
                console.log('Token error:', tokenData.error);
                // คุณอาจต้องจัดการกับข้อผิดพลาดที่เกิดขึ้น เช่น แจ้งเตือนผู้ใช้
                return;
            }
			const profileResponse = await fetch('https://api.line.me/v2/profile', {
				headers: {
					Authorization: `Bearer ${tokenData.access_token}`
				}
			});
			// const verifyResponse = await fetch('https://api.line.me/oauth2/v2.1/verify', {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/x-www-form-urlencoded'
			// 	},
			// 	body: new URLSearchParams({
			// 		'id_token': tokenData.id_token,  // ID token ที่ได้จากการแลกเปลี่ยน authorization code
			// 		'client_id': '2005856083'
			// 	})
			// });
			
			// const userInfo = await verifyResponse.json();
			// const email = userInfo.email;
			

			const profileData = await profileResponse.json();
			if (profileData.error) {
                console.log('Profile error:', profileData.error);
                // คุณอาจต้องจัดการกับข้อผิดพลาดที่เกิดขึ้น เช่น แจ้งเตือนผู้ใช้
                return;
            }
			console.log('Profile data:', profileData);
			// let existingProfileData = JSON.parse(localStorage.getItem('DataUsers') || '[]');
			// const isDuplicate = existingProfileData.some(profile => profile.userId === profileData.userId);

            // // เพิ่มข้อมูลโปรไฟล์ใหม่เข้าไป
			// if (!isDuplicate) {
            //     // เพิ่มข้อมูลโปรไฟล์ใหม่เข้าไป
            //     existingProfileData = [...existingProfileData, profileData];

            //     // เก็บข้อมูลโปรไฟล์ที่อัปเดตลงใน localStorage
            //     localStorage.setItem('DataUsers', JSON.stringify(existingProfileData));
            // }
			localStorage.setItem('DataUsers', JSON.stringify(profileData));
			// Store user profile data in localStorage (or other storage)
			sessionStorage.setItem('profileData', JSON.stringify(profileData));
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				document.getElementById('inputuid').value = profileData.userId;
                document.getElementById('inputid').value = returnedState;
				document.getElementById('inputname').value = profileData.displayName;
				document.getElementById('inputavatar').value = profileData.pictureUrl;
				
				document.getElementById('updateline').submit();

			// profileData.userId = document.getElementById('uid').value;
			// profileData.displayName = document.getElementById('name').value;
			//  console.log(document.getElementById('uid') , document.getElementById('name'))
		} catch (error) {
			console.log(error);
		}
	}
});
