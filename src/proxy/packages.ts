import { millaApiUrl } from "../auth.config";
import { mapPackagesResponseToPackages } from "../domain/mappers/package";
import { Package } from "../domain/package";
import { getAuth } from "../utils/auth-utils";

export async function getPackages(): Promise<Package[]> {
    try {
        const response = await fetch(`${millaApiUrl}/api/packages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuth()?.jwt}`,
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const packages = mapPackagesResponseToPackages(data) || [];
        packages.sort((a, b) => a?.multiplier - b?.multiplier);
        return packages;
    } catch (error) {
        throw error;
    }
}