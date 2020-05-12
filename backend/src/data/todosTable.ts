import { DocumentClient } from '../aws';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const TableName = process.env.TODOS_TABLE;
const IndexName = process.env.USER_INDEX;

const db = new DocumentClient();
const log = createLogger('data/todosTable');

const query = (params) => db.query({ TableName, ...params }).promise();
const update = (params) => db.update({ TableName, ...params }).promise();

async function getTodoById(id: string) {
  log.debug(`Getting todo item ${id}`);

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
  log.debug(`Getting todos for user ${id}`);

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
  log.debug(`Saving todo`, { todo });
  try {
    const result = await db.put({ TableName, Item: todo }).promise();
    log.info(`Put complete`, { result });
    return todo;
  } catch (error) {
    log.error('Unable to save todo', { error });
    throw error;
  }
}

async function updateTodo(todoId: string, userId: string, request: UpdateTodoRequest) {
  log.debug(`Updating todo`, { request });
  try {
    const { name, dueDate, done } = request;
    const result = await update({
      Key: { todoId, userId },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': name,
        ':dueDate': dueDate,
        ':done': done,
      },
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ReturnValues: 'ALL_NEW',
    });
    log.info('Update complete', { result });
    return result.Attributes;
  } catch (error) {
    log.error('Unable to update todo', { error });
    throw error;
  }
}

async function updateAttachmentUrl(todoId: string, userId: string, attachmentUrl: string) {
  log.debug(`Updating attachment url`, { item: { todoId, userId, attachmentUrl } });
  try {
    const result = await update({
      Key: { todoId, userId },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl,
      },
      ReturnValues: 'ALL_NEW',
    });

    log.info('Update complete', { result });
    return result.Attributes;
  } catch (error) {
    log.error('Unable to update todo', { error });
    throw error;
  }
}

async function deleteTodo(todoId: string, userId: string) {
  log.debug(`Deleting todo`, { todo: { todoId, userId } });
  try {
    const result = await db
      .delete({
        TableName,
        Key: { todoId, userId },
        ReturnValues: 'ALL_OLD',
      })
      .promise();
    log.info(`Delete complete`, { result });
    return result;
  } catch (error) {
    log.error('Unable to delete todo', { error });
    throw error;
  }
}

export const todosTable = {
  getById: getTodoById,
  getByUser: getTodosByUserId,
  create: createTodo,
  update: updateTodo,
  delete: deleteTodo,
  updateAttachmentUrl,
};
