import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import {
  Cors,
  LambdaIntegration,
  ResourceOptions,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LambdaInsightsVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { existsSync } from 'fs';
import { join } from 'path';
import { HTTP_METHOD } from '../src/util';

export class FileUploaderLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //create Lambda
    const path = join(
      __dirname,
      '..',
      'src',
      'lambdas',
      'fileuploader',
      'handler.ts'
    );

    if (!existsSync(path)) {
      console.error('NOT FOUND', path);
      return;
    }

    //assign lambdaRight to access the S3 drive
    const uploadLambda = new NodejsFunction(this, 'fileuploader', {
      runtime: Runtime.NODEJS_18_X,
      functionName: 'emifileuploader',
      handler: 'handler',
      entry: path,
      timeout: cdk.Duration.minutes(5),
      environment: {
        BUCKET_NAME: 'emibucketai',
      },
    });

    uploadLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ['arn:aws:s3:::emibucketai/*'],
        actions: ['s3:*'],
      })
    );

    //create api
    const api = new RestApi(this, 'fileuploaderApi');
    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };
    const lambdaIntegration = new LambdaIntegration(uploadLambda);
    const apiResources = api.root.addResource('upload', optionsWithCors);
    apiResources.addMethod(HTTP_METHOD.GET, lambdaIntegration);
    apiResources.addMethod(HTTP_METHOD.POST, lambdaIntegration);
  }
}
