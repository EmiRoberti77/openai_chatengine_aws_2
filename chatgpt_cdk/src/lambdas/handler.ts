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

  console.info('engine', engine);
  switch (engine) {
    case GEN_AI_ENGINE.CHATGPT_GPT3_5_TURBO:
    case GEN_AI_ENGINE.CHATGPT_GPT4:
      console.info('in switch chatgpt', engine);
      api = new ChatGptHandler(event);
      return await api.post();
    case GEN_AI_ENGINE.BEDROCK_AI21_J2_ULTRA_V1:
      console.info('in switch bedrock', engine);
      api = new BedrockHandler(event);
      return await api.post();
    case GEN_AI_ENGINE.ODIN:
      console.info('in switch odin', engine);
      api = new OdinAixHandler(event);
      return await api.init();
    default:
      console.info('in switch default', engine);
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: false,
        body: 'error:No correct gen ai engine specified',
      });
  }
};
