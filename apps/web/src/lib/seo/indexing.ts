import { JWT } from 'google-auth-library';

export type IndexingAction = 'URL_UPDATED' | 'URL_DELETED';

export async function notifyGoogleIndexingAPI(url: string, type: IndexingAction = 'URL_UPDATED') {
  // We generally only want to ping Google in production to preserve quota
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV] Skipped Google Indexing API for ${url} (${type})`);
    return false;
  }

  try {
    let clientEmail: string | undefined;
    let privateKey: string | undefined;

    const credentialsStr = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (credentialsStr) {
      try {
        const credentials = JSON.parse(credentialsStr);
        clientEmail = credentials.client_email;
        privateKey = credentials.private_key;
      } catch (err) {
        console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", err);
      }
    } else if (process.env.GSC_SERVICE_ACCOUNT_EMAIL && process.env.GSC_PRIVATE_KEY) {
      clientEmail = process.env.GSC_SERVICE_ACCOUNT_EMAIL;
      privateKey = process.env.GSC_PRIVATE_KEY;
    }

    if (!clientEmail || !privateKey) {
      console.warn("Google Indexing API credentials not found. Skipping.");
      return false;
    }

    const client = new JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
    
    const response = await client.request({
      url: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        url: url,
        type: type,
      },
    });

    if (response.status === 200) {
      console.log(`Successfully notified Google Indexing API: ${url} (${type})`);
      return true;
    } else {
      console.error(`Failed to notify Google Indexing API: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('Error notifying Google Indexing API:', error);
    return false;
  }
}
