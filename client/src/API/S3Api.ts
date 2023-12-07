import axios from 'axios';
import { S3RDSParams } from '../components/S3FileUpload';
export const s3TransferEndPoint = () => 'http://18.209.50.73:3005/transfer';
const s3rdsEndpoint = () =>
  'https://aaflna2153.execute-api.us-east-1.amazonaws.com/prod/s3rds';
export class S3Api {
  private params: S3RDSParams;
  private file: File;
  private rds: boolean;
  constructor(params: S3RDSParams, file: File, rds: boolean = true) {
    this.params = params;
    this.file = file;
    this.rds = rds;
  }
  public async transfer(): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('file', this.file);
      const response = await axios.post(s3TransferEndPoint(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const upload_response = response.data;
      const success: boolean = upload_response.message;
      if (success && this.rds) {
        this.insert();
      }

      return true;
    } catch (err: any) {
      throw Error(err);
    }
  }
  private insert() {
    console.log('inserting=>', this.params);

    axios
      .post(s3rdsEndpoint(), this.params)
      .then((success) => console.log(success))
      .catch((err: any) => {
        throw err;
      });
  }
}
