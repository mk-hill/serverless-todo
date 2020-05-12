import { S3 } from '../aws';
import { createLogger } from '../utils/logger';

const log = createLogger('data/attachments');

const Bucket = process.env.TODO_ITEM_ATTACHMENTS_BUCKET;
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION ?? 600;

const s3 = new S3({
  signatureVersion: 'v4',
  region: process.env.BUCKET_AWS_REGION ?? 'us-east-1',
  params: { Bucket },
});

export async function generateAttachmentUrls(todoId: string, userId: string) {
  try {
    log.info('Requesting signed url', { userId, todoId });
    const fileName = `${userId}/${todoId}`;
    const getUrl = `https://${Bucket}.s3.amazonaws.com/${fileName}`;
    const signedPutUrl = s3.getSignedUrl('putObject', {
      Bucket,
      Key: fileName,
      Expires: signedUrlExpiration,
    });

    log.info('Retrieved signed url', { urls: { put: signedPutUrl, get: getUrl } });
    return { signedPutUrl, getUrl };
  } catch (error) {
    log.error('Unable to get signed url', { error });
    throw error;
  }
}

export async function deleteAttachment(todoId: string, userId: string) {
  try {
    const fileName = `${userId}/${todoId}`;
    log.info('Deleting attachment', { userId, todoId, fileName });
    return s3.deleteObject({
      Bucket,
      Key: fileName,
    });
  } catch (error) {
    log.error('Unable to delete attachment');
  }
}
