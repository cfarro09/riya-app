import { auth0ApiUrl, clientIdAuth0Api, clientSecretAuth0Api } from "../auth.config";
import { AuthToken } from "../domain/auth0";
import { User } from "../domain/user";

export async function getUserById(accessToken: string): Promise<User> {
    try {
        const response = await fetch(`${auth0ApiUrl}/userinfo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as User;
    } catch (error) {
        throw error;
    }
}


export async function getAuthToken(): Promise<AuthToken> {
    try {
        const response = await fetch(`${auth0ApiUrl}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientIdAuth0Api,
                client_secret: clientSecretAuth0Api,
                audience: `https://dev-6m4hbmrr1ebgapmp.us.auth0.com/api/v2/`,
                grant_type: "client_credentials"
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as AuthToken;
    } catch (error) {
        throw error;
    }
}

