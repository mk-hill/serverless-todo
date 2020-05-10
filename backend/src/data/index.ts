import { todosTable } from './todosTable';
import { generateUploadUrl } from './attachments';

export const Todo = {
  ...todosTable,
  generateAttachmentUploadUrl: generateUploadUrl,
};
