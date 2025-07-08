'use client';

import React, { ReactNode, useEffect, useState, createContext, useContext } from "react";
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';

interface AgoraContextType {
  client: IAgoraRTCClient | null;
}

const AgoraContext = createContext<AgoraContextType>({ client: null });

export function AgoraClientProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);

  useEffect(() => {
    let mounted = true;
    import("agora-rtc-sdk-ng").then((AgoraRTC) => {
      if (mounted) {
        setClient(AgoraRTC.default.createClient({ mode: "rtc", codec: "vp8" }));
      }
    });
    return () => { mounted = false }
  }, []);

  return (
    <AgoraContext.Provider value={{ client }}>
      {children}
    </AgoraContext.Provider>
  );
}

export function useAgoraClient() {
  return useContext(AgoraContext).client;
}