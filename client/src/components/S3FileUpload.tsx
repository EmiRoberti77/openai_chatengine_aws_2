import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UploadResponse {
  bucket: string;
  key: string;
  message: string;
}

const postEndpoint =
  'https://0ypn7p2kk1.execute-api.us-east-1.amazonaws.com/prod/upload';

const S3FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [msg, setMsg] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {}, [isLoading, msg]);

  const onHandleDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      setSelectedFile(e.target.files[0]);
      return;
    }
    console.error('no file selected');
  };

  const transfer = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const response = await axios.get(postEndpoint);

    try {
      console.log(selectedFile);
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await axios.post(postEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { message, key } = response.data.body as UploadResponse;
      console.info('response from transfer', message);
      setMsg(`${message} - ${key}`);
    } catch (err: any) {
      console.error(err.message);
      setMsg(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div>Transfer Document</div>
      <div>{msg}</div>
      {isLoading ? <div>transferring . .</div> : <div>all good!</div>}
      <input type="file" onChange={onHandleDocument} />
      <button onClick={() => transfer()}>Transfer</button>
    </div>
  );
};

export default S3FileUpload;
