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
  const [joining, setJoining] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);

  const joinChannel = useCallback(async () => {
    if (!client || joined || joining) return;
    setJoining(true);

    try {
      // 1. Fetch the token from your backend
      const res = await fetch(`/api/agora-token?channel=${channelId}&uid=0`);
      const { token } = await res.json();
      if (!token) throw new Error('Failed to get Agora token');

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

      // 2. Join the channel with App ID, channelId, token, and UID (here UID=0 for auto-assign)
      await client.join(appId, channelId, token, null);
      await client.publish([microphoneTrack, cameraTrack]);
      cameraTrack.play(localVideoRef.current!);
      setJoined(true);
    } catch (e) {
      console.error(e);
      setJoined(false);
    } finally {
      setJoining(false);
    }
  }, [client, joined, joining, channelId]);

  useEffect(() => {
    if (client && !joined && !joining) {
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