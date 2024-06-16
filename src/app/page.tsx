"use client"

import { WebSocketContext } from "@/contexts/WebSocketContext";
import { useContext } from "react";

export default function Test() {
    const { isConnected } = useContext(WebSocketContext)
    
    return (
        <div>
            <p>Status: {isConnected ? 'Connected' : 'Disconnected' }</p>
        </div>
    )
}