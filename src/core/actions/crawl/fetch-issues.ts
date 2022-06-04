import { controller } from "../../../proto/actions/calls";
import type { PageMindScanResponse } from "../../../schema";

interface Params {
  url: string;
  userId?: number;
  pageHeaders?: any[];
  pageInsights?: boolean;
  noStore?: boolean; // prevent storing values to CDN server
  scriptsEnabled?: boolean; // scripts storing enabled for user
  mobile?: boolean; // is the testing done in mobile view port
  standard?: string; // is the testing done in mobile view port
  ua?: string; // is the testing done in mobile view port
}

// gRPC call to scan from pagemind
export const fetchPageIssues = async (
  params: Params
): Promise<PageMindScanResponse> => {
  try {
    return await controller.scan(params);
  } catch (e) {
    console.error(e);
  }
};
