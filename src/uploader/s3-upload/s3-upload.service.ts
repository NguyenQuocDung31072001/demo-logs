import { Injectable } from "@nestjs/common";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { config as configS3, S3 } from "aws-sdk";
import config from "src/config";

@Injectable()
export class S3UploadService {
  public async uploadFile(data: any) {
    configS3.update({
      region: config.AWS_REGION,
      credentials: {
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        accessKeyId: config.AWS_ACCESS_KEY_ID,
      },
    });
    const s3AWS = new S3();
    const { bucketName, file, prefix } = data;
    const path = prefix ? bucketName + "/" + prefix : bucketName;
    const name = file.originalname;
    const params: PutObjectRequest = {
      Bucket: path,
      Key: name,
      Body: file.buffer,
    };
    console.log(`Uploading ${name} to ${bucketName}`);
    return new Promise((resolve: (val: string) => void, reject) => {
      s3AWS.upload(params, undefined, (err, data) => {
        if (err) {
          console.error(`[S3 Error] Uploading file ${name}`, err);
          reject(err);
        } else {
          console.info(`File uploaded successfully. ${data.Location}`);
          resolve(name);
        }
      });
    });
  }
}
