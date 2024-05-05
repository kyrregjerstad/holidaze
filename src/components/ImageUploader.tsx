import { useUploadThing } from '@/lib/utils/uploadthing';
import { useDropzone } from '@uploadthing/react';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { Progress } from './ui/progress';
import { Label } from './ui/label';

type Props = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  uploadedImages: string[];
  setUploadedImages: Dispatch<SetStateAction<string[]>>;
};

export const ImageUploader = ({
  files,
  setFiles,
  uploadedImages,
  setUploadedImages,
}: Props) => {
  const [progress, setProgress] = useState(0);

  const { startUpload, permittedFileInfo } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      console.log('client upload complete');
      setUploadedImages([
        ...uploadedImages,
        ...res.map((r) => r.serverData.url),
      ]);
    },
    onUploadError: () => {
      console.log('upload error');
    },
    onUploadBegin: () => {
      console.log('upload begin');
    },
    onUploadProgress(p) {
      console.log(p);
      setProgress(p);
    },
  });

  const maxFiles = permittedFileInfo?.config.image?.maxFileCount || 8;
  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (uploadedImages.length + acceptedFiles.length > maxFiles) {
      return alert('Too many files');
    }

    setFiles(acceptedFiles);
    startUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles,
  });

  return (
    <div>
      <Label htmlFor="file-upload">Images</Label>
      <div
        {...getRootProps()}
        className="group flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-all hover:border-gray-500"
      >
        <input {...getInputProps()} id="file-upload" />
        <p>
          {uploadedImages.length} out of {maxFiles} files
        </p>
        <p className="text-neutral-500 group-hover:text-foreground">
          Drag and drop files here or click to select
        </p>
        <Progress value={progress} className="mt-2 h-2" />
      </div>
    </div>
  );
};
