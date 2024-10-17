import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: "22.0.0.179",
  port: 9000,
  useSSL: false,
  accessKey: "zdUNw0ojDofdgwLRs8eR",
  secretKey: "PtkP3Syt0e2BFlNkQgqe0yLHWpEIe7EeVKo87x4z",
});

const bucketName = "nischte";

export { minioClient, bucketName };
