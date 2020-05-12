import { todosTable } from './todosTable';
import { generateAttachmentUrls, deleteAttachment } from './attachments';
import { createLogger } from '../utils/logger';

const log = createLogger('data/index');

const { delete: deleteFromTable, ...todosMethods } = todosTable;

async function deleteFromTableAndBucket(todoId, userId) {
  try {
    const [tableResult, bucketResult] = await Promise.all([
      deleteFromTable(todoId, userId),
      deleteAttachment(todoId, userId),
    ]);
    log.info('Deleted todo item from table and s3 bucket', { tableResult, bucketResult });
    return tableResult;
  } catch (error) {
    log.error('Unable to delete todo item', { error });
  }
}

export const Todo = {
  ...todosMethods,
  generateAttachmentUrls,
  delete: deleteFromTableAndBucket,
};
