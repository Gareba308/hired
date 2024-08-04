"use client";

import { useSocket } from "@/context/Socket-Provider";

export const SocketIndicator = () => {
  const { isConnected} = useSocket();

  if (!isConnected) {
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
        Offline: Disconnected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
      Online: Connected
    </span>
  );
};

