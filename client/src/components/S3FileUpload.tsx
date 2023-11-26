import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../state/Store';
import './css/S3FileUpload.css';
interface UploadResponse {
  bucket: string;
  key: string;
  message: string;
  name: string;
  user: string;
  desc: string;
  size: number;
  type: string;
  transferDuration: number;
}

interface EndpointProps {
  user: string;
  name: string;
  desc: string;
  type: string;
  size: number;
}

class EndpointCreator {
  private base =
    'https://0ypn7p2kk1.execute-api.us-east-1.amazonaws.com/prod/upload';
  private endpointProps: EndpointProps;
  private verbose: boolean = false;
  constructor(endpointProps: EndpointProps, verbose: boolean = false) {
    this.endpointProps = endpointProps;
    this.verbose = verbose;
  }

  public get endpoint(): string {
    if (!this.endpointProps)
      throw Error('missing endpoint props for file transfer');

    const { user, name, desc, type, size } = this.endpointProps;
    const endpoint = `${this.base}?user=${user}&name=${name}&desc=${desc}&type=${type}&size=${size}`;
    if (this.verbose) console.info('transfer file endpoint=>', endpoint);
    return endpoint;
  }
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
      console.log(selectedFile);
      const formData = new FormData();
      //prep file to for post
      formData.append('file', selectedFile);
      //prep extra info to associate with the file
      const endpointProps: EndpointProps = {
        user: loggedUser.username,
        name: selectedFile.name ? selectedFile.name : 'noname',
        desc: fileDescription,
        type: selectedFile.type,
        size: selectedFile.size,
      };
      //create endpoint
      const creator = new EndpointCreator(endpointProps, true);
      //post
      const response = await axios.post(creator.endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const uploadResponse: UploadResponse = response.data.body;
      console.info('upload response', uploadResponse);
      setMsg(uploadResponse.message);
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
