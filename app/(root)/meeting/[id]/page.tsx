'use client';
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import React, { useState } from 'react';

const Meeting = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!id) return <Loader />;

  return (
    <main className='h-screen w-full'>
      {!isSetupComplete ? (
        <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
      ) : (
        <MeetingRoom channelId={id} />
      )}
    </main>
  );
}

export default Meeting;