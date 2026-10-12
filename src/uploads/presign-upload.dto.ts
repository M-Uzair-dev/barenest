import { IsIn } from 'class-validator';

export const ALLOWED_CONTENT_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
  'text/plain',
] as const;

export class PresignUploadDto {
  @IsIn(ALLOWED_CONTENT_TYPES)
  contentType: (typeof ALLOWED_CONTENT_TYPES)[number];
}
