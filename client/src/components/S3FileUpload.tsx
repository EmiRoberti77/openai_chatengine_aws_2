import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../state/Store';
import './css/S3FileUpload.css';
import { S3Api, s3TransferEndPoint } from '../API/S3Api';
export interface UploadResponse {
  originalFilename: string;
  newFileName: string;
  encoding: string;
  mimeType: string;
  bucket: string;
}

export interface S3RDSParams {
  filename: string;
  size: number;
  description: string;
  category: string;
  user: string;
  entityId: string;
  timestamp: Date;
  content_type: string;
  active: boolean;
}

const S3FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [msg, setMsg] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileDescription, setFileDescription] = useState<string>('');

  const loggedUser = useSelector((state: RootState) => state.user);
  useEffect(() => {}, [isLoading, msg]);
  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  const onHandleFileDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileDescription(e.target.value);
  };

  const onHandleDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      setSelectedFile(e.target.files[0]);
      console.log('file selected', selectedFile);
      return;
    }
    console.error('no file selected');
  };

  const transfer = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const s3Params: S3RDSParams = {
        user: loggedUser.username,
        filename: selectedFile.name ? selectedFile.name : 'noname',
        description: fileDescription,
        content_type: selectedFile.type,
        size: selectedFile.size,
        category: 'GENERALs',
        entityId: 'emi_oaix_1',
        timestamp: new Date(),
        active: true,
      };

      const s3api = new S3Api(s3Params, selectedFile);
      const isTransferred: boolean = await s3api.transfer();
      setMsg(`created:${isTransferred}`);
    } catch (err: any) {
      console.error(err.message);
      setMsg(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">Transfer Document</div>
      <div className="card-body">
        <div className="message">{msg}</div>
        {isLoading ? <div>transferring . .</div> : <div>all good!</div>}
        <div className="input-group">
          <input type="file" onChange={onHandleDocument} />
        </div>
        <div className="input-group">
          <label>short description:</label>
          <input
            type="text"
            onChange={onHandleFileDescription}
            value={fileDescription}
          />
        </div>
        <div className="action">
          <button onClick={() => transfer()}>Transfer</button>
        </div>
      </div>
    </div>
  );
};

export default S3FileUpload;
