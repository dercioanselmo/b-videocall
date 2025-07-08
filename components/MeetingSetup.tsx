'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import { Button } from './ui/button';

interface MeetingSetupProps {
  setIsSetupComplete: (value: boolean) => void;
}

const MeetingSetup = ({ setIsSetupComplete }: MeetingSetupProps) => {
  const [isMicCamOff, setIsMicCamOff] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLDivElement>(null);
  const [previewTrack, setPreviewTrack] = useState<ICameraVideoTrack | null>(null);

  useEffect(() => {
    let active = true;
    let localTrack: ICameraVideoTrack | null = null;

    async function setupCamera() {
      setLoading(true);
      if (!isMicCamOff) {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
        localTrack = await AgoraRTC.createCameraVideoTrack();
        if (active) {
          setPreviewTrack(localTrack);
          localTrack.play(videoRef.current!);
        } else {
          localTrack.close();
        }
      } else {
        setPreviewTrack(null);
      }
      setLoading(false);
    }

    setupCamera();

    return () => {
      active = false;
      if (localTrack) {
        localTrack.stop();
        localTrack.close();
      }
    };
    // eslint-disable-next-line
  }, [isMicCamOff]);

  // Clean up the previewTrack if component unmounts
  useEffect(() => {
    return () => {
      previewTrack?.stop();
      previewTrack?.close();
    };
  }, [previewTrack]);

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
      <h1 className='text-2xl font-bold'>Setup</h1>
      <div ref={videoRef} className='w-[300px] h-[225px] bg-black mb-4 rounded-md' />
      <div className='flex h-16 items-center justify-center gap-3'>
        <label className='flex items-center justify-center gap-2 font-medium'>
          <input
            type="checkbox"
            checked={isMicCamOff}
            onChange={e => setIsMicCamOff(e.target.checked)}
          />
          Join with mic and camera off
        </label>
      </div>
      <Button
        className='rounded-md bg-green-500 px-4 py-2.5'
        onClick={() => setIsSetupComplete(true)}
        disabled={loading}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;