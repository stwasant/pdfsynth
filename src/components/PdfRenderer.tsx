'use client';
import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useResizeDetector } from 'react-resize-detector';
import { z } from 'zod';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

import SimpleBar from 'simplebar-react';
import PdfFullScreen from './PdfFullScreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
}

const PdfRenderer: React.FC<PdfRendererProps> = ({ url }) => {
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [isLoadedSuccess,setIsLoadedSuccess] = useState<boolean>(false);

  const customPageValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof customPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: '1',
    },
    resolver: zodResolver(customPageValidator),
  });

  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrentPage(Number(page));
    setValue('page', String(page));
  };
  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      <div
        className={cn(
          'h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2',
          !isLoadedSuccess ? 'pointer-events-none' : ''
        )}>
        <div className='flex items-center gap-1.5'>
          <Button
            disabled={currentPage <= 1}
            variant='ghost'
            aria-label='Previous page'
            onClick={() => {
              setCurrentPage((prev) => (prev === 1 ? 1 : prev - 1));
              setValue('page', String(currentPage - 1));
            }}>
            <ChevronDown className='h-4 w-4' />
          </Button>
          <div className='flex items-center gap-1.5'>
            <Input
              {...register('page')}
              className={cn('w-12 h-8 text-center', errors.page && 'focus-visible:ring-red-500')}
              //   value={currentPage}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className='text-zinc-700 text-sm space-x-1'>
              <span>/</span>
              <span>{numPages ?? '...'}</span>
            </p>
          </div>
          <Button
            disabled={currentPage === numPages}
            variant='ghost'
            aria-label='Next page'
            onClick={() => {
              setCurrentPage((prev) => (prev === numPages ? numPages : prev + 1));
              setValue('page', String(currentPage + 1));
            }}>
            <ChevronUp className='h-4 w-4' />
          </Button>
        </div>
        <div className='space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='gap-1.5' aria-label='zoom' variant='ghost'>
                <Search className='w-4 h-4' />
                {scale * 100}%<ChevronDown className='h-3 w-3 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>100%</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(0.75)}>75%</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(0.5)}>50%</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(0.25)}>25%</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setScale(1.5)}>150%</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>200%</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>250%</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            aria-label='rotate 90 degrees'
            variant='ghost'
            onClick={() => {
              setRotate((prev) => (prev >= 270 ? 0 : prev + 90));
            }}>
            <RotateCw className='w-4 h-4' />
          </Button>
          <PdfFullScreen fileUrl={url} />
        </div>
      </div>
      <div className='flex-1 w-full max-h-screen'>
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
          <div ref={ref}>
            <Document
              className='max-h-screen'
              file={url}
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
              <Page
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotate}
                loading={
                  <div className='flex justify-center'>
                    <Loader2 className='my-24 h-6 w-6 animate-spin' />
                  </div>
                }
                onLoadSuccess={() => setIsLoadedSuccess(true)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
