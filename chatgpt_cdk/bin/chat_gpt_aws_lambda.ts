#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChatGptAwsLambdaStack } from '../lib/chat_gpt_aws_lambda-stack';
import { ChatGptUIClient } from '../lib/chat_gpt_ui_client';
import { FileUploaderLambdaStack } from '../lib/fileuploader_lambda_stack';

const app = new cdk.App();
new ChatGptAwsLambdaStack(app, 'ChatGptAwsLambdaStack', {});
new FileUploaderLambdaStack(app, 'fileUploaderStack');
new ChatGptUIClient(app, 'ChatGptUIClient');
