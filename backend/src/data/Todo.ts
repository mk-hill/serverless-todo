import { AWS } from '../aws';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';

const TableName = process.env.TODOS_TABLE;
const IndexName = process.env.USER_INDEX;

const db = new AWS.DynamoDB.DocumentClient();
const log = createLogger('data/Todo');

const query = (params) => db.query({ TableName, ...params }).promise();

async function getTodoById(id: string) {
  log.info(`Getting todo item ${id}`);

  const data = await query({
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': id,
    },
  });

  if (!data.Items.length) {
    throw new Error(`Could not find todo item ${id}`);
  }

  log.info(`Retrieved data`, { data });
  return data.Items[0] as TodoItem;
}

async function getTodosByUserId(id: string) {
  log.info(`Getting todos for user ${id}`);

  try {
    const data = await query({
      IndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': id,
      },
    });

    log.info(`Retrieved data`, { data });
    return data.Items as TodoItem[];
  } catch (error) {
    log.error(`Unable to retrieve user todos`, { error });
    throw error;
  }
}

async function createTodo(todo: TodoItem) {
  log.info(`Saving todo`, { todo });
  try {
    const result = await db.put({ TableName, Item: todo }).promise();
    log.info(`Put completed`, { result });
    return todo;
  } catch (error) {
    log.error('Unable to save todo', { error });
    throw error;
  }
}

export const Todo = {
  getById: getTodoById,
  getByUser: getTodosByUserId,
  create: createTodo,
};
