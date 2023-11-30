import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ChatInput, HTTP_CODE, jsonApiProxyResultResponse } from '../../util';
import axios from 'axios';
import { ChatQueryParam } from '../chatgpt/ChatQueryParam';
import { randomUUID } from 'crypto';
import { ChatGptQueryHandler } from '../database/ChatGptQueryHandler';

const ssmClient = new SSMClient({ region: 'us-east-1' });
export class OdinAixHandler {
  private storeParameterName: string = 'odin_aix_endpoint';
  private endpoint: string | undefined;
  private event: APIGatewayProxyEvent;
  constructor(event: APIGatewayProxyEvent) {
    this.event = event;
  }

  async init(): Promise<APIGatewayProxyResult> {
    try {
      const response = await ssmClient.send(
        new GetParameterCommand({
          Name: this.storeParameterName,
          WithDecryption: false,
        })
      );

      this.endpoint = response.Parameter?.Value;
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: true,
        body: this.endpoint,
      });
    } catch (err: any) {
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        message: false,
        body: err.message,
      });
    }
  }

  async post(): Promise<APIGatewayProxyResult> {
    if (!this.endpoint) {
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: false,
        body: 'odin oaix endpoint is undefined',
      });
    }

    if (!this.event.body) {
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: false,
        body: 'missing body or odin oaix',
      });
    }

    const chatInput: ChatInput = JSON.parse(this.event.body);
    var response;
    try {
      response = await axios.post(this.endpoint, chatInput, {
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (err: any) {
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: false,
        body: err.message,
      });
    }

    if (!response.data) {
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: false,
        body: 'E101:can not answer question',
      });
    }

    const d = new Date();
    const chatQueryParam: ChatQueryParam = {
      id: randomUUID(),
      username: chatInput.username,
      timestamp: d.getTime(),
      createdAt: d.toISOString(),
      userInput: {
        user: chatInput.username,
        role: 'user',
        input: chatInput.input,
      },
      chatCompletion: response.data,
      engine: chatInput.engine,
    };

    try {
      await new ChatGptQueryHandler(chatQueryParam).saveQuery();
    } catch (err: any) {
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: false,
        body: err.message,
      });
    }

    return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      message: true,
      body: response.data,
    });
  }
}
