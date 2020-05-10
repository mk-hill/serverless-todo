import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

import { generateUploadUrl } from '../../services';
import { getUserId, addMiddleware } from '../utils';
import { createLogger } from '../../utils/logger';

const log = createLogger('http/generateUploadUrl');

const getSignedUrl: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  log.info(`Received event`, { event });
  try {
    const { todoId } = event.pathParameters;
    const userId = getUserId(event);
    const uploadUrl = await generateUploadUrl(todoId, userId);
    log.info(`Returning generated upload url`, { uploadUrl });
    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl }),
    };
  } catch (error) {
    const message = 'Unable to generate upload url';
    log.error(message, { error });
    return {
      statusCode: 500,
      body: message,
    };
  }
};

export const handler = addMiddleware(getSignedUrl);
