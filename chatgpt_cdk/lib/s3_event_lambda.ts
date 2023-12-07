import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { existsSync } from 'fs';
import { join } from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaDestination } from 'aws-cdk-lib/aws-lambda-destinations';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class S3EventLambda extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //create Lambda
    const path = join(
      __dirname,
      '..',
      'src',
      'lambdas',
      's3event',
      'handler.ts'
    );

    if (!existsSync(path)) {
      console.error('NOT FOUND', path);
      return;
    }

    //assign lambdaRight to access the S3 drive
    const s3eventLambda = new NodejsFunction(this, 'odin_s3_lambda_event', {
      runtime: Runtime.NODEJS_18_X,
      functionName: 'odin_s3_lambda_event',
      handler: 'handler',
      entry: path,
      environment: {
        BUCKET_NAME: 'emibucketai',
      },
    });

    s3eventLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ['arn:aws:s3:::emibucketai/*'],
        actions: ['s3:*'],
      })
    );

    const bucket = s3.Bucket.fromBucketName(this, 'emibucketai', 'emibucketai');
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(s3eventLambda)
    );
  }
}
