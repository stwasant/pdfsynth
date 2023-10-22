import Link from 'next/link';
import React, { ReactNode } from 'react';

interface InterfaceStepsItems {
  stepTitle: string;
  stepDescription?: ReactNode;
  stepSecondDescription?: ReactNode;
}

const StepsItems: React.FC<InterfaceStepsItems> = (props) => {
  const { stepTitle, stepDescription, stepSecondDescription } = props;
  return (
    <>
      <li className='md:flex-1'>
        <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
          <span className='text-sm font-medium text-blue-600'>{stepTitle}</span>
          <span className='text-xl font-semibold'>{stepDescription}</span>
          <span className='mt-2 text-zinc-700'>{stepSecondDescription}</span>
        </div>
      </li>
    </>
  );
};

export default StepsItems;
