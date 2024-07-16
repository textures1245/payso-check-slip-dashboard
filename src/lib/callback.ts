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
                    redirect_uri: 'http://localhost:5173/dashboard',
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
            localStorage.setItem('profile', JSON.stringify(profileData));
            sessionStorage.setItem('profile', JSON.stringify(profileData));

        } catch (error) {
            console.error('Error:', error);
            // @ts-ignore
            document.getElementById('result').innerText = 'Error during login process';
        }
    } else {
        // @ts-ignore
        document.getElementById('result').innerText = 'No code found in the URL';
    }
});
