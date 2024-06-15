"use client"

import { ws } from "@/socket";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Test() {
    const [ connected, setConnected ] = useState<boolean>(false);

    useEffect(() => {
        if (ws.OPEN) {
            onConnect()
        }

        function onConnect() {            
            console.log(
                '[WebSockets - Client]: Client connected to the WebSocket server'
            );
            setConnected(true)
        }
        
        function onDisconnect() {            
            console.log('[WebSockets - Client]: Client disconnected');
            setConnected(false)
        }

        function onError(error: any) {
            console.error('[WebSockets - Client]: WebSocket error:', error);
        }

        ws.addEventListener('open', onConnect);
        ws.addEventListener('close', onDisconnect);
        ws.addEventListener('error', onError);

        return () => {
            ws.removeEventListener('open', onConnect)
            ws.removeEventListener('close', onDisconnect)
            ws.removeEventListener('error', onError);
            ws.close();

            console.log('[WebSockets - Client]: Cleanup, closing WebSocket');
        }
    }, [])
    
    return (
        <div>
            {connected ? <p>Status: Connected</p> : <p>Status: Disconnected</p>}
            <button>
                <Link href="/hello">Click</Link>
            </button>
        </div>
    )
}