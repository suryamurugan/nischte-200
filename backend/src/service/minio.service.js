import { minioClient, bucketName } from "../config/minio.config.js";
import fs from "fs";
import util from "util";

const unlinkFile = util.promisify(fs.unlink);

export const uploadFile = async (file) => {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const objectName = file.filename;

  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    throw new Error(`Bucket '${bucketName}' does not exist.`);
  }

  await minioClient.fPutObject(bucketName, objectName, file.path);
  const pictureUrl = `${process.env.MINIO_ENDPOINT}/${bucketName}/${objectName}`;

  await unlinkFile(file.path);

  return pictureUrl;
};
