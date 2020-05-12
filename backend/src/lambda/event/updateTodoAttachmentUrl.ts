import 'source-map-support/register';

import { S3Handler, S3Event } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { updateTodoAttachmentUrl } from '../../services/updateTodoAttachmentUrl';

const log = createLogger('http/updateTodoAttachmentUrl');

export const handler: S3Handler = async (event: S3Event) => {
  log.info(`Received event`, { event });
  try {
    const filePath = event.Records.find((record) => record.s3.object.key).s3.object.key;
    const result = await updateTodoAttachmentUrl(filePath);
    log.info('Updated todo item attachment url', { result });
  } catch (error) {
    log.error('Unable to update todo item attachment url', { error });
  }
};
