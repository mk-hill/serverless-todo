import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getTodosByUserId } from '../../aws';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
// import * as middy from 'middy';

const log = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (event) => {
  const time = process.hrtime();

  const items = await getTodosByUserId(getUserId(event));

  log.info(`Time taken: ${process.hrtime(time)}`);
  return {
    statusCode: 200,
    body: JSON.stringify({ items }),
  };
};
