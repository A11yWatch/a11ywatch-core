import type { sendUnaryData, ServerWritableStream } from "@grpc/grpc-js";
import { extractLighthouse } from "../../core/utils/shapes/extract-page-data";
import { LIGHTHOUSE } from "../../core/static";
import { pubsub } from "../../database";
import { collectionUpsert } from "../../core/utils";
import { PageSpeedController } from "../../core/controllers/page-speed/main";

// lighthouse page updating
export const pageUpdate = async (
  call: ServerWritableStream<{ domain: string; url:string; user_id: number; insight: any }, {}>,
  callback: sendUnaryData<any>
) => {
    // handle data after connection
    setImmediate(async () => {
      // handle lighthouse data into db and send sub
      const { user_id: userId, url: pageUrl, domain, insight } = call.request;
      const lighthouseResults = extractLighthouse({ userId, domain, pageUrl, insight });
      const [pageSpeed, pageSpeedCollection] = await PageSpeedController().getWebsite({ pageUrl, userId }, true);

      // upsert lightouse data
      await collectionUpsert(lighthouseResults, [pageSpeedCollection, pageSpeed]);

      try {
          await pubsub.publish(LIGHTHOUSE, { lighthouseResult: lighthouseResults });
      } catch (_) {
          // silent pub sub errors
      }
    })

   callback(null, {});
};
