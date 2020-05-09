import { Todo } from '../data';
import { createLogger } from '../utils/logger';

const log = createLogger('services/getTodos');

export const getTodos = async (id: string) => {
  log.debug(`Getting todos for user ${id}`);
  return Todo.getByUser(id);
};
