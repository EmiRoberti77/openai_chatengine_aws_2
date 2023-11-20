import React, { useState } from 'react';
import { noAllowedFiles } from '../Share/Util';

interface FileUploadProps {
  onFileContentHandle: (content: string) => void;
  styleName: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileContentHandle,
  styleName,
}) => {
  const [selectedFileExtract, setSelectedFileExtract] = useState<
    File | undefined
  >(undefined);

  const handleFileExtract = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFileExtract(file);
    }
  };

  const extract = () => {
    if (selectedFileExtract) {
      if (
        noAllowedFiles.find((element) => element === selectedFileExtract.type)
      ) {
        console.error(selectedFileExtract.type, 'file type not supported');
        return;
      }
      console.log('read file');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const fileContent = event.target.result as string;
          console.info(fileContent);
          onFileContentHandle(fileContent);
        }
      };
      reader.readAsText(selectedFileExtract);
    }
  };

  return (
    <div>
      <div>
        <input className={styleName} type="file" onChange={handleFileExtract} />
        <button className={styleName} onClick={extract}>
          extract
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
