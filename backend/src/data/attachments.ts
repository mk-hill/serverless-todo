import { S3 } from '../aws';
import { createLogger } from '../utils/logger';

const log = createLogger('data/attachments');

const Bucket = process.env.TODO_ITEM_ATTACHMENTS_BUCKET;
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION ?? 600;

const s3 = new S3({
  signatureVersion: 'v4',
  region: process.env.AWS_REGION ?? 'us-east-1',
  params: { Bucket },
});

export async function generateUploadUrl(todoId: string, userId: string) {
  try {
    log.info('Requesting signed url', { userId, todoId });
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket,
      Key: `${userId}/${todoId}`,
      Expires: signedUrlExpiration,
    });
    log.info('Retrieved signed url', { signedUrl });
    return signedUrl;
  } catch (error) {
    log.error('Unable to get signed url', { error });
    throw error;
  }
}
