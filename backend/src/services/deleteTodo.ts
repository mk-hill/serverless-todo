import { Todo } from '../data';
import { createLogger } from '../utils/logger';

const log = createLogger('services/deleteTodo');

export const deleteTodo = (todoId: string, userId: string) => {
  log.debug('Deleting item', { item: { todoId, userId } });
  return Todo.delete(todoId, userId);
};
