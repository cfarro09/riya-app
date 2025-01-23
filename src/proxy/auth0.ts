import { auth0ApiUrl, clientIdAuth0Api, clientSecretAuth0Api } from "../auth.config";
import { AuthToken } from "../domain/auth0";
import { User } from "../domain/user";
import { getAuth } from '../utils/auth-utils';

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
        const response = await fetch(`https://dev-6m4hbmrr1ebgapmp.us.auth0.com/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "client_id": "PjFyOIiEKzvVLr009IcfzlDtZB5ZZEYh",
                "client_secret": "cU1pTIweAXmqgQZ4PkS5GVh2VnQ9bmbLsD3vvUeTYDVPrIYOunhOVkyqG2uwCoro",
                "audience": "https://dev-6m4hbmrr1ebgapmp.us.auth0.com/api/v2/",
                "grant_type": "client_credentials"
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

export async function deleteUser(userId: string): Promise<void> {
    try {
        const token = await getAuthToken();
        console.log("token.access_token", token.access_token)
        const response = await fetch(`${auth0ApiUrl}/api/v2/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        throw error;
    }
}
