import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3,
} from "@aws-sdk/client-s3";
import * as formidable from "formidable";
import dotenv from "dotenv/config";
import fs from "fs";
export default class FileService {
  private static s3Client = new S3({
    region: process.env.AWS_REGION ?? "",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  public static async uploadFile(file: formidable.File): Promise<{
    fileName: string;
    uploadDate: Date;
    s3Key: string;
    fileType: string;
  }> {
    const date = new Date();
    const s3Key = date.toISOString() + file.originalFilename;
    const fileContent = fs.createReadStream(file.filepath);
    await FileService.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
        Key: s3Key,
        Body: fileContent,
        ContentType: file.mimetype ?? "",
      })
    );
    return {
      fileName: file.originalFilename ?? "",
      uploadDate: date,
      s3Key: s3Key,
      fileType: file.mimetype ?? "",
    };
  }

  public static async downloadFile(
    s3Key: string
  ): Promise<GetObjectCommandOutput> {
    return await FileService.s3Client.getObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
      Key: s3Key,
    });
  }
}
