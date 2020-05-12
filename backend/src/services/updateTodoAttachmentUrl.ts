import { Todo } from '../data';
import { createLogger } from '../utils/logger';

const log = createLogger('services/updateTodoAttachmentUrl');

export const updateTodoAttachmentUrl = (filePath) => {
  try {
    const [userId, todoId] = filePath.split('/').map((id) => {
      const decodedId = decodeURI(id);
      log.info('Decoded id', { originalId: id, decodedId });
      return decodedId;
    });
    log.debug('Updating attachment', { userId, todoId });
    const attachmentUrl = `https://${process.env.TODO_ITEM_ATTACHMENTS_BUCKET}.s3.amazonaws.com/${filePath}`;
    return Todo.updateAttachmentUrl(todoId, userId, attachmentUrl);
  } catch (error) {
    log.error('Unable to update attachment url', { error });
  }
};
