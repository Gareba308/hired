
"use client"

import { createContext, useEffect, useContext, useState } from "react";
import { io as ClientIO } from "socket.io-client";
import { useSession} from "next-auth/react";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const userId = session?.id;
  const role = session?.role;
  const [socketInstance, setSocketInstance] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && userId) {
      const socketUrl = process.env.NEXT_PUBLIC_BASE_URL

      const socket = new (ClientIO as any)(socketUrl, {
        path: '/api/socket/io',
        addTrailingSlash: false,
      });

      setSocketInstance(socket);

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [status, userId]);

  useEffect(() => {
    if (socketInstance) {
      const handleUserConnected = () => {
        setIsConnected(true);
        socketInstance.emit("user_connected", { userId, role });
      };

      const handleUserDisconnected = () => {
        setIsConnected(false);
        socketInstance.emit("user_disconnected", { userId, role });
      };

      socketInstance.on("connect", handleUserConnected);
      socketInstance.on("disconnect", handleUserDisconnected);

      handleUserConnected();

      return () => {
        handleUserDisconnected();
      };
    }
  }, [socketInstance, userId, role]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};