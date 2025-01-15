import { millaApiUrl } from "../auth.config";
import { mapMediaResponseToMedia } from "../domain/mappers/media";
import { Media } from "../domain/media";
import { getAuth } from "../utils/auth-utils";

export async function uploadFile(file: Blob): Promise<Media> {
  try {
    const body = new FormData()
    body.append('files', file, `${Math.floor(Math.random() * 9988)}.jpeg`);
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${getAuth()?.jwt}`)
    const response = await fetch(`${millaApiUrl}/api/upload`, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const activityResponse = await response.json() as Media[];
    const obj = {
      data: {
        id: activityResponse[0].id,
        attributes: activityResponse[0]
      },
    }
    return mapMediaResponseToMedia(obj);
  } catch (error) {
    throw error;
  }
}
