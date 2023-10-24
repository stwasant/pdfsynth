'use client';

import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Button } from './ui/button';
import { DialogContent } from './ui/dialog';
import DropZone from 'react-dropzone';
import { Cloud } from 'lucide-react';

const UploadFileDropZone = () => {
  return (
    <DropZone multiple={false} onDrop={(acceptedFile) => console.log(acceptedFile)}>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'>
          <div className='flex items-center justify-center h-full w-full'>
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <Cloud className='h-6 w-6 text-zinc-500 mb-2'/>
                <p className='mb-2 text-sm text-zinc-700'>
                  <span className='font-semibold'>Click to upload</span> or drag and drop
                </p>
                <p className='text-xs text-zinc-500'>PDF (up to 4MB)</p>
              </div>
            </label>
          </div>
        </div>
      )}
    </DropZone>
  );
};

const UploadButtonFile = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(view) => {
        if (!view) {
          setIsOpen(view);
        }
      }}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadFileDropZone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButtonFile;
