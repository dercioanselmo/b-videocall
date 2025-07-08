'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAgoraClient } from '@/providers/AgoraClientProvider';
import type { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;

interface MeetingRoomProps {
  channelId: string;
}

const MeetingRoom = ({ channelId }: MeetingRoomProps) => {
  const client = useAgoraClient() as IAgoraRTCClient | null;
  const [joined, setJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);

  const joinChannel = useCallback(async () => {
    if (!client || joined) return;
    setJoined(true);

    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    const [microphoneTrack, cameraTrack] = await Promise.all([
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createCameraVideoTrack(),
    ]);

    setLocalTracks([microphoneTrack, cameraTrack]);

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        user.videoTrack?.play(`remote-video-${user.uid}`);
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
      setRemoteUsers((prev) => [...prev.filter(u => u.uid !== user.uid), user]);
    });

    client.on('user-unpublished', (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    await client.join(appId, channelId, null, null);
    await client.publish([microphoneTrack, cameraTrack]);
    cameraTrack.play(localVideoRef.current!);
  }, [client, joined, channelId]);

  useEffect(() => {
    if (client && !joined) {
      joinChannel();
    }
    return () => {
      localTracks?.forEach((track) => track.close && track.close());
      client?.leave();
    };
    // eslint-disable-next-line
  }, [client]);

  return (
    <section className='relative h-screen w-full overflow-hidden p-4 text-white'>
      <div className='flex flex-col items-center'>
        <div ref={localVideoRef} className='w-[400px] h-[300px] bg-black mb-4 rounded-md' />
        <h3 className='mb-2'>Remote Participants</h3>
        <div className='flex gap-4'>
          {remoteUsers.map((user) => (
            <div key={user.uid} id={`remote-video-${user.uid}`} className='w-[400px] h-[300px] bg-black rounded-md' />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;