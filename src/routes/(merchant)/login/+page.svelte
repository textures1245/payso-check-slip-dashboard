<script lang="ts">
import { onMount } from 'svelte';
let lineLoginUrl = 'https://access.line.me/oauth2/v2.1/authorize';
let clientId = '2005856083';
let redirectUri = 'http://localhost:5173/dashboard';
let state = 'randomState';
let scope = 'profile%20openid%20email';

let loginUrl = generateLoginUrl(lineLoginUrl, clientId, redirectUri, state, scope);

	function generateLoginUrl(lineLoginUrl: string, clientId: string, redirectUri: string, state: string, scope: string) {
		console.log(scope)
    return `${lineLoginUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

	
}


const line = async () => {
			window.location.replace(loginUrl);
			console.log("1")
	
	};


</script>

<button on:click={line}>asdadada</button>

