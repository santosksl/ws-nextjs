"use client";
import { ws } from "@/socket";
import { ReactNode, createContext, useEffect, useState } from "react";

interface WebSocketContextType {
    isConnected: boolean;
}

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketContext = createContext({} as WebSocketContextType)

export default function WebSocketProvider({ children }: WebSocketProviderProps) {
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        function onConnect() {            
            console.log(
                '[WebSockets - Client]: Client connected to the WebSocket server'
            );
            setIsConnected(true)
        }

        function onDisconnect() {            
            console.log('[WebSockets - Client]: Client disconnected');
            setIsConnected(false)
        }

        function onError(error: any) {
            console.error('[WebSockets - Client]: WebSocket error:', error);
        }

        ws.addEventListener('open', onConnect);
        ws.addEventListener('close', onDisconnect);
        ws.addEventListener('error', onError);

        if (ws.readyState === WebSocket.OPEN) {
            onConnect();
        }

        return () => {
            ws.removeEventListener('open', onConnect)
            ws.removeEventListener('close', onDisconnect)
            ws.removeEventListener('error', onError);
        }
    }, [])

    return (
        <WebSocketContext.Provider value={{ isConnected }}>
            { children }
        </WebSocketContext.Provider>
    )
}
