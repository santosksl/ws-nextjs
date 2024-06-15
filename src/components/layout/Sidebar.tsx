"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const roomSchema = z.object({
    name: z
        .string()
        .min(4, { message: 'Name must be at least 4 characters long' }),
});

type RoomType = z.infer<typeof roomSchema>

function DesktopNavLinks() {
    const form = useForm<RoomType>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            name: ''
        },
    })

    async function onSubmit(values: RoomType) {
        console.log(values)
    }

    return (
      <ul className="w-[16vw] h-[100vh] flex flex-col bg-neutral-800">
        <li className="flex gap-x-3 p-5 hover:bg-red-500 cursor-pointer">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>1</AvatarFallback>
            </Avatar>

            <span className="font-semibold">
                Room Name
            </span>
        </li>

        <li className="fixed bottom-0">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-[16vw] rounded-none">Create Room</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Room</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="">
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