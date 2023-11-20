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

    const decodeFile = Buffer.from(event.body, 'base64');
    const filename = `emi_ai_${randomUUID()}.txt`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: decodeFile,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      message: true,
      body: {
        message: 'SUCCESS',
        bucket: BUCKET_NAME,
        key: filename,
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
