import {millaApiUrl} from '../../auth.config'
import {Media, MediaResponse} from '../media'
import {StrapiCollectionResponse, StrapiResponse, StrapiSingleResponse} from '../response'

export function mediaUrl(url: string = ''): string {
  const [_, file] = url ? url?.split('/uploads') : ['', ''];
  return url ? `${millaApiUrl}/uploads${file}` : '';
}

export function mapUserEndpointMediaResponseToMedia(
  response: Partial<Media> | undefined
): Media | undefined {
  if (!response) return undefined

  const id = response?.id ?? 0;
  const name = response?.name ?? '';
  const url = mediaUrl(response.url);
  return { id, name, url }
}

export function mapMediaResponseToMedia(
  response: StrapiSingleResponse<MediaResponse> | undefined
): Media | undefined {
  if (!response || !response.data) return undefined

  const id = response?.data?.id ?? 0;
  const name = response?.data?.attributes?.name ?? '';
  const url = mediaUrl(response?.data?.attributes?.url);
  return { id, name, url }
}

export function mapMediaResponsesToMedia(
  response: StrapiCollectionResponse<MediaResponse>
): Media[] | undefined {
  if (!response || !response.data) return undefined;

  const pictures = response.data
    .map((media) => {
      const id = media.id ?? 0;
      const name = media.attributes?.name ?? '';
      const url = mediaUrl(media.attributes?.url);
      return { id, name, url }
    });
    return pictures?.length === 0 ? undefined : pictures;
}
