document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        try {
            const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: 'http://localhost:5173/login',
                    client_id: '2005856083',
                    client_secret: '48a55f999f0d1895eb0bf9bb22b9a564'
                })
            });

            const tokenData = await tokenResponse.json();
            console.log('Token data:', tokenData);

            const profileResponse = await fetch('https://api.line.me/v2/profile', {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`
                }
            });

            const profileData = await profileResponse.json();
            console.log('Profile data:', profileData);

            // Store user profile data in localStorage (or other storage)
            localStorage.setItem('profile Data ', JSON.stringify(profileData));
            sessionStorage.setItem('profile Data', JSON.stringify(profileData));

            document.getElementById('emailInputline').value = profileData.userId;
			document.getElementById('nameInputline').value = profileData.displayName;
            localStorage.setItem('Login line', JSON.stringify(true));
            sessionStorage.setItem('Login line', JSON.stringify(true));
            // profileData.userId = document.getElementById('uid').value;
            // profileData.displayName = document.getElementById('name').value;
            //  console.log(document.getElementById('uid') , document.getElementById('name'))
             document.getElementById('mylineForm').submit();
            
           
        
           
        } catch (error) {

            console.log(error)
            
            
        }
    }
});

