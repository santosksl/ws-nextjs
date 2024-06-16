"use client"

import { WebSocketContext } from "@/contexts/WebSocketContext";
import Link from "next/link";
import { useContext } from "react";

export default function Test() {
    const { isConnected } = useContext(WebSocketContext)
    
    return (
        <div>
            <p>Status: {isConnected ? 'Connected' : 'Disconnected' }</p>
            <button>
                <Link href="/hello">Click</Link>
            </button>
        </div>
    )
}