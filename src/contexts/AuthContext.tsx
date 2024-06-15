"use client"

import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { ReactNode, createContext, useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
}

type Rooms = {
    name: string;
}

type LogInData = {
    email: string;
    password: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    rooms: Rooms | null;
    roomsArray: [];
    logIn: (data: LogInData) => Promise<void>
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [rooms, setUserRooms] = useState<Rooms | null>(null)
    const [roomsArray, setUserRoomsArray] = useState<[]>([])

    const isAuthenticated = !!user;
    
    const { toast } = useToast();
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            const { 'auth.token': token } = parseCookies()

            if (token) {
                api.defaults.headers['Authorization'] = `Bearer ${token}`

                const decodedToken = jwtDecode(token);
                const userId = Number(decodedToken.sub);
                
                await api.get(`/user/${userId}`).then((res) => {
                    setUser(res.data.user[0]);
                    setUserRooms(res.data.rooms[0])
                    setUserRoomsArray(res.data.rooms);
                }).catch((error) => {
                    destroyCookie({}, 'auth.token');

                    if (error.response) {
                        router.push('/login')

                        toast({
                            variant: 'destructive',
                            description: error.response.data.message
                        })
                        
                        console.log(error.response)
                    } else if (error.request) {
                        console.log('Error Request', error.request)
                    } else {
                        console.error('Error Api', error);
                    }
                })
            }
        }
        fetchData()
    }, [toast, router])
    
    async function logIn({ email, password }: LogInData) {
        await api.post('/user/login', {
            email, password
        }).then(async (res) => {
            setCookie(undefined, 'auth.token', res.data.token, {
                maxAge: 60 * 60 * 24 // 1 day
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
        <AuthContext.Provider value={{ user, rooms, roomsArray, isAuthenticated, logIn }}>
          {children}
        </AuthContext.Provider>
    )
}