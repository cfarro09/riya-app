import {Level, LevelResponse} from '../level'
import {StrapiCollectionResponse, StrapiSingleResponse} from '../response'

export function mapLevelsResponseToLevels(
  response: StrapiCollectionResponse<LevelResponse>
): Level[] {
  return response?.data?.map((ageResponse) => ({
    id: ageResponse.id,
    name: ageResponse.attributes.name,
  }));
}

export function mapLevelResponseToLevel(response: StrapiSingleResponse<LevelResponse>): Level | undefined {
  if (!response || !response.data) {
    return undefined;
  }

  return {
    id: response.data!.id,
    name: response.data!.attributes.name,
  }
}
