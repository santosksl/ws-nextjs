"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ws } from "@/socket";
import { useEffect, useRef, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";

interface DataMessage {
    message: string;
} 

interface MyMessageDialogBox {
    className?: string;
}

export function MyMessageDialogBox({ className }: MyMessageDialogBox) {
    return (
        <div className={`w-full px-5 py-3 ${className}`}>
            <h1 className="font-bold text-primary">SANTOSTEBOTA</h1>
            <p className="text-sm">
                A mãe do Nxz é do job
            </p>
        </div>
    )
}

export function MessageDialogBox() {
    return (
        <div className={`w-full px-5 py-3`}>
            <h1 className="font-bold text-primary">SANTOSTEBOTA2</h1>
            <p className="text-sm">
                Comi a mae do Nxz
            </p>
        </div>
    )
}

export default function Chat() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<DataMessage[]>([]);

    useEffect(() => {
        function receiveMessage() {
            for (let i = 0; i < messages.length; ++i) {
                console.log(messages[i].message)
             }
        } 
        
        ws.addEventListener('message', receiveMessage)

        return () => {
            ws.removeEventListener('message', receiveMessage)
        }
    })

    function onClick() {
        if (!inputRef.current?.value.trim()) return 0;

        const message = inputRef.current?.value;
        console.log(message)
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

    return (
        <div className="flex flex-col overflow-x-auto h-[100vh]">
            <MyMessageDialogBox />
            <MessageDialogBox />
            <SendMessageChat />
        </div>
    )
}