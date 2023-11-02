import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Expand, Loader2 } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { Document, Page } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { useToast } from './ui/use-toast';

interface PdfFullScreenProps {
  fileUrl: string;
}

const PdfFullScreen: React.FC<PdfFullScreenProps> = ({ fileUrl }) => {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>();

  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button variant='ghost' className='gap-1.5' aria-label='fullscreen'>
          <Expand className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-7xl w-full'>
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] mt-6'>
          <div ref={ref}>
            <Document
              className='max-h-screen'
              file={fileUrl}
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='my-24 h-6 w-6 animate-spin' />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: 'Error loading PDF',
                  description: 'Please try again',
                  variant: 'destructive',
                });
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              {new Array(numPages).fill(0).map((_, index) => (
                <Page key={index} width={width ? width : 1} pageNumber={index + 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
