import "server-only";
import { paginateListBuckets, S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";
export const S3 = new S3Client({
  // region value can be directly 'auto'
  region: "auto",
  endpoint: env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: false,
});