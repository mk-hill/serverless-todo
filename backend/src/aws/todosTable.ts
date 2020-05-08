import { AWS } from './sdk';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';

const TableName = process.env.TODOS_TABLE;
const IndexName = process.env.USER_INDEX;

const db = new AWS.DynamoDB.DocumentClient();
const log = createLogger('todosTable');

const query = (params) => db.query({ TableName, ...params }).promise();

export async function getTodoById(id: string) {
  log.info(`Getting todo item ${id}`);
  const data = await query({
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': id,
    },
  });

  if (!data?.Items?.length) {
    throw new Error(`Could not find todo item ${id}`);
  }

  return data.Items[0] as TodoItem;
}

export async function getTodosByUserId(id: string) {
  log.info(`Getting todo items for user ${id}`);

  const data = await query({
    IndexName,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': id,
    },
  });

  return data.Items as TodoItem[];
}

export async function createTodo(Item: TodoItem) {
  log.info(`Creating todo ${Item.todoId}`);
  const result = await db.put({ TableName, Item }).promise();
  log.info('Saved item:\n' + result);
  return Item;
}
