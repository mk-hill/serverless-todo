import { Todo } from '../data';
import { createLogger } from '../utils/logger';

const log = createLogger('services/generateUploadUrl');

export const generateUploadUrl = (todoId: string, userId: string) => {
  log.debug('Generating upload url', { item: { todoId, userId } });
  return Todo.generateAttachmentUploadUrl(todoId, userId);
};
