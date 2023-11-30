import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  GEN_AI_ENGINE,
  HTTP_CODE,
  HTTP_METHOD,
  jsonApiProxyResultResponse,
} from '../util';
import { ChatGptHandler } from './chatgpt/ChatGptHandler';
import { BedrockHandler } from './bedrock/BedrockHandler';
import { OdinAixHandler } from './odin_aix/OdinAixHandler';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const api = new ChatGptHandler(event);
  switch (event.httpMethod) {
    case HTTP_METHOD.GET:
      return await api.get();
    case HTTP_METHOD.POST:
      return await post(event);
    default:
      return await api.noService();
  }
};

const post = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body)
    return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
      message: false,
      body: 'missing body',
    });

  const { engine } = JSON.parse(event.body);
  var api: ChatGptHandler | BedrockHandler | OdinAixHandler;

  switch (engine) {
    case GEN_AI_ENGINE.CHATGPT_GPT3_5_TURBO:
    case GEN_AI_ENGINE.CHATGPT_GPT4:
      api = new ChatGptHandler(event);
      return await api.post();
    case GEN_AI_ENGINE.BEDROCK_AI21_J2_ULTRA_V1:
      api = new BedrockHandler(event);
      return await api.post();
    case GEN_AI_ENGINE.ODIN:
      api = new OdinAixHandler(event);
      await api.init(); //make that odin oix is initiated to access the end point internally
      await api.post();
    default:
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: false,
        body: 'error:No correct gen ai engine specified',
      });
  }
};
