import { todosTable } from './todosTable';
import { generateAttachmentUrls } from './attachments';

export const Todo = {
  ...todosTable,
  generateAttachmentUrls,
};
