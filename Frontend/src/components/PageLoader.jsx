import React from 'react';
import { LoaderIcon } from 'lucide-react';

const PageLoader = () => {
  return (
    // Full-page centered spinner shown during blocking loads.
    <div className="min-h-screen flex items-center justify-center">
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  );
};

export default PageLoader;
