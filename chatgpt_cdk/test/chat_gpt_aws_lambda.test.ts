import { handler } from '../src/lambdas/handler';
import { HTTP_METHOD, allModels } from '../src/util';

const testChatLambda = async (index: number): Promise<void> => {
  const param = {
    httpMethod: HTTP_METHOD.POST,
    body: JSON.stringify({
      input: 'retail trends in the uk',
      username: 'emi_code',
      engine: allModels[index],
    }),
  };

  const response = await handler(param as any);
  console.log(response);
};
//0 chatgpt 3.5 turbo
//1 chatgpt 4
//2 bedrock
//3 odin
testChatLambda(0);
