import { Todo } from '../data';
import { createLogger } from '../utils/logger';

const log = createLogger('services/generateUploadUrl');

export const generateUploadUrl = async (todoId: string, userId: string) => {
  log.debug('Generating upload url', { item: { todoId, userId } });
  const { signedPutUrl } = await Todo.generateAttachmentUrls(todoId, userId);
  return signedPutUrl;
};
