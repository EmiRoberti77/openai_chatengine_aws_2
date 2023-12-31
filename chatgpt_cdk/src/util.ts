import { APIGatewayProxyResult } from 'aws-lambda';

export enum HTTP_CODE {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  ERROR = 500,
}

export const allModels: string[] = [
  'chatgpt:gpt-3.5-turbo',
  'chatgpt:gpt-4',
  'bedrock:ai21.j2-ultra-v1',
  'odin:oaix_0.1',
];

export enum GEN_AI_ENGINE {
  CHATGPT_GPT3_5_TURBO = 'chatgpt:gpt-3.5-turbo',
  CHATGPT_GPT4 = 'chatgpt:gpt-4',
  BEDROCK_AI21_J2_ULTRA_V1 = 'bedrock:ai21.j2-ultra-v1',
  ODIN = 'odin:oaix_0.1',
}

export const validateGenAIengine = (model: string): boolean => {
  return allModels.includes(model);
};

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if (!arg.headers) {
    arg.headers = {};
  }
  arg.headers['Access-Control-Allow-Origin'] = '*';
  arg.headers['Access-Control-Allow-Methods'] = '*';
  //arg.headers['Access-Control-Allow-Credentials'] = true;
}

export const jsonApiProxyResultResponse = (
  statusCode: HTTP_CODE,
  object: any
): APIGatewayProxyResult => {
  const response = {
    statusCode,
    body: JSON.stringify(object),
  };
  addCorsHeader(response);
  return response;
};

export enum DYNAMO_TABLES {
  USER_QUERIES = 'emi_chat_gpt_user_queries',
}

export const FUNCTION_NAME = 'emi_chat_gpt_lambda';
export const HANDLER = 'handler';
export const CHAT_GPT_EMI_API = 'chat_gpt_handler_api';
export const CHAT = 'chat';
export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
}

export interface ChatInput {
  username: string;
  input: string;
  engine: string;
}
