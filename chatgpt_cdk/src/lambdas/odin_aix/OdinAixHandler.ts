import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';

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
}
