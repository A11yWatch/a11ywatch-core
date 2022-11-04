import { SUPER_MODE } from "../../config/config";
import { getWebsite } from "../controllers/websites";

// get the website crawl configuration
export const getCrawlConfig = async ({
  id,
  role,
  url,
  tld,
  subdomains,
  robots = true,
}) => {
  let subdomainsEnabled = SUPER_MODE ? subdomains : role && subdomains;
  let tldEnabled = SUPER_MODE ? tld : role && tld;

  // determine active configuration on role
  if (role) {
    if (!subdomainsEnabled || !tldEnabled) {
      const [website] = await getWebsite({ userId: id, url });
      if (website) {
        if (!subdomainsEnabled) {
          subdomainsEnabled = !!website.subdomains;
        }
        if (!tldEnabled) {
          tldEnabled = !!website.tld;
        }
      }
    }
  }

  return {
    url,
    userId: id,
    subdomains: subdomainsEnabled,
    tld: tldEnabled,
    robots,
  };
};
