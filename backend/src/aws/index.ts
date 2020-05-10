import * as AWSWithoutXray from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

export const AWS = AWSXRay.captureAWS(AWSWithoutXray);
export const { DocumentClient } = AWS.DynamoDB;
export const { S3 } = AWS;
