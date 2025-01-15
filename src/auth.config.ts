import { isPlatform } from "@ionic/react";

export const domain = "dev-6m4hbmrr1ebgapmp.us.auth0.com";
export const auth0ApiUrl = `https://${domain}`;
export const millaApiUrl = "https://millaapi.strategiacode.com";

export const clientId = "FOY1Y3l3VM1MQFxkwbvVHglpqnP0usfH";
export const clientSecret = "pSjaXVQbFMsd8Dsh3CKlwK6C4rGaTVDXZ3ejXVpHV1DyVgrCtlZFFpX8NYe-PK5_";

export const clientIdAuth0Api = "FOY1Y3l3VM1MQFxkwbvVHglpqnP0usfH";
export const clientSecretAuth0Api = "pSjaXVQbFMsd8Dsh3CKlwK6C4rGaTVDXZ3ejXVpHV1DyVgrCtlZFFpX8NYe-PK5_";

export const millaGlobalApiAccessToken = "0bfbe403580a43df311616ca261162d67095908db87bbc8170efb752cb49abe956e6c9d4df8541df2105745f872b22cd2c598d4452b8cd8b4d25ed7471196d30a5eb3c68e9163eca8d342a82433bbbf27fa974cd728ff4fdf9ca9f7b7f65a319b8ec3386a2c3f6f49c6e1e677ccd4cdd320224683e531ed817fb2b221b431913";

const appId = "milla.dev.app";

// Use `auth0Domain` in string interpolation below so that it doesn't
// get replaced by the quickstart auto-packager
const auth0Domain = domain;
const iosOrAndroid = isPlatform('hybrid');

export const callbackUri = iosOrAndroid
  ? `${appId}://${auth0Domain}/capacitor/${appId}/callback`
  : 'http://localhost:3000';