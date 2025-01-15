import { Age, AgeResponse } from "../age";
import { StrapiCollectionResponse, StrapiSingleResponse } from "../response";

export function mapAgesResponseToAges(response: StrapiCollectionResponse<AgeResponse>): Age[] {
  return response?.data?.map(ageResponse => (
    {
      id: ageResponse.id,
      name: ageResponse.attributes.name,
      startAge: ageResponse.attributes.startAge,
      endAge: ageResponse.attributes.endAge
    }
  ));
}

export function mapAgeResponseToAge(response: StrapiSingleResponse<AgeResponse>): Age | undefined {
  if (!response || !response.data) {
    return undefined;
  }

  return {
    id: response.data!.id,
    name: response.data!.attributes.name,
    startAge: response.data!.attributes.startAge,
    endAge: response.data!.attributes.endAge
  }
}