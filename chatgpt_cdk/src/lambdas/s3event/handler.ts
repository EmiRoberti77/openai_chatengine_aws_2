import { S3Event, S3Handler } from 'aws-lambda';
import { S3Client } from '@aws-sdk/client-s3';

export const handler: S3Handler = async (event: S3Event): Promise<void> => {
  console.info('s3 event', JSON.stringify(event, null, 2));

  const s3Client = new S3Client({ region: 'us-east-1' });
  const record = event.Records[0];
  const bucketName = record.s3.bucket.name;
  const objectKey = record.s3.object.key;

  //call oaix api to copy the file to its local store
  console.info(record, bucketName, objectKey);
};
