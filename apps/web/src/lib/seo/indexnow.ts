import { SITE_URL } from "@/constants";

export const DEFAULT_INDEXNOW_KEY = "c7482f3484f940d99824f115591eb10a";

export function getIndexNowKey(): string {
  return process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY;
}

export function getIndexNowKeyLocation(): string {
  const key = getIndexNowKey();
  return `${SITE_URL}/${key}.txt`;
}

/**
 * Submits a URL or list of URLs to the IndexNow protocol.
 * This instantly alerts Microsoft Bing, Copilot, Yandex, Seznam,
 * and partner AI engines within seconds of publishing or updating content.
 */
export async function submitToIndexNow(urls: string | string[]): Promise<boolean> {
  const urlList = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);
  if (urlList.length === 0) return true;

  const key = getIndexNowKey();
  const keyLocation = getIndexNowKeyLocation();

  let host = "www.globalchanakya.in";
  try {
    const parsed = new URL(SITE_URL);
    host = parsed.host;
  } catch {
    // fallback to default host
  }

  const payload = {
    host,
    key,
    keyLocation,
    urlList,
  };

  try {
    // IndexNow API distributes to Bing, Yandex, Seznam, and AI search engines
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`[IndexNow] Successfully notified IndexNow for ${urlList.length} URL(s)`);
      return true;
    } else {
      const errorText = await response.text().catch(() => "");
      console.warn(`[IndexNow] API returned status ${response.status}: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error("[IndexNow] Failed to notify IndexNow:", error);
    return false;
  }
}
