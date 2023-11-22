import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';
import { randomUUID } from 'crypto';
import { UploadFile } from './model/UploadFile';

const BUCKET_NAME = process.env.BUCKET_NAME;
const s3Client = new S3Client({});
const SUCCESS = 'Transfer success';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'GET') {
    return handleGet();
  }

  try {
    if (!event.body) {
      return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
        message: false,
        body: 'missing body',
      });
    }
    if (!event.queryStringParameters) {
      return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
        message: false,
        body: 'query string with file information, user, name, desc',
      });
    }
    const decodeFile = Buffer.from(event.body, 'base64');
    const filename = `emi_ai_${randomUUID()}.txt`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: decodeFile,
    };

    const startTimeTime = new Date();
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const completedTransferTime = new Date();
    const transferDuration =
      (completedTransferTime.getTime() - startTimeTime.getTime()) / 1000;

    const { user, name, desc, type, size } = event.queryStringParameters;

    return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      message: true,
      body: {
        message: SUCCESS,
        user,
        name,
        desc,
        type,
        size,
        transferDuration,
      },
    });
  } catch (error: any) {
    return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
      message: false,
      body: {
        error: error.message,
      },
    });
  }
};

const handleGet = () => {
  return jsonApiProxyResultResponse(HTTP_CODE.OK, {
    message: true,
    body: {
      httpMethod: 'GET',
    },
  });
};
