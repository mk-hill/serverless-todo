import * as AWSWithoutXray from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

export const AWS = AWSXRay.captureAWS(AWSWithoutXray);
