#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChatGptAwsLambdaStack } from '../lib/chat_gpt_aws_lambda-stack';
import { ChatGptUIClient } from '../lib/chat_gpt_ui_client';
import { FileUploaderLambdaStack } from '../lib/fileuploader_lambda_stack';
import { S3EventLambda } from '../lib/s3_event_lambda';

const app = new cdk.App();
new ChatGptAwsLambdaStack(app, 'ChatGptAwsLambdaStack');
new S3EventLambda(app, 's3EventLambda');
new FileUploaderLambdaStack(app, 'fileUploaderStack');
new ChatGptUIClient(app, 'ChatGptUIClient');
