"use client"

import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { parseCookies, setCookie } from 'nookies';
import { ReactNode, createContext, useEffect, useState } from "react";

type User = {
    name: string;
}

type LogInData = {
    email: string;
    password: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    logIn: (data: LogInData) => Promise<void>
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const isAuthenticated = !!user;
    
    const { toast } = useToast();
    const router = useRouter()

    useEffect(() => {
        const { 'auth.token': token } = parseCookies()

        /*if (token) {
            recoverUserInformation().then(response => {
              setUser(response.user)
            })
        }*/
    }, [])
    
    async function logIn({ email, password }: LogInData) {
        await api.post('/user/login', {
            email, password
        }).then(async (res) => {
            setCookie(undefined, 'auth.token', res.data.token, {
                maxAge: 60 * 60 * 1 // 1 hour
            })

            api.defaults.headers['Authorization'] = `Bearer ${res.data.token}`
            setUser(user)

            toast({
                className: 'bg-emerald-600',
                description: res.data.message
            })

            router.push('/test');
        }).catch((error) => {
            if (error.response) {
                toast({
                    variant: 'destructive',
                    description: error.response.data.message
                })
            } else if (error.request) {
                console.log('Error Request', error.request)
            } else {
                console.error('Error Api', error);
            }
        })        
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, logIn }}>
          {children}
        </AuthContext.Provider>
    )
}