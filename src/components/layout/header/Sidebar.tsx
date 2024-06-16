"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext, Rooms } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createRoomSchema = z.object({
    name: z
        .string()
        .min(4, { message: 'Name must be at least 4 characters long' }),
});

const joinRoomSchema = z.object({
    roomId:  z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), { message: 'Category ID must be a number' })
});

type CreateRoomType = z.infer<typeof createRoomSchema>
type JoinRoomType = z.infer<typeof joinRoomSchema>

function DesktopNavLinks() {
    const { roomsArray, isAuthenticated, user } = useContext(AuthContext)
    const { toast } = useToast();
    const router = useRouter();

    const createForm = useForm<CreateRoomType>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            name: '',
        },
    })

    const joinForm = useForm<JoinRoomType>({
        resolver: zodResolver(joinRoomSchema),
    })

    async function onCreateRoom(values: CreateRoomType) {
        if (isAuthenticated) {
            await api.post('/room/create', {
                name: values.name,
                ownerId: user?.id
            }).then(async (res) => {
                location.reload();

                toast({
                    className: 'bg-emerald-600',
                    description: res.data.message
                })
            }).catch((error) => {
                if (error.response) {
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

    async function onJoinRoom(values: JoinRoomType) {
        if (isAuthenticated) {
            await api.post('/room/join', {
                roomId: values.roomId,
                userId: user?.id
            }).then(async (res) => {
                location.reload();

                toast({
                    className: 'bg-emerald-600',
                    description: res.data.message
                })
            }).catch((error) => {
                if (error.response) {
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

    function onClickRedirect(idx: number) {
        const room: Rooms = roomsArray[idx];
        
        if (room) {
            router.push(`/rooms?id=${room.id}`);
        }
    }

    return (
      <ul className="w-[16vw] h-[100vh] flex flex-col bg-neutral-800">
        {   
            roomsArray.map((room: Rooms, idx) => (
                <li key={idx} className="flex gap-x-3 p-5 hover:bg-blue-700 cursor-pointer" onClick={() => onClickRedirect(idx)}>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>

                    <span className="font-semibold">
                        { room?.name }
                    </span>
                </li>
            ))                 
        }
        
        <div className="flex flex-col fixed bottom-0">
            <li>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-[16vw] rounded-none bg-blue-600 text-white hover:bg-blue-500">Join Room</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Join Room</DialogTitle>
                        </DialogHeader>

                        <Form {...joinForm}>
                            <form onSubmit={joinForm.handleSubmit(onJoinRoom)}>
                                <FormField 
                                control={joinForm.control}
                                name="roomId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Room ID</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter the ID of the room you want to join. Ex: 1" type="number" />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                                />
                                <DialogFooter className="mt-5">
                                    <Button className="w-full">Join</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </li>
            <li>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-[16vw] rounded-none">Create Room</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Room</DialogTitle>
                        </DialogHeader>
                        <Form {...createForm}>
                            <form onSubmit={createForm.handleSubmit(onCreateRoom)} method="POST">
                                <FormField
                                control={createForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="É os guri" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                                />
                                <DialogFooter className="mt-5">
                                    <Button className="w-full">Create</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </li>
        </div>
      </ul>
    );
}

export default function Sidebar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <div>
            <div className="hidden relative md:flex flex-col">
                <DesktopNavLinks/>
            </div>
        </div>
    )
}