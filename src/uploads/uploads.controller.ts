import { Body, Controller, Post } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PresignUploadDto } from './presign-upload.dto';

const EXPIRES_IN = 300;

@Controller('uploads')
export class UploadsController {
  private readonly s3 = new S3Client({
    region: process.env.AWS_REGION,
    requestChecksumCalculation: 'WHEN_REQUIRED',
  });

  @Post('presign')
  async presign(@Body() dto: PresignUploadDto) {
    // The server picks the key so clients can't overwrite each other's files.
    const key = `uploads/${randomUUID()}`;

    const url = await getSignedUrl(
      this.s3,
      new PutObjectCommand({
        Bucket: process.env.UPLOADS_BUCKET,
        Key: key,
        ContentType: dto.contentType,
      }),
      { expiresIn: EXPIRES_IN },
    );

    return { key, url, expiresIn: EXPIRES_IN };
  }
}
