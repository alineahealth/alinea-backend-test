import { Readable } from "stream";
import AWS from "aws-sdk";
import { S3EventRecord } from "aws-lambda";
import { FileInformation } from "../types/types";

export const getS3Object = async (
  tracingId: string,
  record: S3EventRecord
): Promise<FileInformation> => {
  try {
    const { bucket, object } = record?.s3 ?? {};
    const bucketName = bucket?.name;
    const objectKey = object?.key;
    const extension = objectKey?.split(".").pop()?.toLocaleUpperCase() ?? "CSV";

    if (!bucketName || !objectKey) {
      throw new Error(
        "Failed to retrieve S3 object: Missing bucket name or object key"
      );
    }

    const s3 = new AWS.S3();
    const getObjectParams = {
      Bucket: bucketName,
      Key: objectKey,
    };

    const s3Object = await s3.getObject(getObjectParams).promise();

    if (!s3Object || !s3Object.Body) {
      throw new Error("Failed to retrieve S3 object: Body is undefined");
    }

    const fileStream = new Readable({
      read() {
        this.push(s3Object.Body);
        this.push(null);
      },
    });

    const fileInformation: FileInformation = {
      fileStream,
      fileName: objectKey,
      extension,
      bucketName,
    };

    return fileInformation;
  } catch (error) {
    const errorMessage = `${tracingId} - Failed to retrieve S3 object: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    throw new Error(errorMessage);
  }
};
