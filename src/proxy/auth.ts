import { millaGlobalApiAccessToken, millaApiUrl } from "../auth.config";
import { mapAuth0UserResponseToUser } from "../domain/mappers/user";
import { User } from "../domain/user";

export async function authUser(jwt: string): Promise<User> {
    try {
        const response = await fetch(`${millaApiUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${millaGlobalApiAccessToken}`,
            },
            body: JSON.stringify({
                jwt
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return mapAuth0UserResponseToUser(data);
    } catch (error) {
        throw error;
    }
}




