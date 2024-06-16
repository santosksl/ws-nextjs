"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebSocketContext } from "@/contexts/WebSocketContext";
import { ws } from "@/socket";
import { useContext, useEffect, useRef, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";

interface DataMessage {
    message: string;
} 

export default function Chat() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<DataMessage[]>([]);
    const { isConnected } = useContext(WebSocketContext);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data) as DataMessage;
            setMessages(prevMessages => [...prevMessages, data]);
        };

        ws.addEventListener('message', handleMessage)  

        return () => {
            ws.removeEventListener('message', handleMessage);
        };
    }, [])

    function onClick() {
        if (!inputRef.current?.value.trim()) return 0;

        const message = inputRef.current?.value;

        if (message) {
            const dataMessage = { message };
            ws.send(JSON.stringify(dataMessage));
            setMessages((prevMessages) => [...prevMessages, dataMessage]);
            inputRef.current.value = '';
        }
    }

    function SendMessageChat() {
        return (
            <div>
                <Input ref={inputRef} placeholder="Send Message" className="ml-5 fixed bottom-2 w-[80%] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md bg-neutral-800"/>
                <Button className="fixed bottom-2 right-8 rounded-none" variant="outline" onClick={onClick}>
                    <FaTelegramPlane/>
                </Button>
            </div>
        )
    }

    function MessageDialogBox() {
        return (
            <>
                {messages.map((data, idx) => (
                    <div key={idx} className="w-full px-5 py-3">
                        <h1 className="font-bold text-primary">SANTOSTEBOTA</h1>
                        <p className="text-sm">{data.message}</p>
                    </div>
                ))}
            </>
        )
    }

    return (
        <div className="flex flex-col overflow-x-auto h-[100vh]">
            <MessageDialogBox />
            <SendMessageChat />
        </div>
    )
}