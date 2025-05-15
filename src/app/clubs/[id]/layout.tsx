import React from 'react';

const ClubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
};

export default ClubLayout;
