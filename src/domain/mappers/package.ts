import {Package, PackageResponse} from '../package'
import {StrapiCollectionResponse, StrapiSingleResponse} from '../response'

export function mapPackagesResponseToPackages(
  response: StrapiCollectionResponse<PackageResponse>
): Package[] | undefined {
  const packages = response.data.map((response) => ({
    id: response.id,
    name: response.attributes.name,
    multiplier: response?.attributes?.multiplier,
  }));

  return packages?.length === 0 ? undefined : packages;
}

export function mapPackageResponseToPackage(response: StrapiSingleResponse<PackageResponse>): Package | undefined {
  if (!response || !response.data) {
    return undefined;
  }

  return {
    id: response.data!.id,
    name: response.data!.attributes.name,
    multiplier: response.data!.attributes.multiplier,
  }
}
