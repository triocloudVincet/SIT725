import React, { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5001");

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
