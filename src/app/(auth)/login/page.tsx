"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

const userSchema = z.object({
    email: z.string().min(4, { message: 'E-mail must be at least 4 characters long'}).email({ message: 'Invalid email format' }),
    password: z
        .string()
        .min(4, { message: 'Password must be at least 4 characters long' }),
});

type UserType = z.infer<typeof userSchema>

export default function SignUp() {
    const form = useForm<UserType>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    const { logIn } = useContext(AuthContext);
    
    async function onSubmit(values: UserType) {
        await logIn(values)
    }

    return (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[30%]" method="POST">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">E-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="example@gmail.com" {...field}  type="email"/>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                    />
                <Button type="submit" className="w-full">Submit</Button>
                </form>
            </Form>
        </div>
    )
}