import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO, Socket } from "socket.io";
import { NextApiResponseServerIo } from "@/types/types";
import { db } from "@/db";

let ioInstance: ServerIO<any, any, any, any> | null = null;

export const config = {
  api: {
    bodyParser: false,
  },
};
const updateUserStatus = async (
  userId: string,
  role: string,
  connected: boolean
) => {
  try {
    const updateData = {
      connected,
      connectedAt: connected ? new Date() : null,
      disconnectedAt: connected ? null : new Date(),
    };

    const existingActiveRecord = await db.active.findFirst({
      where: { userId, role },
      select: { id: true, connected: true },
    });

    if (!existingActiveRecord) {
      await db.active.create({
        data: { userId, role, ...updateData },
      });
    } else {
      await db.active.update({
        where: { id: existingActiveRecord.id, userId, role },
        data: updateData,
      });
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

const handleUserLogout = async (userId: string, role: string) => {
  try {
    await updateUserStatus(userId, role, false);
  } catch (error) {
    console.error("Error handling user logout:", error);
    throw error;
  }
};

const handleSocketConnection = (socket: Socket) => {
  socket.on("user_connected", async ({ userId, role }) => {
    if (userId && role) {
      socket.userId = userId;
      socket.role = role;
      try {
        await updateUserStatus(userId, role, true);
        ioInstance?.emit("user_status_updated", {
          userId,
          role,
          connected: true,
        });
      } catch (error) {
        console.error("Error handling user connection:", error);
      }
    } else {
      console.error("User connection data incomplete:", { userId, role });
    }
  });

  socket.on("disconnect", async () => {
    const { userId, role } = socket;
    if (userId && role) {
      try {
        await handleUserLogout(userId, role);
        ioInstance?.emit("user_status_updated", {
          userId,
          role,
          connected: false,
        });
      } catch (error) {
        console.error("Error handling user disconnection:", error);
      }
    } else {
      console.error("User disconnection data incomplete:", { userId, role });
    }
  });

  socket.on("reconnect_attempt", async () => {
    if (socket.userId && socket.role) {
      socket.emit("user_connected", {
        userId: socket.userId,
        role: socket.role,
      });
    } else {
      console.error("Socket reconnection data incomplete:", {
        userId: socket.userId,
        role: socket.role,
      });
    }
  });
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  try {
    if (!ioInstance) {
      const path = "/api/socket/io";
      const httpServer: NetServer = res.socket.server as any;
      ioInstance = new ServerIO(httpServer, { path, addTrailingSlash: false });

      ioInstance.on("connection", handleSocketConnection);

      res.socket.server.io = ioInstance;
    }
    res.end();
  } catch (error) {
    console.error("Error handling socket connection:", error);
    res.status(500).end("Internal Server Error");
  }
};

export default ioHandler;